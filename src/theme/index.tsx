import { ThemeMode } from 'store/themecache/reducer';
import { Theme } from './styled.d';
import { MEDIA_WIDTHS } from './styled.d';
import { css } from 'styled-components';

const mediaMinWidthTemplates: { [width in keyof typeof MEDIA_WIDTHS]: typeof css } = Object.keys(MEDIA_WIDTHS).reduce(
  (accumulator, size) => {
    ;(accumulator as any)[size] = (a: any, b: any, c: any) => css`
      @media (min-width: ${(MEDIA_WIDTHS as any)[size]}px) {
        ${css(a, b, c)}
      }
    `
    return accumulator
  },
  {}
) as any

function colors(darkMode: boolean): Theme {
  return {
    isMobile: false,
    darkMode,
    mediaMinWidth: mediaMinWidthTemplates,
    black: darkMode ? '#000000' : '#000000',
    white: darkMode ? '#FFFFFF' : '#FFFFFF',
    // system/Text&icon/text-60(Text_L1)
    textL1: darkMode ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    // system/Text&icon/text-50(Text_L2)
    textL2: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    // system/Text&icon/text-40(Text_L3)
    textL3: darkMode ? 'rgba(255, 255, 255, 0.54)' : 'rgba(255, 255, 255, 0.54)',
    // system/Text&icon/text-30(Text_L4)
    textL4: darkMode ? 'rgba(255, 255, 255, 0.36)' : 'rgba(255, 255, 255, 0.36)',
    // system/Text&icon/text-10
    text10: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    // system/Text&icon/text-20
    text20: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
    // system/bg/bg-100(bg-L0)
    bgL0: darkMode ? '#07080A' : '#07080A',
    // system/bg/bg-90(bg-L1)
    bgL1: darkMode ? '#131519' : '#131519',
    // system/bg/bg-80(bg-L2)
    bgL2: darkMode ? '#181C23' : '#181C23',
    // system/bg/bg-transparent-30
    bgT30: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    // system/bg/bg-transparent-10
    bgT10: darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.04)',
    // system/primary/jade-10
    jade10: darkMode ? '#2FF582' : '#2FF582',
    // system/bg/bg-60(sf-c2)
    sfC2: darkMode ? '#20252F' : '#20252F',
    // system/bg/bg-70(sf-c1)
    sfC1: darkMode ? '#1B2028' : '#1B2028',
    // Primary/Medium
    primaryMedium: darkMode ? '#C6B9FF' : '#C6B9FF',
    // system/Short&Error/ruby-50
    ruby50: darkMode ? '#E93E71' : '#E93E71',
    // system/Short&Error/ruby-60
    ruby60: darkMode ? '#D92D6B' : '#D92D6B',
    // Text-Dark/🏈 54%
    textDark54: darkMode ? 'rgba(255, 255, 255, 0.54)' : 'rgba(255, 255, 255, 0.54)',
    // system/bg/bg-transparent-20
    bgT20: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.06)',
    // Text-Dark/🏈 98%
    textDark98: darkMode ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    // Brand/🏈 Brand-6
    brand6: darkMode ? '#335FFC' : '#335FFC',
    // Line-Light/🏈 8%
    lineLight8: darkMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.08)',
    // system/shadow
    systemShadow: darkMode ? 'rgba(0, 0, 0, 0.30)' : 'rgba(0, 0, 0, 0.30)',
    // system/Autumn/autumn-50
    autumn50: darkMode ? '#F67924' : '#F67924',
    // system/primary/jade-40(default)
    jade40: darkMode ? '#00C57E' : '#00C57E',
    // system/Short&Error/ruby-40
    ruby40: darkMode ? '#FF447C' : '#FF447C',
    // Line-Dark/🏈 6%
    lineDark6: darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.06)',
    // Text-Dark/🏈 80%
    textDark80: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    // Line-Dark/🏈 8%
    lineDark8: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.08)',

    // Black/1000
    black1000: darkMode ? '#0B0C0E' : '#0B0C0E',
    // Black/900
    black900: darkMode ? '#121315' : '#121315',
    // Black/800
    black800: darkMode ? '#1A1C1E' : '#1A1C1E',
    // Black/700
    black700: darkMode ? '#232527' : '#232527',
    // Black/600
    black600: darkMode ? '#2F3133' : '#2F3133',
    // Black/500
    black500: darkMode ? '#3C3E41' : '#3C3E41',
    // Black/400
    black400: darkMode ? '#4A4C4F' : '#4A4C4F',
    // Black/300
    black300: darkMode ? '#636567' : '#636567',
    // Black/200
    black200: darkMode ? '#7D7F82' : '#7D7F82',
    // Black/100
    black100: darkMode ? '#A5A7AA' : '#A5A7AA',
    // Black/50
    black50: darkMode ? '#C9CBCE' : '#C9CBCE',

    // Blue/50
    blue50: darkMode ? '#D4F5FC' : '#D4F5FC',
    // Blue/100
    blue100: darkMode ? '#00A9DE' : '#00A9DE',
    // Blue/200
    blue200: darkMode ? '#0076A0' : '#0076A0',
    // Blue/300
    blue300: darkMode ? '#004F6E' : '#004F6E',

    // Green/50
    green50: darkMode ? '#D1FBE8' : '#D1FBE8',
    // Green/100
    green100: darkMode ? '#00DE73' : '#00DE73',
    // Green/200
    green200: darkMode ? '#00AA56' : '#00AA56',
    // Green/300
    green300: darkMode ? '#00763B' : '#00763B',

    // Purple/50
    purple50: darkMode ? '#EDE6FB' : '#EDE6FB',
    // Purple/100
    purple100: darkMode ? '#A87FFF' : '#A87FFF',
    // Purple/200
    purple200: darkMode ? '#8145E0' : '#8145E0',
    // Purple/300
    purple300: darkMode ? '#4F20A0' : '#4F20A0',

    // Orange/50
    orange50: darkMode ? '#FFF0DB' : '#FFF0DB',
    // Orange/100
    orange100: darkMode ? '#FFA940' : '#FFA940',
    // Orange/200
    orange200: darkMode ? '#F97300' : '#F97300',
    // Orange/300
    orange300: darkMode ? '#BD4D00' : '#BD4D00',

    // Red/50
    red50: darkMode ? '#FFDCE3' : '#FFDCE3',
    // Red/100
    red100: darkMode ? '#FF375B' : '#FF375B',
    // Red/200
    red200: darkMode ? '#D82B4C' : '#D82B4C',
    // Red/300
    red300: darkMode ? '#A21E39' : '#A21E39',

    // Yellow/50
    yellow50: darkMode ? '#FFF8D9' : '#FFF8D9',
    // Yellow/100
    yellow100: darkMode ? '#FFDD45' : '#FFDD45',
    // Yellow/200
    yellow200: darkMode ? '#F7B800' : '#F7B800',
    // Yellow/300
    yellow300: darkMode ? '#A97900' : '#A97900',
  }
}

// 根据主题模式获取对应的主题配置
export const getTheme = (mode: ThemeMode): Theme => {
  return colors(mode === 'dark');
};

