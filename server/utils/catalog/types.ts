export interface CatalogProduct {
  productId: number
  title: string
  titleFr?: string
  slug: string
  price: number
  category: 'tailoring' | 'bottoms' | 'outerwear' | 'shirts' | 'dresses' | 'sweats'
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
  sizeChart: Array<{
    size: string
    chestCm: number
    waistCm: number
    hipsCm: number
    lengthCm: number
  }>
  reviews: Array<{
    author: string
    city: string
    rating: number
    date: string
    quote: string
  }>
}

export interface ProductApiItem {
  id: number
  name: string
  slug: string
  description: string
  badge: string
  category: CatalogProduct['category']
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
  sizeChart: CatalogProduct['sizeChart']
  reviews: CatalogProduct['reviews']
}

export interface CatalogAdapter {
  listProducts: (event: any) => Promise<CatalogProduct[]>
  getProductBySlug: (event: any, slug: string) => Promise<CatalogProduct | null>
}
