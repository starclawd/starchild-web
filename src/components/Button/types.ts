/**
 * Button 组件类型定义
 */
import { ComponentPropsWithoutRef } from 'react'

export interface IconButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'color'> {
  icon: string // icon className，如 'icon-chat-share'（必需）
  size?: 'small' | 'medium' | 'large' // 默认 medium 尺寸
  color?: string // 图标颜色
  pending?: boolean
  disabled?: boolean
}
