interface ProductApiItem {
  id: number
  name: string
  slug: string
  description: string
  badge: string
  category: 'tailoring' | 'bottoms' | 'outerwear' | 'shirts' | 'dresses' | 'sweats'
  imageUrl: string
  imageUrls: string[]
  sizes: string[]
  priceCents: number
  highlight: string
  composition: string
  fabricWeightGsm: number
  origin: string
  care: string
  fitNote: string
  sizeChart: Array<{ size: string, chestCm: number, waistCm: number, hipsCm: number, lengthCm: number }>
  reviews: Array<{ author: string, city: string, rating: number, date: string, quote: string }>
}

const resolveLocale = (event: any) => {
  const query = getQuery(event)
  const value = String(query.locale || 'en').toLowerCase()
  return value === 'fr' ? 'fr' : 'en'
}

const mapProduct = (entry: any, locale: 'fr' | 'en'): ProductApiItem => ({
  id: Number(entry.productId || 0),
  name: locale === 'fr' ? String(entry.titleFr || entry.title || '') : String(entry.title || ''),
  slug: String(entry.slug || ''),
  description: locale === 'fr' ? String(entry.descriptionFr || entry.description || '') : String(entry.description || ''),
  badge: locale === 'fr' ? String(entry.badgeFr || entry.badge || '') : String(entry.badge || ''),
  category: String(entry.category || 'tailoring') as ProductApiItem['category'],
  imageUrl: Array.isArray(entry.images) ? String(entry.images[0] || '') : '',
  imageUrls: Array.isArray(entry.images) ? entry.images.map((image: unknown) => String(image)) : [],
  sizes: Array.isArray(entry.sizes) ? entry.sizes.map((size: unknown) => String(size)) : [],
  priceCents: Math.round(Number(entry.price || 0) * 100),
  highlight: locale === 'fr' ? String(entry.highlightFr || entry.highlight || '') : String(entry.highlight || ''),
  composition: locale === 'fr' ? String(entry.compositionFr || entry.composition || '') : String(entry.composition || ''),
  fabricWeightGsm: Number(entry.fabricWeightGsm || 0),
  origin: locale === 'fr' ? String(entry.originFr || entry.origin || '') : String(entry.origin || ''),
  care: locale === 'fr' ? String(entry.careFr || entry.care || '') : String(entry.care || ''),
  fitNote: locale === 'fr' ? String(entry.fitNoteFr || entry.fitNote || '') : String(entry.fitNote || ''),
  sizeChart: Array.isArray(entry.sizeChart) ? entry.sizeChart : [],
  reviews: Array.isArray(entry.reviews) ? entry.reviews : []
})

export default defineEventHandler(async (event) => {
  const locale = resolveLocale(event)
  const slug = String(getRouterParam(event, 'slug') || '')

  const entry = await queryCollection(event, 'products').where('slug', '=', slug).first()
  if (!entry) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found.' })
  }

  return mapProduct(entry, locale)
})
