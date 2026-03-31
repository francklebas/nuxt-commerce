<script setup lang="ts">
import type { Product } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const selectedSize = ref('M')
const selectedImage = ref('')

const { data: product } = await useFetch<Product>(`/api/products/${String(route.params.slug)}`, {
  key: `product-detail-${String(route.params.slug)}-${locale.value}`,
  query: { locale: locale.value }
})

watch(
  product,
  (value) => {
    selectedImage.value = value?.imageUrls?.[0] || value?.imageUrl || ''
    selectedSize.value = value?.sizes?.[0] || 'M'
  },
  { immediate: true }
)

const addToCart = () => {
  if (!product.value) {
    return
  }

  cartStore.addProduct(product.value, selectedSize.value)
}

const toggleWishlist = () => {
  if (!product.value) {
    return
  }

  wishlistStore.toggleProduct(product.value.id)
}

const formatReviewDate = (value: string) =>
  new Intl.DateTimeFormat(locale.value === 'fr' ? 'fr-FR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value))

const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(Math.max(0, 5 - rating))

useSeoMeta(() => ({
  title: product.value?.name || t('seo.productFallbackTitle'),
  description: product.value?.description || t('seo.productFallbackDescription'),
  ogTitle: product.value?.name || t('seo.productFallbackTitle'),
  ogDescription: product.value?.description || t('seo.productFallbackDescription')
}))
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <p v-if="!product" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ t('product.notFound') }}
    </p>

    <section v-else class="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
      <div>
        <NuxtImg :src="selectedImage || product.imageUrl" :alt="product.name" class="editorial-frame h-[520px] w-full rounded-[2rem] object-cover sm:h-[620px]" width="800" height="1066" decoding="async" format="webp" sizes="(max-width: 1024px) 100vw, 55vw" />
        <div class="mt-4 grid grid-cols-3 gap-3">
          <button
            v-for="image in product.imageUrls"
            :key="image"
            class="overflow-hidden rounded-2xl border"
            :class="selectedImage === image ? 'border-clay-700' : 'border-clay-500/30'"
            type="button"
            @click="selectedImage = image"
          >
            <NuxtImg :src="image" :alt="product.name" class="h-28 w-full object-cover" width="800" height="1066" decoding="async" loading="lazy" format="webp" />
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <p class="inline-flex rounded-full bg-clay-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
            {{ product.badge }}
          </p>
          <button
            class="rounded-full border border-clay-500/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-clay-700"
            type="button"
            @click="toggleWishlist"
          >
            {{ wishlistStore.hasProduct(product.id) ? '♥' : '♡' }} {{ t('header.wishlist') }}
          </button>
        </div>
        <h1 class="text-4xl text-ink-900 sm:text-5xl">{{ product.name }}</h1>
        <p class="text-lg text-clay-700">{{ product.description }}</p>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-clay-700">{{ product.highlight }}</p>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-clay-700">{{ t('product.size') }}</p>
          <div class="mt-3 flex gap-2">
            <button
              v-for="size in product.sizes"
              :key="size"
              class="rounded-full border px-4 py-2 text-sm font-semibold"
              :class="selectedSize === size ? 'border-clay-700 bg-clay-700 text-white' : 'border-clay-500/30 text-clay-700 hover:border-clay-700'"
              type="button"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
          <p class="mt-2 text-xs text-clay-700">{{ t('product.sizeGuide') }}</p>
        </div>

        <div class="rounded-2xl bg-white/80 p-6">
          <p class="text-sm text-clay-700">{{ t('product.instantOffer') }}</p>
          <p class="mt-1 text-3xl font-bold text-ink-900">{{ (product.priceCents / 100).toFixed(2) }} EUR</p>
          <p class="mt-2 text-sm text-clay-700">{{ t('product.shippingInfo') }}</p>
          <p class="mt-2 text-xs uppercase tracking-[0.16em] text-clay-700/90">{{ t('product.origin') }}: {{ product.origin }}</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-900"
            type="button"
            @click="addToCart"
          >
            {{ t('product.addToCart') }}
          </button>
          <NuxtLink :to="localePath('/panier')" no-prefetch class="rounded-full border border-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-clay-700 hover:bg-white">
            {{ t('product.checkout') }}
          </NuxtLink>
        </div>

        <div class="rounded-2xl border border-clay-500/20 bg-white/80 p-5 text-sm text-clay-700">
          <p class="font-semibold text-ink-900">{{ t('product.shippingTitle') }}</p>
          <p class="mt-2">{{ t('product.shippingDetail') }}</p>
          <p class="mt-2">{{ t('product.returnsDetail') }}</p>
        </div>
      </div>
    </section>

    <section v-if="product" class="mt-12 grid gap-6 lg:grid-cols-2">
      <article class="rounded-3xl border border-clay-500/20 bg-white/85 p-6">
        <h2 class="text-2xl text-ink-900">{{ t('product.detailsTitle') }}</h2>
        <dl class="mt-4 space-y-3 text-sm text-clay-700">
          <div class="flex justify-between gap-4 border-b border-clay-500/15 pb-2">
            <dt>{{ t('product.composition') }}</dt>
            <dd class="text-right text-ink-900">{{ product.composition }}</dd>
          </div>
          <div class="flex justify-between gap-4 border-b border-clay-500/15 pb-2">
            <dt>{{ t('product.fabricWeight') }}</dt>
            <dd class="text-right text-ink-900">{{ product.fabricWeightGsm }} g/m2</dd>
          </div>
          <div class="flex justify-between gap-4 border-b border-clay-500/15 pb-2">
            <dt>{{ t('product.origin') }}</dt>
            <dd class="text-right text-ink-900">{{ product.origin }}</dd>
          </div>
          <div class="flex justify-between gap-4 border-b border-clay-500/15 pb-2">
            <dt>{{ t('product.care') }}</dt>
            <dd class="text-right text-ink-900">{{ product.care }}</dd>
          </div>
          <div class="flex justify-between gap-4">
            <dt>{{ t('product.fit') }}</dt>
            <dd class="text-right text-ink-900">{{ product.fitNote }}</dd>
          </div>
        </dl>
      </article>

      <article class="rounded-3xl border border-clay-500/20 bg-white/85 p-6">
        <h2 class="text-2xl text-ink-900">{{ t('product.sizeChartTitle') }}</h2>
        <div class="mt-4 overflow-x-auto">
          <table class="w-full min-w-[420px] text-left text-sm text-clay-700">
            <thead>
              <tr class="border-b border-clay-500/20 text-xs uppercase tracking-[0.16em]">
                <th class="pb-2">{{ t('product.size') }}</th>
                <th class="pb-2">{{ t('product.chest') }}</th>
                <th class="pb-2">{{ t('product.waist') }}</th>
                <th class="pb-2">{{ t('product.hips') }}</th>
                <th class="pb-2">{{ t('product.length') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in product.sizeChart" :key="`${product.slug}-${row.size}`" class="border-b border-clay-500/10 last:border-0">
                <td class="py-2 font-semibold text-ink-900">{{ row.size }}</td>
                <td class="py-2">{{ row.chestCm }} cm</td>
                <td class="py-2">{{ row.waistCm }} cm</td>
                <td class="py-2">{{ row.hipsCm }} cm</td>
                <td class="py-2">{{ row.lengthCm }} cm</td>
              </tr>
            </tbody>
          </table>
        </div>
      </article>
    </section>

    <section v-if="product.reviews.length" class="mt-10">
      <h2 class="text-3xl text-ink-900">{{ t('product.reviewsTitle') }}</h2>
      <div class="mt-4 grid gap-4 md:grid-cols-2">
        <article
          v-for="review in product.reviews"
          :key="`${review.author}-${review.date}`"
          class="rounded-2xl border border-clay-500/20 bg-white/85 p-5"
        >
          <p class="text-sm uppercase tracking-[0.12em] text-clay-700">{{ stars(review.rating) }}</p>
          <p class="mt-2 text-sm text-clay-700">"{{ review.quote }}"</p>
          <p class="mt-3 text-xs uppercase tracking-[0.14em] text-clay-700/85">
            {{ review.author }} - {{ review.city }} - {{ formatReviewDate(review.date) }}
          </p>
        </article>
      </div>
    </section>

    <div v-if="product" class="fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-clay-500/25 bg-white/95 p-3 shadow-soft backdrop-blur md:hidden">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-clay-700">{{ t('product.mobileReady') }}</p>
          <p class="text-lg font-bold text-ink-900">{{ (product.priceCents / 100).toFixed(2) }} EUR</p>
        </div>
        <button
          class="rounded-full bg-clay-700 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white"
          type="button"
          @click="addToCart"
        >
          {{ t('product.addToCart') }}
        </button>
      </div>
    </div>
  </main>
</template>
