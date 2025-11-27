/**
 * Divider 组件
 * 用于页面内容之间的分隔线
 * 支持自定义高度、间距等样式
 */
import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'

// 组件属性接口
interface DividerProps {
  /** 分隔线高度，默认 1px。垂直模式下为宽度 */
  height?: string | number
  /** 水平方向内边距，默认 0 */
  paddingHorizontal?: string | number
  /** 垂直方向内边距，默认 0 */
  paddingVertical?: string | number
  /** 分隔线颜色，默认 theme.lineDark8 */
  color?: string
  /** 自定义类名 */
  className?: string
  /** 是否为垂直分隔线，默认 false */
  vertical?: boolean
  /** 垂直模式下的长度，默认 16px */
  length?: string | number
}

// 样式组件
const DividerWrapper = styled.div<{
  $height: string | number
  $paddingHorizontal: string | number
  $paddingVertical: string | number
  $color?: string
  $vertical?: boolean
  $length?: string | number
}>`
  ${({ $vertical, $length }) =>
    $vertical
      ? css`
          display: inline-block;
          height: ${typeof $length === 'number' ? `${$length}px` : $length};
        `
      : css`
          width: 100%;
        `}

  padding: ${({ $paddingVertical, $paddingHorizontal }) =>
    `${typeof $paddingVertical === 'number' ? `${$paddingVertical}px` : $paddingVertical} ${
      typeof $paddingHorizontal === 'number' ? `${$paddingHorizontal}px` : $paddingHorizontal
    }`};

  &::after {
    content: '';
    display: block;
    ${({ $vertical, $height, $length }) =>
      $vertical
        ? css`
            width: ${typeof $height === 'number' ? `${$height}px` : $height};
            height: ${typeof $length === 'number' ? `${$length}px` : $length};
          `
        : css`
            width: 100%;
            height: ${typeof $height === 'number' ? `${$height}px` : $height};
          `}
    background-color: ${({ theme, $color }) => $color || theme.lineDark8};
  }

  /* 移动端适配 */
  ${({ theme, $paddingVertical, $paddingHorizontal, $height, $vertical, $length }) =>
    theme.isMobile &&
    css`
      padding: ${typeof $paddingVertical === 'number' ? vm($paddingVertical) : $paddingVertical}
        ${typeof $paddingHorizontal === 'number' ? vm($paddingHorizontal) : $paddingHorizontal};

      ${$vertical
        ? css`
            height: ${typeof $length === 'number' ? vm($length) : $length};
          `
        : ''}

      &::after {
        ${$vertical
          ? css`
              width: ${typeof $height === 'number' ? vm($height) : $height};
              height: ${typeof $length === 'number' ? vm($length) : $length};
            `
          : css`
              height: ${typeof $height === 'number' ? vm($height) : $height};
            `}
      }
    `}
`

const Divider = ({
  height = 1,
  paddingHorizontal = 0,
  paddingVertical = 0,
  color,
  className,
  vertical = false,
  length = 16,
}: DividerProps) => {
  return (
    <DividerWrapper
      className={className}
      $height={height}
      $paddingHorizontal={paddingHorizontal}
      $paddingVertical={paddingVertical}
      $color={color}
      $vertical={vertical}
      $length={length}
    />
  )
}

Divider.displayName = 'Divider'

export default memo(Divider)
