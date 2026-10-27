/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface Window {
  config: {
    siteName: string
    apiUrl: string
    shortUrl: string
    menuItem: Array<{
      title: string
      link: string
      target: string
    }>
    remoteConfigOptions: Array<{
      value: string
      text: string
    }>
  }
}
