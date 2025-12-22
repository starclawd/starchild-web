/**
 * 图表数值显示组件
 * 用于在图表顶部和底部显示当前hover点的Y轴和X轴数值
 */

import { memo, useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { vm } from 'pages/helper'

interface ChartValueDisplayProps {
  chartRef: React.RefObject<any>
  onHoverDataChange?: (data: HoverData | null) => void
}

const ValueDisplayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
`

const TopValueDisplay = styled.div<{ $visible: boolean; $x: number }>`
  position: absolute;
  top: 16px;
  left: ${({ $x }) => $x}px;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.black600};
  color: ${({ theme }) => theme.textL2};
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 400;
  white-space: nowrap;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
    padding: ${vm(6)} ${vm(12)};
    border-radius: ${vm(6)};
    top: ${vm(8)};
  `}
`

const BottomValueDisplay = styled.div<{ $visible: boolean; $x: number }>`
  position: absolute;
  bottom: 8px;
  left: ${({ $x }) => $x}px;
  transform: translateX(-50%);
  background: ${({ theme }) => theme.black600};
  color: ${({ theme }) => theme.textL4};
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 11px;
  line-height: 16px;
  font-weight: 400;
  white-space: nowrap;
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
    padding: ${vm(6)} ${vm(12)};
    border-radius: ${vm(6)};
    bottom: ${vm(8)};
  `}
`

export interface HoverData {
  value: number
  time: string
  x: number
  visible: boolean
}

const ChartValueDisplay = memo(({ chartRef, onHoverDataChange }: ChartValueDisplayProps) => {
  const [hoverData, setHoverData] = useState<HoverData>({
    value: 0,
    time: '',
    x: 0,
    visible: false,
  })

  const updateHoverData = useCallback(
    (newData: HoverData | null) => {
      const data = newData || { value: 0, time: '', x: 0, visible: false }
      setHoverData(data)
      onHoverDataChange?.(newData)
    },
    [onHoverDataChange],
  )

  // 导出更新函数给外部使用
  useEffect(() => {
    if (chartRef.current && chartRef.current.updateValueDisplay) {
      return
    }

    if (chartRef.current) {
      chartRef.current.updateValueDisplay = updateHoverData
    }
  }, [chartRef, updateHoverData])

  // 处理鼠标离开图表区域时隐藏数值显示
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    const handleMouseLeave = () => {
      updateHoverData(null)
    }

    // 只监听鼠标离开事件，鼠标移动事件由Chart.js的onHover处理
    chart.canvas?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      chart.canvas?.removeEventListener('mouseleave', handleMouseLeave)
      if (chart?.updateValueDisplay) {
        delete chart.updateValueDisplay
      }
    }
  }, [chartRef, updateHoverData])

  return (
    <ValueDisplayContainer>
      <TopValueDisplay $visible={hoverData.visible} $x={hoverData.x}>
        $
        {hoverData.value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </TopValueDisplay>

      <BottomValueDisplay $visible={hoverData.visible} $x={hoverData.x}>
        {hoverData.time}
      </BottomValueDisplay>
    </ValueDisplayContainer>
  )
})

ChartValueDisplay.displayName = 'ChartValueDisplay'

export default ChartValueDisplay
