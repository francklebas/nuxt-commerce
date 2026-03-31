<script setup lang="ts">
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { t, locale, locales } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { mode, toggleTheme } = useTheme()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-clay-500/15 bg-cream-50/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink :to="localePath('/')" no-prefetch class="group inline-flex items-center">
        <img
          src="/logo-aurora-compact.svg"
          alt="Aurora"
          class="h-10 w-auto opacity-95 transition group-hover:opacity-100 sm:h-11"
          :class="mode === 'dark' ? 'invert brightness-200' : ''"
          width="700"
          height="150"
          decoding="async"
        >
      </NuxtLink>

      <div class="flex items-center gap-5 text-sm font-medium text-clay-700">
        <NuxtLink :to="localePath('/boutique')" no-prefetch class="transition hover:text-ink-900">{{ t('header.shop') }}</NuxtLink>
        <NuxtLink :to="`${localePath('/')}#faq`" no-prefetch class="hidden transition hover:text-ink-900 md:inline-flex">{{ t('header.faq') }}</NuxtLink>
        <NuxtLink :to="`${localePath('/boutique')}#wishlist`" no-prefetch class="hidden transition hover:text-ink-900 md:inline-flex">
          {{ t('header.wishlist') }}
          <span class="ml-1 rounded-full bg-white px-1.5 py-0.5 text-xs">{{ wishlistStore.totalItems }}</span>
        </NuxtLink>
        <button
          class="relative rounded-full border border-clay-500/30 px-4 py-2 transition hover:border-clay-700 hover:bg-white/60"
          type="button"
          @click="cartStore.openDrawer()"
        >
          {{ t('header.quickCart') }}
          <span class="ml-2 rounded-full bg-clay-700 px-2 py-0.5 text-xs font-semibold text-white">{{ cartStore.totalItems }}</span>
        </button>

        <button
          class="rounded-full border border-clay-500/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition hover:border-clay-700 hover:bg-white/60"
          type="button"
          @click="toggleTheme"
        >
          {{ mode === 'dark' ? t('header.lightMode') : t('header.darkMode') }}
        </button>

        <div class="items-center gap-2 flex">
          <NuxtLink
            v-for="item in locales"
            :key="item.code"
            :to="switchLocalePath(item.code)"
            no-prefetch
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
