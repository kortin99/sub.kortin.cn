<script setup lang="ts">
import {
  darkTheme, zhCN, NConfigProvider, NDialogProvider, NGlobalStyle, NMessageProvider,
  type GlobalThemeOverrides,
} from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#c6d0dc',
    primaryColorHover: '#e0e6ed',
    primaryColorPressed: '#abb9c8',
    bodyColor: '#020504',
    cardColor: '#171b21',
    modalColor: '#1c2128',
    popoverColor: '#202630',
    textColorBase: '#f0f2f5',
    textColor1: '#f0f2f5',
    textColor2: '#c2c8d0',
    textColor3: '#929ba6',
    borderColor: 'rgba(214, 224, 236, 0.16)',
    borderRadius: '10px',
    fontFamily: "'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif",
    heightMedium: '44px',
  },
  Input: {
    color: 'rgba(7, 10, 14, 0.3)',
    colorFocus: 'rgba(7, 10, 14, 0.45)',
    border: '1px solid rgba(214, 224, 236, 0.18)',
    borderHover: '1px solid rgba(214, 224, 236, 0.4)',
    boxShadowFocus: '0 0 0 3px rgba(198, 208, 220, 0.12)',
    placeholderColor: '#838c98',
    textColor: '#e8ebef',
  },
  Select: {
    peers: {
      InternalSelection: {
        color: 'rgba(7, 10, 14, 0.3)',
        colorActive: 'rgba(7, 10, 14, 0.45)',
        border: '1px solid rgba(214, 224, 236, 0.18)',
        borderHover: '1px solid rgba(214, 224, 236, 0.4)',
        boxShadowFocus: '0 0 0 3px rgba(198, 208, 220, 0.12)',
        textColor: '#e8ebef',
      },
    },
  },
  Button: {
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.045)',
    colorHover: 'rgba(255, 255, 255, 0.08)',
    colorPrimary: '#e8ebef',
    colorHoverPrimary: '#ffffff',
    colorPressedPrimary: '#cbd5e1',
    textColorPrimary: '#171b21',
    textColorHoverPrimary: '#171b21',
    textColorPressedPrimary: '#171b21',
    borderPrimary: '1px solid #e8ebef',
    borderHoverPrimary: '1px solid #ffffff',
    borderPressedPrimary: '1px solid #cbd5e1',
  },
  Form: { labelTextColor: '#c2c8d0', labelFontSizeTopMedium: '13px' },
}
</script>

<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides" :locale="zhCN">
    <NGlobalStyle />
    <NMessageProvider>
      <NDialogProvider>
        <RouterView />
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
</template>

<style>
@import '@/assets/app.css';
</style>
