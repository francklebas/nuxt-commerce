<script setup lang="ts">
const cartStore = useCartStore()
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta(() => ({
  title: t('seo.successTitle'),
  description: t('seo.successDescription'),
  ogTitle: t('seo.successTitle'),
  ogDescription: t('seo.successDescription')
}))

onMounted(() => {
  cartStore.clear()
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
    <section class="rounded-3xl border border-green-200 bg-green-50 p-10 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">{{ t('checkout.success.badge') }}</p>
      <h1 class="mt-3 text-4xl text-green-900">{{ t('checkout.success.title') }}</h1>
      <p class="mx-auto mt-4 max-w-xl text-green-800">
        {{ t('checkout.success.copy') }}
      </p>
      <NuxtLink :to="localePath('/boutique')" no-prefetch class="mt-8 inline-flex rounded-full bg-green-800 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white">
        {{ t('checkout.success.cta') }}
      </NuxtLink>
    </section>
  </main>
</template>
