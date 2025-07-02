import { useMemo } from 'react'

type MockDataItem = {
  time: string
  equity: number
  hold: number
  originalEquity: number
  isIntersection: boolean
}

export const useChartData = (
  mockData: MockDataItem[],
  isCheckedEquity: boolean,
  isCheckedHold: boolean,
  createDynamicGradient: (ctx: CanvasRenderingContext2D, chartArea: any, yScale: any) => CanvasGradient
) => {
  const chartData = useMemo(() => {
    const labels = mockData.map(item => {
      const date = new Date(item.time)
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}-${day}`
    })
    
    const equityData = mockData.map(item => item.equity)
    const holdData = mockData.map(item => item.hold)
    
    const baselineData = new Array(labels.length).fill(0)
    
    const datasets = []
    
    if (isCheckedEquity) {
      datasets.push({
        label: 'Equity',
        data: equityData,
        borderColor: '#FF447C',
        backgroundColor: (context: any) => {
          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return 'transparent'
          
          return createDynamicGradient(ctx, chartArea, chart.scales.y)
        },
        segment: {
          borderColor: (ctx: any) => {
            const currentValue = ctx.p0.parsed.y
            const nextValue = ctx.p1.parsed.y
            
            if (currentValue >= 0 && nextValue >= 0) {
              return '#00C57E'
            } else if (currentValue <= 0 && nextValue <= 0) {
              return '#FF447C'
            } else {
              return currentValue >= 0 ? '#00C57E' : '#FF447C'
            }
          }
        },
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 4,
        tension: 0,
        fill: 'origin',
        yAxisID: 'y',
      })
      
      datasets.push({
        label: '',
        data: baselineData,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        fill: false,
        yAxisID: 'y',
      })
    }
    
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
        yAxisID: 'y1',
      })
      
      datasets.push({
        label: '',
        data: baselineData,
        borderColor: 'rgba(255, 255, 255, 0.06)',
        backgroundColor: 'transparent',
        borderWidth: 1,
        pointRadius: 0,
        pointHoverRadius: 0,
        tension: 0,
        fill: false,
        yAxisID: 'y1',
      })
    }
    
    return {
      labels,
      datasets
    }
  }, [mockData, isCheckedEquity, isCheckedHold, createDynamicGradient])

  return chartData
}