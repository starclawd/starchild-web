import 'styled-components'

export const MEDIA_WIDTHS = {
  width1024: 1024,
  width1280: 1280,
  width1360: 1360,
  width1440: 1440,
  width1500: 1500,
  width1560: 1560,
  width1600: 1600,
  width1680: 1680,
  width1920: 1920,
}

export type Color = string

// 定义主题接口，包含所有颜色变量
export interface Theme {
  darkMode: boolean
  isMobile: boolean
  mediaMinWidth: {
    width1024: ThemedCssFunction<DefaultTheme>
    width1280: ThemedCssFunction<DefaultTheme>
    width1360: ThemedCssFunction<DefaultTheme>
    width1440: ThemedCssFunction<DefaultTheme>
    width1500: ThemedCssFunction<DefaultTheme>
    width1560: ThemedCssFunction<DefaultTheme>
    width1600: ThemedCssFunction<DefaultTheme>
    width1680: ThemedCssFunction<DefaultTheme>
    width1920: ThemedCssFunction<DefaultTheme>
  }
  mediaMaxWidth: {
    width1024: ThemedCssFunction<DefaultTheme>
    width1280: ThemedCssFunction<DefaultTheme>
    width1360: ThemedCssFunction<DefaultTheme>
    width1440: ThemedCssFunction<DefaultTheme>
    width1500: ThemedCssFunction<DefaultTheme>
    width1560: ThemedCssFunction<DefaultTheme>
    width1600: ThemedCssFunction<DefaultTheme>
    width1680: ThemedCssFunction<DefaultTheme>
    width1920: ThemedCssFunction<DefaultTheme>
  }
  white: Color
  black: Color
  bgL0: Color
  bgL1: Color
  bgL2: Color
  jade10: Color
  sfC2: Color
  sfC1: Color
  primaryMedium: Color
  ruby50: Color
  ruby60: Color
  lineLight8: Color
  systemShadow: Color
  autumn50: Color
  jade40: Color
  ruby40: Color
  black1000: Color
  black900: Color
  black800: Color
  black700: Color
  black600: Color
  black500: Color
  black400: Color
  black300: Color
  black200: Color
  black100: Color
  black50: Color
  black0: Color
  blue50: Color
  blue100: Color
  blue200: Color
  blue300: Color
  green50: Color
  green100: Color
  green200: Color
  green300: Color
  purple50: Color
  purple100: Color
  purple200: Color
  purple300: Color
  orange50: Color
  orange100: Color
  orange200: Color
  orange300: Color
  red50: Color
  red100: Color
  red200: Color
  red300: Color
  yellow50: Color
  yellow100: Color
  yellow200: Color
  yellow300: Color
  brand4: Color
  brand50: Color
  brand100: Color
  brand200: Color
  brand300: Color
  thinkingGradient: Color
}

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
