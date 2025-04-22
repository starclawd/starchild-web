import { ANI_DURATION } from 'constants/index';
import { ThemeMode } from 'store/theme/reducer';
import styled, { css } from 'styled-components';
import { isIos } from 'utils/userAgent';

export const MEDIA_WIDTHS = {
  mobileLimitWidth: 375,
  extraSmallWidth: 500,
  smallWidth: 720,
  sMediumWidth: 960,
  mMediumWidth: 1040,
  lMediumWidth: 1216,
  mobileWidth: 1024,
  sLargeWidth: 1280,
  mLargeWidth: 1440,
  positionFixWidth: 1640,
  orderFixWidth: 1640,
  xLargeWidth: 1680,
  marketScrollWidth: 1850,
}

export type Color = string

// 定义主题接口，包含所有颜色变量
export interface Theme {
  darkMode: boolean
  isMobile: boolean
  // text
  text1: Color
  text1_1: Color
  text1_2: Color
  text2: Color
  text2_1: Color
  text3: Color
  text3Hover: Color
  text4: Color
  klineLabel: Color
  text4_1: Color
  expandBg: Color
  pnlBg: Color
  // text5: Color

  // backgrounds / greys
  bg0: Color
  bg1: Color
  bg1_1: Color
  bg2: Color
  bg3: Color
  bg3Header: Color
  bg4: Color
  bg4Hover: Color
  bg5: Color
  bg6: Color
  bg7: Color
  bg8: Color
  bg8Hover: Color
  bg9: Color
  bg10: Color
  bg11: Color
  bg12: Color
  mobileCardBg: Color
  toolTipShadow: Color

  line1: Color
  line2: Color
  line2_1: Color
  line4: Color
  line4_1: Color

  buttonText: Color
  buttonText2: Color
  commonWhite: Color
  marketText: Color
  guideGreenBg: Color
  green: Color
  greenHover: Color
  green_1: Color
  green_2: Color
  greenSpecial: Color
  greenBg02: Color
  red: Color
  red_1: Color
  redSpecial: Color
  middleRisk: Color
  middleRisk_1: Color
  greenGradient: Color
  greenGradientHover: Color
  greenGradientMoveHover: Color
  greenGradientActive: Color
  mbg2: Color
  redGradient: Color
  redGradientHover: Color
  redGradientActive: Color
  redBg02: Color
  depthGreen: Color
  referralGreen: Color
  depthRed: Color
  selectShadow: Color
  sliderTrailBg: Color
  sliderTrackBg: Color
  border1: Color
  marketScroll: Color
  marketScrollGrid: Color
  walletConnectBg: Color
  textGradient: Color
  
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

function colors(darkMode: boolean): Theme {
  return {
    isMobile: false,
    darkMode,
    // system/Text&icon/text-60(Text_L1)
    textL1: darkMode ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.98)',
    // system/Text&icon/text-50(Text_L2)
    textL2: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    // system/Text&icon/text-40(Text_L3)
    textL3: darkMode ? 'rgba(255, 255, 255, 0.54)' : 'rgba(255, 255, 255, 0.54)',
    // system/Text&icon/text-30(Text_L4)
    textL4: darkMode ? 'rgba(255, 255, 255, 0.36)' : 'rgba(255, 255, 255, 0.36)',
    // system/Text&icon/text-10
    textL5: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    // system/Text&icon/text-20
    textL6: darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.2)',
    // system/bg/bg-100(bg-L0)
    bgL0: darkMode ? '#07080A' : '#07080A',
    // system/bg/bg-90(bg-L1)
    bgL1: darkMode ? '#131519' : '#131519',
    // system/bg/bg-80(bg-L2)
    bgL2: darkMode ? '#181C23' : '#181C23',
    // system/bg/bg-transparent-30
    bgT30: darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.12)',
    // system/primary/jade-10
    jade10: darkMode ? '#2FF582' : '#2FF582',
    // system/bg/bg-60(sf-c2)
    sfC2: darkMode ? '#20252F' : '#20252F',
    // system/bg/bg-70(sf-c1)
    sfC1: darkMode ? '#262A32' : '#262A32',
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

    bg0: darkMode ? '#212429' : '#F7F8FA',
    // c_b_bg01 页面主要内容背景色
    bg1: darkMode ? '#1E2229' : '#F5F5F5',
    // c_b_bg01 页面主要内容背景色
    bg1_1: darkMode ? 'rgba(30,34,41,0.8)' : 'rgba(245,245,245,0.8)',
    // c_b_m_bg 全页面次要背景色 / b(页面)  bg(背景)
    bg2: darkMode ? '#191C22' : '#F0F1F2',
    // c_b_bg02 页面主要内容背景色第二层
    bg3: darkMode ? '#262A32' : '#FFFFFF',
    bg3Header: darkMode ? 'rgba(38,42,50,0.7)' : 'rgba(255,255,255,0.7)',
    // c_t02_bg 二级tab背景色
    bg4: darkMode ? 'rgba(60, 64, 72, 0.5)' : '#EDEFF0',
    bg4Hover: darkMode ? 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), rgba(60, 64, 72, 0.5);' : 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), #EDEFF0;',
    // c_fl_bg 普通浮层背景色 / fl(浮层)
    bg5: darkMode ? '#4E545D' : '#FFFFFF',
    // c_t_bg tips背景色 / t(tips)
    bg6: darkMode ? '#464C55' : '#464C55',
    // c_i_bg 输入框背景色 / i(输入框)
    bg7: darkMode ? '#313640' : '#F5F6F7',
    // c_bt_m_bg 次要按钮背景色 / bt(按钮)  m(次要)
    bg8: darkMode ? '#434754' : '#E9EBEC',
    bg8Hover: darkMode ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #E9EBEC' : 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), #E9EBEC',
    // c_e_d_bg 条目禁用色 / (条目)  d(禁用)
    bg9: darkMode ? 'rgba(25,28,34,0.5)' : 'rgba(241,241,242,0.5)',
    // c_e_h_bg 条目鼠标经过
    bg10: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(29,32,35,0.03)',
    bg11: darkMode ? 'rgba(78, 84, 93, 0.5)' : 'rgba(78, 84, 93, 0.1)',
    mobileCardBg: darkMode ? '#1E2229' : '#FDFDFD',
    // c_i_d_bg
    bg12: darkMode ? '#3D434F' : '#EFEFEF',

    // c_s_b01 一级分割线 / s(分割)  b(线)
    line1: darkMode ? '#2F3640' : '#E5E7E9',
    // c_s_b02 二级分割线
    line2: darkMode ? 'rgba(55,60,68,0.5)' : 'rgba(229,231,233,0.7)',
    // c_s_b02 二级分割线 透明度 0.08
    line2_1: darkMode ? 'rgba(42,47,55,0.08)' : 'rgba(236,238,239,0.08)',
    // c_u_b01 通用元素描边 / u(通用)  b(线)
    line4: darkMode ? 'rgba(110, 118, 130, 0.5)' : '#C8C9CB',
    line4_1: darkMode ? 'rgba(110, 118, 130, 0.5)' : 'rgba(200, 201, 203, 0.5)',
    // c_e_u_bg
    expandBg: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(29, 32, 35, 0.02)',
    pnlBg: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',

    // text
    // c_t01
    text1: darkMode ? '#E5E9EF' : '#1D2023',
    text1_1: darkMode ? 'rgba(229,233,239,0.3)' : 'rgba(29,32,35,0.3)',
    text1_2: darkMode ? 'rgba(229,233,239,0.5)' : 'rgba(29,32,35,0.5)',
    // c_t02
    text2: darkMode ? '#ACAFB7' : '#3F4347',
    text2_1: darkMode ? 'rgba(172,175,183,0.5)' : 'rgba(63,67,71,0.5)',
    // c_t03
    text3: darkMode ? '#6A727B' : '#8C929E',
    text3Hover: darkMode ? 'rgba(106,114,123,0.95)' : 'rgba(121,127,138,0.95)',
    // c_t04
    text4: darkMode ? '#565E66' : '#A6AEB8',
    klineLabel: darkMode ? '#373a44' : '#131721',
    // c_t04
    text4_1: darkMode ? 'rgba(86,94,102,0.1)' : 'rgba(166,174,184,0.1)',
    // c_b_t 按钮文字色 / b(按钮)
    buttonText: darkMode ? '#1D2023' : '#1D2023',
    // c_b_t02 按钮文字色 / b(按钮)
    buttonText2: darkMode ? '#1D2023' : '#FFFFFF',
    // c_b_w 日夜间共用白色 / w(白色)
    commonWhite: darkMode ? '#FFFFFF' : '#FFFFFF',
    marketText: darkMode ? '#ACAFB7' : '#FFFFFF',
    // c_m c_r_o100 主题色 / m(主题色) 上涨/买 / r(上涨/买) o(不透明度)
    green: darkMode ? '#46DBAF' : '#1FAE8C',
    greenHover: darkMode
      ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.20), rgba(0, 0, 0, 0.20)), #46DBAF;'
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.20), rgba(255, 255, 255, 0.20)), #1FAE8C;',
    // c_m_o50
    green_1: darkMode ? 'rgba(70, 219, 175, 0.5)' : 'rgba(31, 174, 140, 0.5)',
    green_2: darkMode ? 'rgba(70, 219, 175, 0.1)' : 'rgba(31, 174, 140, 0.1)',
    // 做背景位移的
    greenSpecial: 'linear-gradient(90deg, #5EEFC4 0%, #41DCAE 50%, #5EEFC4 100%);',
    // c_f_o100 下跌/卖 / f(下跌/卖)
    red: darkMode ? '#FF6969' : '#DF5858',
    // c_f_o50 下跌/卖 / f(下跌/卖)
    red_1: darkMode ? 'rgba(255,105,105,0.5)' : 'rgba(223,88,88,0.5)',
    // 做背景位移的
    redSpecial: 'linear-gradient(90deg, #FF8787 0%, #FF7A7A 52.6%, #FF8787 100%);',
    // c_risk_o100 中等风险 / r(风险)
    middleRisk: darkMode ? '#EFA10A' : '#F3A91A',
    middleRisk_1: darkMode ? 'rgba(239, 161, 10, 0.1)' : 'rgba(243, 169, 26, 0.1)',
    // 新手指引背景
    guideGreenBg: 'linear-gradient(91.26deg, #1FAE8C 0%, #1FAE8C 51.04%, #25D09E 100%)',
    // c_m_bg c_r_bg 主题块状色 / m(主题色)  上涨块状
    greenGradient: 'linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%)',
    greenGradientHover: darkMode
      ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%);'
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%);',
    greenGradientMoveHover: darkMode
      ? 'linear-gradient(0deg, linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%) 50%, linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%) 100%);'
      : 'linear-gradient(0deg, linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%) 50%, linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%) 100%);',
    greenGradientActive: darkMode
      ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%);'
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(90deg, #5EEFC4 0%, #41DCAE 100%);',
    // c_r_bg02
    greenBg02: darkMode ? '#25D09E' : '#25D09E',
    // c_m_bg02
    mbg2: darkMode ? '#11CB80' : '#11CB80',
    // c_f_bg 下跌块状
    redGradient: 'linear-gradient(90deg, #FF8787 0%, #FF7A7A 100%)',
    redGradientHover: darkMode
      ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), linear-gradient(90deg, #FF8787 0%, #FF7A7A 100%);'
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)), linear-gradient(90deg, #FF8787 0%, #FF7A7A 100%);',
    redGradientActive: darkMode
      ? 'linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), linear-gradient(90deg, #FF8787 0%, #FF7A7A 100%);'
      : 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)), linear-gradient(90deg, #FF8787 0%, #FF7A7A 100%);',
    // c_f_bg02
    redBg02: darkMode ? '#FA6464' : '#FA6464',
    // c_r_o010 深度 买 / r(上涨/买)
    depthGreen: darkMode ? 'rgba(70,219,175,0.1)' : 'rgba(31,174,140,0.1)',
    referralGreen: darkMode ? 'rgba(70,219,175,0.05)' : 'rgba(31,174,140,0.1)',
    // c_f_o010 深度 卖 / f(下跌/卖)
    depthRed: darkMode ? 'rgba(255,105,105,0.1)' : 'rgba(226,74,74,0.1)',
    // 下拉选择框的阴影 /* Light_s/s_fl */
    selectShadow: darkMode
      ? '0px 0px 1px 0px rgba(255, 255, 255, 0.10), 0px 8px 20px 0px rgba(0, 0, 0, 0.20)'
      : '0px 0px 1px 0px rgba(255, 255, 255, 0.08), 0px 8px 20px 0px rgba(0, 0, 0, 0.06)',
    sliderTrailBg: 'linear-gradient(90.02deg, rgba(110, 115, 123, 0.08) 0%, rgba(110, 115, 123, 0.4) 99.99%)',
    sliderTrackBg: darkMode ? 'linear-gradient(90.02deg, rgba(229, 233, 239, 0.2) 0%, #cccccc 99.99%)' : 'linear-gradient(90.02deg, rgba(110, 115, 123, 0.18) 0%, rgba(110, 115, 123, 0.9) 99.99%)',
    border1: darkMode ? 'rgba(110,118,130,0.5)' : '#C8C9CB',
    marketScroll: darkMode
      ? 'linear-gradient(275.64deg, #1E2229 4.43%, #1E2229 52.35%, rgba(30, 34, 41, 0) 95.45%);'
      : 'linear-gradient(275.64deg, #F5F5F5 4.43%, #F5F5F5 52.35%, rgba(245, 245, 245, 0) 95.45%);',
    marketScrollGrid: darkMode
      ? 'linear-gradient(275.64deg, #262A32 4.43%, #262A32 52.35%, rgba(38, 42, 50, 0) 95.45%);'
      : 'linear-gradient(275.64deg, #FFFFFF 4.43%, #FFFFFF 52.35%, rgba(255, 255, 255, 0) 95.45%);',
    // backgrounds / greys

    toolTipShadow: darkMode ? '#000' : '#2F80ED',
    walletConnectBg: darkMode ? '#373C44' : '#EFF1F2',
    textGradient: darkMode ? 'linear-gradient(90deg, #7B4DFF 0%, #46DBAF 72.92%)' : 'linear-gradient(90deg, #7B4DFF 0%, #23CE9C 72.92%)',
  }
}

// 根据主题模式获取对应的主题配置
export const getTheme = (mode: ThemeMode): Theme => {
  return colors(mode === 'dark');
}; 

export const PixelAllSide = styled.div<{
  color: Color,
  borderRadius: string,
  borderWidth?: string,
  opacity?: number,
}>`
  position: relative;
  &::after {
    content: '';
    width: 200%;
    height: 200%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: ${({ opacity }) => opacity ? opacity : 1};
    border: ${({ borderWidth }) => borderWidth ? borderWidth : '1px'} solid ${({ color }) => color};
    border-radius: ${({ borderRadius }) => borderRadius};
    transform: scale(0.5,0.5);
    transform-origin: top left;
  }
`

interface BorderBoxProps {
  $borderColor?: string
  $borderRadius?: number | string
  $borderTop?: boolean
  $borderRight?: boolean
  $borderBottom?: boolean
  $borderLeft?: boolean
}

export const BorderBox = styled.div<BorderBoxProps>`
  display: flex;
  align-items: center;
  position: relative;
  border-radius: ${({ $borderRadius }) => `${$borderRadius || '0'}${String($borderRadius).includes('%') ? '' : 'px'}`};
  overflow: hidden;

  ${({ $borderRadius, $borderColor, $borderTop, $borderRight, $borderBottom, $borderLeft }) => isIos && css`
    &::after {
      content: '';
      pointer-events: none;
      position: absolute;
      top: 0;
      left: 0;
      width: 200%;
      height: 200%;
      transform: scale(0.5);
      transform-origin: 0 0;
      box-sizing: border-box;
      border-radius: ${`${$borderRadius || '0'}${String($borderRadius).includes('%') ? '' : 'px'}`};
      border-style: solid;
      border-color: ${$borderColor || '#ccc'};
      transition: border-color ${ANI_DURATION}s;
      z-index: 2;

      ${() => {
        const borderWidths = {
          top: $borderTop ? '1px' : '0',
          right: $borderRight ? '1px' : '0',
          bottom: $borderBottom ? '1px' : '0',
          left: $borderLeft ? '1px' : '0',
        };
        return css`
          border-width: ${borderWidths.top} ${borderWidths.right} ${borderWidths.bottom} ${borderWidths.left};
        `;
      }}
    }
  `}

  ${({ $borderColor, $borderTop, $borderRight, $borderBottom, $borderLeft }) => !isIos && css`
    border-style: solid;
    border-color: ${$borderColor || '#ccc'};
    transition: border-color ${ANI_DURATION}s;
    
    ${() => {
      const borderWidths = {
        top: $borderTop ? '1px' : '0',
        right: $borderRight ? '1px' : '0',
        bottom: $borderBottom ? '1px' : '0',
        left: $borderLeft ? '1px' : '0',
      };
      return css`
        border-width: ${borderWidths.top} ${borderWidths.right} ${borderWidths.bottom} ${borderWidths.left};
      `;
    }}
  `}
`
