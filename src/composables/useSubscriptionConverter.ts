import { onScopeDispose, reactive, readonly, shallowRef } from 'vue'
import type { SelectOption } from 'naive-ui'
import { request } from '@/network'
import type { ClientIconName } from '@/components/converter/clientIcons'
import {
  useConversionHistory,
  type ConversionHistoryRecord,
} from '@/composables/useConversionHistory'
import { useFeedback } from '@/composables/useFeedback'
import { getSubLink, regexCheck, type MoreConfig } from '@/views/home'

interface ShortLinkResponse {
  Code?: number
  ShortUrl?: string
}

const COPY_FEEDBACK_DURATION = 3000

export interface TargetOption extends SelectOption {
  icon: ClientIconName
}

export function useSubscriptionConverter() {
  const { showDialog, showNotification } = useFeedback()
  const {
    historyLimit, records: historyRecords, isEnabled: isHistoryEnabled, enableHistory,
    upsertRecord, removeRecord, clearRecords,
  } = useConversionHistory()

  const placeholder = '多订阅链接或节点请确保每行一条\n支持手动使用 "|" 分割多链接或节点'
  const targetOptions: TargetOption[] = [
    { value: 'clash', label: 'Clash', icon: 'clash' },
    { value: 'clashr', label: 'ClashR', icon: 'clash' },
    { value: 'v2ray', label: 'V2Ray', icon: 'v2ray' },
    { value: 'quan', label: 'Quantumult', icon: 'quantumult' },
    { value: 'quanx', label: 'Quantumult X', icon: 'quantumultx' },
    { value: 'surge&ver=2', label: 'Surge V2', icon: 'surge' },
    { value: 'surge&ver=3', label: 'Surge V3', icon: 'surge' },
    { value: 'surge&ver=4', label: 'Surge V4', icon: 'surge' },
    { value: 'surfboard', label: 'Surfboard', icon: 'surfboard' },
    { value: 'ss', label: 'SS (SIP002)', icon: 'shadowsocks' },
    { value: 'sssub', label: 'SS Android', icon: 'shadowsocks' },
    { value: 'ssd', label: 'SSD', icon: 'shadowsocks' },
    { value: 'ssr', label: 'SSR', icon: 'shadowrocket' },
    { value: 'loon', label: 'Loon', icon: 'loon' },
    { value: 'singbox', label: 'Sing-box', icon: 'singbox' },
  ]

  const moreConfigDefaults: MoreConfig = {
    include: '',
    exclude: '',
    filename: '',
    region: '',
    emoji: true,
    udp: true,
    sort: false,
    scv: false,
    list: false,
    appendType: false,
    fdn: false,
    expand: true,
    surgeDoh: false,
    clashDoh: false,
    insert: false,
    customParams: [],
  }

  const createMoreConfig = (): MoreConfig => ({
    ...moreConfigDefaults,
    customParams: [],
  })

  const normalizeMoreConfig = (value: unknown): MoreConfig => {
    const source = typeof value === 'object' && value !== null
      ? value as Partial<MoreConfig>
      : {}

    return {
      include: typeof source.include === 'string' ? source.include : '',
      exclude: typeof source.exclude === 'string' ? source.exclude : '',
      filename: typeof source.filename === 'string' ? source.filename : '',
      region: typeof source.region === 'string' ? source.region : '',
      emoji: typeof source.emoji === 'boolean' ? source.emoji : true,
      udp: typeof source.udp === 'boolean' ? source.udp : true,
      sort: typeof source.sort === 'boolean' ? source.sort : false,
      scv: typeof source.scv === 'boolean' ? source.scv : false,
      list: typeof source.list === 'boolean' ? source.list : false,
      appendType: typeof source.appendType === 'boolean' ? source.appendType : false,
      fdn: typeof source.fdn === 'boolean' ? source.fdn : false,
      expand: typeof source.expand === 'boolean' ? source.expand : true,
      surgeDoh: typeof source.surgeDoh === 'boolean' ? source.surgeDoh : false,
      clashDoh: typeof source.clashDoh === 'boolean' ? source.clashDoh : false,
      insert: typeof source.insert === 'boolean' ? source.insert : false,
      customParams: Array.isArray(source.customParams)
        ? source.customParams
          .filter((param): param is { name: string; value: string } =>
            typeof param === 'object'
            && param !== null
            && typeof param.name === 'string'
            && typeof param.value === 'string'
          )
          .map((param) => ({ name: param.name, value: param.value }))
        : [],
    }
  }

  const regionOptions: SelectOption[] = [
    { value: '', label: '全部节点' },
    { value: 'common', label: '常用节点（HK / TW / SG / JP / US）' },
    { value: 'asia', label: '亚洲节点' },
    { value: 'americas', label: '美洲节点' },
    { value: 'europe', label: '欧洲节点' },
    { value: 'africa', label: '非洲节点' },
    { value: 'game', label: '游戏节点' },
  ]

  const apiUrl = window.config.apiUrl
  const shortUrl = window.config.shortUrl
  const remoteConfigOptions: SelectOption[] = window.config.remoteConfigOptions.map((option) => ({
    value: option.value,
    label: option.text,
  }))

  const apiOptions: SelectOption[] = [
    { value: apiUrl, label: apiUrl },
    { value: 'manual', label: '自定义后端 API 地址' },
  ]

  const remoteOptions: SelectOption[] = [
    { value: '', label: '默认配置' },
    ...remoteConfigOptions,
    { value: 'manual', label: '自定义远程配置地址' },
  ]

  const state = reactive({
    urls: '',
    api: apiUrl,
    apiSelection: apiUrl,
    target: 'clash',
    remoteConfig: '',
    remoteSelection: '',
    isShowManualApiUrl: false,
    isShowRemoteConfig: false,
    result: {
      subUrl: '',
      shortUrl: '',
    },
    moreConfig: createMoreConfig(),
  })

  const isMoreConfigOpen = shallowRef(false)
  const isShortLinkLoading = shallowRef(false)
  const copiedUrl = shallowRef('')
  let copyFeedbackTimer: ReturnType<typeof setTimeout> | undefined

  const clearCopyFeedback = () => {
    if (copyFeedbackTimer) {
      clearTimeout(copyFeedbackTimer)
      copyFeedbackTimer = undefined
    }
    copiedUrl.value = ''
  }

  const showCopyFeedback = (url: string) => {
    clearCopyFeedback()
    copiedUrl.value = url
    copyFeedbackTimer = setTimeout(clearCopyFeedback, COPY_FEEDBACK_DURATION)
  }

  onScopeDispose(clearCopyFeedback)

  const handleApiChange = (value: string) => {
    state.apiSelection = value
    state.isShowManualApiUrl = value === 'manual'
    state.api = state.isShowManualApiUrl ? '' : value
  }

  const handleRemoteChange = (value: string) => {
    state.remoteSelection = value
    state.isShowRemoteConfig = value === 'manual'
    state.remoteConfig = state.isShowRemoteConfig ? '' : value
  }

  const recordCurrentConversion = (shortLink = '') => {
    upsertRecord({
      source: state.urls.trim(),
      target: state.target,
      api: state.api,
      remoteConfig: state.remoteConfig,
      advancedOpen: isMoreConfigOpen.value,
      moreConfig: normalizeMoreConfig(state.moreConfig),
      subUrl: state.result.subUrl,
      shortUrl: shortLink,
    })
  }

  const restoreHistory = (record: ConversionHistoryRecord) => {
    const hasTarget = targetOptions.some((option) => String(option.value) === record.target)
    const hasRemoteConfig = remoteConfigOptions.some((option) => option.value === record.remoteConfig)

    state.urls = record.source
    state.target = hasTarget ? record.target : 'clash'
    state.api = record.api
    state.apiSelection = record.api === apiUrl ? apiUrl : 'manual'
    state.isShowManualApiUrl = state.apiSelection === 'manual'
    state.remoteConfig = record.remoteConfig
    state.remoteSelection = record.remoteConfig === ''
      ? ''
      : hasRemoteConfig
        ? record.remoteConfig
        : 'manual'
    state.isShowRemoteConfig = state.remoteSelection === 'manual'
    state.result.subUrl = record.subUrl
    state.result.shortUrl = record.shortUrl
    state.moreConfig = normalizeMoreConfig(record.moreConfig)
    isMoreConfigOpen.value = record.advancedOpen
    showNotification('历史配置已载入，可以修改后重新生成')
  }

  const removeHistoryRecord = (id: string) => {
    removeRecord(id)
    showNotification('历史记录已删除')
  }

  const clearHistory = () => {
    if (!historyRecords.value.length) return

    showDialog(
      'warning',
      '清空历史记录',
      '所有保存在当前浏览器本地的历史记录都会被删除，此操作无法撤销。',
      () => {
        clearRecords()
        showNotification('历史记录已清空')
      }
    )
  }

  const copyToClipboard = async (url: string, title: string): Promise<boolean> => {
    if (!url) {
      showDialog('warning', '无法复制', '请先生成链接。')
      return false
    }

    clearCopyFeedback()

    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url)
      } else {
        const copyInput = document.createElement('input')
        copyInput.value = url
        document.body.appendChild(copyInput)
        copyInput.select()
        try {
          if (!document.execCommand('copy')) throw new Error('Copy failed')
        } finally {
          copyInput.remove()
        }
      }
      showCopyFeedback(url)
      showNotification(`${title}已复制`)
      return true
    } catch {
      showDialog('warning', '复制失败', '当前浏览器不支持自动复制，请手动复制链接。')
      return false
    }
  }

  const getConverter = (): boolean => {
    if (!state.urls.trim()) {
      showDialog('warning', '缺少订阅链接', '请输入订阅链接或节点。')
      return false
    }

    if (!regexCheck(state.api)) {
      showDialog('warning', '后端地址无效', '请输入正确的后端 API 地址，或选择默认后端服务。')
      return false
    }

    if (!state.remoteConfig && state.isShowRemoteConfig) {
      showDialog('warning', '远程配置为空', '请输入远程配置地址，或选择默认配置。')
      return false
    }

    const finalApi = state.api.endsWith('/') ? state.api.slice(0, -1) : state.api
    state.result.subUrl = getSubLink(
      state.urls.trim(),
      finalApi,
      state.target,
      state.remoteConfig,
      isMoreConfigOpen.value,
      state.moreConfig
    )
    state.result.shortUrl = ''
    return true
  }

  const handleGetSubUrl = async () => {
    if (getConverter()) {
      recordCurrentConversion()
      await copyToClipboard(state.result.subUrl, '订阅链接')
    }
  }

  const handleGetShortUrl = async () => {
    if (isShortLinkLoading.value || !getConverter()) {
      return
    }

    recordCurrentConversion()
    isShortLinkLoading.value = true

    try {
      const data = new FormData()
      data.append('longUrl', btoa(state.result.subUrl))
      const response = await request({
        method: 'post',
        url: `${shortUrl}/short`,
        data,
      })
      const result = response.data as ShortLinkResponse
      if (result.Code === 1 && result.ShortUrl) {
        state.result.shortUrl = result.ShortUrl
        recordCurrentConversion(state.result.shortUrl)
        await copyToClipboard(state.result.shortUrl, '短链接')
      } else {
        showDialog('error', '生成失败', '短链接服务返回了无效结果。')
      }
    } catch {
      showDialog('error', '生成失败', '短链接生成失败，请检查短链接服务是否可用。')
    } finally {
      isShortLinkLoading.value = false
    }
  }

  return {
    state, targetOptions, regionOptions, apiOptions, remoteOptions, placeholder,
    isMoreConfigOpen, isShortLinkLoading: readonly(isShortLinkLoading), copiedUrl: readonly(copiedUrl),
    historyLimit, historyRecords, isHistoryEnabled, enableHistory,
    handleApiChange, handleRemoteChange, handleGetSubUrl, handleGetShortUrl, copyToClipboard,
    restoreHistory, removeHistoryRecord, clearHistory,
  }
}
