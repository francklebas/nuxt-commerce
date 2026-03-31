import type { Product, ProductReview, ProductSizeRow } from '~/types/product'

interface ProductCollectionEntry {
  productId: number
  title: string
  titleFr?: string
  slug: string
  price: number
  category: Product['category']
  badge: string
  badgeFr?: string
  highlight: string
  highlightFr?: string
  description: string
  descriptionFr?: string
  images: string[]
  sizes: string[]
  composition: string
  compositionFr?: string
  fabricWeightGsm: number
  origin: string
  originFr?: string
  care: string
  careFr?: string
  fitNote: string
  fitNoteFr?: string
  sizeChart: ProductSizeRow[]
  reviews: ProductReview[]
}

export const mapCollectionProduct = (entry: ProductCollectionEntry, locale = 'fr'): Product => ({
  id: entry.productId,
  name: locale === 'fr' ? (entry.titleFr || entry.title) : entry.title,
  slug: entry.slug,
  description: locale === 'fr' ? (entry.descriptionFr || entry.description) : entry.description,
  badge: locale === 'fr' ? (entry.badgeFr || entry.badge) : entry.badge,
  category: entry.category,
  imageUrl: entry.images[0] || '',
  imageUrls: entry.images,
  sizes: entry.sizes,
  priceCents: Math.round(entry.price * 100),
  highlight: locale === 'fr' ? (entry.highlightFr || entry.highlight) : entry.highlight,
  composition: locale === 'fr' ? (entry.compositionFr || entry.composition) : entry.composition,
  fabricWeightGsm: entry.fabricWeightGsm,
  origin: locale === 'fr' ? (entry.originFr || entry.origin) : entry.origin,
  care: locale === 'fr' ? (entry.careFr || entry.care) : entry.care,
  fitNote: locale === 'fr' ? (entry.fitNoteFr || entry.fitNote) : entry.fitNote,
  sizeChart: entry.sizeChart,
  reviews: entry.reviews
})
