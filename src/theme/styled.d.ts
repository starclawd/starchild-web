import 'styled-components';

export const MEDIA_WIDTHS = {
  minWidth1024: 1024,
  minWidth1280: 1280,
  minWidth1440: 1440,
  minWidth1920: 1920,
}

export type Color = string

// 定义主题接口，包含所有颜色变量
export interface Theme {
  darkMode: boolean
  isMobile: boolean
  mediaMinWidth: {
    minWidth1024: ThemedCssFunction<DefaultTheme>
    minWidth1280: ThemedCssFunction<DefaultTheme>
    minWidth1440: ThemedCssFunction<DefaultTheme>
    minWidth1920: ThemedCssFunction<DefaultTheme>
  }
  white: Color
  black: Color
  textL1: Color
  textL2: Color
  textL3: Color
  textL4: Color
  text10: Color
  text20: Color
  bgL0: Color
  bgL1: Color
  bgL2: Color
  bgT20: Color
  bgT30: Color
  bgT10: Color
  jade10: Color
  sfC2: Color
  sfC1: Color
  primaryMedium: Color
  ruby50: Color
  ruby60: Color
  textDark54: Color
  textDark98: Color
  brand6: Color
  lineLight8: Color
  systemShadow: Color
  autumn50: Color
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 