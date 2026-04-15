<script setup lang="ts">
import type { Product } from '~/types/product'

const { t, te, locale } = useI18n()
const localePath = useLocalePath()
const wishlistStore = useWishlistStore()

const { data: products, pending, error } = await useFetch<Product[]>('/api/products', {
  key: `products-shop-${locale.value}`,
  query: { locale: locale.value }
})

const searchQuery = ref('')
const selectedCategory = ref<'all' | Product['category']>('all')
const selectedSize = ref('all')
const sortBy = ref<'featured' | 'priceAsc' | 'priceDesc'>('featured')

const filteredProducts = computed(() => {
  const source = products.value || []

  const searched = source.filter((product) => {
    if (!searchQuery.value.trim()) {
      return true
    }

    const term = searchQuery.value.toLowerCase().trim()
    return [product.name, product.description, product.highlight].some((value) => value.toLowerCase().includes(term))
  })

  const byCategory = searched.filter((product) => selectedCategory.value === 'all' || product.category === selectedCategory.value)
  const bySize = byCategory.filter((product) => selectedSize.value === 'all' || product.sizes.includes(selectedSize.value))

  return [...bySize].sort((a, b) => {
    if (sortBy.value === 'priceAsc') {
      return a.priceCents - b.priceCents
    }

    if (sortBy.value === 'priceDesc') {
      return b.priceCents - a.priceCents
    }

    return 0
  })
})

const wishlistProducts = computed(() => {
  const source = products.value || []
  return source.filter((product) => wishlistStore.hasProduct(product.id))
})

const availableCategories = computed(() => {
  const source = products.value || []
  return Array.from(new Set(source.map((product) => String(product.category || '')).filter(Boolean))).sort()
})

const categoryLabel = (category: string) => {
  const translationKey = `product.categories.${category}`
  if (te(translationKey)) {
    return t(translationKey)
  }

  return category
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

useSeoMeta({
  title: () => t('seo.shopTitle'),
  description: () => t('seo.shopDescription'),
  ogTitle: () => t('seo.shopTitle'),
  ogDescription: () => t('seo.shopDescription')
})
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div class="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-[0.2em] text-clay-700">{{ t('shop.badge') }}</p>
        <h1 class="text-4xl text-ink-900">{{ t('shop.title') }}</h1>
      </div>
      <p class="max-w-sm text-sm text-clay-700">{{ t('shop.subtitle') }}</p>
    </div>

    <section class="mb-8 grid gap-3 rounded-3xl border border-clay-500/20 bg-white/85 p-4 md:grid-cols-4">
      <input
        v-model="searchQuery"
        type="search"
        :placeholder="t('shop.searchPlaceholder')"
        class="rounded-2xl border border-clay-500/30 bg-white px-4 py-3 text-sm text-ink-900 outline-none ring-clay-700/20 transition focus:ring"
      >

      <select v-model="selectedCategory" class="rounded-2xl border border-clay-500/30 bg-white px-4 py-3 text-sm text-ink-900 outline-none ring-clay-700/20 transition focus:ring">
        <option value="all">{{ t('shop.filters.allCategories') }}</option>
        <option v-for="category in availableCategories" :key="category" :value="category">{{ categoryLabel(category) }}</option>
      </select>

      <select v-model="selectedSize" class="rounded-2xl border border-clay-500/30 bg-white px-4 py-3 text-sm text-ink-900 outline-none ring-clay-700/20 transition focus:ring">
        <option value="all">{{ t('shop.filters.allSizes') }}</option>
        <option value="XS">XS</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
      </select>

      <select v-model="sortBy" class="rounded-2xl border border-clay-500/30 bg-white px-4 py-3 text-sm text-ink-900 outline-none ring-clay-700/20 transition focus:ring">
        <option value="featured">{{ t('shop.filters.featured') }}</option>
        <option value="priceAsc">{{ t('shop.filters.priceAsc') }}</option>
        <option value="priceDesc">{{ t('shop.filters.priceDesc') }}</option>
      </select>
    </section>

    <p v-if="pending" class="rounded-2xl bg-white/80 p-4 text-sm text-clay-700">{{ t('shop.loading') }}</p>
    <p v-else-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ t('shop.error') }}
    </p>
    <template v-else>
      <p v-if="!filteredProducts.length" class="rounded-2xl border border-clay-500/20 bg-white/85 p-5 text-sm text-clay-700">
        {{ t('shop.noResults') }}
      </p>
      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
      </div>

      <section id="wishlist" class="mt-14">
        <div class="mb-5 flex items-end justify-between gap-3">
          <h2 class="text-3xl text-ink-900">{{ t('shop.wishlistTitle') }}</h2>
          <NuxtLink :to="localePath('/panier')" no-prefetch class="text-sm font-semibold uppercase tracking-[0.14em] text-clay-700 hover:text-ink-900">
            {{ t('shop.goToCart') }}
          </NuxtLink>
        </div>

        <p v-if="!wishlistProducts.length" class="rounded-2xl border border-clay-500/20 bg-white/85 p-5 text-sm text-clay-700">
          {{ t('shop.wishlistEmpty') }}
        </p>
        <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProductCard v-for="product in wishlistProducts" :key="`wish-${product.id}`" :product="product" />
        </div>
      </section>
    </template>
  </main>
</template>
