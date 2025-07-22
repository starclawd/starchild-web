import { useMemo } from 'react'
import { BacktestDataType } from 'store/agentdetail/agentdetail'

type MockDataItem = {
  time: string
  equity: number
  hold: number
  originalEquity: number
  isIntersection: boolean
}

export const useChartOptions = (
  isMobile: boolean,
  isCheckedEquity: boolean,
  isCheckedHold: boolean,
  mockData: MockDataItem[],
  fundingTrends: BacktestDataType['funding_trends'],
) => {
  const options = useMemo(() => {
    let yMin: number | undefined = undefined
    let yMax: number | undefined = undefined

    if (isCheckedEquity && mockData.length > 0) {
      const equityValues = mockData.map((item) => item.equity)
      const minValue = Math.min(...equityValues)
      const maxValue = Math.max(...equityValues)
      const range = maxValue - minValue
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
          enabled: false,
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
          min: yMin,
          max: yMax,
          ticks: {
            color: 'rgba(255, 255, 255, 0.54)',
            font: {
              size: isMobile ? 10 : 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            },
            callback: (value: any) => {
              const baselineValue = fundingTrends.length > 0 ? Number(fundingTrends[0].funding) : 0
              const originalValue = value + baselineValue
              return originalValue.toFixed(0)
            },
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
            drawOnChartArea: false,
          },
          ticks: {
            color: 'rgba(255, 255, 255, 0.54)',
            font: {
              size: isMobile ? 10 : 11,
              family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
            },
            callback: (value: any) => {
              return value.toFixed(0)
            },
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

  return options
}
