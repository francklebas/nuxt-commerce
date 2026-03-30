<script setup lang="ts">
const cartStore = useCartStore()
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-clay-500/15 bg-cream-50/90 backdrop-blur">
    <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
      <NuxtLink to="/" class="group inline-flex items-center gap-2">
        <span class="rounded-full bg-clay-700 px-2 py-1 text-xs font-bold uppercase tracking-[0.22em] text-white">
          AURORA
        </span>
        <span class="text-xs font-semibold uppercase tracking-[0.24em] text-clay-700/75 group-hover:text-clay-700">
          Atelier Pret-a-Porter
        </span>
      </NuxtLink>

      <div class="flex items-center gap-5 text-sm font-medium text-clay-700">
        <NuxtLink to="/boutique" class="transition hover:text-ink-900">Boutique</NuxtLink>
        <NuxtLink to="/panier" class="relative rounded-full border border-clay-500/30 px-4 py-2 transition hover:border-clay-700 hover:bg-white/60">
          Panier
          <span class="ml-2 rounded-full bg-clay-700 px-2 py-0.5 text-xs font-semibold text-white">{{ cartStore.totalItems }}</span>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>
