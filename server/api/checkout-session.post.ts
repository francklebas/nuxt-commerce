import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

interface CheckoutBody {
  items?: Array<{ id: number, quantity: number }>
}

interface ProductRow {
  id: number
  name: string
  description: string
  image_url: string
  price_cents: number
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
    .select('id, name, description, image_url, price_cents')
    .in('id', ids)
    .eq('is_active', true)

  if (error || !products?.length) {
    throw createError({ statusCode: 400, statusMessage: error?.message || 'Aucun produit valide.' })
  }

  const quantityById = new Map<number, number>()
  for (const item of items) {
    const quantity = Math.min(Math.max(Number(item.quantity || 1), 1), 10)
    quantityById.set(item.id, quantity)
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = (products as ProductRow[]).map((product) => ({
    quantity: quantityById.get(product.id) || 1,
    price_data: {
      currency: 'eur',
      unit_amount: product.price_cents,
      product_data: {
        name: product.name,
        description: product.description,
        images: [product.image_url]
      }
    }
  }))

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
