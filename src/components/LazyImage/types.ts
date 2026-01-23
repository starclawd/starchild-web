/**
 * LazyImage 组件类型定义
 */
import React from 'react'

export type ObjectFitType = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
export type ObjectPositionType = 'center' | 'top' | 'bottom' | 'left' | 'right' | string

export interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  /** 图片 URL */
  src?: string
  /** 加载失败时的备用图片 */
  fallbackSrc?: string
  /** 自定义占位符 */
  placeholder?: React.ReactNode
  /** 图片宽度 */
  width?: string | number
  /** 图片高度 */
  height?: string | number
  /** 宽高比 (如 "16/9", "4/3", "1/1") */
  aspectRatio?: string
  /** 触发加载的阈值（距离视口的像素） */
  threshold?: number
  /** IntersectionObserver 的 rootMargin */
  rootMargin?: string
  /** 是否作为背景图片 */
  asBackground?: boolean
  /** 图片加载成功回调 */
  onLoad?: () => void
  /** 图片加载失败回调 */
  onError?: (error?: Error) => void
  /** 是否显示骨架屏动画 */
  showSkeleton?: boolean
  /** 骨架屏颜色 */
  skeletonColor?: string
  /** 骨架屏高亮颜色 */
  skeletonHighlightColor?: string
  /** object-fit 属性 */
  objectFit?: ObjectFitType
  /** object-position 属性 */
  objectPosition?: ObjectPositionType
  /** 圆角 */
  borderRadius?: string | number
  /** 是否禁用懒加载（立即加载） */
  eager?: boolean
  /** 失败重试次数 */
  retryCount?: number
  /** 重试延迟（毫秒） */
  retryDelay?: number
  /** 加载超时时间（毫秒） */
  loadingTimeout?: number
  /** 自定义错误组件 */
  errorComponent?: React.ReactNode
  /** 淡入动画时长（秒） */
  transitionDuration?: number
  /** 动画缓动函数 */
  transitionTimingFunction?: string
  /** 是否显示模糊占位效果 */
  blurPreview?: boolean
  /** 低质量占位图 URL（LQIP） */
  lowQualitySrc?: string
  /** 响应式图片 srcSet */
  srcSet?: string
  /** 响应式图片 sizes */
  sizes?: string
  /** 跨域设置 */
  crossOrigin?: 'anonymous' | 'use-credentials' | ''
  /** 是否显示加载状态 */
  showLoading?: boolean
  /** 自定义加载组件 */
  loadingComponent?: React.ReactNode
  /** 背景图片模式下的子内容 */
  children?: React.ReactNode
}
