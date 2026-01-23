/**
 * TabList 组件类型定义
 */
import { ReactNode } from 'react'

export enum TAB_TYPE {
  LINE = 'line',
  BG = 'bg',
  SIMPLE = 'simple', // 原来 TabList 的简单样式
}

export interface TabItem {
  key: number | string
  text: ReactNode
  icon?: ReactNode
  clickCallback: () => void
}

export interface TabListProps {
  className?: string
  gap?: number
  tabKey: number | string
  tabType?: TAB_TYPE
  borderRadius?: number
  itemBorderRadius?: number
  tabList: TabItem[]
  forceWebStyle?: boolean
  activeIndicatorBackground?: string
}
