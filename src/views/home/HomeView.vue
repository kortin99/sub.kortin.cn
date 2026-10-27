<script setup lang="ts">
import SubTable from '@/views/home/SubTable.vue'
import AppIcon from '@/components/AppIcon.vue'
</script>

<template>
  <main class="home-page">
    <header class="hero">
      <h1 class="hero-title">订阅转换，<span>简单一点。</span></h1>
      <p class="hero-description">合并订阅、切换客户端，一处完成。<br class="mobile-break" />支持 Clash、Surge、Sing-box 等多种格式。</p>
    </header>
    <section id="converter" class="workspace" aria-label="订阅转换" tabindex="-1">
      <SubTable />
    </section>
    <p class="privacy-note"><AppIcon name="shield" /><span>转换链接在本地生成；生成短链时会提交给短链服务。请仅使用你信任的后端。</span></p>
  </main>
</template>

<style scoped>
.home-page { width: min(calc(100% - 48px), 1040px); margin: 0 auto; padding: 54px 0 32px; }
.hero { margin: 0 auto 36px; text-align: center; }
.hero-title { margin: 0; color: #f0f2f5; font-size: clamp(28px, 3.4vw, 42px); font-weight: 600; letter-spacing: -.015em; line-height: 1.5; }
.hero-title span { color: #cbd5e1; }
.hero-description { margin: 13px 0 0; color: #aeb6c1; font-size: 14px; line-height: 1.9; }
.mobile-break { display: none; }
.workspace {
  position: relative;
  padding: 30px 32px;
  border: 1px solid rgba(205, 228, 221, 0.15);
  border-radius: 20px;
  background:
    radial-gradient(ellipse 74% 120px at 50% 0, rgba(255,255,255,.03), transparent 78%),
    linear-gradient(145deg, rgba(177,201,194,.04), rgba(255,255,255,.014) 42%, rgba(5,11,9,.1));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.12),
    inset 0 0 0 1px rgba(255,255,255,.012),
    inset 0 -1px 0 rgba(255,255,255,.018),
    inset 0 30px 44px -38px rgba(255,255,255,.12),
    0 28px 80px rgba(0,0,0,.3);
  backdrop-filter: blur(22px) saturate(110%);
  -webkit-backdrop-filter: blur(22px) saturate(110%);
  animation: appear 450ms ease-out both;
}
.privacy-note { display: flex; justify-content: center; align-items: flex-start; gap: 8px; margin: 20px 12px 0; color: var(--text-muted); font-size: 12px; line-height: 1.8; }
.privacy-note .app-icon { width: 15px; height: 15px; margin-top: 3px; }
@keyframes appear { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@media (max-width: 600px) {
  .home-page { width: calc(100% - 32px); padding-top: 34px; padding-bottom: 25px; }
  .hero { margin-bottom: 26px; }
  .hero-title { font-size: clamp(25px, 6.6vw, 36px); }
  .hero-description { margin-top: 10px; font-size: 13px; }
  .mobile-break { display: initial; }
  .workspace { padding: 22px 18px; border-radius: 16px; }
  .privacy-note { margin: 18px 2px 0; }
}
@media (prefers-reduced-transparency: reduce), (prefers-contrast: more) {
  .workspace { background: #171b21; backdrop-filter: none; -webkit-backdrop-filter: none; border-color: #748092; }
}
</style>
