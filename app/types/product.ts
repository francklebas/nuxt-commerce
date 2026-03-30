export interface Product {
  id: number
  name: string
  slug: string
  description: string
  badge: string
  imageUrl: string
  imageUrls: string[]
  priceCents: number
  highlight: string
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
