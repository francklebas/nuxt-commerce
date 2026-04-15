import { getCatalogAdapter } from '../utils/catalog/adapters'
import { shopifyStorefrontRequest } from '../utils/shopify/client'

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

  const config = useRuntimeConfig(event)
  const appUrl = String(config.public.appUrl || 'http://localhost:3000')
  const provider = String(config.catalogProvider || 'content').toLowerCase()

  if (provider !== 'shopify') {
    throw createError({
      statusCode: 500,
      statusMessage: 'Checkout session requires CATALOG_PROVIDER=shopify.'
    })
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
  const lines: Array<{
    merchandiseId: string
    quantity: number
    attributes: Array<{ key: string, value: string }>
  }> = []

  for (const item of items) {
    const product = productBySlug.get(item.slug)
    if (!product) {
      continue
    }

    const size = String(item.size || '').toUpperCase() || 'M'
    const variants = Array.isArray(product.variants) ? product.variants : []
    const matchedVariant =
      variants.find((variant) => String(variant.size || '').toUpperCase() === size) || variants[0]

    if (!matchedVariant?.id) {
      continue
    }

    lines.push({
      merchandiseId: String(matchedVariant.id),
      quantity: Math.min(Math.max(Number(item.quantity || 1), 1), 10),
      attributes: [
        { key: 'slug', value: String(product.slug || '') },
        { key: 'size', value: size }
      ]
    })
  }

  if (!lines.length) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun produit valide.' })
  }

  const payload = await shopifyStorefrontRequest<{
    cartCreate?: {
      cart?: {
        checkoutUrl?: string
      }
      userErrors?: Array<{ message?: string }>
    }
  }>(
    event,
    `#graphql
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            checkoutUrl
          }
          userErrors {
            message
          }
        }
      }
    `,
    {
      input: {
        lines
      }
    }
  )

  const userErrors = payload.cartCreate?.userErrors || []
  if (userErrors.length) {
    throw createError({ statusCode: 400, statusMessage: String(userErrors[0]?.message || 'Shopify cart creation failed.') })
  }

  const checkoutUrl = String(payload.cartCreate?.cart?.checkoutUrl || '')

  if (!checkoutUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de creer le checkout Shopify.' })
  }

  return { url: checkoutUrl }
})
