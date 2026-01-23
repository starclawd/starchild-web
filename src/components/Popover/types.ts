/**
 * Popover 组件类型定义
 */
import { ReactNode, MouseEventHandler, CSSProperties } from 'react'
import { Placement } from '@popperjs/core'

/**
 * Popover组件属性接口
 */
export interface PopoverProps {
  content: ReactNode // 弹出内容
  show: boolean // 是否显示
  children: ReactNode // 触发元素
  placement?: Placement // 弹出位置
  offsetTop?: number // 顶部偏移量
  offsetLeft?: number // 左侧偏移量
  widthAuto?: boolean // 是否自动宽度
  begainToHide?: boolean // 是否开始隐藏动画
  rootClass?: string // 根元素类名
  showArrow?: boolean // 是否显示箭头
  popoverContainerStyle?: CSSProperties // 容器样式
  onClick?: MouseEventHandler<HTMLElement> // 点击事件
  onMouseEnter?: MouseEventHandler<HTMLElement> // 鼠标进入事件
  onMouseLeave?: MouseEventHandler<HTMLElement> // 鼠标离开事件
  onClickOutside?: () => void // 点击外部区域回调
  arrowStyle?: CSSProperties // 箭头样式
  disablePointerEvents?: boolean // 禁用弹出内容的鼠标事件
}
