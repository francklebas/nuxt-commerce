<script setup lang="ts">
import type { Product } from '~/types/product'

const route = useRoute()
const cartStore = useCartStore()
const { t } = useI18n()
const localePath = useLocalePath()
const selectedSize = ref('M')
const selectedImage = ref('')
const sizeOptions = ['XS', 'S', 'M', 'L']

const { data: products } = await useFetch<Product[]>('/api/products')

const product = computed(() =>
  (products.value || []).find((item) => item.slug === String(route.params.slug))
)

watch(
  product,
  (value) => {
    selectedImage.value = value?.imageUrls?.[0] || value?.imageUrl || ''
  },
  { immediate: true }
)

const addToCart = () => {
  if (!product.value) {
    return
  }

  cartStore.addProduct(product.value, selectedSize.value)
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <p v-if="!product" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
      {{ t('product.notFound') }}
    </p>

    <section v-else class="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
      <div>
        <img :src="selectedImage || product.imageUrl" :alt="product.name" class="h-[520px] w-full rounded-[2rem] object-cover shadow-soft">
        <div class="mt-4 grid grid-cols-3 gap-3">
          <button
            v-for="image in product.imageUrls"
            :key="image"
            class="overflow-hidden rounded-2xl border"
            :class="selectedImage === image ? 'border-clay-700' : 'border-clay-500/30'"
            type="button"
            @click="selectedImage = image"
          >
            <img :src="image" :alt="product.name" class="h-28 w-full object-cover">
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <p class="inline-flex rounded-full bg-clay-700 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white">
          {{ product.badge }}
        </p>
        <h1 class="text-4xl text-ink-900 sm:text-5xl">{{ product.name }}</h1>
        <p class="text-lg text-clay-700">{{ product.description }}</p>
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-clay-700">{{ product.highlight }}</p>

        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-clay-700">{{ t('product.size') }}</p>
          <div class="mt-3 flex gap-2">
            <button
              v-for="size in sizeOptions"
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
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            class="rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-900"
            type="button"
            @click="addToCart"
          >
            {{ t('product.addToCart') }}
          </button>
          <NuxtLink :to="localePath('/panier')" class="rounded-full border border-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-clay-700 hover:bg-white">
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
  </main>
</template>
