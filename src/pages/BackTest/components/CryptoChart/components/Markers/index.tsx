import { IconBase } from 'components/Icons'
import { IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts'
import { memo, useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { ChartDataItem, TradeMarker } from 'store/insights/insights.d'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'

// 防抖函数
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// 添加标记覆盖层样式
const MarkersOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
`

const MarkerIcon = styled.div<{ $isBuy: boolean; $x: number; $y: number }>`
  position: absolute;
  width: 24px;
  height: 29px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  left: ${(props) => props.$x}px;
  top: ${(props) => props.$y}px;
  color: ${(props) => (props.$isBuy ? props.theme.jade40 : props.theme.ruby40)};
  font-size: 11px;
  font-weight: 400;
  line-height: 16px;
  font-family: 'iconfont', sans-serif;
  .icon-chat-back {
    font-size: 14px;
    transform: rotate(90deg);
  }
  ${({ $isBuy }) =>
    $isBuy &&
    css`
      flex-direction: column-reverse;
    `}/* 如果使用背景图片 */
  /* background-image: url(${(props) => (props.$isBuy ? '/buy-icon.svg' : '/sell-icon.svg')});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center; */
`

export default memo(function Markers({
  chartData,
  chartRef,
  seriesRef,
}: {
  chartData: ChartDataItem[]
  chartRef: React.RefObject<IChartApi>
  seriesRef: React.RefObject<ISeriesApi<'Area'>>
}) {
  const theme = useTheme()
  // 存储所有标记数据的引用
  const allMarkersRef = useRef<TradeMarker[]>([])

  // 添加可见标记的状态
  const [visibleMarkers, setVisibleMarkers] = useState<
    Array<{
      id: string
      x: number
      y: number
      isBuy: boolean
      text: string
    }>
  >([])

  // 创建时间到数据的映射，提高查找效率
  const timeToDataMap = useRef<Map<number, ChartDataItem>>(new Map())

  // 更新时间映射
  useEffect(() => {
    const map = new Map<number, ChartDataItem>()
    chartData.forEach((item) => {
      const time = typeof item.time === 'string' ? Math.floor(new Date(item.time).getTime() / 1000) : Number(item.time)
      map.set(time, item)
    })
    timeToDataMap.current = map
  }, [chartData])

  // 生成模拟买卖标签数据
  const generateMockTradeMarkers = useCallback(
    (chartData: ChartDataItem[]): TradeMarker[] => {
      if (chartData.length === 0) return []

      const markers: TradeMarker[] = []
      const dataLength = chartData.length

      // 每20-30个数据点生成一个买卖信号
      for (let i = 20; i < dataLength; i += Math.floor(Math.random() * 20) + 15) {
        const dataPoint = chartData[i]
        const isBuy = Math.random() > 0.5 // 随机决定是买入还是卖出

        markers.push({
          time:
            typeof dataPoint.time === 'string'
              ? (Math.floor(new Date(dataPoint.time).getTime() / 1000) as UTCTimestamp)
              : (dataPoint.time as UTCTimestamp),
          position: isBuy ? 'belowBar' : 'aboveBar',
          color: isBuy ? theme.jade40 : theme.ruby40,
          shape: isBuy ? 'arrowUp' : 'arrowDown',
          text: isBuy ? 'Buy' : 'Sell',
          size: 1,
        })
      }

      return markers
    },
    [theme.jade40, theme.ruby40],
  )

  // 更新可见标记位置的函数
  const updateVisibleMarkers = useCallback(() => {
    if (!chartRef.current || !seriesRef.current || allMarkersRef.current.length === 0) {
      setVisibleMarkers([])
      return
    }

    try {
      const chart = chartRef.current
      const timeScale = chart.timeScale()

      // 获取当前可见的逻辑范围
      const visibleLogicalRange = timeScale.getVisibleLogicalRange()
      if (!visibleLogicalRange) {
        setVisibleMarkers([])
        return
      }

      const newVisibleMarkers: Array<{
        id: string
        x: number
        y: number
        isBuy: boolean
        text: string
      }> = []

      // 遍历所有标记，找出在可见范围内的
      allMarkersRef.current.forEach((marker, index) => {
        const markerTime = marker.time

        // 转换为像素坐标来检查是否在可见范围内
        const x = timeScale.timeToCoordinate(markerTime)

        if (x !== null) {
          // 使用映射快速查找数据点
          const exactTime = Number(markerTime)
          let dataPoint = timeToDataMap.current.get(exactTime)

          // 如果找不到精确匹配，查找最近的时间点
          if (!dataPoint) {
            let minDiff = Infinity
            let closestTime = exactTime

            for (const [time] of timeToDataMap.current) {
              const diff = Math.abs(time - exactTime)
              if (diff < minDiff && diff < 60) {
                // 允许1分钟的误差
                minDiff = diff
                closestTime = time
              }
            }

            dataPoint = timeToDataMap.current.get(closestTime)
          }

          if (dataPoint) {
            // 计算标记的价格位置 - 让标记更贴近蜡烛
            const basePrice =
              marker.position === 'aboveBar'
                ? dataPoint.high || dataPoint.close || 0
                : dataPoint.low || dataPoint.close || 0

            // 计算价格范围来确定偏移距离
            const priceRange = (dataPoint.high || dataPoint.close || 0) - (dataPoint.low || dataPoint.close || 0)
            const offset = Math.max(priceRange * 0.05, basePrice * 0.002) // 增加偏移量使标记更明显

            const price =
              marker.position === 'aboveBar'
                ? basePrice + offset // 略高于最高点
                : basePrice - offset // 略低于最低点

            // 转换为像素坐标
            const y = seriesRef.current?.priceToCoordinate(price)

            if (y !== null && y !== undefined) {
              newVisibleMarkers.push({
                id: `${marker.time}-${index}`,
                x,
                y,
                isBuy: marker.shape === 'arrowUp',
                text: marker.text,
              })
            }
          }
        }
      })

      setVisibleMarkers(newVisibleMarkers)
    } catch (error) {
      console.error('更新标记位置错误:', error)
      setVisibleMarkers([])
    }
  }, [chartRef, seriesRef])

  // 创建防抖版本的更新函数
  const debouncedUpdateVisibleMarkers = useMemo(
    () => debounce(updateVisibleMarkers, 16), // 约60fps的更新频率
    [updateVisibleMarkers],
  )

  // 生成并保存模拟数据，并立即更新可见标记
  useEffect(() => {
    if (chartData.length > 0) {
      const mockMarkers = generateMockTradeMarkers(chartData)
      allMarkersRef.current = mockMarkers
      // 立即更新可见标记 - 初始加载时不使用防抖
      setTimeout(() => {
        updateVisibleMarkers()
      }, 50) // 稍微延迟确保图表已渲染
    } else {
      // 清空数据时也清空标记
      allMarkersRef.current = []
      setVisibleMarkers([])
    }
  }, [chartData, generateMockTradeMarkers, updateVisibleMarkers])

  // 监听图表变化，更新标记位置
  useEffect(() => {
    if (!chartRef.current) return

    const chart = chartRef.current
    const timeScale = chart.timeScale()

    // 监听时间范围变化 - 使用防抖版本
    const handleTimeRangeChange = () => {
      debouncedUpdateVisibleMarkers()
    }

    // 监听图表尺寸变化 - 使用防抖版本
    const handleSizeChange = () => {
      debouncedUpdateVisibleMarkers()
    }

    // 订阅事件
    timeScale.subscribeVisibleTimeRangeChange(handleTimeRangeChange)

    // 监听窗口尺寸变化
    window.addEventListener('resize', handleSizeChange)

    // 清理订阅
    return () => {
      try {
        timeScale.unsubscribeVisibleTimeRangeChange(handleTimeRangeChange)
      } catch (error) {
        // 静默处理取消订阅错误
      }
      window.removeEventListener('resize', handleSizeChange)
    }
  }, [debouncedUpdateVisibleMarkers, chartRef])
  return (
    <MarkersOverlay>
      {visibleMarkers.map((marker) => (
        <MarkerIcon key={marker.id} $isBuy={marker.isBuy} $x={marker.x} $y={marker.y} title={marker.text}>
          {/* 使用字体图标 */}
          <span>{marker.isBuy ? 'Buy' : 'Sell'}</span>
          <IconBase style={{ transform: `rotate(${marker.isBuy ? '90deg' : '270deg'})` }} className='icon-chat-back' />
        </MarkerIcon>
      ))}
    </MarkersOverlay>
  )
})
