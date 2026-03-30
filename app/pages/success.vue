<script setup lang="ts">
const cartStore = useCartStore()

onMounted(() => {
  cartStore.clear()
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-16 sm:px-6">
    <section class="rounded-3xl border border-green-200 bg-green-50 p-10 text-center">
      <p class="text-sm font-semibold uppercase tracking-[0.2em] text-green-800">Paiement confirme</p>
      <h1 class="mt-3 text-4xl text-green-900">Merci pour ta commande</h1>
      <p class="mx-auto mt-4 max-w-xl text-green-800">
        Ton look est reserve. Tu recevras un email de suivi des que le colis part de notre atelier.
      </p>
      <NuxtLink to="/boutique" class="mt-8 inline-flex rounded-full bg-green-800 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white">
        Continuer le shopping
      </NuxtLink>
    </section>
  </main>
</template>
