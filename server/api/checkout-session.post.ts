import Stripe from 'stripe'
import { getCatalogAdapter } from '../utils/catalog/adapters'

interface CheckoutBody {
  items?: Array<{ slug: string, quantity: number, size?: string }>
}

interface RateLimitEntry {
  count: number
  resetAt: number
}

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_REQUESTS = 12

const rateLimitStore =
  (globalThis as typeof globalThis & { __checkoutRateLimitStore?: Map<string, RateLimitEntry> }).__checkoutRateLimitStore ||
  new Map<string, RateLimitEntry>()

;(globalThis as typeof globalThis & { __checkoutRateLimitStore?: Map<string, RateLimitEntry> }).__checkoutRateLimitStore = rateLimitStore

const getClientIp = (event: any) => {
  const forwarded = String(getRequestHeader(event, 'x-forwarded-for') || '')
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown'
  }

  return String(event.node.req.socket.remoteAddress || 'unknown')
}

const enforceRateLimit = (event: any) => {
  const key = getClientIp(event)
  const now = Date.now()
  const current = rateLimitStore.get(key)

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
  } else {
    current.count += 1
    if (current.count > RATE_LIMIT_MAX_REQUESTS) {
      const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000))
      setResponseHeader(event, 'Retry-After', retryAfterSeconds)
      throw createError({ statusCode: 429, statusMessage: 'Too many requests. Please try again shortly.' })
    }
  }

  for (const [ip, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(ip)
    }
  }
}

const enforceOriginCheck = (event: any, appUrl: string) => {
  const origin = String(getRequestHeader(event, 'origin') || '')
  const referer = String(getRequestHeader(event, 'referer') || '')
  const appOrigin = new URL(appUrl).origin

  if (origin && origin === appOrigin) {
    return
  }

  if (!origin && referer.startsWith(appOrigin)) {
    return
  }

  throw createError({ statusCode: 403, statusMessage: 'Forbidden origin.' })
}

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed.' })
  }

  const config = useRuntimeConfig()
  const stripeKey = String(config.stripeSecretKey || '')
  const appUrl = String(config.public.appUrl || 'http://localhost:3000')

  if (!stripeKey) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe env vars are missing.' })
  }

  enforceOriginCheck(event, appUrl)
  enforceRateLimit(event)

  const body = await readBody<CheckoutBody>(event)
  const items = (body.items || []).filter((item) => item.slug)

  if (!items.length) {
    throw createError({ statusCode: 400, statusMessage: 'Panier vide.' })
  }

  const adapter = getCatalogAdapter(event)
  const products = await adapter.listProducts(event)
  const productBySlug = new Map(products.map((product) => [String(product.slug), product]))

  const stripe = new Stripe(stripeKey)
  const baseUrl = appUrl

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  for (const item of items) {
    const product = productBySlug.get(item.slug)
    if (!product) {
      continue
    }

    lineItems.push({
      quantity: Math.min(Math.max(Number(item.quantity || 1), 1), 10),
      price_data: {
        currency: 'eur',
        unit_amount: Math.round(Number(product.price) * 100),
        product_data: {
          name: String(product.title || 'Produit'),
          description: String(product.description || ''),
          images: Array.isArray(product.images) && product.images[0] ? [String(product.images[0])] : undefined,
          metadata: {
            slug: String(product.slug || ''),
            size: String(item.size || 'M').toUpperCase()
          }
        }
      }
    })
  }

  if (!lineItems.length) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun produit valide.' })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    line_items: lineItems,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['FR', 'BE', 'CH', 'LU']
    },
    metadata: {
      cart: JSON.stringify(items.map((item) => ({ slug: item.slug, size: item.size || 'M', quantity: item.quantity })))
    }
  })

  if (!session.url) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de creer la session Stripe.' })
  }

  return { url: session.url }
})
