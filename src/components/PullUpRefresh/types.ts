/**
 * PullUpRefresh 组件类型定义
 */
import { Dispatch, ReactNode, SetStateAction, UIEventHandler } from 'react'

/**
 * PullUpRefresh组件属性接口
 */
export interface PullUpRefreshProps {
  /** 滚动事件处理函数 */
  onScroll?: UIEventHandler<HTMLDivElement>
  /** 是否禁用上拉加载功能 */
  disabledPull: boolean
  /** 触发组件更新的随机值 */
  randomUpdate?: any
  /** 刷新回调函数 */
  onRefresh: () => void
  /** 子组件内容 */
  children: ReactNode
  /** 是否正在刷新中 */
  isRefreshing: boolean
  /** 子容器的自定义类名 */
  childrenWrapperClassName?: string
  /** 额外的高度调整值 */
  extraHeight?: number
  /** 设置刷新状态的函数 */
  setIsRefreshing: Dispatch<SetStateAction<boolean>>
  /** 是否启用PC端滚轮支持 */
  enableWheel?: boolean
  /** PC端滚轮触发阈值 */
  wheelThreshold?: number
  /** 是否还有更多数据可以加载 */
  hasLoadMore?: boolean
  /** 内容容器的自定义类名 */
  contentClassName?: string
}
