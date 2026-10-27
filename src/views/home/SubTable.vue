<script setup lang="ts">
import { NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import AdvancedOptions from '@/components/converter/AdvancedOptions.vue'
import ConversionResults from '@/components/converter/ConversionResults.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSubscriptionConverter } from '@/composables/useSubscriptionConverter'

const {
  state, targetOptions, regionOptions, apiOptions, remoteOptions, placeholder,
  isMoreConfigOpen, isShortLinkLoading, handleApiChange, handleRemoteChange,
  handleGetSubUrl, handleGetShortUrl, copyToClipboard,
} = useSubscriptionConverter()
</script>

<template>
  <NForm label-placement="top" :show-feedback="false" class="converter-form" @submit.prevent="handleGetSubUrl">
    <div class="converter-grid">
      <section class="source-section" aria-labelledby="source-heading">
        <h2 id="source-heading" class="section-title"><AppIcon name="link" />订阅来源</h2>
        <p id="source-hint" class="section-description">每行一条订阅链接或节点，也可以用 | 分隔。</p>
        <NInput
          v-model:value="state.urls"
          class="source-input"
          type="textarea"
          :input-props="{ id: 'source-links', 'aria-label': '订阅链接', 'aria-describedby': 'source-hint', spellcheck: false }"
          :autosize="{ minRows: 9, maxRows: 14 }"
          :placeholder="placeholder"
        />
        <p class="source-note">支持同时转换多个订阅源。</p>
      </section>
      <section class="settings-section" aria-labelledby="settings-heading">
        <h2 id="settings-heading" class="section-title"><AppIcon name="settings" />转换设置</h2>
        <p class="section-description">选择要使用的客户端和配置。</p>
        <NFormItem label="目标客户端" :label-props="{ for: 'client-select' }">
          <NSelect v-model:value="state.target" :input-props="{ id: 'client-select', 'aria-label': '目标客户端' }" :options="targetOptions" filterable />
        </NFormItem>
        <NFormItem label="后端服务" :label-props="{ for: 'api-select' }">
          <NSelect v-model:value="state.apiSelection" :input-props="{ id: 'api-select', 'aria-label': '后端服务' }" :options="apiOptions" filterable @update:value="handleApiChange" />
        </NFormItem>
        <NFormItem v-if="state.isShowManualApiUrl" label="自定义后端 API 地址" :label-props="{ for: 'custom-api' }">
          <NInput v-model:value="state.api" :input-props="{ id: 'custom-api' }" placeholder="例如：https://sub.example.com" />
        </NFormItem>
        <NFormItem label="远程配置" :label-props="{ for: 'remote-select' }">
          <NSelect v-model:value="state.remoteSelection" :input-props="{ id: 'remote-select', 'aria-label': '远程配置' }" :options="remoteOptions" filterable @update:value="handleRemoteChange" />
        </NFormItem>
        <NFormItem v-if="state.isShowRemoteConfig" label="自定义远程配置地址" :label-props="{ for: 'custom-remote' }">
          <NInput v-model:value="state.remoteConfig" :input-props="{ id: 'custom-remote' }" placeholder="请输入远程配置地址" />
        </NFormItem>
        <button class="advanced-toggle" type="button" :aria-expanded="isMoreConfigOpen" aria-controls="advanced-options" @click="isMoreConfigOpen = !isMoreConfigOpen">
          <span>高级设置<span class="advanced-caption">节点筛选与参数</span></span>
          <AppIcon name="chevron" :class="{ expanded: isMoreConfigOpen }" />
        </button>
      </section>
    </div>
    <AdvancedOptions v-if="isMoreConfigOpen" v-model="state.moreConfig" :region-options="regionOptions" />
    <ConversionResults :sub-url="state.result.subUrl" :short-url="state.result.shortUrl" :loading="isShortLinkLoading" @convert="handleGetSubUrl" @shorten="handleGetShortUrl" @copy="copyToClipboard" />
  </NForm>
</template>

<style scoped>
.converter-grid { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr); gap: 32px; padding-bottom: 26px; }
.source-section { padding-right: 32px; border-right: 1px solid var(--line); min-width: 0; }
.settings-section { min-width: 0; }
.section-title { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--text-primary); font-size: 16px; font-weight: 600; }
.section-title .app-icon { width: 18px; color: #cbd5e1; }
.section-description { margin: 10px 0 22px; color: var(--text-muted); font-size: 13px; line-height: 1.7; }
.source-input { line-height: 1.9; }
.source-note { color: var(--text-muted); font-size: 12px; margin: 14px 0 0; }
.converter-form :deep(.n-form-item) { margin-bottom: 16px; }
.advanced-toggle { display: flex; justify-content: space-between; align-items: center; gap: 8px; width: 100%; min-height: 40px; padding: 4px 0; color: var(--text-secondary); border: 0; border-radius: 4px; background: transparent; cursor: pointer; text-align: left; font-size: 13px; }
.advanced-toggle:hover { color: var(--text-primary); }
.advanced-toggle .app-icon { width: 15px; height: 15px; transition: transform 180ms ease; }
.advanced-toggle .expanded { transform: rotate(180deg); }
.advanced-caption { margin-left: 12px; color: var(--text-muted); font-size: 12px; }
@media (max-width: 760px) {
  .converter-grid { grid-template-columns: 1fr; gap: 24px; }
  .source-section { padding-right: 0; padding-bottom: 24px; border-right: 0; border-bottom: 1px solid var(--line); }
}
@media (max-width: 600px) {
  .section-description { margin-bottom: 16px; }
}
</style>
