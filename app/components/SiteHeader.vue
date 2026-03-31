<script setup lang="ts">
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { mode, toggleTheme } = useTheme()

const nextLocaleCode = computed(() => (locale.value === 'en' ? 'fr' : 'en'))
const nextLocaleHref = computed(() => switchLocalePath(nextLocaleCode.value) || localePath('/'))
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-clay-500/15 bg-cream-50/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink :to="localePath('/')" no-prefetch class="group inline-flex items-center">
        <img
          src="/logo-aurora.svg"
          alt="Aurora"
          class="h-9 w-auto opacity-95 transition group-hover:opacity-100 md:hidden"
          :class="mode === 'dark' ? 'invert brightness-200' : ''"
          width="1280"
          height="780"
          decoding="async"
        >
        <img
          src="/logo-aurora-compact.svg"
          alt="Aurora"
          class="hidden h-11 w-auto opacity-95 transition group-hover:opacity-100 md:block"
          :class="mode === 'dark' ? 'invert brightness-200' : ''"
          width="700"
          height="150"
          decoding="async"
        >
      </NuxtLink>

      <div class="flex items-center gap-3 text-sm font-medium text-clay-700 md:gap-5">
        <NuxtLink :to="localePath('/boutique')" no-prefetch class="transition hover:text-ink-900">{{ t('header.shop') }}</NuxtLink>
        <NuxtLink :to="`${localePath('/')}#faq`" no-prefetch class="hidden transition hover:text-ink-900 md:inline-flex">{{ t('header.faq') }}</NuxtLink>
        <NuxtLink :to="`${localePath('/boutique')}#wishlist`" no-prefetch class="hidden transition hover:text-ink-900 md:inline-flex">
          {{ t('header.wishlist') }}
          <span class="ml-1 rounded-full bg-white px-1.5 py-0.5 text-xs">{{ wishlistStore.totalItems }}</span>
        </NuxtLink>
        <button
          class="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-clay-500/40 transition hover:border-clay-700 hover:bg-white/60"
          type="button"
          :aria-label="t('header.quickCart')"
          @click="cartStore.openDrawer()"
        >
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12l-1.2 8.4a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.6L6 7Zm2 0V6a4 4 0 1 1 8 0v1" />
          </svg>
          <span class="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-clay-700 px-1 text-[10px] font-bold text-white">{{ cartStore.totalItems }}</span>
        </button>

        <button
          class="rounded-full border border-clay-500/30 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] transition hover:border-clay-700 hover:bg-white/60"
          type="button"
          @click="toggleTheme"
        >
          {{ mode === 'dark' ? t('header.lightMode') : t('header.darkMode') }}
        </button>

        <NuxtLink
          :to="nextLocaleHref"
          no-prefetch
          class="rounded-full border border-clay-500/30 px-2.5 py-1 text-xs uppercase tracking-[0.12em] transition hover:border-clay-700 hover:bg-white/60"
        >
          {{ nextLocaleCode }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
