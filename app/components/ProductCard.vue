<script setup lang="ts">
import type { Product } from '~/types/product'

const props = defineProps<{ product: Product }>()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { t, te } = useI18n()
const localePath = useLocalePath()
const isWishlisted = computed(() => wishlistStore.hasProduct(props.product.id))

const categoryLabel = computed(() => {
  const key = `product.categories.${props.product.category}`
  if (te(key)) {
    return t(key)
  }

  return String(props.product.category || '')
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
})

const quickAdd = () => {
  cartStore.addProduct(props.product, 'M')
}

const toggleWishlist = () => {
  wishlistStore.toggleProduct(props.product.id)
}
</script>

<template>
  <article class="group overflow-hidden rounded-3xl border border-clay-500/20 bg-white/85 shadow-soft transition hover:-translate-y-1">
    <div class="relative overflow-hidden">
      <NuxtImg
        :src="product.imageUrl"
        :alt="product.name"
        class="h-72 w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
        decoding="async"
        width="800"
        height="1066"
        format="webp"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <span class="absolute left-4 top-4 rounded-full bg-ink-900/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
        {{ product.badge }}
      </span>
      <button
        class="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/80 text-lg text-ink-900 backdrop-blur"
        type="button"
        :aria-label="t('productCard.wishlist')"
        @click="toggleWishlist"
      >
        {{ isWishlisted ? '♥' : '♡' }}
      </button>
    </div>
    <div class="space-y-3 p-6">
      <h3 class="text-2xl text-ink-900">{{ product.name }}</h3>
      <p class="text-sm text-clay-700/90">{{ product.description }}</p>
      <div class="flex items-center justify-between gap-2">
        <p class="text-sm font-semibold uppercase tracking-[0.16em] text-clay-700">{{ product.highlight }}</p>
        <p class="text-xs uppercase tracking-[0.14em] text-clay-700/80">{{ categoryLabel }}</p>
      </div>
      <div class="flex items-center justify-between pt-2">
        <p class="text-lg font-bold text-ink-900">{{ (product.priceCents / 100).toFixed(2) }} EUR</p>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full bg-clay-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ink-900"
            type="button"
            @click="quickAdd"
          >
            {{ t('productCard.add') }}
          </button>
          <NuxtLink
            :to="localePath(`/produit/${product.slug}`)"
            no-prefetch
            class="rounded-full border border-clay-700 px-4 py-2 text-sm font-semibold text-clay-700 transition hover:bg-clay-700 hover:text-white"
          >
            {{ t('productCard.view') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
