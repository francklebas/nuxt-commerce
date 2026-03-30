<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
    <section class="rounded-3xl border border-amber-200 bg-amber-50 p-10 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">{{ t('checkout.cancel.badge') }}</p>
      <h1 class="mt-3 text-4xl text-amber-900">{{ t('checkout.cancel.title') }}</h1>
      <p class="mx-auto mt-4 max-w-xl text-amber-800">
        {{ t('checkout.cancel.copy') }}
      </p>
      <NuxtLink :to="localePath('/panier')" class="mt-8 inline-flex rounded-full bg-amber-800 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white">
        {{ t('checkout.cancel.cta') }}
      </NuxtLink>
    </section>
  </main>
</template>
