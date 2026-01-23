/**
 * Skeleton 组件类型定义
 */

export interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

export interface SkeletonCircleProps {
  size?: string
  className?: string
}

export interface SkeletonTextProps extends SkeletonProps {
  lines?: never // 确保不会意外传递 lines 参数
}

export interface SkeletonMultilineTextProps {
  lines?: number
  className?: string
}
