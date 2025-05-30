import { useEffect, useRef } from 'react'
import { createChart, ColorType, IChartApi, ISeriesApi, LineStyle, LineSeries } from 'lightweight-charts'
import styled from 'styled-components'
import { useIsMobile } from 'store/application/hooks'

const VolumeChartWrapper = styled.div`
  width: 100%;
  height: 144px;
  position: relative;
`

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`

// Mock数据生成函数
const generateMockData = () => {
  const data = []
  let baseVolume = 10000
  let hold = 8000
  let equity = 9500
  
  // 使用真实的日期，从今天开始往前推155天
  const endDate = new Date()
  
  for (let i = 1; i <= 155; i++) {
    // 模拟价格波动
    baseVolume += (Math.random() - 0.5) * 500
    if (i > 50 && i < 70) {
      baseVolume += Math.random() * 1000 // 上涨段
    }
    if (i > 100 && i < 120) {
      baseVolume -= Math.random() * 800 // 下跌段
    }
    if (i > 130) {
      baseVolume += Math.random() * 600 // 最后上涨
    }
    
    // 模拟成交量
    hold += (Math.random() - 0.5) * 1000
    hold = Math.max(5000, Math.min(25000, hold))
    
    // 模拟权益曲线
    equity += (Math.random() - 0.4) * 200
    equity = Math.max(9000, Math.min(12500, equity))
    
    // 创建日期字符串，格式为 YYYY-MM-DD
    const currentDate = new Date(endDate)
    currentDate.setDate(endDate.getDate() - (155 - i))
    const timeString = currentDate.toISOString().split('T')[0]
    
    data.push({
      time: timeString,
      volume: Math.max(0, baseVolume),
      hold,
      equity
    })
  }
  
  return data
}

export default function VolumeChart() {
  const isMobile = useIsMobile()
  const chartContainerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const volumeSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)
  const holdSeriesRef = useRef<ISeriesApi<'Line'> | null>(null)

  useEffect(() => {
    if (!chartContainerRef.current) return

    // 创建图表
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#07080A' },
        textColor: 'rgba(255, 255, 255, 0.54)',
        fontSize: isMobile ? 11 : 12,
      },
      grid: {
        vertLines: { color: 'transparent' },
        horzLines: { color: 'transparent' },
      },
      crosshair: {
        // Modify crosshair line style
        vertLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: 1, // Dashed line style
        },
        horzLine: {
          color: 'rgba(255, 255, 255, 0.36)',
          width: 1,
          style: 1, // Dashed line style
        },
      },
      leftPriceScale: {
        visible: true,
        borderColor: 'transparent',
        textColor: 'rgba(255, 255, 255, 0.54)',
      },
      rightPriceScale: {
        visible: true,
        borderColor: 'transparent',
        textColor: 'rgba(255, 255, 255, 0.54)',
      },
      timeScale: {
        borderColor: 'transparent',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    })

    chartRef.current = chart

    const holdSeries = chart.addSeries(LineSeries, {
      color: '#335FFC',
      lineWidth: 1,
      priceScaleId: 'left',
      lineStyle: LineStyle.Solid,
      priceLineVisible: false,
      lastValueVisible: false,
    })

    const volumeSeries = chart.addSeries(LineSeries, {
      color: '#00C57E',
      lineWidth: 1,
      priceScaleId: 'right',
      lineStyle: LineStyle.Solid,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    volumeSeriesRef.current = volumeSeries

    holdSeriesRef.current = holdSeries
    // 生成并设置数据
    const mockData = generateMockData()
    
    const volumeData = mockData.map(item => ({ time: item.time, value: item.volume }))
    const holdData = mockData.map(item => ({ time: item.time, value: item.hold }))

    volumeSeries.setData(volumeData)
    holdSeries.setData(holdData)

    // 设置价格范围
    chart.priceScale('left').applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    })

    chart.priceScale('right').applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    })

    chart.timeScale().fitContent()

    // 响应式处理
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
        })
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (chart) {
        chart.remove()
      }
    }
  }, [isMobile])

  return (
    <VolumeChartWrapper>
      <ChartContainer ref={chartContainerRef} />
    </VolumeChartWrapper>
  )
}
