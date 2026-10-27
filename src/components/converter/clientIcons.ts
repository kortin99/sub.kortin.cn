import clashIcon from '@/assets/client-icons/clash.webp'
import loonIcon from '@/assets/client-icons/loon.webp'
import quantumultIcon from '@/assets/client-icons/quantumult.webp'
import quantumultXIcon from '@/assets/client-icons/quantumultx.webp'
import shadowrocketIcon from '@/assets/client-icons/shadowrocket.webp'
import shadowsocksIcon from '@/assets/client-icons/shadowsocks.webp'
import singboxIcon from '@/assets/client-icons/singbox.webp'
import surfboardIcon from '@/assets/client-icons/surfboard.webp'
import surgeIcon from '@/assets/client-icons/surge.webp'
import v2rayIcon from '@/assets/client-icons/v2ray.webp'

export type ClientIconName =
  | 'clash'
  | 'v2ray'
  | 'quantumult'
  | 'quantumultx'
  | 'surge'
  | 'surfboard'
  | 'shadowsocks'
  | 'shadowrocket'
  | 'loon'
  | 'singbox'

export const clientIcons = {
  clash: clashIcon,
  v2ray: v2rayIcon,
  quantumult: quantumultIcon,
  quantumultx: quantumultXIcon,
  surge: surgeIcon,
  surfboard: surfboardIcon,
  shadowsocks: shadowsocksIcon,
  shadowrocket: shadowrocketIcon,
  loon: loonIcon,
  singbox: singboxIcon,
} satisfies Record<ClientIconName, string>
