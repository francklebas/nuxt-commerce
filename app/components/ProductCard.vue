<script setup lang="ts">
import type { Product } from '~/types/product'

defineProps<{ product: Product }>()
</script>

<template>
  <article class="group overflow-hidden rounded-3xl border border-clay-500/20 bg-white/85 shadow-soft transition hover:-translate-y-1">
    <div class="relative overflow-hidden">
      <img
        :src="product.imageUrl"
        :alt="product.name"
        class="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      >
      <span class="absolute left-4 top-4 rounded-full bg-ink-900/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {{ product.badge }}
      </span>
    </div>
    <div class="space-y-3 p-6">
      <h3 class="text-2xl text-ink-900">{{ product.name }}</h3>
      <p class="text-sm text-clay-700/90">{{ product.description }}</p>
      <p class="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">{{ product.highlight }}</p>
      <div class="flex items-center justify-between pt-2">
        <p class="text-lg font-bold text-ink-900">{{ (product.priceCents / 100).toFixed(2) }} EUR</p>
        <NuxtLink
          :to="`/produit/${product.slug}`"
          class="rounded-full border border-clay-700 px-4 py-2 text-sm font-semibold text-clay-700 transition hover:bg-clay-700 hover:text-white"
        >
          Voir
        </NuxtLink>
      </div>
    </div>
  </article>
</template>
