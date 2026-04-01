import type { CatalogProduct, ProductApiItem } from './types'

const text = (value: unknown): string => String(value || '')
const numeric = (value: unknown): number => Number(value || 0)

export const mapProductForApi = (entry: CatalogProduct, locale: 'fr' | 'en'): ProductApiItem => ({
  id: numeric(entry.productId),
  name: locale === 'fr' ? text(entry.titleFr || entry.title) : text(entry.title),
  slug: text(entry.slug),
  description: locale === 'fr' ? text(entry.descriptionFr || entry.description) : text(entry.description),
  badge: locale === 'fr' ? text(entry.badgeFr || entry.badge) : text(entry.badge),
  category: entry.category,
  imageUrl: text(entry.images[0] || ''),
  imageUrls: entry.images.map((image: string) => text(image)),
  sizes: entry.sizes.map((size: string) => text(size)),
  priceCents: Math.round(numeric(entry.price) * 100),
  highlight: locale === 'fr' ? text(entry.highlightFr || entry.highlight) : text(entry.highlight),
  composition: locale === 'fr' ? text(entry.compositionFr || entry.composition) : text(entry.composition),
  fabricWeightGsm: numeric(entry.fabricWeightGsm),
  origin: locale === 'fr' ? text(entry.originFr || entry.origin) : text(entry.origin),
  care: locale === 'fr' ? text(entry.careFr || entry.care) : text(entry.care),
  fitNote: locale === 'fr' ? text(entry.fitNoteFr || entry.fitNote) : text(entry.fitNote),
  sizeChart: Array.isArray(entry.sizeChart) ? entry.sizeChart : [],
  reviews: Array.isArray(entry.reviews) ? entry.reviews : []
})

export const resolveLocale = (event: any): 'fr' | 'en' => {
  const query = getQuery(event)
  const value = String(query.locale || 'en').toLowerCase()
  return value === 'fr' ? 'fr' : 'en'
}
