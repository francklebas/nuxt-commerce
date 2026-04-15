<script setup lang="ts">
const cartStore = useCartStore()
const { t } = useI18n()
const localePath = useLocalePath()

const isLoading = ref(false)
const apiError = ref('')

const checkout = async () => {
  if (!cartStore.items.length || isLoading.value) {
    return
  }

  isLoading.value = true
  apiError.value = ''

  try {
    const response = await $fetch<{ url: string }>('/api/checkout-session', {
      method: 'POST',
      body: {
        items: cartStore.items.map((item) => ({
          slug: item.slug,
          size: item.size,
          quantity: item.quantity
        }))
      }
    })

    await navigateTo(response.url, { external: true })
  } catch (error) {
    apiError.value = error instanceof Error ? error.message : t('cart.checkoutError')
  } finally {
    isLoading.value = false
  }
}

useSeoMeta({
  title: () => t('seo.cartTitle'),
  description: () => t('seo.cartDescription'),
  ogTitle: () => t('seo.cartTitle'),
  ogDescription: () => t('seo.cartDescription')
})
</script>

<template>
  <main class="mx-auto max-w-5xl px-4 py-12 pb-28 sm:px-6 sm:pb-12">
    <div class="mb-8 flex items-end justify-between">
      <h1 class="text-4xl text-ink-900">{{ t('cart.title') }}</h1>
      <p class="text-sm text-clay-700">{{ t('cart.itemsCount', { count: cartStore.totalItems }) }}</p>
    </div>

    <div v-if="!cartStore.items.length" class="rounded-3xl bg-white/80 p-10 text-center">
      <p class="text-lg text-clay-700">{{ t('cart.empty') }}</p>
      <NuxtLink :to="localePath('/boutique')" no-prefetch class="mt-5 inline-flex rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white">
        {{ t('cart.backToShop') }}
      </NuxtLink>
    </div>

    <section v-else class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="space-y-4">
        <article
          v-for="item in cartStore.items"
          :key="item.lineId"
          class="flex flex-col gap-4 rounded-3xl border border-clay-500/20 bg-white/80 p-4 sm:flex-row sm:items-center"
        >
          <NuxtImg :src="item.imageUrl" :alt="item.name" class="h-28 w-full rounded-2xl object-cover sm:w-28" width="800" height="1066" decoding="async" loading="lazy" format="webp" />
          <div class="flex-1">
            <NuxtLink :to="localePath(`/produit/${item.slug}`)" no-prefetch class="text-xl text-ink-900 hover:text-clay-700">{{ item.name }}</NuxtLink>
            <p class="mt-1 text-xs uppercase tracking-[0.15em] text-clay-700">{{ t('product.size') }} {{ item.size }}</p>
            <p class="mt-1 text-sm text-clay-700">{{ (item.priceCents / 100).toFixed(2) }} EUR</p>
          </div>
          <div class="flex items-center gap-3">
            <button class="h-9 w-9 rounded-full border border-clay-700 text-clay-700" @click="cartStore.updateQuantity(item.lineId, item.quantity - 1)">-</button>
            <span class="w-7 text-center font-bold">{{ item.quantity }}</span>
            <button class="h-9 w-9 rounded-full border border-clay-700 text-clay-700" @click="cartStore.updateQuantity(item.lineId, item.quantity + 1)">+</button>
          </div>
          <button class="text-xs font-semibold uppercase tracking-[0.18em] text-clay-700" @click="cartStore.removeProduct(item.lineId)">{{ t('cart.remove') }}</button>
        </article>
      </div>

      <aside class="h-fit rounded-3xl border border-clay-500/20 bg-white/85 p-6 shadow-soft">
        <p class="text-sm uppercase tracking-[0.2em] text-clay-700">{{ t('cart.summary') }}</p>
        <div class="mt-5 space-y-2 text-sm text-clay-700">
          <p class="flex justify-between"><span>{{ t('cart.subtotal') }}</span><span>{{ (cartStore.totalPriceCents / 100).toFixed(2) }} EUR</span></p>
          <p class="flex justify-between"><span>{{ t('cart.shipping') }}</span><span>{{ t('cart.free') }}</span></p>
          <p class="flex justify-between font-semibold text-ink-900"><span>{{ t('cart.total') }}</span><span>{{ (cartStore.totalPriceCents / 100).toFixed(2) }} EUR</span></p>
        </div>
        <button
          class="mt-6 w-full rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-ink-900 disabled:opacity-60"
          :disabled="isLoading"
          @click="checkout"
        >
          {{ isLoading ? t('cart.redirecting') : t('cart.pay') }}
        </button>
        <p v-if="apiError" class="mt-3 text-sm text-red-700">{{ apiError }}</p>
      </aside>
    </section>

    <div v-if="cartStore.items.length" class="fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-clay-500/25 bg-white/95 p-3 shadow-soft backdrop-blur lg:hidden">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.16em] text-clay-700">{{ t('cart.total') }}</p>
          <p class="text-lg font-bold text-ink-900">{{ (cartStore.totalPriceCents / 100).toFixed(2) }} EUR</p>
        </div>
        <button
          class="rounded-full bg-clay-700 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white disabled:opacity-60"
          :disabled="isLoading"
          @click="checkout"
        >
          {{ isLoading ? t('cart.redirecting') : t('cart.pay') }}
        </button>
      </div>
    </div>
  </main>
</template>
