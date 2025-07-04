import { useMemo } from 'react'
import { BacktestData } from 'store/backtest/backtest.d'
import { div, mul } from 'utils/calc'

export const useMockData = (
  fundingTrends: BacktestData['funding_trends'],
  initial_value: number,
  formatPriceData: Record<string, { close: number, time: number }>
) => {
  const mockData = useMemo(() => {
    if (fundingTrends.length === 0) return []
    const initPrice = formatPriceData[fundingTrends[0].datetime]?.close || 0
    const initVolume = initPrice ? div(initial_value, initPrice) : 0
    const baselineValue = Number(fundingTrends[0].funding)
    
    const rawData = fundingTrends.map((item, index) => {
      const { datetime, funding } = item
      return {
        time: datetime,
        equity: Number(funding) - baselineValue,
        hold: Number(mul(initVolume, formatPriceData[datetime]?.close || 0)),
        originalEquity: Number(funding),
        isIntersection: false
      }
    })
    
    const processedData = []
    for (let i = 0; i < rawData.length; i++) {
      const current = rawData[i]
      processedData.push(current)
      
      if (i < rawData.length - 1) {
        const next = rawData[i + 1]
        const currentValue = current.equity
        const nextValue = next.equity
        
        if ((currentValue > 0 && nextValue < 0) || (currentValue < 0 && nextValue > 0)) {
          const ratio = Math.abs(currentValue) / (Math.abs(currentValue) + Math.abs(nextValue))
          
          const currentTime = new Date(current.time).getTime()
          const nextTime = new Date(next.time).getTime()
          const intersectionTime = currentTime + (nextTime - currentTime) * ratio
          
          processedData.push({
            time: new Date(intersectionTime).toISOString(),
            equity: 0,
            hold: rawData[i].hold,
            originalEquity: baselineValue,
            isIntersection: true
          })
        }
      }
    }
    
    return processedData
  }, [initial_value, fundingTrends, formatPriceData])

  return mockData
}