import type { CatalogAdapter, CatalogProduct } from '../types'

export const contentCatalogAdapter: CatalogAdapter = {
  async listProducts(event) {
    const entries = await queryProductsCollection(event).all()
    return entries.map((entry: any) => normalizeContentProduct(entry))
  },
  async getProductBySlug(event, slug) {
    const entry = await queryProductsCollection(event).where('slug', '=', slug).first()
    return entry ? normalizeContentProduct(entry) : null
  }
}

const queryProductsCollection = (event: any) => {
  return (queryCollection as unknown as (ctx: any, collection: string) => any)(event, 'products')
}

const normalizeContentProduct = (entry: any): CatalogProduct => ({
  productId: Number(entry.productId || 0),
  title: String(entry.title || ''),
  titleFr: optionalString(entry.titleFr),
  slug: String(entry.slug || ''),
  price: Number(entry.price || 0),
  category: String(entry.category || 'tailoring'),
  badge: String(entry.badge || ''),
  badgeFr: optionalString(entry.badgeFr),
  highlight: String(entry.highlight || ''),
  highlightFr: optionalString(entry.highlightFr),
  description: String(entry.description || ''),
  descriptionFr: optionalString(entry.descriptionFr),
  images: toStringArray(entry.images),
  sizes: toStringArray(entry.sizes),
  composition: String(entry.composition || ''),
  compositionFr: optionalString(entry.compositionFr),
  fabricWeightGsm: Number(entry.fabricWeightGsm || 0),
  origin: String(entry.origin || ''),
  originFr: optionalString(entry.originFr),
  care: String(entry.care || ''),
  careFr: optionalString(entry.careFr),
  fitNote: String(entry.fitNote || ''),
  fitNoteFr: optionalString(entry.fitNoteFr),
  sizeChart: Array.isArray(entry.sizeChart) ? entry.sizeChart : [],
  reviews: Array.isArray(entry.reviews) ? entry.reviews : []
})

const optionalString = (value: unknown) => {
  if (!value) {
    return undefined
  }

  return String(value)
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => String(item || ''))
}
