export interface Product {
  id: number
  name: string
  slug: string
  description: string
  badge: string
  category: string
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
  sizeChart: ProductSizeRow[]
  reviews: ProductReview[]
}

export interface ProductSizeRow {
  size: string
  chestCm: number
  waistCm: number
  hipsCm: number
  lengthCm: number
}

export interface ProductReview {
  author: string
  city: string
  rating: number
  date: string
  quote: string
}

export interface CartItem {
  lineId: string
  id: number
  slug: string
  name: string
  imageUrl: string
  size: string
  priceCents: number
  quantity: number
}
