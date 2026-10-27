<script setup lang="ts">
import { NButton, NInput } from 'naive-ui'
import AppIcon from '@/components/AppIcon.vue'

defineProps<{ subUrl: string; shortUrl: string; loading: boolean }>()
const emit = defineEmits<{
  convert: []
  shorten: []
  copy: [url: string, title: string]
}>()
</script>

<template>
  <section class="results" aria-labelledby="results-heading">
    <div class="results-heading">
      <h2 id="results-heading">转换结果</h2>
      <span>生成后自动复制</span>
    </div>
    <div class="result-row">
      <label class="result-label" for="subscription-result">订阅链接</label>
      <NInput :value="subUrl" :input-props="{ id: 'subscription-result' }" readonly placeholder="转换后的订阅链接将显示在这里">
        <template #suffix>
          <button class="copy-button" type="button" :disabled="!subUrl" aria-label="复制订阅链接" title="复制订阅链接" @click="emit('copy', subUrl, '订阅链接')"><AppIcon name="copy" /></button>
        </template>
      </NInput>
      <NButton type="primary" class="generate-button" @click="emit('convert')">转换并复制 <AppIcon class="button-arrow" name="arrow" /></NButton>
    </div>
    <div class="result-row">
      <label class="result-label" for="short-result">短链接</label>
      <NInput :value="shortUrl" :input-props="{ id: 'short-result' }" readonly placeholder="生成更短的链接，便于导入和分享">
        <template #suffix>
          <button class="copy-button" type="button" :disabled="!shortUrl" aria-label="复制短链接" title="复制短链接" @click="emit('copy', shortUrl, '短链接')"><AppIcon name="copy" /></button>
        </template>
      </NInput>
      <NButton :loading="loading" :disabled="loading" @click="emit('shorten')">生成短链</NButton>
    </div>
  </section>
</template>

<style scoped>
.results { padding-top: 24px; border-top: 1px solid var(--line); }
.results-heading { display: flex; justify-content: space-between; align-items: center; gap: 12px; margin-bottom: 20px; }
.results-heading h2 { margin: 0; font-size: 16px; font-weight: 600; }
.results-heading span { color: var(--text-muted); font-size: 12px; }
.result-row { display: grid; grid-template-columns: 64px minmax(0, 1fr) 154px; align-items: center; gap: 16px; margin-top: 12px; }
.result-label { color: var(--text-secondary); font-size: 13px; }
.copy-button { display: grid; place-items: center; width: 32px; height: 32px; margin-right: -6px; border: 0; border-radius: 6px; color: var(--text-secondary); background: transparent; cursor: pointer; }
.copy-button:not(:disabled):hover { color: var(--text-primary); background: rgba(255,255,255,.08); }
.copy-button:disabled { opacity: .35; cursor: not-allowed; }
.copy-button .app-icon { width: 16px; height: 16px; }
.button-arrow { width: 17px; margin-left: 16px; }
@media (max-width: 600px) {
  .result-row { grid-template-columns: 1fr; gap: 9px; margin-top: 18px; }
  .result-row + .result-row { margin-top: 24px; }
}
</style>
