/**
 * Divider 组件
 * 用于页面内容之间的分隔线
 * 支持自定义高度、间距等样式
 */
import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import type { DividerProps } from './types'

export type { DividerProps }

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
    background-color: ${({ theme, $color }) => $color || theme.black800};
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
