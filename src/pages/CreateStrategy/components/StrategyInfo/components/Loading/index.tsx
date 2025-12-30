import { memo, useCallback, useEffect, useId, useRef, useState } from 'react'
import styled from 'styled-components'

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`

const NumberDisplay = styled.div`
  position: absolute;
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px;
  color: ${({ theme }) => theme.brand100};
`

interface LoadingProps {
  /** 是否开始 loading */
  startLoading?: boolean
  /** 当前步骤数字，显示在中间 */
  step?: number
  /** 组件尺寸 */
  size?: number
  /** 进度填充颜色 */
  fillColor?: string
  /** 背景轨道颜色 */
  trackColor?: string
  /** 每个周期的时长（毫秒），默认 120000 */
  intervalDuration?: number
}

// 8 个分段的 path 数据（按顺时针顺序，从 12 点方向开始）
const SEGMENT_PATHS = [
  'M19.2146 0.0154286C14.4763 0.201654 9.95825 2.06541 6.46677 5.27411L8.49676 7.483C11.4645 4.7556 15.3048 3.17141 19.3324 3.01311L19.2146 0.0154286Z',
  'M5.32418 6.41249C2.10261 9.89211 0.222184 14.4032 0.0184649 19.1408L3.0157 19.2697C3.18886 15.2427 4.78721 11.4083 7.52556 8.45062L5.32418 6.41249Z',
  'M0.0172588 20.8307C0.214215 25.5686 2.0882 30.0823 5.3048 33.5665L7.50908 31.5316C4.77497 28.57 3.18208 24.7333 3.01467 20.7061L0.0172588 20.8307Z',
  'M6.43209 34.6939C9.916 37.9109 14.4296 39.7853 19.1674 39.9827L19.2923 36.9853C15.2651 36.8175 11.4286 35.2242 8.46727 32.4898L6.43209 34.6939Z',
  'M20.7679 39.9853C25.5064 39.8032 30.026 37.9434 33.5203 34.7377L31.4923 32.5271C28.5221 35.2519 24.6804 36.8327 20.6527 36.9875L20.7679 39.9853Z',
  'M34.6663 33.5978C37.8903 30.1205 39.7739 25.6107 39.9809 20.8733L36.9838 20.7423C36.8078 24.7691 35.2067 28.6024 32.4663 31.5582L34.6663 33.5978Z',
  'M39.9903 19.3779C39.8428 14.6382 38.0161 10.1052 34.836 6.58757L32.6106 8.59944C35.3137 11.5894 36.8664 15.4425 36.9918 19.4712L39.9903 19.3779Z',
  'M33.7004 5.42951C30.2458 2.18117 25.7493 0.26598 21.0134 0.0256933L20.8614 3.02184C24.8869 3.22608 28.7089 4.85399 31.6453 7.61509L33.7004 5.42951Z',
]

// 计算扇形 clipPath 路径
function getClipArcPath(percent: number): string {
  if (percent <= 0) return ''
  if (percent >= 100) return 'M0,0 L40,0 L40,40 L0,40 Z' // 完整矩形

  const cx = 20
  const cy = 20
  const r = 30 // 使用较大的半径确保完全覆盖

  // 从 12 点方向开始 (-90 度)，顺时针方向
  const startAngle = -90
  const angle = (percent / 100) * 360
  const endAngle = startAngle + angle

  const endRad = (endAngle * Math.PI) / 180
  const x2 = cx + r * Math.cos(endRad)
  const y2 = cy + r * Math.sin(endRad)

  // 起点是 12 点方向
  const x1 = cx
  const y1 = cy - r

  const largeArc = angle > 180 ? 1 : 0

  // 从中心到起点，沿弧线到终点，回到中心
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

export default memo(function Loading({
  startLoading = false,
  step,
  size = 40,
  fillColor = '#F84600',
  trackColor = 'rgba(0, 0, 0, 0.12)',
  intervalDuration = 120000,
}: LoadingProps) {
  const clipId = useId()
  const [percent, setPercent] = useState(0)
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // 进度动画函数
  const animateLoading = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now()
    }
    const startTime = startTimeRef.current

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime

      // 计算当前是第几个周期
      const currentCycle = Math.floor(elapsed / intervalDuration)
      // 当前周期内的进度 (0-1)
      const cycleProgress = (elapsed % intervalDuration) / intervalDuration

      // 计算当前进度百分比
      let currentPercent = 0

      // 每个周期走剩余的60%
      for (let i = 0; i <= currentCycle; i++) {
        const remaining = 100 - currentPercent
        if (i === currentCycle) {
          // 当前周期：根据cycleProgress计算部分进度
          currentPercent += remaining * 0.6 * cycleProgress
        } else {
          // 已完成的周期：直接加上60%的剩余
          currentPercent += remaining * 0.6
        }
      }

      // 确保不超过99%（永远不到100%）
      currentPercent = Math.min(currentPercent, 99)
      setPercent(currentPercent)

      // 继续动画
      animationRef.current = requestAnimationFrame(updateProgress)
    }

    animationRef.current = requestAnimationFrame(updateProgress)
  }, [intervalDuration])

  useEffect(() => {
    if (startLoading) {
      animateLoading()
    } else {
      // 停止动画并重置进度
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      startTimeRef.current = null
      setPercent(0)
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [startLoading, animateLoading])

  const clipPath = getClipArcPath(percent)

  return (
    <LoadingWrapper style={{ width: size, height: size }}>
      <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 40 40' fill='none'>
        <defs>
          <clipPath id={clipId}>
            <path d={clipPath} />
          </clipPath>
        </defs>

        {/* 背景分段 */}
        {SEGMENT_PATHS.map((d, index) => (
          <path key={`bg-${index}`} d={d} fill={trackColor} />
        ))}

        {/* 进度分段，使用 clipPath 裁剪 */}
        <g clipPath={`url(#${clipId})`}>
          {SEGMENT_PATHS.map((d, index) => (
            <path key={`fg-${index}`} d={d} fill={fillColor} />
          ))}
        </g>
      </svg>

      {step !== undefined && <NumberDisplay>{step}</NumberDisplay>}
    </LoadingWrapper>
  )
})
