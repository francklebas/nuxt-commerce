<script setup lang="ts">
const { locale, t } = useI18n()
const wishlistStore = useWishlistStore()
const { initTheme } = useTheme()

onMounted(() => {
  wishlistStore.init()
  initTheme()
})

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  },
  title: t('seo.defaultTitle'),
  meta: [
    {
      name: 'description',
      content: t('seo.defaultDescription')
    }
  ],
  titleTemplate: (titleChunk?: string) => titleChunk ? `${titleChunk} | AURORA` : 'AURORA'
}))

useSeoMeta({
  title: () => t('seo.defaultTitle'),
  description: () => t('seo.defaultDescription'),
  ogTitle: () => t('seo.defaultTitle'),
  ogDescription: () => t('seo.defaultDescription'),
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <div class="min-h-screen bg-cream-50 text-ink-900">
    <NuxtRouteAnnouncer />
    <SiteHeader />
    <Suspense>
      <NuxtPage />
      <template #fallback>
        <main class="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div class="space-y-4 rounded-3xl border border-clay-500/20 bg-white/80 p-6">
            <div class="h-8 w-2/3 animate-pulse rounded-xl bg-clay-500/20" />
            <div class="h-4 w-full animate-pulse rounded-xl bg-clay-500/20" />
            <div class="h-4 w-5/6 animate-pulse rounded-xl bg-clay-500/20" />
            <div class="h-64 w-full animate-pulse rounded-2xl bg-clay-500/20" />
          </div>
        </main>
      </template>
    </Suspense>
    <SiteFooter />
    <CartDrawer />
    <CartToast />
  </div>
</template>
