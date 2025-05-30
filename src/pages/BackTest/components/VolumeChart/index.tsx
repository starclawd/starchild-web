import { useEffect, useRef, useMemo } from 'react'
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
  const chartRef = useRef<ChartJS<'line', number[], string>>(null)

  // 生成数据
  const mockData = useMemo(() => generateMockData(), [])
  
  // 创建渐变色的函数
  const createGradient = (ctx: CanvasRenderingContext2D, chartArea: any) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
    gradient.addColorStop(0, 'rgba(0, 197, 126, 0.36)')
    gradient.addColorStop(1, 'rgba(0, 197, 126, 0)')
    return gradient
  }

  // 创建分段渐变填充插件
  const segmentGradientPlugin = {
    id: 'segmentGradientFill',
    afterDatasetsDraw: (chart: any) => {
      const ctx = chart.ctx
      const chartArea = chart.chartArea
      const holdMeta = chart.getDatasetMeta(0) // Hold数据集
      const volumeMeta = chart.getDatasetMeta(1) // Volume数据集
      
      if (!holdMeta || !volumeMeta || !chartArea) return
      
      const yScale = chart.scales.y    // hold轴
      const y1Scale = chart.scales.y1  // volume轴
      
      if (!yScale || !y1Scale) return
      
      // 从chart数据中获取数据数组
      const holdData = chart.data.datasets[0].data
      const volumeData = chart.data.datasets[1].data
      
      ctx.save()
      
      // 遍历每个数据点，绘制分段填充
      for (let i = 0; i < holdMeta.data.length - 1; i++) {
        const holdPoint1 = holdMeta.data[i]
        const holdPoint2 = holdMeta.data[i + 1]
        const volumePoint1 = volumeMeta.data[i]
        const volumePoint2 = volumeMeta.data[i + 1]
        
        if (!holdPoint1 || !holdPoint2 || !volumePoint1 || !volumePoint2) continue
        
        // 获取当前段的数据值
        const holdValue1 = holdData[i]
        const holdValue2 = holdData[i + 1]
        const volumeValue1 = volumeData[i]
        const volumeValue2 = volumeData[i + 1]
        
        // 转换为像素坐标来判断位置关系
        const holdPixelY1 = yScale.getPixelForValue(holdValue1)
        const holdPixelY2 = yScale.getPixelForValue(holdValue2)
        const volumePixelY1 = y1Scale.getPixelForValue(volumeValue1)
        const volumePixelY2 = y1Scale.getPixelForValue(volumeValue2)
        
        // 判断这个区段中volume是否主要在hold上方
        const volume1Above = volumePixelY1 < holdPixelY1
        const volume2Above = volumePixelY2 < holdPixelY2
        const isVolumeAbove = volume1Above || volume2Above
        
        // 创建区段特定的渐变
        const segmentGradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
        
        if (isVolumeAbove) {
          // volume在hold上方：从上到下渐变
          segmentGradient.addColorStop(0, 'rgba(0, 197, 126, 0.36)')
          segmentGradient.addColorStop(1, 'rgba(0, 197, 126, 0)')
        } else {
          // volume在hold下方：从下到上渐变
          segmentGradient.addColorStop(0, 'rgba(0, 197, 126, 0)')
          segmentGradient.addColorStop(1, 'rgba(0, 197, 126, 0.36)')
        }
        
        // 绘制区段填充
        ctx.fillStyle = segmentGradient
        ctx.beginPath()
        
        // 创建四边形路径
        ctx.moveTo(holdPoint1.x, holdPixelY1)
        ctx.lineTo(volumePoint1.x, volumePixelY1)
        ctx.lineTo(volumePoint2.x, volumePixelY2)
        ctx.lineTo(holdPoint2.x, holdPixelY2)
        ctx.closePath()
        
        ctx.fill()
      }
      
      ctx.restore()
    }
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
    
    // 计算Y轴范围的中间位置
    const holdMin = Math.min(...holdData)
    const holdMax = Math.max(...holdData)
    const middleValue = (holdMin + holdMax) / 2
    
    // 创建水平线数据（所有点都是相同的中间值）
    const horizontalLineData = new Array(labels.length).fill(middleValue)
    
    return {
      labels,
      datasets: [
        {
          label: 'Hold',
          data: holdData,
          borderColor: '#335FFC',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0,
          fill: false,
          yAxisID: 'y', // 使用左轴
        },
        {
          label: 'Volume',
          data: volumeData,
          borderColor: '#FF447C',
          backgroundColor: 'transparent', // 移除默认填充，由插件处理
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: 0,
          fill: false, // 移除默认填充
          yAxisID: 'y1', // 使用右轴
        },
        {
          label: '', // 不显示在tooltip中
          data: horizontalLineData,
          borderColor: 'rgba(255, 255, 255, 0.12)',
          backgroundColor: 'transparent',
          borderWidth: 1,
          pointRadius: 0,
          pointHoverRadius: 0,
          tension: 0,
          fill: false,
          yAxisID: 'y', // 使用左轴
          borderDash: [],
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
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'rgba(7, 8, 10, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        titleFont: {
          size: isMobile ? 11 : 12,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
        },
        bodyFont: {
          size: isMobile ? 11 : 12,
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
        },
        callbacks: {
          label: (context: any) => {
            const value = context.parsed.y
            const formattedValue = value >= 10000 ? `${(value / 1000).toFixed(0)}k` : value.toLocaleString()
            return `${context.dataset.label}: ${formattedValue}`
          },
          filter: (tooltipItem: any) => {
            // 过滤掉空标签的数据集（水平线）
            return tooltipItem.dataset.label !== ''
          }
        }
      },
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
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
      <Line ref={chartRef} data={chartData} options={options} plugins={[segmentGradientPlugin]} />
    </VolumeChartWrapper>
  )
}
