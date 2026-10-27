<script setup lang="ts">
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import ClientIcon from '@/components/converter/ClientIcon.vue'
import type { ConversionHistoryRecord } from '@/composables/useConversionHistory'
import type { TargetOption } from '@/composables/useSubscriptionConverter'

const props = defineProps<{
  records: readonly ConversionHistoryRecord[]
  targetOptions: readonly TargetOption[]
  enabled: boolean
  copiedUrl: string
}>()

const emit = defineEmits<{
  restore: [record: ConversionHistoryRecord]
  copy: [url: string, title: string]
  remove: [id: string]
  enable: []
  clear: []
}>()

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

const historyGroupDefinitions = [
  { key: 'just-now', label: '今天' },
  { key: 'one-day', label: '1 天前' },
  { key: 'two-days', label: '2 天前' },
  { key: 'three-days', label: '3 天前' },
  { key: 'this-week', label: '本周' },
  { key: 'this-month', label: '本月' },
  { key: 'older', label: '更久之前' },
] as const

type HistoryGroupKey = (typeof historyGroupDefinitions)[number]['key']

const historyGroups = computed(() => {
  const groupedRecords = new Map<HistoryGroupKey, ConversionHistoryRecord[]>()
  for (const { key } of historyGroupDefinitions) groupedRecords.set(key, [])

  const now = new Date()
  for (const record of props.records) {
    groupedRecords.get(resolveHistoryGroup(record.createdAt, now))?.push(record)
  }

  return historyGroupDefinitions
    .map((group) => ({
      ...group,
      records: groupedRecords.get(group.key) ?? [],
    }))
    .filter((group) => group.records.length > 0)
})

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function startOfWeek(date: Date) {
  const weekStart = startOfDay(date)
  const daysSinceMonday = (weekStart.getDay() + 6) % 7
  weekStart.setDate(weekStart.getDate() - daysSinceMonday)
  return weekStart
}

function calendarDaysAgo(date: Date, now: Date) {
  const dateUtc = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((nowUtc - dateUtc) / 86_400_000)
}

function resolveHistoryGroup(createdAt: string, now: Date): HistoryGroupKey {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return 'older'

  const daysAgo = calendarDaysAgo(date, now)
  if (daysAgo <= 0) return 'just-now'
  if (daysAgo === 1) return 'one-day'
  if (daysAgo === 2) return 'two-days'
  if (daysAgo === 3) return 'three-days'
  if (date >= startOfWeek(now)) return 'this-week'
  if (date >= new Date(now.getFullYear(), now.getMonth(), 1)) return 'this-month'
  return 'older'
}

function targetLabel(target: string) {
  return props.targetOptions.find((option) => String(option.value) === target)?.label ?? target
}

function targetIcon(target: string) {
  const option = props.targetOptions.find((item) => String(item.value) === target)
  return option?.icon
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function sourceSummary(source: string) {
  const sources = source.split(/[\r\n|]+/).map((item) => item.trim()).filter(Boolean)
  const firstSource = sources[0] ?? ''

  try {
    return new URL(firstSource).hostname
  } catch {
    if (/^[a-z][a-z\d+.-]*:\/\//i.test(firstSource)) {
      return `${firstSource.split('://')[0].toUpperCase()} 节点`
    }
    return firstSource.length > 64 ? `${firstSource.slice(0, 64)}…` : firstSource
  }
}

function sourceCount(source: string) {
  return source.split(/[\r\n|]+/).filter((item) => item.trim()).length
}

function abbreviateLink(link: string) {
  return link.length > 92 ? `${link.slice(0, 92)}…` : link
}

function isCopied(url: string) {
  return Boolean(url) && props.copiedUrl === url
}
</script>

<template>
  <section class="history-content" aria-label="历史记录">

    <div v-if="!enabled" class="history-gate">
      <span class="history-gate-icon"><AppIcon name="shield" /></span>
      <div class="history-gate-copy">
        <h3>先确认设备环境</h3>
        <p>历史记录只保存在当前浏览器本地，不会上传到服务器。</p>
        <p>记录包含订阅链接、节点配置和生成的地址，其中可能含有订阅密钥。请不要在公用设备上启用；如果这不是你的私人设备，使用后请及时清理。</p>
        <p v-if="records.length" class="history-gate-existing">
          当前浏览器还保存着 {{ records.length }} 条旧记录。你可以开启后查看，或直接清除。
        </p>
      </div>
      <div class="history-gate-actions">
        <button type="button" class="enable-history" @click="emit('enable')">开启历史记录</button>
        <button v-if="records.length" type="button" class="clear-existing-history" @click="emit('clear')">清除已有记录</button>
      </div>
    </div>

    <template v-else>
      <div v-if="!records.length" class="history-empty">
        <span class="empty-icon"><AppIcon name="history" /></span>
        <p>还没有历史记录</p>
        <small>生成订阅链接后会自动保存在这里。</small>
      </div>

      <template v-else>
        <div class="history-groups">
          <section v-for="group in historyGroups" :key="group.key" class="history-group" :aria-labelledby="`history-group-${group.key}`">
            <header class="history-group-heading">
              <h3 :id="`history-group-${group.key}`">{{ group.label }}</h3>
              <span>{{ group.records.length }} 条</span>
            </header>

            <ul class="history-list">
              <li v-for="record in group.records" :key="record.id">
                <article class="history-card">
                  <header class="record-header">
                    <div class="record-meta">
                      <span class="record-target">
                        <ClientIcon :name="targetIcon(record.target)" size="small" />
                        {{ targetLabel(record.target) }}
                      </span>
                      <time :datetime="record.createdAt">生成于 {{ formatDate(record.createdAt) }}</time>
                    </div>
                    <button type="button" class="record-delete" :aria-label="`删除 ${formatDate(record.createdAt)} 的历史记录`" title="删除记录" @click="emit('remove', record.id)">
                      <AppIcon name="trash" />
                    </button>
                  </header>

                  <p class="record-source">
                    <span>{{ sourceSummary(record.source) }}</span>
                    <small>{{ sourceCount(record.source) }} 个来源</small>
                  </p>

                  <div class="record-links">
                    <div class="record-link">
                      <span class="link-label">订阅</span>
                      <code :title="record.subUrl">{{ abbreviateLink(record.subUrl) }}</code>
                      <button
                        type="button"
                        :class="{ 'record-copy--copied': isCopied(record.subUrl) }"
                        :aria-label="isCopied(record.subUrl) ? '历史订阅链接已复制' : '复制历史订阅链接'"
                        :title="isCopied(record.subUrl) ? '已复制' : '复制订阅链接'"
                        @click="emit('copy', record.subUrl, '订阅链接')"
                      >
                        <AppIcon :name="isCopied(record.subUrl) ? 'check' : 'copy'" />
                      </button>
                    </div>
                    <div v-if="record.shortUrl" class="record-link">
                      <span class="link-label">短链</span>
                      <code :title="record.shortUrl">{{ abbreviateLink(record.shortUrl) }}</code>
                      <button
                        type="button"
                        :class="{ 'record-copy--copied': isCopied(record.shortUrl) }"
                        :aria-label="isCopied(record.shortUrl) ? '历史短链接已复制' : '复制历史短链接'"
                        :title="isCopied(record.shortUrl) ? '已复制' : '复制短链接'"
                        @click="emit('copy', record.shortUrl, '短链接')"
                      >
                        <AppIcon :name="isCopied(record.shortUrl) ? 'check' : 'copy'" />
                      </button>
                    </div>
                  </div>

                  <footer class="record-footer">
                    <span>载入后可修改配置并重新生成</span>
                    <button type="button" class="restore-button" @click="emit('restore', record)">
                      重新转换
                      <AppIcon name="arrow" />
                    </button>
                  </footer>
                </article>
              </li>
            </ul>
          </section>
        </div>
      </template>

      <p class="history-note">历史记录只保存在当前浏览器本地，不会上传到服务器。其中可能包含订阅密钥，请勿在公用设备上使用。如果这不是你的私人设备，使用后请及时清理。</p>
    </template>
  </section>
</template>

<style scoped>
.history-content { min-height: 100%; }
.history-gate {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 15px 14px;
  padding: 19px 20px;
  border: 1px solid rgba(224,196,151,.18);
  border-radius: 12px;
  background:
    radial-gradient(ellipse 90% 100px at 20% 0, rgba(224,196,151,.045), transparent 78%),
    rgba(255,255,255,.015);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.06),
    0 12px 30px rgba(0,0,0,.12);
}
.history-gate-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid rgba(224,196,151,.18);
  border-radius: 9px;
  color: #dec59d;
  background: rgba(224,196,151,.055);
}
.history-gate-icon .app-icon { width: 18px; height: 18px; }
.history-gate-copy { min-width: 0; }
.history-gate-copy h3 { margin: 0; color: var(--text-primary); font-size: 14px; font-weight: 600; }
.history-gate-copy p { margin: 9px 0 0; color: var(--text-secondary); font-size: 12px; line-height: 1.75; }
.history-gate-copy p + p { margin-top: 6px; }
.history-gate-copy .history-gate-existing { color: #d5c4aa; }
.history-gate-actions { grid-column: 2; display: flex; flex-wrap: wrap; gap: 8px; margin-top: 3px; }
.enable-history,
.clear-existing-history {
  min-height: 34px;
  padding: 0 13px;
  border-radius: 7px;
  cursor: pointer;
  font-size: 12px;
}
.enable-history {
  border: 1px solid rgba(255,255,255,.72);
  color: #17201e;
  background: linear-gradient(180deg, #f4f6f5, #dfe4e2);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.8),
    0 5px 14px rgba(0,0,0,.16);
}
.enable-history:hover { background: #fff; }
.clear-existing-history {
  border: 1px solid rgba(205,228,221,.14);
  color: var(--text-muted);
  background: rgba(255,255,255,.025);
}
.clear-existing-history:hover { color: #e3aaa2; border-color: rgba(225,170,162,.2); background: rgba(210,112,99,.06); }
.empty-icon { display: grid; place-items: center; flex: none; color: #b8cbc6; }
.history-empty {
  display: grid;
  justify-items: center;
  padding: 42px 20px;
  border: 1px dashed rgba(205,228,221,.13);
  border-radius: 12px;
  background: rgba(255,255,255,.012);
  text-align: center;
}
.empty-icon { width: 34px; height: 34px; border: 1px solid rgba(205,228,221,.13); border-radius: 50%; background: rgba(255,255,255,.025); }
.empty-icon .app-icon { width: 17px; height: 17px; }
.history-empty p { margin: 10px 0 0; color: var(--text-secondary); font-size: 13px; }
.history-empty small { margin-top: 7px; color: var(--text-muted); font-size: 12px; }
.history-groups { display: grid; gap: 24px; }
.history-group { min-width: 0; }
.history-group-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid rgba(205,228,221,.08); }
.history-group-heading h3 { display: flex; align-items: center; gap: 7px; margin: 0; color: var(--text-secondary); font-size: 12px; font-weight: 600; }
.history-group-heading h3::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: #9bb3ac; box-shadow: 0 0 0 3px rgba(155,179,172,.08); }
.history-group-heading span { color: var(--text-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.history-list { display: grid; gap: 10px; margin: 0; padding: 0; list-style: none; }
.history-card {
  min-width: 0;
  padding: 16px 17px;
  border: 1px solid rgba(205,228,221,.13);
  border-radius: 12px;
  background:
    radial-gradient(ellipse 68% 74px at 50% 0, rgba(255,255,255,.035), transparent 82%),
    linear-gradient(145deg, rgba(178,202,195,.045), rgba(255,255,255,.012) 55%, rgba(4,10,8,.035));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.08),
    inset 0 18px 28px -28px rgba(255,255,255,.11),
    0 10px 26px rgba(0,0,0,.15);
}
.record-header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.record-meta { display: flex; align-items: center; flex-wrap: wrap; gap: 9px; min-width: 0; }
.record-target { display: inline-flex; align-items: center; gap: 6px; padding: 3px 8px 3px 4px; border: 1px solid rgba(151,189,179,.18); border-radius: 7px; color: #c4d8d2; background: linear-gradient(145deg, rgba(151,189,179,.11), rgba(151,189,179,.055)); box-shadow: inset 0 1px 0 rgba(255,255,255,.045); font-size: 11px; }
.record-meta time { color: var(--text-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.record-delete { display: grid; place-items: center; width: 30px; height: 30px; margin: -4px -5px -4px 0; border: 0; border-radius: 6px; color: var(--text-muted); background: transparent; cursor: pointer; }
.record-delete:hover { color: #e3aaa2; background: rgba(210,112,99,.08); }
.record-delete .app-icon { width: 15px; height: 15px; }
.record-source { display: flex; align-items: center; gap: 8px; min-width: 0; margin: 11px 0 0; color: var(--text-secondary); font-size: 12px; }
.record-source > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.record-source small { flex: none; color: var(--text-muted); font-size: 11px; }
.record-links { display: grid; gap: 6px; margin-top: 10px; }
.record-link { display: grid; grid-template-columns: 30px minmax(0, 1fr) 28px; align-items: center; gap: 7px; min-width: 0; padding: 5px 6px 5px 9px; border: 1px solid rgba(205,228,221,.075); border-radius: 7px; background: rgba(2,7,6,.2); box-shadow: inset 0 1px 0 rgba(255,255,255,.025); }
.link-label { color: var(--text-muted); font-size: 10px; }
.record-link code { overflow: hidden; color: #aebbb7; font-family: 'SFMono-Regular', Consolas, monospace; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
.record-link button { display: grid; place-items: center; width: 28px; height: 28px; border: 0; border-radius: 5px; color: var(--text-muted); background: transparent; cursor: pointer; transition: color 160ms ease, background 160ms ease; }
.record-link button:hover { color: var(--text-primary); background: rgba(255,255,255,.06); }
.record-link button.record-copy--copied, .record-link button.record-copy--copied:hover { color: #b9dbd0; background: rgba(142,194,177,.1); }
.record-link .app-icon { width: 14px; height: 14px; }
.record-footer { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 12px; }
.record-footer > span { color: var(--text-muted); font-size: 11px; }
.restore-button { display: inline-flex; align-items: center; gap: 7px; min-height: 31px; padding: 0 11px; border: 1px solid rgba(205,228,221,.17); border-radius: 7px; color: var(--text-secondary); background: linear-gradient(145deg, rgba(255,255,255,.055), rgba(255,255,255,.025)); box-shadow: inset 0 1px 0 rgba(255,255,255,.055); cursor: pointer; font-size: 12px; }
.restore-button:hover { color: var(--text-primary); border-color: rgba(205,228,221,.28); background: rgba(255,255,255,.065); }
.restore-button .app-icon { width: 14px; height: 14px; }
.history-note { margin: 0; margin-top: 18px; padding-top: 14px; color: var(--text-muted); font-size: 11px; line-height: 1.7; }
@media (max-width: 600px) {
  .history-gate { grid-template-columns: 34px minmax(0, 1fr); gap: 13px 11px; padding: 16px; }
  .history-gate-icon { width: 34px; height: 34px; }
  .history-gate-actions { grid-column: 1 / -1; padding-left: 45px; }
  .history-card { padding: 14px; }
  .record-footer { align-items: flex-end; }
  .record-footer > span { max-width: 150px; line-height: 1.6; }
}
</style>
