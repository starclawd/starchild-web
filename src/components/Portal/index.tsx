/**
 * Portal传送门组件
 * 基于React.createPortal实现的DOM传送组件
 * 用于将子组件渲染到指定DOM节点
 */

import { createPortal } from 'react-dom'
import type { PortalProps } from './types'

export type { PortalProps }

/**
 * Portal组件
 * 将子组件渲染到指定DOM节点，用于弹窗、提示等脱离文档流的场景
 */
export default function Portal({ children, rootEl }: PortalProps) {
  return createPortal(children, rootEl ? rootEl : document.body)
}
