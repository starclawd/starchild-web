/**
 * Tooltip内容组件
 * 提供基础的气泡提示内容展示
 */
import { ReactNode } from 'react'
import styled, { CSSProperties } from 'styled-components'
import Popover, { PopoverProps } from 'components/Popover'
import { ANI_DURATION } from 'constants/index'
import { CommonFun } from 'types/global'

/**
 * 气泡容器样式组件
 */
export const TooltipContainer = styled.div`
  max-width: 240px;
  padding: 8px;
  font-weight: 400;
  word-break: break-word;
  border-radius: 8px;
`

/**
 * 子元素包装器样式组件
 */
export const ChildrenWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: help;
  transition: all ${ANI_DURATION}s;
`

export enum TriggerMethod {
  CLICK, // 点击触发
  HOVER, // 悬浮触发
}

/**
 * Tooltip内容组��属性接口
 */
export interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  contentStyle?: CSSProperties
  content: ReactNode
  emptyContent?: boolean
  widthAuto?: boolean
  canOperator?: boolean
  onOpen?: CommonFun<any>
  wrap?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  childClick?: React.MouseEventHandler<HTMLElement>
  onMouseEnter?: React.MouseEventHandler<HTMLElement>
  onMouseLeave?: React.MouseEventHandler<HTMLElement>
  outShow?: boolean
  useOutShow?: boolean
  ignoreTooltipConfig?: boolean
  stopPropagation?: boolean
  begainToHide?: boolean
  showTooltipWrapper?: boolean
  contentClass?: string
  disabledDisappearAni?: boolean
  outSetShow?: CommonFun<any>
  disableHover?: boolean
  triggerMethod?: TriggerMethod
}

/**
 * Tooltip内容基础组件
 */
export default function TooltipContent({ content, wrap = false, widthAuto = true, ...rest }: TooltipContentProps) {
  return (
    <Popover
      showArrow
      widthAuto={widthAuto}
      {...rest}
      content={wrap ? <TooltipContainer>{content}</TooltipContainer> : content}
    />
  )
}
