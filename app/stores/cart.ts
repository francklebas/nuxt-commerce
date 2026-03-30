import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types/product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[]
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPriceCents: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)
  },
  actions: {
    addProduct(product: Product) {
      const existing = this.items.find((item) => item.id === product.id)
      if (existing) {
        existing.quantity += 1
        return
      }

      this.items.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        priceCents: product.priceCents,
        quantity: 1
      })
    },
    updateQuantity(id: number, quantity: number) {
      if (quantity <= 0) {
        this.removeProduct(id)
        return
      }

      const item = this.items.find((cartItem) => cartItem.id === id)
      if (!item) {
        return
      }

      item.quantity = Math.min(quantity, 10)
    },
    removeProduct(id: number) {
      this.items = this.items.filter((item) => item.id !== id)
    },
    clear() {
      this.items = []
    }
  }
})
