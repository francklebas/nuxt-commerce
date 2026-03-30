<script setup lang="ts">
import type { Product } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const added = ref(false)

const { data: products } = await useFetch<Product[]>('/api/products')

const product = computed(() =>
  (products.value || []).find((item) => item.slug === String(route.params.slug))
)

const addToCart = () => {
  if (!product.value) {
    return
  }

  cartStore.addProduct(product.value)
  added.value = true
  setTimeout(() => {
    added.value = false
  }, 1400)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <p v-if="!product" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Produit introuvable.
    </p>

    <section v-else class="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <img :src="product.imageUrl" :alt="product.name" class="h-[520px] w-full rounded-[2rem] object-cover shadow-soft">

      <div class="space-y-6">
        <p class="inline-flex rounded-full bg-clay-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
          {{ product.badge }}
        </p>
        <h1 class="text-4xl text-ink-900 sm:text-5xl">{{ product.name }}</h1>
        <p class="text-lg text-clay-700">{{ product.description }}</p>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-clay-700">{{ product.highlight }}</p>

        <div class="rounded-2xl bg-white/80 p-6">
          <p class="text-sm text-clay-700">Offre instantanee</p>
          <p class="mt-1 text-3xl font-bold text-ink-900">{{ (product.priceCents / 100).toFixed(2) }} EUR</p>
          <p class="mt-2 text-sm text-clay-700">Livraison offerte des 120 EUR et retours simplifies pendant 30 jours.</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-900"
            type="button"
            @click="addToCart"
          >
            Ajouter au panier
          </button>
          <NuxtLink to="/panier" class="rounded-full border border-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-clay-700 hover:bg-white">
            Checkout
          </NuxtLink>
        </div>

        <p v-if="added" class="text-sm font-semibold text-green-700">Ajoute au panier.</p>
      </div>
    </section>
  </main>
</template>
