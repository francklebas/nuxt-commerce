<script setup lang="ts">
const cartStore = useCartStore()
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-clay-500/15 bg-cream-50/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink :to="localePath('/')" class="group inline-flex items-center gap-2">
        <span class="rounded-full bg-clay-700 px-2 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">
          AURORA
        </span>
        <span class="text-xs font-semibold uppercase tracking-[0.24em] text-clay-700/75 group-hover:text-clay-700">
          {{ t('header.brandTagline') }}
        </span>
      </NuxtLink>

      <div class="flex items-center gap-5 text-sm font-medium text-clay-700">
        <NuxtLink :to="localePath('/boutique')" class="transition hover:text-ink-900">{{ t('header.shop') }}</NuxtLink>
        <NuxtLink :to="localePath('/#faq')" class="hidden transition hover:text-ink-900 md:inline-flex">FAQ</NuxtLink>
        <button
          class="relative rounded-full border border-clay-500/30 px-4 py-2 transition hover:border-clay-700 hover:bg-white/60"
          type="button"
          @click="cartStore.openDrawer()"
        >
          {{ t('header.quickCart') }}
          <span class="ml-2 rounded-full bg-clay-700 px-2 py-0.5 text-xs font-semibold text-white">{{ cartStore.totalItems }}</span>
        </button>

        <div class="hidden items-center gap-2 md:flex">
          <NuxtLink
            v-for="item in locales"
            :key="item.code"
            :to="switchLocalePath(item.code)"
            class="rounded-full border px-2.5 py-1 text-xs uppercase tracking-[0.12em]"
            :class="item.code === locale ? 'border-clay-700 bg-clay-700 text-white' : 'border-clay-500/30 text-clay-700 hover:border-clay-700'"
          >
            {{ item.code }}
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>
