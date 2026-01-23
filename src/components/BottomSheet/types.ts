/**
 * BottomSheet 组件类型定义
 */
import { ReactNode } from 'react'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  positionRef?: any
  rootStyle?: React.CSSProperties
  hideDragHandle?: boolean
  placement?: 'top' | 'bottom' | 'mobile'
  hideClose?: boolean
  isCloseText?: boolean
}
