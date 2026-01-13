import styled, { keyframes, css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'

// 动画常量
const ANIMATION_DURATION = '1.5s'
const ANIMATION_TIMING = 'ease-in-out'

// 骨架屏动画
const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`

// 基础骨架屏样式
const SkeletonBase = styled.div<{
  $width?: string
  $height?: string
  $borderRadius?: string
}>`
  position: relative;
  background-color: ${({ theme }) => theme.black600};
  border-radius: ${({ $borderRadius }) => $borderRadius || '4px'};
  display: inline-block;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
  overflow: hidden;
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent 0%, ${({ theme }) => theme.black500} 50%, transparent 100%);
    animation: ${shimmer} ${ANIMATION_DURATION} ${ANIMATION_TIMING} infinite;
  }

  // 支持用户的动画偏好设置
  @media (prefers-reduced-motion: reduce) {
    &::before {
      animation: none;
    }
  }
`

// 圆形骨架屏（用于头像）
const SkeletonCircle = styled(SkeletonBase)`
  border-radius: 50%;
`

// 骨架屏容器
const SkeletonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

// 接口定义
interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
  className?: string
}

interface SkeletonCircleProps {
  size?: string
  className?: string
}

interface SkeletonTextProps extends SkeletonProps {
  lines?: never // 确保不会意外传递 lines 参数
}

interface SkeletonMultilineTextProps {
  lines?: number
  className?: string
}

// 基础骨架屏组件
export const Skeleton = memo(function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  const isMobile = useIsMobile()

  const finalHeight = height || (isMobile ? vm(20) : '20px')
  const finalBorderRadius = borderRadius || (isMobile ? vm(4) : '4px')

  return <SkeletonBase $width={width} $height={finalHeight} $borderRadius={finalBorderRadius} className={className} />
})

// 圆形骨架屏组件
export const SkeletonAvatar = memo(function SkeletonAvatar({ size, className }: SkeletonCircleProps) {
  const isMobile = useIsMobile()

  const finalSize = size || (isMobile ? vm(40) : '40px')

  return <SkeletonCircle $width={finalSize} $height={finalSize} className={className} />
})

// 文本骨架屏组件
export const SkeletonText = memo(function SkeletonText({ width = '100%', height, className }: SkeletonTextProps) {
  const isMobile = useIsMobile()

  const finalHeight = height || (isMobile ? vm(16) : '16px')
  const finalBorderRadius = isMobile ? vm(4) : '4px'

  return <SkeletonBase $width={width} $height={finalHeight} $borderRadius={finalBorderRadius} className={className} />
})

// 多行文本骨架屏
export const SkeletonMultilineText = memo(function SkeletonMultilineText({
  lines = 2,
  className,
}: SkeletonMultilineTextProps) {
  return (
    <SkeletonContainer className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonText key={index} width={index === lines - 1 ? '75%' : '100%'} />
      ))}
    </SkeletonContainer>
  )
})

// 图片骨架屏组件
export const SkeletonImage = memo(function SkeletonImage({ width, height, className, borderRadius }: SkeletonProps) {
  const isMobile = useIsMobile()

  const finalHeight = height || (isMobile ? vm(160) : '160px')
  const finalBorderRadius = borderRadius || (isMobile ? vm(12) : '12px')

  return <SkeletonBase $width={width} $height={finalHeight} $borderRadius={finalBorderRadius} className={className} />
})

export default Skeleton
