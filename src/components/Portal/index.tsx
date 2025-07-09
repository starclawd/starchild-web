/**
 * Portal传送门组件
 * 基于React.createPortal实现的DOM传送组件
 * 用于将子组件渲染到指定DOM节点
 */

import { ReactNode } from 'react'
import { createPortal } from 'react-dom'

/**
 * Portal组件属性接口
 */
interface PortalProps {
  children: ReactNode // 需要传送的子组件
  rootEl?: HTMLDivElement | null | undefined // 目标DOM节点，默认为document.body
}

/**
 * Portal组件
 * 将子组件渲染到指定DOM节点，用于弹窗、提示等脱离文档流的场景
 */
export default function Portal({ children, rootEl }: PortalProps) {
  return createPortal(children, rootEl ? rootEl : document.body)
}
