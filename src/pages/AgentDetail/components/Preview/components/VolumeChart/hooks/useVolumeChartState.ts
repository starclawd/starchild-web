import { useState, useRef } from 'react'
import { Chart as ChartJS } from 'chart.js'

export const useVolumeChartState = () => {
  const initialPriceData = useRef(true)
  const [priceData, setPriceData] = useState<{ close: number; time: number }[]>([])
  const [isPending, setIsPending] = useState(false)
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

  return {
    initialPriceData,
    priceData,
    setPriceData,
    isPending,
    setIsPending,
    isCheckedEquity,
    setIsCheckedEquity,
    isCheckedHold,
    setIsCheckedHold,
    chartRef,
    crosshairData,
    setCrosshairData,
  }
}
