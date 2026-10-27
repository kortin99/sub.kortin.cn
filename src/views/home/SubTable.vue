<script setup lang="ts">
import { h, nextTick, shallowRef } from 'vue'
import { NDrawer, NDrawerContent, NForm, NFormItem, NInput, NSelect, type SelectOption } from 'naive-ui'
import AdvancedOptions from '@/components/converter/AdvancedOptions.vue'
import ClientOptionLabel from '@/components/converter/ClientOptionLabel.vue'
import ConversionHistory from '@/components/converter/ConversionHistory.vue'
import ConversionResults from '@/components/converter/ConversionResults.vue'
import AppIcon from '@/components/AppIcon.vue'
import { useSubscriptionConverter, type TargetOption } from '@/composables/useSubscriptionConverter'
import type { ConversionHistoryRecord } from '@/composables/useConversionHistory'

const {
  state, targetOptions, regionOptions, apiOptions, remoteOptions, placeholder,
  isMoreConfigOpen, isShortLinkLoading, handleApiChange, handleRemoteChange,
  handleGetSubUrl, handleGetShortUrl, copyToClipboard,
  historyLimit, historyRecords, isHistoryEnabled, enableHistory,
  restoreHistory, removeHistoryRecord, clearHistory,
} = useSubscriptionConverter()

const isHistoryOpen = shallowRef(false)
const historyDrawerWidth = shallowRef(560)

const renderTargetLabel = (option: SelectOption) => {
  const target = option as TargetOption
  return h(ClientOptionLabel, {
    label: String(target.label ?? target.value),
    icon: target.icon,
  })
}

const openHistory = () => {
  historyDrawerWidth.value = Math.min(560, window.innerWidth - 24)
  isHistoryOpen.value = true
}

const handleRestoreHistory = async (record: ConversionHistoryRecord) => {
  isHistoryOpen.value = false
  restoreHistory(record)
  await nextTick()
  document.getElementById('converter')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  })
}
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
        <div class="section-heading">
          <h2 id="settings-heading" class="section-title"><AppIcon name="settings" />转换设置</h2>
          <button type="button" class="history-entry" aria-haspopup="dialog" @click="openHistory">
            <AppIcon name="history" />
            历史记录
            <span v-if="isHistoryEnabled && historyRecords.length" class="history-count">{{ historyRecords.length }}</span>
          </button>
        </div>
        <p class="section-description">选择要使用的客户端和配置。</p>
        <NFormItem label="目标客户端" :label-props="{ for: 'client-select' }">
          <NSelect v-model:value="state.target" :input-props="{ id: 'client-select', 'aria-label': '目标客户端' }" :options="targetOptions" :render-label="renderTargetLabel" filterable />
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

  <NDrawer v-model:show="isHistoryOpen" class="history-drawer" placement="right" :width="historyDrawerWidth">
    <NDrawerContent class="history-drawer-content" closable :native-scrollbar="false">
      <template #header>
        <div class="history-drawer-heading">
          <div>
            <h2>历史记录</h2>
            <p v-if="isHistoryEnabled">保存在当前浏览器，最多保留 {{ historyLimit }} 条。</p>
            <p v-else>默认关闭，只有主动开启后才会保存。</p>
          </div>
          <button v-if="isHistoryEnabled && historyRecords.length" type="button" class="clear-history" @click="clearHistory">清空记录</button>
        </div>
      </template>
      <ConversionHistory
        :records="historyRecords"
        :target-options="targetOptions"
        :enabled="isHistoryEnabled"
        @enable="enableHistory"
        @restore="handleRestoreHistory"
        @copy="copyToClipboard"
        @remove="removeHistoryRecord"
        @clear="clearHistory"
      />
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.converter-grid { display: grid; grid-template-columns: minmax(0, 1.12fr) minmax(0, 1fr); gap: 32px; padding-bottom: 26px; }
.source-section { padding-right: 32px; border-right: 1px solid var(--line); min-width: 0; }
.settings-section { min-width: 0; }
.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.section-title { display: flex; align-items: center; gap: 10px; margin: 0; color: var(--text-primary); font-size: 16px; font-weight: 600; }
.section-title .app-icon { width: 18px; color: #cbd5e1; }
.history-entry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 9px;
  border: 1px solid rgba(205,228,221,.13);
  border-radius: 7px;
  color: var(--text-muted);
  background: linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.018));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.055);
  cursor: pointer;
  font-size: 12px;
}
.history-entry:hover { color: var(--text-primary); border-color: rgba(205,228,221,.24); background: rgba(255,255,255,.055); }
.history-entry .app-icon { width: 14px; height: 14px; }
.history-count { display: grid; place-items: center; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 9px; color: #c9d5d1; background: rgba(157,190,181,.12); font-size: 10px; font-variant-numeric: tabular-nums; }
.section-description { margin: 10px 0 22px; color: var(--text-muted); font-size: 13px; line-height: 1.7; }
.source-input { line-height: 1.9; }
.source-note { color: var(--text-muted); font-size: 12px; margin: 14px 0 0; }
.converter-form :deep(.n-form-item) { margin-bottom: 16px; }
.advanced-toggle { display: flex; justify-content: space-between; align-items: center; gap: 8px; width: 100%; min-height: 40px; padding: 4px 0; color: var(--text-secondary); border: 0; border-radius: 4px; background: transparent; cursor: pointer; text-align: left; font-size: 13px; }
.advanced-toggle:hover { color: var(--text-primary); }
.advanced-toggle .app-icon { width: 15px; height: 15px; transition: transform 180ms ease; }
.advanced-toggle .expanded { transform: rotate(180deg); }
.advanced-caption { margin-left: 12px; color: var(--text-muted); font-size: 12px; }
:global(.history-drawer) {
  top: 12px !important;
  bottom: 12px !important;
  height: auto !important;
  max-width: calc(100vw - 24px) !important;
  margin-right: 12px;
  overflow: hidden;
  border: 1px solid rgba(205,228,221,.15);
  border-radius: 18px !important;
  background:
    radial-gradient(ellipse 90% 260px at 50% 0, rgba(255,255,255,.04), transparent 78%),
    linear-gradient(150deg, rgba(45,74,67,.92), rgba(15,26,23,.95) 52%, rgba(5,11,9,.97)) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.12),
    inset 0 0 0 1px rgba(255,255,255,.012),
    inset 0 30px 44px -38px rgba(255,255,255,.12),
    0 28px 80px rgba(0,0,0,.38);
  backdrop-filter: blur(26px) saturate(112%);
  -webkit-backdrop-filter: blur(26px) saturate(112%);
}
.history-drawer-heading { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; min-width: 0; padding-right: 28px; }
.history-drawer-heading h2 { margin: 0; color: var(--text-primary); font-size: 17px; font-weight: 600; }
.history-drawer-heading p { margin: 7px 0 0; color: var(--text-muted); font-size: 12px; }
.clear-history {
  flex: none;
  margin-top: 2px;
  padding: 6px 9px;
  border: 1px solid rgba(205,228,221,.11);
  border-radius: 7px;
  color: var(--text-muted);
  background: rgba(255,255,255,.025);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.045);
  cursor: pointer;
  font-size: 12px;
}
.clear-history:hover { color: #e1aaa2; border-color: rgba(225,170,162,.2); background: rgba(210,112,99,.06); }
.history-drawer-content :deep(.n-drawer-header) { padding: 22px 24px 18px; border-bottom: 1px solid rgba(205,228,221,.1); }
.history-drawer-content :deep(.n-drawer-header__close) { color: var(--text-muted); }
.history-drawer-content :deep(.n-drawer-header__close:hover) { color: var(--text-primary); }
.history-drawer-content :deep(.n-drawer-body-content-wrapper) { padding: 20px 24px 24px; }
@media (max-width: 760px) {
  .converter-grid { grid-template-columns: 1fr; gap: 24px; }
  .source-section { padding-right: 0; padding-bottom: 24px; border-right: 0; border-bottom: 1px solid var(--line); }
}
@media (max-width: 600px) {
  .section-description { margin-bottom: 16px; }
  :global(.history-drawer) { top: 6px !important; bottom: 6px !important; margin-right: 6px; border-radius: 15px !important; }
  .history-drawer-content :deep(.n-drawer-body-content-wrapper) { padding: 16px 18px 20px; }
  .history-drawer-content :deep(.n-drawer-header) { padding: 19px 18px 16px; }
}
</style>
