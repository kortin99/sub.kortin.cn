<script setup lang="ts">
import { NCheckbox, NFormItem, NInput, NSelect } from 'naive-ui'
import type { SelectOption } from 'naive-ui'
import type { CustomParam, MoreConfig } from '@/views/home'

const options = defineModel<MoreConfig>({ required: true })
defineProps<{ regionOptions: SelectOption[] }>()

const basicToggles = [
  { key: 'emoji', label: '节点名称添加表情' },
  { key: 'scv', label: '跳过证书验证' },
  { key: 'udp', label: '启用 UDP' },
  { key: 'appendType', label: '输出节点类型' },
  { key: 'sort', label: '排序节点' },
  { key: 'fdn', label: '过滤非法节点' },
  { key: 'expand', label: '规则展开' },
  { key: 'list', label: '输出为 Node List' },
] as const

const customToggles = [
  { key: 'surgeDoh', label: 'Surge.DoH' },
  { key: 'clashDoh', label: 'Clash.DoH' },
  { key: 'insert', label: '网易云' },
] as const

function update<K extends keyof MoreConfig>(key: K, value: MoreConfig[K]) {
  options.value = { ...options.value, [key]: value }
}

function updateCustomParam(index: number, key: keyof CustomParam, value: string) {
  const customParams = options.value.customParams.map((param, itemIndex) =>
    itemIndex === index ? { ...param, [key]: value } : param
  )
  update('customParams', customParams)
}

function addCustomParam() {
  update('customParams', [...options.value.customParams, { name: '', value: '' }])
}

function removeCustomParam(index: number) {
  update('customParams', options.value.customParams.filter((_, itemIndex) => itemIndex !== index))
}
</script>

<template>
  <section id="advanced-options" class="advanced-options" aria-label="高级设置">
    <div class="advanced-header">
      <div>
        <h2>高级设置</h2>
        <p>按名称、地区和转换参数精细控制生成结果。</p>
      </div>
      <span class="advanced-count">{{ options.customParams.length ? `${options.customParams.length} 个自定义参数` : '可选参数' }}</span>
    </div>

    <div class="filter-grid">
      <NFormItem label="节点筛选" :label-props="{ for: 'region-select' }">
        <NSelect v-model:value="options.region" :input-props="{ id: 'region-select', 'aria-label': '节点筛选' }" :options="regionOptions" filterable />
      </NFormItem>
      <NFormItem label="保留节点" :label-props="{ for: 'include' }">
        <NInput :value="options.include" :input-props="{ id: 'include' }" placeholder="节点名称包含的关键字，支持正则" @update:value="update('include', $event)" />
      </NFormItem>
      <NFormItem label="排除节点" :label-props="{ for: 'exclude' }">
        <NInput :value="options.exclude" :input-props="{ id: 'exclude' }" placeholder="节点名称不包含的关键字，支持正则" @update:value="update('exclude', $event)" />
      </NFormItem>
      <NFormItem label="订阅文件名" :label-props="{ for: 'filename' }">
        <NInput :value="options.filename" :input-props="{ id: 'filename' }" placeholder="返回的订阅文件名，可选" @update:value="update('filename', $event)" />
      </NFormItem>
    </div>

    <div class="advanced-columns">
      <section class="option-card" aria-labelledby="basic-options-heading">
        <h3 id="basic-options-heading">基础选项</h3>
        <NCheckbox
          v-for="item in basicToggles"
          :key="item.key"
          class="check-option"
          :checked="options[item.key]"
          @update:checked="update(item.key, $event)"
        >
          {{ item.label }}
        </NCheckbox>
      </section>
      <section class="option-card" aria-labelledby="custom-options-heading">
        <h3 id="custom-options-heading">定制功能</h3>
        <NCheckbox
          v-for="item in customToggles"
          :key="item.key"
          class="check-option"
          :checked="options[item.key]"
          @update:checked="update(item.key, $event)"
        >
          {{ item.label }}
        </NCheckbox>
        <div class="custom-params">
          <div v-for="(param, index) in options.customParams" :key="index" class="custom-param-row">
            <NInput :value="param.name" placeholder="参数名" :input-props="{ 'aria-label': `自定义参数名 ${index + 1}` }" @update:value="updateCustomParam(index, 'name', $event)" />
            <NInput :value="param.value" placeholder="参数值" :input-props="{ 'aria-label': `自定义参数值 ${index + 1}` }" @update:value="updateCustomParam(index, 'value', $event)" />
            <button type="button" class="remove-param" :aria-label="`删除自定义参数 ${index + 1}`" @click="removeCustomParam(index)">删除</button>
          </div>
          <button type="button" class="add-param" @click="addCustomParam">＋ 添加参数</button>
        </div>
      </section>
    </div>

    <p v-if="options.scv" class="certificate-warning" role="status">跳过证书检查会降低连接安全性，请仅在确认需要时开启。</p>
  </section>
</template>

<style scoped>
.advanced-options { padding: 26px 0 4px; border-top: 1px solid var(--line); }
.advanced-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 22px; }
.advanced-header h2 { margin: 0; color: var(--text-primary); font-size: 16px; font-weight: 600; }
.advanced-header p { margin: 8px 0 0; color: var(--text-muted); font-size: 13px; }
.advanced-count { flex: none; padding-top: 2px; color: var(--text-muted); font-size: 12px; }
.filter-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.advanced-columns { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px; }
.option-card {
  min-width: 0;
  padding: 18px 20px;
  border: 1px solid rgba(205, 228, 221, 0.11);
  border-radius: 12px;
  background:
    radial-gradient(ellipse 70% 70px at 50% 0, rgba(255,255,255,.02), transparent 80%),
    linear-gradient(145deg, rgba(178,202,195,.022), rgba(255,255,255,.008));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    inset 0 18px 28px -28px rgba(255,255,255,.08),
    0 12px 28px rgba(0,0,0,.12);
}
.option-card h3 { margin: 0 0 14px; color: var(--text-secondary); font-size: 13px; font-weight: 600; }
.check-option { display: flex; width: 100%; min-height: 32px; color: var(--text-secondary); font-size: 13px; }
.check-option:hover { color: var(--text-primary); }
.custom-params { margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--line); }
.custom-param-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; gap: 8px; margin-top: 8px; }
.custom-param-row:first-child { margin-top: 0; }
.remove-param, .add-param { border: 1px solid var(--line); border-radius: 7px; color: var(--text-secondary); background: rgba(255,255,255,.035); cursor: pointer; font-size: 12px; }
.remove-param { padding: 0 9px; }
.add-param { margin-top: 10px; padding: 7px 11px; }
.remove-param:hover, .add-param:hover { color: var(--text-primary); border-color: rgba(214,224,236,.35); background: rgba(255,255,255,.07); }
.certificate-warning { margin: 18px 0 0; color: #dfc28f; font-size: 13px; }
@media (max-width: 760px) { .filter-grid, .advanced-columns { grid-template-columns: 1fr; } }
@media (max-width: 480px) { .advanced-header { display: block; } .advanced-count { display: block; margin-top: 8px; } .custom-param-row { grid-template-columns: 1fr 1fr; } .remove-param { min-height: 36px; } }
</style>
