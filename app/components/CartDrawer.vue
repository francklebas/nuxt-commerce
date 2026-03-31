<script setup lang="ts">
const cartStore = useCartStore()
const { t } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <button
        v-if="cartStore.isDrawerOpen"
        class="fixed inset-0 z-40 bg-ink-900/45"
        type="button"
        :aria-label="t('cart.drawer.close')"
        @click="cartStore.closeDrawer()"
      />
    </transition>

    <aside
      class="fixed right-0 top-0 z-50 flex h-dvh w-full max-w-md flex-col border-l border-clay-500/20 bg-cream-50 shadow-2xl transition-transform duration-300"
      :class="cartStore.isDrawerOpen ? 'translate-x-0' : 'translate-x-full'"
      :aria-label="t('cart.drawer.title')"
    >
      <header class="flex items-center justify-between border-b border-clay-500/20 px-5 py-4">
        <h2 class="text-xl text-ink-900">{{ t('cart.drawer.title') }}</h2>
        <button class="rounded-full border border-clay-500/40 px-3 py-1 text-sm text-clay-700" type="button" @click="cartStore.closeDrawer()">
          {{ t('cart.drawer.close') }}
        </button>
      </header>

      <div v-if="!cartStore.items.length" class="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
        <p class="text-clay-700">{{ t('cart.empty') }}</p>
        <NuxtLink :to="localePath('/boutique')" no-prefetch class="rounded-full bg-clay-700 px-5 py-2 text-sm font-semibold uppercase tracking-[0.14em] text-white" @click="cartStore.closeDrawer()">
          {{ t('home.hero.ctaCollection') }}
        </NuxtLink>
      </div>

      <div v-else class="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        <article
          v-for="item in cartStore.items"
          :key="item.lineId"
          class="rounded-2xl border border-clay-500/20 bg-white/90 p-3"
        >
          <div class="flex gap-3">
            <NuxtImg :src="item.imageUrl" :alt="item.name" class="h-20 w-16 rounded-xl object-cover" width="800" height="1066" decoding="async" loading="lazy" format="webp" />
            <div class="flex-1">
              <NuxtLink :to="localePath(`/produit/${item.slug}`)" no-prefetch class="font-semibold text-ink-900" @click="cartStore.closeDrawer()">{{ item.name }}</NuxtLink>
              <p class="mt-1 text-xs uppercase tracking-[0.15em] text-clay-700">{{ t('product.size') }} {{ item.size }}</p>
              <p class="mt-1 text-sm text-clay-700">{{ (item.priceCents / 100).toFixed(2) }} EUR</p>
            </div>
          </div>

          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <button class="h-8 w-8 rounded-full border border-clay-700 text-clay-700" type="button" @click="cartStore.updateQuantity(item.lineId, item.quantity - 1)">-</button>
              <span class="w-6 text-center text-sm font-bold">{{ item.quantity }}</span>
              <button class="h-8 w-8 rounded-full border border-clay-700 text-clay-700" type="button" @click="cartStore.updateQuantity(item.lineId, item.quantity + 1)">+</button>
            </div>
            <button class="text-xs font-semibold uppercase tracking-[0.14em] text-clay-700" type="button" @click="cartStore.removeProduct(item.lineId)">
              {{ t('cart.remove') }}
            </button>
          </div>
        </article>
      </div>

      <footer v-if="cartStore.items.length" class="space-y-4 border-t border-clay-500/20 px-5 py-4">
        <p class="flex items-center justify-between text-sm text-clay-700">
          <span>{{ t('cart.subtotal') }}</span>
          <span class="text-lg font-bold text-ink-900">{{ (cartStore.totalPriceCents / 100).toFixed(2) }} EUR</span>
        </p>
        <NuxtLink
          :to="localePath('/panier')"
          no-prefetch
          class="block rounded-full bg-clay-700 px-5 py-3 text-center text-sm font-bold uppercase tracking-[0.15em] text-white"
          @click="cartStore.closeDrawer()"
        >
          {{ t('cart.drawer.checkout') }}
        </NuxtLink>
      </footer>
    </aside>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
