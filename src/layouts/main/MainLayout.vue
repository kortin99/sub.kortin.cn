<script setup lang="ts">
import NavBar from '@/layouts/main/navbar/NavBar.vue'
import FooterBar from '@/layouts/main/footer/FooterBar.vue'
import PatternBackground from '@/components/backgrounds/PatternBackground.vue'
</script>

<template>
  <div class="app-shell">
    <PatternBackground class="page-pattern" :animate="true" direction="bottom-right" variant="big-dot" size="lg" mask="ellipse" :speed="1000" aria-hidden="true" />
    <a class="skip-link" href="#converter">跳到订阅转换</a>
    <NavBar />
    <RouterView />
    <FooterBar />
  </div>
</template>

<style scoped>
.app-shell {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(
      ellipse 52% 50% at 50% 11%,
      #416b61 0%,
      #2d554c 22%,
      #18342e 45%,
      #07110f 70%,
      transparent 88%
    ),
    #020504;
}
.app-shell::before {
  position: absolute;
  z-index: -2;
  inset: 0;
  pointer-events: none;
  content: '';
  background:
    radial-gradient(ellipse 34% 190px at 58% 9%, rgba(139, 181, 171, 0.07), transparent),
    linear-gradient(145deg, transparent 30%, rgba(1, 5, 4, 0.22) 76%, rgba(0, 0, 0, 0.4));
}
.page-pattern {
  --pattern-color: rgba(160, 194, 185, 0.22);
  position: absolute;
  z-index: -1;
  inset: 0;
  opacity: 0.4;
}
.skip-link { position: absolute; top: -100px; left: 20px; z-index: 40; padding: 10px 16px; background: #e8ebef; color: #171b21; border-radius: 8px; }
.skip-link:focus { top: 12px; }
</style>
