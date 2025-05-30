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
  }
}

// 根据主题模式获取对应的主题配置
export const getTheme = (mode: ThemeMode): Theme => {
  return colors(mode === 'dark');
};

