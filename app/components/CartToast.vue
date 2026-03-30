<script setup lang="ts">
const cartStore = useCartStore()
const { t } = useI18n()
const isVisible = ref(false)
let timeoutId: ReturnType<typeof setTimeout> | null = null

watch(
  () => cartStore.lastAddedItem,
  (item) => {
    if (!item) {
      isVisible.value = false
      return
    }

    isVisible.value = true
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      isVisible.value = false
      cartStore.clearLastAddedItem()
    }, 2200)
  }
)

onBeforeUnmount(() => {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
})
</script>

<template>
  <Teleport to="body">
    <transition name="toast">
      <div
        v-if="isVisible && cartStore.lastAddedItem"
        class="fixed bottom-5 right-5 z-[60] rounded-2xl border border-clay-500/25 bg-white px-4 py-3 shadow-soft"
      >
        <p class="text-sm font-semibold text-ink-900">
          {{
            t('cart.toast.added', {
              name: cartStore.lastAddedItem.name,
              size: cartStore.lastAddedItem.size,
              quantity: cartStore.lastAddedItem.quantity
            })
          }}
        </p>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
