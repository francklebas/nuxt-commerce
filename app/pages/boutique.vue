<script setup lang="ts">
import type { Product } from '~/types/product'

const { data: products, pending, error } = await useFetch<Product[]>('/api/products')
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-clay-700">Collection capsule</p>
        <h1 class="text-4xl text-ink-900">Boutique</h1>
      </div>
      <p class="max-w-sm text-sm text-clay-700">Tous les produits sont synchronises depuis Supabase (3 references).</p>
    </div>

    <p v-if="pending" class="rounded-2xl bg-white/80 p-4 text-sm text-clay-700">Chargement en cours...</p>
    <p v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      Erreur de chargement des produits.
    </p>
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProductCard v-for="product in products || []" :key="product.id" :product="product" />
    </div>
  </main>
</template>
