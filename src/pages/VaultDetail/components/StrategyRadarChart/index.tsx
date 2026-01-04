import { memo, useMemo } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
import type { Plugin } from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { vm } from 'pages/helper'

// 中心方块插件
const centerSquarePlugin: Plugin = {
  id: 'centerSquare',
  afterDraw: (chart) => {
    const { ctx, scales } = chart
    if (!scales.r) return

    // 获取雷达图的中心点坐标（类型断言为any来访问radial scale属性）
    const radialScale = scales.r as any
    const centerX = radialScale.xCenter
    const centerY = radialScale.yCenter

    // 获取当前主题的brand100颜色
    const dataset = chart.data.datasets[0]
    const color = dataset?.borderColor || '#4F46E5'

    ctx.save()
    ctx.fillStyle = color as string

    // 绘制2x2px的方块，中心对齐
    ctx.fillRect(centerX - 1, centerY - 1, 2, 2)

    ctx.restore()
  },
}

// 注册 Chart.js 雷达图所需组件和插件
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, centerSquarePlugin)

const RadarChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 150px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(150)};
      gap: ${vm(16)};
    `}
`

const ChartArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`

interface RadarDataItem {
  label: string
  value: number
}

interface StrategyRadarChartProps {
  /** 雷达图数据，每个维度包含标签和数值(0-100) */
  data: RadarDataItem[]
  className?: string
}

/**
 * 策略雷达图组件
 * 展示策略在各个维度的评分
 */
const StrategyRadarChart = memo<StrategyRadarChartProps>(({ data, className }) => {
  const theme = useTheme()

  // 构建雷达图数据
  const radarData = useMemo(() => {
    return {
      labels: data.map((d) => d.label),
      datasets: [
        {
          data: data.map((d) => d.value),
          borderColor: theme.brand100,
          backgroundColor: `${theme.brand100}33`, // 20% 透明度
          borderWidth: 2,
          pointBackgroundColor: theme.brand100,
          pointBorderColor: theme.brand100,
          pointRadius: 0, // 隐藏默认的圆点
          pointHoverRadius: 4,
          pointStyle: 'rect',
        },
      ],
    }
  }, [data, theme.brand100])

  // 图表配置
  const radarOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: theme.black800,
          titleColor: theme.textL1,
          bodyColor: theme.textL2,
          borderColor: theme.lineDark12,
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (context: any) => {
              const label = context.label || ''
              const value = context.parsed.r || 0
              return `${label}: ${value.toFixed(0)}/100`
            },
          },
        },
        centerSquare: {
          enabled: true,
        },
      },
      scales: {
        r: {
          beginAtZero: true,
          min: 0,
          max: 100,
          stepSize: 20,
          angleLines: {
            color: theme.bgT30,
            lineWidth: 1,
          },
          grid: {
            color: theme.bgT30,
            lineWidth: 1,
          },
          pointLabels: {
            font: {
              size: 11,
              weight: 400,
            },
            color: theme.textL4,
            padding: 4,
          },
          ticks: {
            display: false,
            stepSize: 20,
            min: 0,
            max: 100,
          },
        },
      },
      elements: {
        point: {
          radius: 0,
          hoverRadius: 6,
        },
        line: {
          borderWidth: 2,
          tension: 0,
        },
      },
      interaction: {
        intersect: false,
      },
    }
  }, [theme])

  return (
    <RadarChartContainer className={className}>
      <ChartArea>
        <Radar data={radarData} options={radarOptions} />
      </ChartArea>
    </RadarChartContainer>
  )
})

StrategyRadarChart.displayName = 'StrategyRadarChart'

export default StrategyRadarChart
