<script setup lang="ts">
import AppIcon from '@/components/AppIcon.vue'
const siteName = window.config.siteName
</script>

<template>
  <RouterLink to="/" class="brand">
    <span class="brand-mark"><AppIcon name="link" /></span>
    <span class="brand-name">{{ siteName }}</span>
  </RouterLink>
</template>

<style scoped>
.brand { display: inline-flex; align-items: center; gap: 12px; min-width: 0; color: var(--text-primary); text-decoration: none; }
.brand-mark {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(214, 224, 236, 0.23);
  border-radius: 10px;
  color: #d4dbe5;
  background: linear-gradient(145deg, rgba(255,255,255,.1), rgba(255,255,255,.02));
  box-shadow: inset 0 1px 2px rgba(255,255,255,.08), 0 2px 5px rgba(0,0,0,.12);
}
.brand-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; font-weight: 600; }
@media (max-width: 400px) { .brand-name { max-width: 195px; font-size: 14px; } }
</style>
