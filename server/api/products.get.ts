import { createClient } from '@supabase/supabase-js'

interface ProductRow {
  id: number
  name: string
  slug: string
  description: string
  badge: string
  image_url: string
  price_cents: number
  highlight: string
}

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()
  const supabaseUrl = String(config.public.supabaseUrl || '')
  const supabaseKey = String(config.supabaseServiceKey || config.public.supabaseAnonKey || '')

  if (!supabaseUrl || !supabaseKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase env vars are missing.'
    })
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false
    }
  })

  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, description, badge, image_url, price_cents, highlight')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(3)

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return (data as ProductRow[]).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    badge: row.badge,
    imageUrl: row.image_url,
    priceCents: row.price_cents,
    highlight: row.highlight
  }))
})
