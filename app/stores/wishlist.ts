import { defineStore } from 'pinia'

const WISHLIST_STORAGE_KEY = 'aurora-wishlist-v1'

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    productIds: [] as number[],
    isReady: false
  }),
  getters: {
    totalItems: (state) => state.productIds.length,
    hasProduct: (state) => (productId: number) => state.productIds.includes(productId)
  },
  actions: {
    init() {
      if (!import.meta.client || this.isReady) {
        return
      }

      try {
        const raw = localStorage.getItem(WISHLIST_STORAGE_KEY)
        if (!raw) {
          this.isReady = true
          return
        }

        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
          this.productIds = parsed.filter((value) => Number.isInteger(value))
        }
      } catch {
        this.productIds = []
      }

      this.isReady = true
    },
    toggleProduct(productId: number) {
      const existingIndex = this.productIds.findIndex((id) => id === productId)

      if (existingIndex >= 0) {
        this.productIds.splice(existingIndex, 1)
      } else {
        this.productIds.push(productId)
      }

      this.persist()
    },
    persist() {
      if (!import.meta.client) {
        return
      }

      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(this.productIds))
    }
  }
})
