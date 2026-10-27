import { computed, readonly, shallowRef } from 'vue'
import type { MoreConfig } from '@/views/home'

const STORAGE_KEY = 'subweb.conversion-history.v1'
const ENABLED_STORAGE_KEY = 'subweb.conversion-history-enabled.v1'
const MAX_HISTORY_RECORDS = 20

export interface ConversionHistoryRecord {
  id: string
  createdAt: string
  source: string
  target: string
  api: string
  remoteConfig: string
  advancedOpen: boolean
  moreConfig: MoreConfig
  subUrl: string
  shortUrl: string
}

type ConversionHistoryInput = Omit<ConversionHistoryRecord, 'id' | 'createdAt'>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function createRecordId() {
  return globalThis.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function parseRecord(value: unknown): ConversionHistoryRecord | null {
  if (!isRecord(value)) return null

  const {
    id, createdAt, source, target, api, remoteConfig, advancedOpen, moreConfig, subUrl, shortUrl,
  } = value

  if (
    typeof id !== 'string'
    || typeof createdAt !== 'string'
    || Number.isNaN(Date.parse(createdAt))
    || typeof source !== 'string'
    || !source.trim()
    || typeof target !== 'string'
    || typeof api !== 'string'
    || typeof remoteConfig !== 'string'
    || typeof advancedOpen !== 'boolean'
    || !isRecord(moreConfig)
    || typeof subUrl !== 'string'
    || !subUrl
    || typeof shortUrl !== 'string'
  ) {
    return null
  }

  return {
    id,
    createdAt,
    source,
    target,
    api,
    remoteConfig,
    advancedOpen,
    moreConfig: moreConfig as unknown as MoreConfig,
    subUrl,
    shortUrl,
  }
}

function readRecords(): ConversionHistoryRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map(parseRecord)
      .filter((record): record is ConversionHistoryRecord => record !== null)
      .sort((left, right) => Date.parse(right.createdAt) - Date.parse(left.createdAt))
      .slice(0, MAX_HISTORY_RECORDS)
  } catch {
    return []
  }
}

function writeRecords(records: ConversionHistoryRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // The in-memory list still works when storage is unavailable or full.
  }
}

function readEnabled() {
  try {
    return localStorage.getItem(ENABLED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function writeEnabled(enabled: boolean) {
  try {
    if (enabled) {
      localStorage.setItem(ENABLED_STORAGE_KEY, 'true')
    } else {
      localStorage.removeItem(ENABLED_STORAGE_KEY)
    }
  } catch {
    // The in-memory preference still works when storage is unavailable.
  }
}

export function useConversionHistory() {
  const records = shallowRef<ConversionHistoryRecord[]>(readRecords())
  const isEnabled = shallowRef(readEnabled())
  const readonlyRecords = computed<readonly ConversionHistoryRecord[]>(() => records.value)

  const enableHistory = () => {
    isEnabled.value = true
    writeEnabled(true)
  }

  const upsertRecord = (input: ConversionHistoryInput) => {
    if (!isEnabled.value) return

    const existing = records.value.find((record) => record.subUrl === input.subUrl)
    const createdAt = new Date().toISOString()
    const nextRecord: ConversionHistoryRecord = {
      ...input,
      id: existing?.id ?? createRecordId(),
      createdAt,
      shortUrl: input.shortUrl || existing?.shortUrl || '',
    }

    records.value = [
      nextRecord,
      ...records.value.filter((record) => record.subUrl !== input.subUrl),
    ].slice(0, MAX_HISTORY_RECORDS)
    writeRecords(records.value)
  }

  const removeRecord = (id: string) => {
    records.value = records.value.filter((record) => record.id !== id)
    writeRecords(records.value)
  }

  const clearRecords = () => {
    records.value = []
    writeRecords(records.value)
  }

  return {
    historyLimit: MAX_HISTORY_RECORDS,
    records: readonlyRecords,
    isEnabled: readonly(isEnabled),
    enableHistory,
    upsertRecord,
    removeRecord,
    clearRecords,
  }
}
