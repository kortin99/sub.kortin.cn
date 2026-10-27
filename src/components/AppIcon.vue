<script setup lang="ts">
defineProps<{ name: 'link' | 'arrow' | 'copy' | 'check' | 'settings' | 'shield' | 'chevron' | 'menu' | 'history' | 'trash' }>()

const paths = {
  link: 'M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-2 2 M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l2-2',
  arrow: 'M5 12h14 M13 6l6 6-6 6',
  copy: 'M9 9h11v11H9z M15 5V3H3v12h2',
  check: 'M5 12l4 4L19 6',
  settings: 'M4 7h6m4 0h6M4 17h10m4 0h2 M10 4v6 M14 14v6',
  shield: 'M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6',
  chevron: 'M6 9l6 6 6-6',
  menu: 'M4 6h16 M4 12h16 M4 18h16',
  history: 'M3 12a9 9 0 1 0 3-6.7 M3 4v5h5 M12 7v5l3 2',
  trash: 'M4 7h16 M9 7V4h6v3 M7 7l1 13h8l1-13 M10 11v5 M14 11v5',
}
</script>

<template>
  <svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path :d="paths[name]" />
  </svg>
</template>

<style scoped>
.app-icon { width: 20px; height: 20px; flex: none; vertical-align: middle; }
</style>
