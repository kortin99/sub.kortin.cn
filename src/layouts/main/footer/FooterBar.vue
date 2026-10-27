<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <span>基于 Subconverter</span>
    <span>© {{ year }} <a href="https://kortin.me" target="_blank" rel="noopener noreferrer">kortin.cn</a></span>
  </footer>
</template>

<style scoped>
.site-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; width: min(calc(100% - 48px), 1040px); margin: auto auto 0; padding: 22px 0 26px; border-top: 1px solid rgba(214,224,236,.07); color: var(--text-muted); font-size: 12px; }
.site-footer a { color: var(--text-secondary); text-decoration: none; }
.site-footer a:hover { color: var(--text-primary); }
@media (max-width: 600px) { .site-footer { width: calc(100% - 32px); } }
</style>
