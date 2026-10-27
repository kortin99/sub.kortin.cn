<script setup lang="ts">
import { shallowRef } from 'vue'
import { NDrawer, NDrawerContent } from 'naive-ui'
import AppIcon from '@/components/AppIcon.vue'

const open = shallowRef(false)
const items = window.config.menuItem
</script>

<template>
  <nav class="desktop-menu" aria-label="主导航">
    <a v-for="(item, index) in items" :key="`${item.link}-${index}`" :href="item.link" :target="item.target || undefined" :rel="item.target === '_blank' ? 'noopener noreferrer' : undefined" class="nav-link" :class="{ 'nav-link-external': item.target === '_blank' }">
      {{ item.title }}<AppIcon v-if="item.target === '_blank'" class="external-arrow" name="arrow" />
    </a>
  </nav>
  <button type="button" class="menu-toggle" aria-label="打开导航菜单" :aria-expanded="open" @click="open = true"><AppIcon name="menu" /></button>
  <NDrawer v-model:show="open" :width="280" placement="right">
    <NDrawerContent title="导航菜单" closable>
      <nav class="mobile-menu" aria-label="移动端导航">
        <a v-for="(item, index) in items" :key="`${item.link}-${index}`" class="nav-link" :href="item.link" :target="item.target || undefined" :rel="item.target === '_blank' ? 'noopener noreferrer' : undefined" @click="open = false">{{ item.title }}<AppIcon v-if="item.target === '_blank'" class="external-arrow" name="arrow" /></a>
      </nav>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.desktop-menu { display: flex; align-items: center; flex-wrap: wrap; justify-content: flex-end; gap: 8px; }
.nav-link { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 9px 17px; border: 1px solid transparent; border-radius: 8px; color: var(--text-secondary); text-decoration: none; font-size: 13px; transition: background 150ms, color 150ms; }
.nav-link:hover { color: var(--text-primary); background: rgba(255,255,255,.07); }
.nav-link-external { border-color: var(--line); background: rgba(255,255,255,.035); box-shadow: inset 0 1px 0 rgba(255,255,255,.05); }
.external-arrow { width: 14px; height: 14px; transform: rotate(-45deg); }
.menu-toggle { display: none; flex: none; place-items: center; width: 40px; height: 40px; border: 1px solid var(--line); border-radius: 8px; background: rgba(255,255,255,.04); color: var(--text-primary); cursor: pointer; }
.mobile-menu { display: grid; gap: 8px; }
.mobile-menu .nav-link { justify-content: space-between; font-size: 15px; padding: 12px; }
@media (max-width: 600px) { .desktop-menu { display: none; } .menu-toggle { display: grid; } }
</style>
