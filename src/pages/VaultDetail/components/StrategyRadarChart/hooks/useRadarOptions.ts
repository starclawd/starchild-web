import { useMemo } from 'react'
import { useTheme } from 'styled-components'

interface RadarDataItem {
  label: string
  value: number
}

/**
 * 雷达图配置选项Hook
 */
export const useRadarOptions = (data: RadarDataItem[]) => {
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
          titleColor: theme.black0,
          bodyColor: theme.black100,
          borderColor: theme.black600,
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
            color: theme.black600,
            lineWidth: 1,
          },
          grid: {
            color: theme.black600,
            lineWidth: 1,
          },
          pointLabels: {
            font: {
              size: 11,
              weight: 400,
            },
            color: theme.black300,
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

  return {
    radarData,
    radarOptions,
  }
}
