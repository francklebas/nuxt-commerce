import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

interface CheckoutBody {
  items?: Array<{ id: number, quantity: number, size?: string }>
}

interface ProductRow {
  id: number
  slug: string
  name: string
  description: string
  image_url: string
  price_cents: number
}

const fallbackImageBySlug: Record<string, string> = {
  'blazer-nova-sable': 'https://picsum.photos/id/325/1200/1600',
  'pantalon-flux-creme': 'https://picsum.photos/id/342/1200/1600',
  'trench-aura-cacao': 'https://picsum.photos/id/64/1200/1600'
}

const resolveProductImage = (imageUrl: string, slug: string): string => {
  const fallbackUrl = fallbackImageBySlug[slug]

  if (!fallbackUrl) {
    return imageUrl
  }

  return imageUrl.includes('image.pollinations.ai') ? fallbackUrl : imageUrl
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  const stripeKey = String(config.stripeSecretKey || '')
  const supabaseUrl = String(config.public.supabaseUrl || '')
  const supabaseKey = String(config.supabaseServiceKey || config.public.supabaseAnonKey || '')

  if (!stripeKey || !supabaseUrl || !supabaseKey) {
    throw createError({ statusCode: 500, statusMessage: 'Stripe or Supabase env vars are missing.' })
  }

  const body = await readBody<CheckoutBody>(event)
  const items = body.items || []

  if (!items.length) {
    throw createError({ statusCode: 400, statusMessage: 'Panier vide.' })
  }

  const ids = [...new Set(items.map((item) => item.id).filter((id) => Number.isInteger(id)))]
  if (!ids.length) {
    throw createError({ statusCode: 400, statusMessage: 'Produits invalides.' })
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
  })

  const { data: products, error } = await supabase
    .from('products')
    .select('id, slug, name, description, image_url, price_cents')
    .in('id', ids)
    .eq('is_active', true)

  if (error || !products?.length) {
    throw createError({ statusCode: 400, statusMessage: error?.message || 'Aucun produit valide.' })
  }

  const productsById = new Map<number, ProductRow>()
  for (const product of products as ProductRow[]) {
    productsById.set(product.id, product)
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = []
  for (const item of items) {
    const product = productsById.get(item.id)
    if (!product) {
      continue
    }

    const quantity = Math.min(Math.max(Number(item.quantity || 1), 1), 10)
    const size = String(item.size || 'M').toUpperCase()

    lineItems.push({
      quantity,
      price_data: {
        currency: 'eur',
        unit_amount: product.price_cents,
        product_data: {
          name: `${product.name} - ${size}`,
          description: product.description,
          images: [resolveProductImage(product.image_url, product.slug)]
        }
      }
    })
  }

  if (!lineItems.length) {
    throw createError({ statusCode: 400, statusMessage: 'Aucun produit valide.' })
  }

  const stripe = new Stripe(stripeKey)
  const baseUrl = getRequestHeader(event, 'origin') || String(config.public.appUrl || 'http://localhost:3000')

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    line_items: lineItems,
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['FR', 'BE', 'CH', 'LU']
    }
  })

  if (!session.url) {
    throw createError({ statusCode: 500, statusMessage: 'Impossible de creer la session Stripe.' })
  }

  return { url: session.url }
})
