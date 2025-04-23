import 'styled-components';

export const MEDIA_WIDTHS = {
  mobileWidth: 1024,
  sLargeWidth: 1280,
  mLargeWidth: 1440,
  xLargeWidth: 1920,
}

export type Color = string

// 定义主题接口，包含所有颜色变量
export interface Theme {
  darkMode: boolean
  isMobile: boolean

  textL1: Color
  textL2: Color
  textL3: Color
  textL4: Color
  textL5: Color
  textL6: Color
  bgL0: Color
  bgL1: Color
  bgL2: Color
  bgT20: Color
  bgT30: Color
  jade10: Color
  sfC2: Color
  sfC1: Color
  primaryMedium: Color
  ruby50: Color
  ruby60: Color
  textDark54: Color
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 