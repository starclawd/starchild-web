/**
 * Tooltip 组件类型定义
 */
import { ReactNode, MouseEventHandler, CSSProperties } from 'react'
import { PopoverProps } from 'components/Popover/types'
import { CommonFun } from 'types/global'

export enum TriggerMethod {
  CLICK, // 点击触发
  HOVER, // 悬浮触发
}

/**
 * Tooltip内容组件属性接口
 */
export interface TooltipContentProps extends Omit<PopoverProps, 'content'> {
  contentStyle?: CSSProperties
  content: ReactNode
  emptyContent?: boolean
  widthAuto?: boolean
  canOperator?: boolean
  onOpen?: CommonFun<any>
  wrap?: boolean
  onClick?: MouseEventHandler<HTMLElement>
  childClick?: MouseEventHandler<HTMLElement>
  onMouseEnter?: MouseEventHandler<HTMLElement>
  onMouseLeave?: MouseEventHandler<HTMLElement>
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
