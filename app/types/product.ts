export interface Product {
  id: number
  name: string
  slug: string
  description: string
  badge: string
  imageUrl: string
  priceCents: number
  highlight: string
}

export interface CartItem {
  id: number
  slug: string
  name: string
  imageUrl: string
  priceCents: number
  quantity: number
}
