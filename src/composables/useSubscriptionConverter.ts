import { reactive, readonly, shallowRef } from 'vue'
import type { SelectOption } from 'naive-ui'
import { request } from '@/network'
import { useFeedback } from '@/composables/useFeedback'
import { getSubLink, regexCheck, type MoreConfig } from '@/views/home'

interface ShortLinkResponse {
  Code?: number
  ShortUrl?: string
}

export function useSubscriptionConverter() {
  const { showDialog, showNotification } = useFeedback()

  const placeholder = '多订阅链接或节点请确保每行一条\n支持手动使用 "|" 分割多链接或节点'
  const targetOptions: SelectOption[] = [
    { value: 'clash', label: 'Clash' },
    { value: 'clashr', label: 'ClashR' },
    { value: 'v2ray', label: 'V2Ray' },
    { value: 'quan', label: 'Quantumult' },
    { value: 'quanx', label: 'Quantumult X' },
    { value: 'surge&ver=2', label: 'Surge V2' },
    { value: 'surge&ver=3', label: 'Surge V3' },
    { value: 'surge&ver=4', label: 'Surge V4' },
    { value: 'surfboard', label: 'Surfboard' },
    { value: 'ss', label: 'SS (SIP002)' },
    { value: 'sssub', label: 'SS Android' },
    { value: 'ssd', label: 'SSD' },
    { value: 'ssr', label: 'SSR' },
    { value: 'loon', label: 'Loon' },
    { value: 'singbox', label: 'Sing-box' },
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
    moreConfig: { ...moreConfigDefaults },
  })

  const isMoreConfigOpen = shallowRef(false)
  const isShortLinkLoading = shallowRef(false)

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

  const copyToClipboard = async (url: string, title: string) => {
    if (!url) {
      showDialog('warning', '无法复制', '请先生成链接。')
      return
    }

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
      showNotification(`${title}已复制`)
    } catch {
      showDialog('warning', '复制失败', '当前浏览器不支持自动复制，请手动复制链接。')
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
    return true
  }

  const handleGetSubUrl = async () => {
    if (getConverter()) {
      await copyToClipboard(state.result.subUrl, '订阅链接')
    }
  }

  const handleGetShortUrl = async () => {
    if (isShortLinkLoading.value || !getConverter()) {
      return
    }

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
    isMoreConfigOpen, isShortLinkLoading: readonly(isShortLinkLoading),
    handleApiChange, handleRemoteChange, handleGetSubUrl, handleGetShortUrl, copyToClipboard,
  }
}
