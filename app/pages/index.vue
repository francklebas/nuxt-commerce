<script setup lang="ts">
import type { Product } from '~/types/product'

const { t, locale } = useI18n()
const localePath = useLocalePath()

const { data: products, error } = await useFetch<Product[]>('/api/products', {
  key: `products-home-${locale.value}`,
  query: { locale: locale.value }
})

const featuredProducts = computed(() => (products.value || []).slice(0, 3))

useSeoMeta({
  title: () => t('seo.homeTitle'),
  description: () => t('seo.homeDescription'),
  ogTitle: () => t('seo.homeTitle'),
  ogDescription: () => t('seo.homeDescription')
})
</script>

<template>
  <main>
    <section class="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
      <div class="space-y-6">
        <p class="inline-flex rounded-full border border-clay-700/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-clay-700">
          {{ t('home.hero.badge') }}
        </p>
        <h1 class="text-balance text-4xl leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
          {{ t('home.hero.title') }}
        </h1>
        <p class="max-w-xl text-lg text-clay-700/95">
          {{ t('home.hero.subtitle') }}
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink :to="localePath('/boutique')" no-prefetch class="rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-900">
            {{ t('home.hero.ctaCollection') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/panier')" no-prefetch class="rounded-full border border-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-clay-700 transition hover:bg-white">
            {{ t('home.hero.ctaCart') }}
          </NuxtLink>
        </div>
      </div>

      <div class="editorial-frame relative overflow-hidden rounded-[2rem] bg-white/75 p-5">
        <p class="absolute right-6 top-6 z-10 rounded-full border border-white/50 bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-clay-700">
          {{ t('home.hero.editorialTag') }}
        </p>
        <NuxtImg
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=80"
          :alt="t('home.hero.imageAlt')"
          class="h-[420px] w-full rounded-[1.4rem] object-cover"
          width="1400"
          height="900"
          decoding="async"
          fetchpriority="high"
          format="webp"
          sizes="(max-width: 1024px) 100vw, 45vw"
        />
        <div class="pointer-events-none absolute inset-x-10 bottom-10 rounded-2xl bg-ink-900/75 p-4 text-sm text-white backdrop-blur">
          {{ t('home.hero.socialProof') }}
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div class="manifesto-panel rounded-3xl border border-clay-500/20 px-6 py-8">
        <p class="text-xs font-semibold uppercase tracking-[0.24em] text-clay-700">{{ t('home.manifesto.kicker') }}</p>
        <p class="mt-3 max-w-4xl text-3xl leading-tight text-ink-900 sm:text-4xl">
          {{ t('home.manifesto.quote') }}
        </p>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="rounded-3xl border border-clay-500/20 bg-white/80 p-8">
        <p class="text-sm uppercase tracking-[0.2em] text-clay-700">{{ t('home.funnel.title') }}</p>
        <div class="mt-6 grid gap-5 md:grid-cols-3">
          <article class="rounded-2xl bg-cream-50 p-5">
            <h2 class="text-2xl">{{ t('home.funnel.step1Title') }}</h2>
            <p class="mt-2 text-sm text-clay-700">{{ t('home.funnel.step1Copy') }}</p>
          </article>
          <article class="rounded-2xl bg-cream-50 p-5">
            <h2 class="text-2xl">{{ t('home.funnel.step2Title') }}</h2>
            <p class="mt-2 text-sm text-clay-700">{{ t('home.funnel.step2Copy') }}</p>
          </article>
          <article class="rounded-2xl bg-cream-50 p-5">
            <h2 class="text-2xl">{{ t('home.funnel.step3Title') }}</h2>
            <p class="mt-2 text-sm text-clay-700">{{ t('home.funnel.step3Copy') }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
      <div class="mb-6 flex items-end justify-between">
        <h2 class="text-3xl text-ink-900">{{ t('home.products.title') }}</h2>
        <NuxtLink :to="localePath('/boutique')" no-prefetch class="text-sm font-semibold uppercase tracking-[0.14em] text-clay-700 hover:text-ink-900">{{ t('home.products.viewAll') }}</NuxtLink>
      </div>

      <p v-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {{ t('home.products.error') }}
      </p>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>

    <section id="shipping" class="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div class="grid gap-5 rounded-3xl border border-clay-500/20 bg-white/85 p-8 md:grid-cols-3">
        <article>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-clay-700">{{ t('home.shipping.card1Label') }}</p>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.shipping.card1Copy') }}</p>
        </article>
        <article>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-clay-700">{{ t('home.shipping.card2Label') }}</p>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.shipping.card2Copy') }}</p>
        </article>
        <article>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-clay-700">{{ t('home.shipping.card3Label') }}</p>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.shipping.card3Copy') }}</p>
        </article>
      </div>
    </section>

    <section id="faq" class="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
      <h2 class="text-3xl text-ink-900">{{ t('home.faq.title') }}</h2>
      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <h3 class="text-lg text-ink-900">{{ t('home.faq.q1') }}</h3>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.faq.a1') }}</p>
        </article>
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <h3 class="text-lg text-ink-900">{{ t('home.faq.q2') }}</h3>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.faq.a2') }}</p>
        </article>
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <h3 class="text-lg text-ink-900">{{ t('home.faq.q3') }}</h3>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.faq.a3') }}</p>
        </article>
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <h3 class="text-lg text-ink-900">{{ t('home.faq.q4') }}</h3>
          <p class="mt-2 text-sm text-clay-700">{{ t('home.faq.a4') }}</p>
        </article>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
      <h2 class="text-3xl text-ink-900">{{ t('home.testimonials.title') }}</h2>
      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <p class="text-sm text-clay-700">"{{ t('home.testimonials.quote1') }}"</p>
          <p class="mt-3 text-xs uppercase tracking-[0.16em] text-clay-700">{{ t('home.testimonials.author1') }}</p>
        </article>
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <p class="text-sm text-clay-700">"{{ t('home.testimonials.quote2') }}"</p>
          <p class="mt-3 text-xs uppercase tracking-[0.16em] text-clay-700">{{ t('home.testimonials.author2') }}</p>
        </article>
        <article class="rounded-2xl border border-clay-500/20 bg-white/80 p-5">
          <p class="text-sm text-clay-700">"{{ t('home.testimonials.quote3') }}"</p>
          <p class="mt-3 text-xs uppercase tracking-[0.16em] text-clay-700">{{ t('home.testimonials.author3') }}</p>
        </article>
      </div>
    </section>
  </main>
</template>
