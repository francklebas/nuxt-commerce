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

const fallbackImageBySlug: Record<string, string> = {
  'blazer-nova-sable': 'https://picsum.photos/id/325/1200/1600',
  'pantalon-flux-creme': 'https://picsum.photos/id/342/1200/1600',
  'trench-aura-cacao': 'https://picsum.photos/id/64/1200/1600'
}

const galleryImageBySlug: Record<string, string[]> = {
  'blazer-nova-sable': [
    'https://picsum.photos/id/325/1200/1600',
    'https://picsum.photos/id/454/1200/1600',
    'https://picsum.photos/id/177/1200/1600'
  ],
  'pantalon-flux-creme': [
    'https://picsum.photos/id/342/1200/1600',
    'https://picsum.photos/id/175/1200/1600',
    'https://picsum.photos/id/496/1200/1600'
  ],
  'trench-aura-cacao': [
    'https://picsum.photos/id/64/1200/1600',
    'https://picsum.photos/id/433/1200/1600',
    'https://picsum.photos/id/26/1200/1600'
  ]
}

const resolveProductImage = (imageUrl: string, slug: string): string => {
  const fallbackUrl = fallbackImageBySlug[slug]

  if (!fallbackUrl) {
    return imageUrl
  }

  return imageUrl.includes('image.pollinations.ai') ? fallbackUrl : imageUrl
}

const resolveProductGallery = (imageUrl: string, slug: string): string[] => {
  const fallbackGallery = galleryImageBySlug[slug]

  if (!fallbackGallery?.length) {
    return [imageUrl]
  }

  if (imageUrl.includes('image.pollinations.ai')) {
    return fallbackGallery
  }

  if (imageUrl === fallbackGallery[0]) {
    return fallbackGallery
  }

  return [imageUrl]
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

  return (data as ProductRow[]).map((row) => {
    const mainImage = resolveProductImage(row.image_url, row.slug)
    return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    badge: row.badge,
    imageUrl: mainImage,
    imageUrls: resolveProductGallery(mainImage, row.slug),
    priceCents: row.price_cents,
    highlight: row.highlight
    }
  })
})
