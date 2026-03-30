import { defineStore } from 'pinia'
import type { CartItem, Product } from '~/types/product'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isDrawerOpen: false,
    lastAddedItem: null as null | { name: string, size: string, quantity: number }
  }),
  getters: {
    totalItems: (state) => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPriceCents: (state) =>
      state.items.reduce((sum, item) => sum + item.quantity * item.priceCents, 0)
  },
  actions: {
    addProduct(product: Product, size = 'M') {
      const lineId = `${product.id}-${size}`
      const existing = this.items.find((item) => item.lineId === lineId)
      if (existing) {
        existing.quantity += 1
        this.lastAddedItem = { name: product.name, size, quantity: existing.quantity }
        this.isDrawerOpen = true
        return
      }

      this.items.push({
        lineId,
        id: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        size,
        priceCents: product.priceCents,
        quantity: 1
      })
      this.lastAddedItem = { name: product.name, size, quantity: 1 }
      this.isDrawerOpen = true
    },
    updateQuantity(lineId: string, quantity: number) {
      if (quantity <= 0) {
        this.removeProduct(lineId)
        return
      }

      const item = this.items.find((cartItem) => cartItem.lineId === lineId)
      if (!item) {
        return
      }

      item.quantity = Math.min(quantity, 10)
    },
    removeProduct(lineId: string) {
      this.items = this.items.filter((item) => item.lineId !== lineId)
    },
    clear() {
      this.items = []
    },
    openDrawer() {
      this.isDrawerOpen = true
    },
    closeDrawer() {
      this.isDrawerOpen = false
    },
    clearLastAddedItem() {
      this.lastAddedItem = null
    }
  }
})
