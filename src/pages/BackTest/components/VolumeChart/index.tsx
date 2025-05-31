import { useEffect, useRef, useMemo, useState, useCallback } from 'react'
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
  }
`

const AxisLabel = styled.div<{ x?: number; y?: number; position: 'x' | 'y' | 'y1' }>`
  position: absolute;
  background: ${({theme}) => theme.sfC2};
  color: ${({theme}) => theme.textL2};
  padding: 0 6px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 10;
  
  ${props => props.position === 'x' && `
    bottom: 0;
    left: ${props.x}px;
    transform: translateX(-50%);
  `}
  
  ${props => props.position === 'y' && `
    left: 0;
    top: ${props.y}px;
    transform: translateY(-50%);
  `}
  
  ${props => props.position === 'y1' && `
    right: 0;
    top: ${props.y}px;
    transform: translateY(-50%);
  `}
`

// 十字线插件
const crosshairPlugin = {
  id: 'crosshair',
  afterDatasetsDraw: (chart: any) => {
    if (chart.crosshair && chart.crosshair.draw) {
      const { ctx, chartArea } = chart
      const { x, holdY, volumeY, holdValue, volumeValue } = chart.crosshair
      
      ctx.save()
      
      // 设置十字线样式
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.54)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 4]) // 虚线样式，4像素实线，4像素空白
      
      // 绘制垂直线
      ctx.beginPath()
      ctx.moveTo(x, chartArea.top)
      ctx.lineTo(x, chartArea.bottom)
      ctx.stroke()
      
      // 绘制Hold数据的水平线
      if (holdY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(chartArea.left, holdY)
        ctx.lineTo(chartArea.right, holdY)
        ctx.stroke()
      }
      
      // 绘制Volume数据的水平线
      if (volumeY !== undefined) {
        ctx.beginPath()
        ctx.moveTo(chartArea.left, volumeY)
        ctx.lineTo(chartArea.right, volumeY)
        ctx.stroke()
      }
      
      // 重置线条样式为实线，准备绘制圆点
      ctx.setLineDash([])
      
      // 绘制Hold交点圆点
      if (holdY !== undefined) {
        ctx.beginPath()
        ctx.arc(x, holdY, 3, 0, 2 * Math.PI) // 半径4像素的圆
        ctx.fillStyle = '#000' // Hold线的颜色
        ctx.fill()
        // 添加白色边框
        ctx.strokeStyle = '#335FFC'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      // 绘制Volume交点圆点
      if (volumeY !== undefined) {
        ctx.beginPath()
        ctx.arc(x, volumeY, 3, 0, 2 * Math.PI) // 半径4像素的圆
        ctx.fillStyle = '#000' // Volume线的颜色
        ctx.fill()
        // 添加白色边框
        ctx.strokeStyle = '#FF447C'
        ctx.lineWidth = 2
        ctx.stroke()
      }
      
      ctx.restore()
    }
  }
}

// Mock数据生成函数
const generateMockData = () => {
  const data = []
  let baseVolume = 5000 // 降低初始值，方便产生负数
  let hold = 8000
  let equity = 9500
  
  // 使用真实的日期，从今天开始往前推155天
  const endDate = new Date()
  
  for (let i = 1; i <= 155; i++) {
    // 模拟价格波动，包含负数
    baseVolume += (Math.random() - 0.5) * 1500
    
    if (i > 20 && i < 40) {
      baseVolume -= Math.random() * 1200 // 强制下跌段，产生负数
    }
    if (i > 50 && i < 70) {
      baseVolume += Math.random() * 1000 // 上涨段
    }
    if (i > 80 && i < 100) {
      baseVolume -= Math.random() * 1800 // 再次下跌段，产生更多负数
    }
    if (i > 100 && i < 120) {
      baseVolume += Math.random() * 800 // 继续下跌
    }
    if (i > 130) {
      baseVolume += Math.random() * 600 // 最后上涨
    }
    
    // 模拟成交量，也可能有负数
    hold += (Math.random() - 0.5) * 1000
    hold = Math.max(-5000, Math.min(25000, hold)) // 允许负数到-5000
    
    // 模拟权益曲线
    equity += (Math.random() - 0.4) * 200
    equity = Math.max(9000, Math.min(12500, equity))
    
    // 创建日期字符串，格式为 YYYY-MM-DD
    const currentDate = new Date(endDate)
    currentDate.setDate(endDate.getDate() - (155 - i))
    const timeString = currentDate.toISOString().split('T')[0]
    
    data.push({
      time: timeString,
      volume: baseVolume, // 允许负数
      hold,
      equity
    })
  }
  
  return data
}

export default function VolumeChart() {
  const isMobile = useIsMobile()
  const chartRef = useRef<ChartJS<'line', number[], string>>(null)
  const [crosshairData, setCrosshairData] = useState<{
    x: number
    dataIndex: number
    xLabel: string
    holdValue: number
    volumeValue: number
    holdY: number
    volumeY: number
  } | null>(null)

  // 生成数据
  const mockData = useMemo(() => generateMockData(), [])

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
        
        console.log('Canvas mouse move:', { x, y })
        
        if (isNaN(x) || isNaN(y)) return
        
        const dataX = chart.scales.x.getValueForPixel(x)
        
        if (dataX !== undefined && dataX >= 0 && dataX < mockData.length) {
          const dataIndex = Math.round(dataX)
          const xLabel = mockData[dataIndex]?.time || ''
          
          // 获取实际的数据值
          const holdValue = mockData[dataIndex]?.hold || 0
          const volumeValue = mockData[dataIndex]?.volume || 0
          
          // 计算对应的像素坐标
          const holdY = chart.scales.y.getPixelForValue(holdValue)
          const volumeY = chart.scales.y1.getPixelForValue(volumeValue)
          
          ;(chart as any).crosshair = {
            x,
            holdY,
            volumeY,
            holdValue,
            volumeValue,
            draw: true
          }
          
          setCrosshairData({
            x,
            dataIndex,
            xLabel,
            holdValue,
            volumeValue,
            holdY,
            volumeY
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
  }, [mockData])

  // 创建动态渐变（以0轴为分界线）
  const createDynamicGradient = (ctx: CanvasRenderingContext2D, chartArea: any, yScale: any) => {
    // 获取0值对应的像素位置
    const zeroPixel = yScale.getPixelForValue(0)
    
    // 创建从顶部到底部的渐变
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    
    // 计算0轴在渐变中的相对位置 (0-1之间)
    const zeroPosition = (zeroPixel - chartArea.top) / (chartArea.bottom - chartArea.top)
    const clampedZeroPosition = Math.max(0, Math.min(1, zeroPosition))
    
    // 在0轴上方：绿色渐变（正值）
    if (clampedZeroPosition > 0) {
      gradient.addColorStop(0, 'rgba(0, 197, 126, 0.36)')
      gradient.addColorStop(clampedZeroPosition, 'rgba(0, 197, 126, 0)')
    }
    
    // 在0轴下方：红色渐变（负值）
    if (clampedZeroPosition < 1) {
      gradient.addColorStop(clampedZeroPosition, 'rgba(255, 68, 124, 0)')
      gradient.addColorStop(1, 'rgba(255, 68, 124, 0.36)')
    }
    
    return gradient
  }
  
  const chartData = useMemo(() => {
    const labels = mockData.map(item => {
      const date = new Date(item.time)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    })
    
    const volumeData = mockData.map(item => item.volume)
    const holdData = mockData.map(item => item.hold)
    
    // 创建0轴水平线数据
    const zeroLineData = new Array(labels.length).fill(0)
    
    return {
      labels,
      datasets: [
        {
          label: 'Hold',
          data: holdData,
          borderColor: '#335FFC',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0,
          fill: 'origin',
          yAxisID: 'y', // 使用左轴
        },
        {
          label: 'Volume',
          data: volumeData,
          borderColor: '#FF447C',
          backgroundColor: (context: any) => {
            const chart = context.chart
            const { ctx, chartArea } = chart
            if (!chartArea) return 'transparent'
            
            // 使用动态渐变，基于Y1轴（右轴）
            return createDynamicGradient(ctx, chartArea, chart.scales.y1)
          },
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0,
          fill: 'origin',
          yAxisID: 'y1', // 使用右轴
        },
        {
          label: '', // 空标签，不在图例中显示
          data: zeroLineData,
          borderColor: 'rgba(255, 255, 255, 0.06)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
          fill: false,
          yAxisID: 'y', // 使用左轴
        },
        {
          label: '', // 空标签，不在图例中显示 - Volume 0轴线
          data: zeroLineData,
          borderColor: 'rgba(255, 255, 255, 0.06)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
          fill: false,
          yAxisID: 'y1', // 使用右轴（Volume轴）
        }
      ]
    }
  }, [mockData])

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 3,
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
        display: true,
        position: 'left' as const,
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
          display: false,
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.54)',
          font: {
            size: isMobile ? 10 : 11,
            family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          },
          callback: (value: any) => {
            if (value >= 10000) {
              return `${(value / 1000).toFixed(0)}k`
            }
            return value.toFixed(0)
          }
        },
        border: {
          display: false,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: false,
          text: 'Volume',
          color: '#00C57E',
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
            if (value >= 10000) {
              return `${(value / 1000).toFixed(0)}k`
            }
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
  }), [isMobile])

  return (
    <VolumeChartWrapper>
      <Line 
        ref={chartRef} 
        data={chartData} 
        options={options}
      />
      
      {crosshairData && (
        <>
          {/* X轴标签 */}
          <AxisLabel position="x" x={crosshairData.x}>
            {new Date(crosshairData.xLabel).toLocaleDateString('zh-CN', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </AxisLabel>
          
          {/* Y轴标签（左轴 - Hold） */}
          <AxisLabel position="y" y={crosshairData.holdY}>
            {crosshairData.holdValue >= 10000 
              ? `${(crosshairData.holdValue / 1000).toFixed(1)}k` 
              : crosshairData.holdValue.toFixed(0)
            }
          </AxisLabel>
          
          {/* Y1轴标签（右轴 - Volume） */}
          <AxisLabel position="y1" y={crosshairData.volumeY}>
            {crosshairData.volumeValue >= 10000 
              ? `${(crosshairData.volumeValue / 1000).toFixed(1)}k` 
              : crosshairData.volumeValue.toFixed(0)
            }
          </AxisLabel>
        </>
      )}
    </VolumeChartWrapper>
  )
}
