import styled, { keyframes, css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'

// 骨架屏动画
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

// 基础骨架屏样式
const SkeletonBase = styled.div<{
  $width?: string
  $height?: string
  $borderRadius?: string
}>`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.text10} 25%,
    ${({ theme }) => theme.text20} 50%,
    ${({ theme }) => theme.text10} 75%
  );
  background-size: 200px 100%;
  background-repeat: no-repeat;
  border-radius: ${({ $borderRadius }) => $borderRadius || '4px'};
  display: inline-block;
  width: ${({ $width }) => $width || '100%'};
  height: ${({ $height }) => $height || '20px'};
  animation: ${shimmer} 1.2s ease-in-out infinite;
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
      gap: ${vm(6)};
    `}
`

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

// 基础骨架屏组件
export const Skeleton = memo(function Skeleton({ width, height, borderRadius, className }: SkeletonProps) {
  return <SkeletonBase $width={width} $height={height} $borderRadius={borderRadius} className={className} />
})

// 圆形骨架屏组件
export const SkeletonAvatar = memo(function SkeletonAvatar({ size = '40px', className }: SkeletonCircleProps) {
  return <SkeletonCircle $width={size} $height={size} className={className} />
})

// 文本骨架屏组件
export const SkeletonText = memo(function SkeletonText({ width = '100%', height = '16px', className }: SkeletonProps) {
  return <SkeletonBase $width={width} $height={height} $borderRadius='4px' className={className} />
})

// 多行文本骨架屏
export const SkeletonMultilineText = memo(function SkeletonMultilineText({
  lines = 2,
  className,
}: {
  lines?: number
  className?: string
}) {
  return (
    <SkeletonContainer className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonText key={index} width={index === lines - 1 ? '75%' : '100%'} height='14px' />
      ))}
    </SkeletonContainer>
  )
})

export default Skeleton
