/**
 * Modal 组件类型定义
 */
import { ReactNode, MouseEventHandler, CSSProperties } from 'react'

/**
 * Modal组件属性接口
 */
export interface ModalProps {
  isOpen: boolean // 是否显示弹窗
  hideClose?: boolean // 是否隐藏关闭按钮
  forceWeb?: boolean // 是否强制使用web样式
  useDismiss?: boolean // 是否允许点击空白处关闭
  openTouchMove?: boolean // 是否允许触摸移动
  onDismiss?: () => void // 关闭回调函数
  children?: ReactNode // 子元素
  contentStyle?: CSSProperties // 内容样式
  cancelOverflow?: boolean // 是否取消溢出
  zIndex?: number // z-index层级
  openAnimation?: boolean // 是否开启动画
  onClick?: MouseEventHandler<HTMLElement> // 点击事件处理
  closeWrapperStyle?: CSSProperties // 关闭按钮样式
  closeIconStyle?: CSSProperties // 关闭按钮图标样式
}
