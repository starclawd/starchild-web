import dayjs from 'dayjs'
import { useEffect, useRef, useMemo, useState, useCallback, memo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import styled from 'styled-components'
import { useIsMobile } from 'store/application/hooks'
import { BacktestData } from 'store/backtest/backtest'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { useGetHistoryKlineData } from 'store/insights/hooks'
import { KlineData } from 'store/websocket/utils'
import { div, mul } from 'utils/calc'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const VolumeChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  height: auto;
`

const ChartContent = styled.div`
  width: 100%;
  height: 144px;
  position: relative;
  background: #07080A;
  
  canvas {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    image-rendering: pixelated;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transform: translateZ(0);
    will-change: transform;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  span {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 2px;
    font-size: 12px;
    font-weight: 600;
    line-height: 18px;
    color: ${({theme}) => theme.textL2};
    i {
      font-size: 14px;
    }
    .icon-selected {
      color: ${({theme}) => theme.brand6};
    }
    .icon-unselected {
      color: ${({theme}) => theme.textDark80};
    }
  }
`

const AxisLabel = styled.div.attrs<{ x?: number; y?: number; $position: 'x' | 'y' | 'y1' }>(props => ({
  style: {
    ...(props.$position === 'x' && {
      bottom: 0,
      left: `${props.x}px`,
      transform: 'translateX(-50%)'
    }),
    ...(props.$position === 'y' && {
      left: 0,
      top: `${props.y}px`,
      transform: 'translateY(-50%)'
    }),
    ...(props.$position === 'y1' && {
      right: 0,
      top: `${props.y}px`,
      transform: 'translateY(-50%)'
    })
  }
}))<{ x?: number; y?: number; $position: 'x' | 'y' | 'y1' }>`
  position: absolute;
  background: ${({theme}) => theme.sfC2};
  color: ${({theme}) => theme.textL2};
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
`

// 十字线插件
const crosshairPlugin = {
  id: 'crosshair',
  afterDatasetsDraw: (chart: any) => {
    if (chart.crosshair && chart.crosshair.draw) {
      const { ctx, chartArea } = chart
      const { x, equityY, holdY, equityValue, holdValue } = chart.crosshair
      
      ctx.save()
      
      // 设置十字线样式
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.54)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4]) // 虚线样式，4像素实线，4像素空白
      
      // 绘制垂直线（如果有任一数据线显示就绘制）
      if (equityY !== undefined || holdY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(x, chartArea.top)
        ctx.lineTo(x, chartArea.bottom)
        ctx.stroke()
      }
      
      // 绘制Equity数据的水平线（仅当Equity显示时）
      if (equityY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(chartArea.left, equityY)
        ctx.lineTo(chartArea.right, equityY)
        ctx.stroke()
      }
      
      // 绘制Hold数据的水平线（仅当Hold显示时）
      if (holdY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(chartArea.left, holdY)
        ctx.lineTo(chartArea.right, holdY)
        ctx.stroke()
      }
      
      // 重置线条样式为实线，准备绘制圆点
      ctx.setLineDash([])
      
      // 绘制Equity交点圆点（仅当Equity显示时）
      if (equityY !== undefined) {
        ctx.beginPath()
        ctx.arc(x, equityY, 3, 0, 2 * Math.PI) // 半径3像素的圆
        ctx.fillStyle = '#000' // 黑色填充
        ctx.fill()
        // 根据数据值的正负设置边框颜色
        const dataIndex = Math.round(chart.scales.x.getValueForPixel(x))
        const equityRelativeValue = chart.data.datasets[0]?.data[dataIndex] || 0
        ctx.strokeStyle = equityRelativeValue >= 0 ? '#00C57E' : '#FF447C'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      // 绘制Hold交点圆点（仅当Hold显示时）
      if (holdY !== undefined) {
        ctx.beginPath()
        ctx.arc(x, holdY, 3, 0, 2 * Math.PI) // 半径3像素的圆
        ctx.fillStyle = '#000' // 黑色填充
        ctx.fill()
        // 添加Hold颜色边框
        ctx.strokeStyle = '#335FFC'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      ctx.restore()
    }
  }
}

export default memo(function VolumeChart({
  symbol = 'BTC',
  isBinanceSupport,
  backtestData,
}: {
  symbol: string
  isBinanceSupport: boolean
  backtestData: BacktestData
}) {
  const isMobile = useIsMobile()
  const initialPriceData = useRef(true)
  const triggerGetKlineData = useGetHistoryKlineData()
  const [priceData, setPriceData] = useState<{ close: number, time: number }[]>([])
  const { funding_trends: fundingTrends, initial_value } = backtestData
  const [isCheckedEquity, setIsCheckedEquity] = useState(true)
  const [isCheckedHold, setIsCheckedHold] = useState(true)
  const chartRef = useRef<ChartJS<'line', number[], string>>(null)
  const [crosshairData, setCrosshairData] = useState<{
    x: number
    dataIndex: number
    xLabel: string
    equityValue: number
    holdValue: number
    equityY: number
    holdY: number
  } | null>(null)

  const formatPriceData = useMemo(() => {
    const data = {} as Record<string, { close: number, time: number }>
    priceData.forEach(item => {
      const time = item.time
      const formatTime = dayjs.tz(time, 'Etc/UTC').format('YYYY-MM-DD')
      data[formatTime] = item
    })
    return data
  }, [priceData])

  const [endTime, fundingTrendsLen] = useMemo(() => {
    const len = fundingTrends.length
    return [fundingTrends[len - 1]?.timestamp || 0, len]
  }, [fundingTrends])
  // 生成数据
  const mockData = useMemo(() => {
    if (fundingTrends.length === 0) return []
    const initPrice = formatPriceData[fundingTrends[0].datetime]?.close || 0
    const initVolume = initPrice ? div(initial_value, initPrice) : 0
    // 以第一项的funding值作为基准线
    const baselineValue = Number(fundingTrends[0].funding)
    
    const rawData = fundingTrends.map((item, index) => {
      const { datetime, funding } = item
      return {
        time: datetime,
        equity: Number(funding) - baselineValue, // 相对于基准线的偏移值
        hold: Number(mul(initVolume, formatPriceData[datetime]?.close || 0)),
        originalEquity: Number(funding), // 保留原始值用于显示
        isIntersection: false // 原始数据点不是交点
      }
    })
    
    // 插入基准线交点，让跨越基准线的线段能够分成上下两部分
    const processedData = []
    for (let i = 0; i < rawData.length; i++) {
      const current = rawData[i]
      processedData.push(current)
      
      // 检查是否有下一个点，以及是否跨越基准线
      if (i < rawData.length - 1) {
        const next = rawData[i + 1]
        const currentValue = current.equity
        const nextValue = next.equity
        
                // 如果跨越基准线（一个在上，一个在下）
        if ((currentValue > 0 && nextValue < 0) || (currentValue < 0 && nextValue > 0)) {
          // 使用更精确的线性插值计算交点
          const ratio = Math.abs(currentValue) / (Math.abs(currentValue) + Math.abs(nextValue))
          
          // 确保时间插值的精确性
          const currentTime = new Date(current.time).getTime()
          const nextTime = new Date(next.time).getTime()
          const intersectionTime = currentTime + (nextTime - currentTime) * ratio
          
          // 插入基准线交点，使用更精确的时间
          processedData.push({
            time: new Date(intersectionTime).toISOString(),
            equity: 0, // 精确的基准线上的点
            hold: rawData[i].hold,
            originalEquity: baselineValue, // 基准线的原始值
            isIntersection: true // 标记这是一个插入的交点
          })
        }
      }
    }
    
    return processedData
  }, [initial_value, fundingTrends, formatPriceData])

  const changeCheckedEquity = useCallback(() => {
    if (!isCheckedHold && isCheckedEquity) {
      setIsCheckedHold(true)
    }
    setIsCheckedEquity(!isCheckedEquity)
  }, [isCheckedEquity, isCheckedHold])

  const changeCheckedHold = useCallback(() => {
    if (!isCheckedEquity && isCheckedHold) {
      setIsCheckedEquity(true)
    }
    setIsCheckedHold(!isCheckedHold)
  }, [isCheckedHold, isCheckedEquity])

  // 注册十字线插件和事件监听器
  useEffect(() => {
    if (!ChartJS.registry.plugins.get('crosshair')) {
      ChartJS.register(crosshairPlugin)
    }
    
    // 添加直接的Canvas事件监听
    const chart = chartRef.current
    if (chart && chart.canvas) {
      const canvas = chart.canvas
      
      const handleCanvasMouseMove = (e: MouseEvent) => {
          const rect = canvas.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          
          if (isNaN(x) || isNaN(y)) return
          
          const dataX = chart.scales.x.getValueForPixel(x)
          
          if (dataX !== undefined && dataX >= 0 && dataX < mockData.length) {
            const dataIndex = Math.round(dataX)
            const currentDataPoint = mockData[dataIndex]
            
            // 如果是插入的交点，不显示十字线
            if (currentDataPoint?.isIntersection) {
              ;(chart as any).crosshair = { draw: false }
              setCrosshairData(null)
              chart.update('none')
              return
            }
            
            const xLabel = currentDataPoint?.time || ''
            
            // 根据显示状态获取对应的数据值和坐标
            let equityValue, holdValue, equityY, holdY
            
            if (isCheckedEquity && chart.scales.y) {
              equityValue = currentDataPoint?.originalEquity || 0 // 使用原始值
              const relativeValue = currentDataPoint?.equity || 0 // 相对偏移值用于定位
              equityY = chart.scales.y.getPixelForValue(relativeValue)
            }
            
            if (isCheckedHold && chart.scales.y1) {
              holdValue = currentDataPoint?.hold || 0
              holdY = chart.scales.y1.getPixelForValue(holdValue)
            }
            
            ;(chart as any).crosshair = {
              x,
              equityY,
              holdY,
              equityValue,
              holdValue,
              draw: true
            }
            
            setCrosshairData({
              x,
              dataIndex,
              xLabel,
              equityValue: equityValue || 0,
              holdValue: holdValue || 0,
              equityY: equityY || 0,
              holdY: holdY || 0
            })
            
            chart.update('none')
          }
        }
      
      const handleCanvasMouseLeave = () => {
        ;(chart as any).crosshair = { draw: false }
        setCrosshairData(null)
        chart.update('none')
      }
      
      canvas.addEventListener('mousemove', handleCanvasMouseMove)
      canvas.addEventListener('mouseleave', handleCanvasMouseLeave)
      
      return () => {
        canvas.removeEventListener('mousemove', handleCanvasMouseMove)
        canvas.removeEventListener('mouseleave', handleCanvasMouseLeave)
        try {
          ChartJS.unregister(crosshairPlugin)
        } catch (e) {
          // 忽略卸载错误
        }
      }
    }
    
    return () => {
      try {
        ChartJS.unregister(crosshairPlugin)
      } catch (e) {
        // 忽略卸载错误
      }
    }
  }, [mockData, isCheckedEquity, isCheckedHold])

  // 创建动态渐变（以基准线为分界线）
  const createDynamicGradient = (ctx: CanvasRenderingContext2D, chartArea: any, yScale: any) => {
    // 获取基准线（0值）对应的像素位置
    const baselinePixel = yScale.getPixelForValue(0)
    
    // 创建从顶部到底部的渐变
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    
    // 计算基准线在渐变中的相对位置 (0-1之间)
    const baselinePosition = (baselinePixel - chartArea.top) / (chartArea.bottom - chartArea.top)
    const clampedBaselinePosition = Math.max(0, Math.min(1, baselinePosition))
    
    // 在基准线上方：绿色渐变（正值偏移）
    if (clampedBaselinePosition > 0) {
      gradient.addColorStop(0, 'rgba(0, 197, 126, 0.36)')
      gradient.addColorStop(clampedBaselinePosition, 'rgba(0, 197, 126, 0)')
    }
    
    // 在基准线下方：红色渐变（负值偏移）
    if (clampedBaselinePosition < 1) {
      gradient.addColorStop(clampedBaselinePosition, 'rgba(255, 68, 124, 0)')
      gradient.addColorStop(1, 'rgba(255, 68, 124, 0.36)')
    }
    
    return gradient
  }
  
  const chartData = useMemo(() => {
    const labels = mockData.map(item => {
      const date = new Date(item.time)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}-${day}`
    })
    
    const equityData = mockData.map(item => item.equity)
    const holdData = mockData.map(item => item.hold)
    
    // 创建基准线数据（相对偏移为0）
    const baselineData = new Array(labels.length).fill(0)
    
    const datasets = []
    
    // 根据状态决定是否添加Equity数据集
    if (isCheckedEquity) {
      datasets.push({
        label: 'Equity',
        data: equityData,
        borderColor: '#FF447C',
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return 'transparent'
          
          // 使用动态渐变，基于Y轴（左轴）
          return createDynamicGradient(ctx, chartArea, chart.scales.y)
        },
        segment: {
          borderColor: (ctx: any) => {
            // 获取当前点的数据值
            const currentValue = ctx.p0.parsed.y
            const nextValue = ctx.p1.parsed.y
            
            // 由于我们已经插入了基准线交点，现在线段基本不会跨越基准线
            // 根据线段的起始点位置决定颜色
            if (currentValue >= 0 && nextValue >= 0) {
              return '#00C57E' // 都在基准线上方，使用绿色
            } else if (currentValue <= 0 && nextValue <= 0) {
              return '#FF447C' // 都在基准线下方，使用红色
            } else {
              // 如果还有跨越情况（理论上很少），根据起始点决定
              return currentValue >= 0 ? '#00C57E' : '#FF447C'
            }
          }
        },
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0,
        fill: 'origin',
        yAxisID: 'y', // 使用左轴
      })
      
      // Equity的基准线
      datasets.push({
        label: '', // 空标签，不在图例中显示
        data: baselineData,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        fill: false,
        yAxisID: 'y', // 使用左轴（Equity轴）
      })
    }
    
    // 根据状态决定是否添加Hold数据集
    if (isCheckedHold) {
      datasets.push({
        label: 'Hold',
        data: holdData,
        borderColor: '#335FFC',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0,
        fill: 'origin',
        yAxisID: 'y1', // 使用右轴
      })
      
      // Hold的基准线
      datasets.push({
        label: '', // 空标签，不在图例中显示 - Hold基准线
        data: baselineData,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        fill: false,
        yAxisID: 'y1', // 使用右轴（Hold轴）
      })
    }
    
    return {
      labels,
      datasets
    }
  }, [mockData, isCheckedEquity, isCheckedHold])

  const options = useMemo(() => {
    // 计算Y轴范围以增强波动感
    let yMin: number | undefined = undefined
    let yMax: number | undefined = undefined
    
    if (isCheckedEquity && mockData.length > 0) {
      const equityValues = mockData.map(item => item.equity)
      const minValue = Math.min(...equityValues)
      const maxValue = Math.max(...equityValues)
      const range = maxValue - minValue
      // 如果range很小或为0，增加一些padding来显示波动
      const padding = range < 100 ? 50 : range * 0.1
      yMin = minValue - padding
      yMax = maxValue + padding
    }
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      devicePixelRatio: window.devicePixelRatio || 2,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false, // 禁用tooltip
        },
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.54)',
            font: {
              size: isMobile ? 10 : 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            },
            maxTicksLimit: isMobile ? 6 : 8,
          },
          border: {
            display: false,
          },
        },
        y: {
          type: 'linear' as const,
          display: isCheckedEquity,
          position: 'left' as const,
          title: {
            display: false,
            text: 'Equity',
            color: '#FF447C',
            font: {
              size: isMobile ? 10 : 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            },
          },
          grid: {
            display: false,
          },
          // 自动调整Y轴范围以增强波动感
          min: yMin,
          max: yMax,
          ticks: {
            color: 'rgba(255, 255, 255, 0.54)',
            font: {
              size: isMobile ? 10 : 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            },
            callback: (value: any) => {
              // 显示相对于基准线的偏移值，但实际显示原始值
              const baselineValue = fundingTrends.length > 0 ? Number(fundingTrends[0].funding) : 0
              const originalValue = value + baselineValue
              return originalValue.toFixed(0)
            }
          },
          border: {
            display: false,
          },
        },
      y1: {
        type: 'linear' as const,
        display: isCheckedHold,
        position: 'right' as const,
        title: {
          display: false,
          text: 'Hold',
          color: '#335FFC',
          font: {
            size: isMobile ? 10 : 11,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          },
        },
        grid: {
          drawOnChartArea: false, // 只在左轴显示网格
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.54)',
          font: {
            size: isMobile ? 10 : 11,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          },
          callback: (value: any) => {
            return value.toFixed(0)
          }
        },
        border: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0,
        borderCapStyle: 'round' as const,
        borderJoinStyle: 'round' as const,
      },
      point: {
        radius: 0,
        hoverRadius: 4,
      },
    },
    animation: {
      duration: 0,
    },
  }
  }, [isMobile, isCheckedEquity, isCheckedHold, mockData, fundingTrends])

  const getPriceData = useCallback(async () => {
    const paramSymbol = `${symbol}USDT`
    if (symbol && fundingTrendsLen > 0) {
      if (initialPriceData.current) {
        initialPriceData.current = false
        const data = await triggerGetKlineData({
          symbol: paramSymbol,
          interval: '1d',
          endTime: endTime * 1000,
          limit: 1000,
          timeZone: '0',
          isBinanceSupport
        })
        setPriceData(data.data)
      }
    }
  }, [isBinanceSupport, symbol, endTime, fundingTrendsLen, triggerGetKlineData])

  useEffect(() => {
    getPriceData()
  }, [getPriceData])

  return (
    <VolumeChartWrapper className="volume-chart-wrapper">
      <ChartContent className="chart-content">
        <Line 
          ref={chartRef} 
          data={chartData} 
          options={options}
        />
        
        {crosshairData && (
          <>
            {/* X轴标签 */}
            <AxisLabel $position="x" x={crosshairData.x}>
              {/* {new Date(crosshairData.xLabel).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })} */}
              {crosshairData.xLabel}
            </AxisLabel>
            
            {/* Y轴标签（左轴 - Equity） */}
            {isCheckedEquity && (
              <AxisLabel $position="y" y={crosshairData.equityY}>
                {crosshairData.equityValue.toFixed(0)}
              </AxisLabel>
            )}
            
            {/* Y1轴标签（右轴 - Hold） */}
            {isCheckedHold && (
              <AxisLabel $position="y1" y={crosshairData.holdY}>
                {crosshairData.holdValue.toFixed(0)}
              </AxisLabel>
            )}
          </>
        )}
      </ChartContent>
      <IconWrapper className="icon-wrapper">
        <span onClick={changeCheckedEquity}>
          <IconBase className={isCheckedEquity ? 'icon-selected' : 'icon-unselected'} />
          <Trans>Equity</Trans>
        </span>
        <span onClick={changeCheckedHold}>
          <IconBase className={isCheckedHold ? 'icon-selected' : 'icon-unselected'} />
          <Trans>Buy & hold equity</Trans>
        </span>
      </IconWrapper>
    </VolumeChartWrapper>
  )
})
