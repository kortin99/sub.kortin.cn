<script setup lang="ts">
import ClientIcon from '@/components/converter/ClientIcon.vue'
import type { ClientIconName } from '@/components/converter/clientIcons'

defineProps<{
  label: string
  icon: ClientIconName
}>()
</script>

<template>
  <span class="client-option-label">
    <ClientIcon :name="icon" />
    <span class="client-option-label-text">{{ label }}</span>
  </span>
</template>

<style scoped>
.client-option-label { display: flex; align-items: center; gap: 9px; min-width: 0; line-height: 1.3; }
.client-option-label-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>
