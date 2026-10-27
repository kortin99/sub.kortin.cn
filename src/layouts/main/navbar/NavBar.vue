<script setup lang="ts">
import AppBrand from '@/layouts/main/navbar/AppBrand.vue'
import NavMenu from '@/layouts/main/navbar/NavMenu.vue'
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <AppBrand />
      <NavMenu />
    </div>
  </header>
</template>

<style scoped>
.site-header { position: relative; z-index: 20; padding: 24px 24px 0; }
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: min(100%, 1040px);
  min-height: 62px;
  margin: 0 auto;
  padding: 10px 16px;
  border: 1px solid rgba(205, 228, 221, 0.15);
  border-radius: 14px;
  background:
    radial-gradient(ellipse 64% 90px at 50% 0, rgba(255,255,255,.045), transparent 76%),
    linear-gradient(145deg, rgba(177,205,197,.05), rgba(255,255,255,.014) 58%, rgba(5,11,9,.08));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.14),
    inset 0 -1px 0 rgba(255,255,255,.018),
    inset 0 18px 30px -28px rgba(255,255,255,.12),
    0 14px 36px rgba(0,0,0,.28),
    0 0 34px rgba(132,181,168,.025);
  backdrop-filter: blur(20px) saturate(112%);
  -webkit-backdrop-filter: blur(20px) saturate(112%);
}
@media (max-width: 600px) { .site-header { padding: 14px 16px 0; } .header-inner { padding: 8px 12px; gap: 12px; min-height: 58px; } }
</style>
