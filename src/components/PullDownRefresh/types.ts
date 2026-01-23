/**
 * PullDownRefresh 组件类型定义
 */
import { Dispatch, ReactNode, SetStateAction } from 'react'

/**
 * PullDownRefresh组件属性接口
 */
export interface PullDownRefreshProps {
  children: ReactNode // 子内容
  pullDownAreaHeight?: string // 下拉区域高度
  onRefresh?: () => void // 刷新回调函数
  isRefreshing: boolean // 是否正在刷新
  setIsRefreshing: Dispatch<SetStateAction<boolean>> // 设置刷新状态
  scrollContainerId?: string // 滚动容器id
}
