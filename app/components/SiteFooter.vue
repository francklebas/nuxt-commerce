<script setup lang="ts">
const { t } = useI18n()
</script>

<template>
  <footer class="mt-20 border-t border-clay-500/15">
    <div class="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-clay-700 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>{{ t('footer.stack') }}</p>
      <p class="text-xs uppercase tracking-[0.22em] text-clay-700/70">{{ t('footer.brand') }}</p>
    </div>
  </footer>
</template>
