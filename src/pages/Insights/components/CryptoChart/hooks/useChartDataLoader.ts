import { useEffect } from 'react'
import { UTCTimestamp } from 'lightweight-charts'
import { ChartDataItem, KlineDataParams } from 'store/insights/insights'
import { useGetHistoryKlineData } from 'store/insights/hooks'
import { useGetConvertPeriod } from 'store/insightscache/hooks'

interface UseChartDataLoaderProps {
  chartRef: React.RefObject<any>
  seriesRef: React.RefObject<any>
  chartData: ChartDataItem[]
  paramSymbol: string
  selectedPeriod: string
  reachedDataLimit: boolean
  binanceTimeZone: string
  isBinanceSupport: boolean
  triggerGetKlineData: any
  getConvertPeriod: any
  setChartData: (data: ChartDataItem[]) => void
  setReachedDataLimit: (limit: boolean) => void
}

export const useChartDataLoader = ({
  chartRef,
  seriesRef,
  chartData,
  paramSymbol,
  selectedPeriod,
  reachedDataLimit,
  binanceTimeZone,
  isBinanceSupport,
  triggerGetKlineData: externalTriggerGetKlineData,
  getConvertPeriod: externalGetConvertPeriod,
  setChartData,
  setReachedDataLimit,
}: UseChartDataLoaderProps) => {
  const triggerGetKlineData = externalTriggerGetKlineData || useGetHistoryKlineData()
  const getConvertPeriod = externalGetConvertPeriod || useGetConvertPeriod()
  useEffect(() => {
    if (chartData.length > 0 && seriesRef.current && chartRef.current) {
      let isLoadingMoreData = false
      let lastLoadedTimestamp =
        chartData.length > 0
          ? Math.min(
              ...chartData.map((item: ChartDataItem) =>
                typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : Number(item.time),
              ),
            )
          : 0

      let lastVisibleFrom = 0
      chartRef.current.timeScale().fitContent()

      const handleVisibleRangeChange = () => {
        if (isLoadingMoreData || reachedDataLimit || !chartRef.current) return

        const logicalRange = chartRef.current.timeScale().getVisibleLogicalRange()
        if (!logicalRange) return

        const currentFrom = logicalRange.from
        const isScrollingLeft =
          typeof currentFrom === 'number' && typeof lastVisibleFrom === 'number' && currentFrom < lastVisibleFrom

        if (typeof currentFrom === 'number') {
          lastVisibleFrom = currentFrom
        }

        if (isScrollingLeft && logicalRange.from < 10) {
          if (!lastLoadedTimestamp) return

          isLoadingMoreData = true

          const endTime = new Date(lastLoadedTimestamp * 1000)

          triggerGetKlineData({
            symbol: paramSymbol,
            interval: isBinanceSupport ? selectedPeriod : getConvertPeriod(selectedPeriod as any, isBinanceSupport),
            endTime: endTime.getTime(),
            limit: 500,
            timeZone: binanceTimeZone,
            isBinanceSupport,
          } as KlineDataParams)
            .then((response: any) => {
              if (response.data && response.data.length > 0) {
                if (response.data.length < 500) {
                  setReachedDataLimit(true)
                }

                const newData = response.data.map(
                  (item: {
                    time: number | string
                    close?: number
                    value?: number
                    open?: number
                    high?: number
                    low?: number
                    volume?: number
                  }) => {
                    const utcTime = Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp

                    return {
                      time: utcTime,
                      value: item.close || item.value,
                      open: item.open,
                      high: item.high,
                      low: item.low,
                      close: item.close || item.value,
                      volume: item.volume || 0,
                    }
                  },
                )

                const newEarliestTimestamp = Math.min(
                  ...newData.map((item: { time: string | number; value: number }) => Number(item.time)),
                )

                if (newEarliestTimestamp < lastLoadedTimestamp) {
                  lastLoadedTimestamp = newEarliestTimestamp

                  if (seriesRef.current) {
                    const existingTimestamps = new Set(
                      chartData.map((item: ChartDataItem) =>
                        typeof item.time === 'string' ? item.time : String(item.time),
                      ),
                    )

                    const uniqueNewData = newData.filter(
                      (item: { time: string | number; value: number }) =>
                        !existingTimestamps.has(typeof item.time === 'string' ? item.time : String(item.time)),
                    )

                    if (uniqueNewData.length > 0) {
                      const combinedData = [...uniqueNewData, ...chartData]

                      let fromTime: number | undefined, toTime: number | undefined
                      if (chartRef.current) {
                        fromTime = chartRef.current.timeScale().getVisibleLogicalRange()?.from
                        toTime = chartRef.current.timeScale().getVisibleLogicalRange()?.to
                      }

                      seriesRef.current.setData(combinedData)
                      setChartData(combinedData)

                      setTimeout(() => {
                        if (fromTime !== undefined && toTime !== undefined && chartRef.current) {
                          const offset = uniqueNewData.length
                          chartRef.current.timeScale().setVisibleLogicalRange({
                            from: fromTime + offset,
                            to: toTime + offset,
                          })
                        }
                      }, 0)
                    }
                  }
                } else {
                  setReachedDataLimit(true)
                }
              } else {
                setReachedDataLimit(true)
              }

              isLoadingMoreData = false
            })
            .catch((error: any) => {
              console.error('加载历史数据失败:', error)
              isLoadingMoreData = false
            })
        }
      }

      const timeScale = chartRef.current.timeScale()
      timeScale.subscribeVisibleTimeRangeChange(handleVisibleRangeChange)
      const currentChart = chartRef.current

      return () => {
        if (currentChart) {
          const timeScale = currentChart.timeScale()
          timeScale.unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange)
        }
      }
    }
  }, [
    chartData,
    paramSymbol,
    selectedPeriod,
    reachedDataLimit,
    binanceTimeZone,
    isBinanceSupport,
    triggerGetKlineData,
    getConvertPeriod,
    chartRef,
    seriesRef,
    setChartData,
    setReachedDataLimit,
  ])
}
