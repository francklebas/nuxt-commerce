<script setup lang="ts">
import type { Product } from '~/types/product'

const { data: products, error } = await useFetch<Product[]>('/api/products')
</script>

<template>
  <main>
    <section class="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pt-20">
      <div class="space-y-6">
        <p class="inline-flex rounded-full border border-clay-700/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-clay-700">
          Nouvelle capsule SS26
        </p>
        <h1 class="text-balance text-4xl leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
          Des pieces premium qui convertissent en coup de coeur.
        </h1>
        <p class="max-w-xl text-lg text-clay-700/95">
          Funnel commerce complet: landing, preuve sociale, offre claire et checkout Stripe en quelques clics.
        </p>
        <div class="flex flex-wrap gap-4">
          <NuxtLink to="/boutique" class="rounded-full bg-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-ink-900">
            Voir la collection
          </NuxtLink>
          <NuxtLink to="/panier" class="rounded-full border border-clay-700 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-clay-700 transition hover:bg-white">
            Aller au panier
          </NuxtLink>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-[2rem] border border-clay-500/25 bg-white/75 p-5 shadow-soft">
        <img
          src="https://picsum.photos/id/823/1400/900"
          alt="Lookbook AI"
          class="h-[420px] w-full rounded-[1.4rem] object-cover"
        >
        <div class="pointer-events-none absolute inset-x-10 bottom-10 rounded-2xl bg-ink-900/75 p-4 text-sm text-white backdrop-blur">
          97% des clientes valident la coupe et la matiere des la premiere commande.
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 sm:px-6">
      <div class="rounded-3xl border border-clay-500/20 bg-white/80 p-8">
        <p class="text-sm uppercase tracking-[0.2em] text-clay-700">Funnel en 3 etapes</p>
        <div class="mt-6 grid gap-5 md:grid-cols-3">
          <article class="rounded-2xl bg-cream-50 p-5">
            <h2 class="text-2xl">1. Hook visuel</h2>
            <p class="mt-2 text-sm text-clay-700">Univers de marque fort, image AI haute qualite et proposition claire.</p>
          </article>
          <article class="rounded-2xl bg-cream-50 p-5">
            <h2 class="text-2xl">2. Offre concise</h2>
            <p class="mt-2 text-sm text-clay-700">Trois best-sellers avec angle produit, preuve sociale et urgence douce.</p>
          </article>
          <article class="rounded-2xl bg-cream-50 p-5">
            <h2 class="text-2xl">3. Checkout rapide</h2>
            <p class="mt-2 text-sm text-clay-700">Panier Pinia puis redirection Stripe securisee sans friction.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6">
      <div class="mb-6 flex items-end justify-between">
        <h2 class="text-3xl text-ink-900">Les 3 produits phares</h2>
        <NuxtLink to="/boutique" class="text-sm font-semibold uppercase tracking-[0.14em] text-clay-700 hover:text-ink-900">Tout voir</NuxtLink>
      </div>

      <p v-if="error" class="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Impossible de charger les produits Supabase. Verifie les variables d'environnement.
      </p>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProductCard v-for="product in products || []" :key="product.id" :product="product" />
      </div>
    </section>
  </main>
</template>
