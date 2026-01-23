/**
 * Portal 组件类型定义
 */
import { ReactNode } from 'react'

/**
 * Portal组件属性接口
 */
export interface PortalProps {
  children: ReactNode // 需要传送的子组件
  rootEl?: HTMLDivElement | null | undefined // 目标DOM节点，默认为document.body
}
