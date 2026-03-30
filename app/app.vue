<script setup lang="ts">
const { locale } = useI18n()

useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  }
}))
</script>

<template>
  <div class="min-h-screen bg-cream-50 text-ink-900">
    <NuxtRouteAnnouncer />
    <SiteHeader />
    <NuxtPage />
    <SiteFooter />
    <CartDrawer />
    <CartToast />
  </div>
</template>
