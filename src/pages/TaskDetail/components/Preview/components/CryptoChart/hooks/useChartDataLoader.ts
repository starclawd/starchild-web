import { useCallback, useEffect } from 'react'
import { UTCTimestamp } from 'lightweight-charts'
import { useGetHistoryKlineData } from 'store/insights/hooks'
import { useGetConvertPeriod } from 'store/insightscache/hooks'
import { ChartDataItem, KlineDataParams } from 'store/insights/insights'

interface UseChartDataLoaderProps {
  paramSymbol: string
  isBinanceSupport: boolean
  binanceTimeZone: string
  chartData: ChartDataItem[]
  setChartData: (data: ChartDataItem[]) => void
  setHistoricalDataLoaded: (loaded: boolean) => void
  setReachedDataLimit: (reached: boolean) => void
  reachedDataLimit: boolean
  selectedPeriod: string
  seriesRef: React.RefObject<any>
  chartRef: React.RefObject<any>
  getMarksTimeRange: () => { min: number; max: number } | null
  refreshTradeMarkers: (data: ChartDataItem[]) => void
}

export const useChartDataLoader = ({
  paramSymbol,
  isBinanceSupport,
  binanceTimeZone,
  chartData,
  setChartData,
  setHistoricalDataLoaded,
  setReachedDataLimit,
  reachedDataLimit,
  selectedPeriod,
  seriesRef,
  chartRef,
  getMarksTimeRange,
  refreshTradeMarkers,
}: UseChartDataLoaderProps) => {
  const triggerGetKlineData = useGetHistoryKlineData()
  const getConvertPeriod = useGetConvertPeriod()

  // Handle period change
  const handlePeriodChange = useCallback(
    async (period: string) => {
      setHistoricalDataLoaded(false) // Reset historical data loaded flag
      setChartData([])
      try {
        // 获取转换后的周期，用于CoinGecko数据源
        const convertedPeriod = getConvertPeriod(period as any, isBinanceSupport)

        // Call API to get K-line data
        const response = await triggerGetKlineData({
          isBinanceSupport,
          symbol: paramSymbol,
          interval: isBinanceSupport ? period : convertedPeriod, // 如果是CoinGecko数据源，使用转换后的周期
          limit: 500, // Increase data points to ensure sufficient data
          timeZone: binanceTimeZone, // 使用转换后的时区格式
        } as KlineDataParams)

        if (response.data && response.data.length > 0) {
          // Directly use the API return data, keep all data points
          const formattedData = response.data.map((item: any) => {
            // Format time based on different periods
            const timeFormat = Math.floor(new Date(item.time).getTime() / 1000) as UTCTimestamp

            return {
              time: timeFormat,
              open: item.open || item.close || item.value,
              high: item.high || item.close || item.value,
              low: item.low || item.close || item.value,
              close: item.close || item.value,
              volume: item.volume || 0,
            }
          })
          setChartData(formattedData)

          if (seriesRef.current) {
            seriesRef.current.setData(formattedData)

            // 初始设置交易标记
            setTimeout(() => {
              refreshTradeMarkers(formattedData)
            }, 50)

            if (chartRef.current) {
              // 数据加载完成后，根据marksDetailData的时间范围调整可视区域
              setTimeout(() => {
                if (!chartRef.current) return

                const marksTimeRange = getMarksTimeRange()
                if (marksTimeRange) {
                  // 获取图表数据的时间范围，确保可视范围在数据范围内
                  const chartTimeRange = {
                    min: Math.min(...formattedData.map((item: ChartDataItem) => Number(item.time))),
                    max: Math.max(...formattedData.map((item: ChartDataItem) => Number(item.time))),
                  }

                  // 计算可视范围，确保在图表数据范围内
                  const buffer = (marksTimeRange.max - marksTimeRange.min) * 0.1
                  const fromTime = Math.max(marksTimeRange.min - buffer, chartTimeRange.min)
                  const toTime = Math.min(marksTimeRange.max + buffer, chartTimeRange.max)

                  // 验证时间范围是否有效
                  if (
                    isFinite(fromTime) &&
                    isFinite(toTime) &&
                    fromTime > 0 &&
                    toTime > fromTime &&
                    fromTime < toTime
                  ) {
                    try {
                      chartRef.current.timeScale().setVisibleRange({
                        from: fromTime as UTCTimestamp,
                        to: toTime as UTCTimestamp,
                      })
                    } catch (error) {
                      chartRef.current.timeScale().fitContent()
                    }
                  } else {
                    chartRef.current.timeScale().fitContent()
                  }
                } else {
                  chartRef.current.timeScale().fitContent()
                }
              }, 100) // 延迟100ms确保数据已渲染
            }
          }

          setHistoricalDataLoaded(true) // Mark historical data as loaded
        }
      } catch (error) {
        setHistoricalDataLoaded(false) // Reset on error
      }
    },
    [
      paramSymbol,
      isBinanceSupport,
      binanceTimeZone,
      getMarksTimeRange,
      refreshTradeMarkers,
      triggerGetKlineData,
      getConvertPeriod,
      setHistoricalDataLoaded,
      setChartData,
      seriesRef,
      chartRef,
    ],
  )

  // 历史数据加载逻辑
  useEffect(() => {
    if (chartData.length > 0 && seriesRef.current && chartRef.current) {
      // 使用一个独立变量来跟踪图表的滚动行为
      let isLoadingMoreData = false
      // 计算初始数据中最早的时间戳
      let lastLoadedTimestamp =
        chartData.length > 0
          ? Math.min(
              ...chartData.map((item: { time: string | number; close?: number }) =>
                typeof item.time === 'string' ? new Date(item.time).getTime() / 1000 : Number(item.time),
              ),
            )
          : 0

      // 记录用户滚动方向，使用数值类型
      let lastVisibleFrom = 0
      // 根据marksDetailData的时间范围调整可视区域
      const marksTimeRange = getMarksTimeRange()
      if (marksTimeRange && chartData.length > 0 && chartRef.current) {
        const buffer = (marksTimeRange.max - marksTimeRange.min) * 0.1 // 添加10%的缓冲区
        const fromTime = marksTimeRange.min - buffer
        const toTime = marksTimeRange.max + buffer

        // 验证时间范围是否有效
        if (isFinite(fromTime) && isFinite(toTime) && fromTime > 0 && toTime > fromTime) {
          try {
            chartRef.current.timeScale().setVisibleRange({
              from: fromTime as UTCTimestamp,
              to: toTime as UTCTimestamp,
            })
          } catch (error) {
            chartRef.current.timeScale().fitContent()
          }
        } else {
          chartRef.current.timeScale().fitContent()
        }
      } else if (chartRef.current) {
        // 如果没有标记数据，则适配所有内容
        chartRef.current.timeScale().fitContent()
      }
      // 定义处理器函数
      const handleVisibleRangeChange = () => {
        // 如果正在加载数据或已经到达数据边界，不再继续加载
        if (isLoadingMoreData || reachedDataLimit || !chartRef.current) return

        // 获取逻辑范围，这是数值类型
        const logicalRange = chartRef.current.timeScale().getVisibleLogicalRange()
        if (!logicalRange) return

        // 判断滚动方向：使用逻辑范围中的数值
        const currentFrom = logicalRange.from
        const isScrollingLeft =
          typeof currentFrom === 'number' && typeof lastVisibleFrom === 'number' && currentFrom < lastVisibleFrom

        // 更新上次位置
        if (typeof currentFrom === 'number') {
          lastVisibleFrom = currentFrom
        }

        // 只有在向左滚动且接近图表左边缘时才加载更多历史数据
        if (isScrollingLeft && logicalRange.from < 10) {
          // 确保我们不会重复加载相同的数据
          if (!lastLoadedTimestamp) return

          isLoadingMoreData = true

          // 使用最早的时间戳作为下一批数据的结束时间
          const endTime = new Date(lastLoadedTimestamp * 1000)

          // 加载更多历史数据
          triggerGetKlineData({
            symbol: paramSymbol,
            interval: isBinanceSupport ? selectedPeriod : getConvertPeriod(selectedPeriod as any, isBinanceSupport),
            endTime: endTime.getTime(),
            limit: 500,
            timeZone: binanceTimeZone, // 使用转换后的时区格式
            isBinanceSupport,
          } as KlineDataParams)
            .then((response) => {
              if (response.data && response.data.length > 0) {
                // 检查是否已到达数据边界
                if (response.data.length < 500) {
                  setReachedDataLimit(true)
                }

                // 格式化新数据
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

                // 找出新数据中最早的时间戳
                const newEarliestTimestamp = Math.min(
                  ...newData.map((item: { time: string | number; close?: number }) => Number(item.time)),
                )

                // 只有当新数据确实比现有数据更早时才更新
                if (newEarliestTimestamp < lastLoadedTimestamp) {
                  lastLoadedTimestamp = newEarliestTimestamp

                  // 处理重复数据
                  if (seriesRef.current) {
                    // 创建时间戳集合用于去重
                    const existingTimestamps = new Set(
                      chartData.map((item: { time: string | number; close?: number }) =>
                        typeof item.time === 'string' ? item.time : String(item.time),
                      ),
                    )

                    // 过滤掉重复的数据点
                    const uniqueNewData = newData.filter(
                      (item: { time: string | number; close?: number }) =>
                        !existingTimestamps.has(typeof item.time === 'string' ? item.time : String(item.time)),
                    )

                    if (uniqueNewData.length > 0) {
                      // 合并新旧数据
                      const combinedData = [...uniqueNewData, ...chartData]

                      // 记录当前可见的时间范围
                      let fromTime: number | undefined, toTime: number | undefined
                      if (chartRef.current) {
                        fromTime = chartRef.current.timeScale().getVisibleLogicalRange()?.from
                        toTime = chartRef.current.timeScale().getVisibleLogicalRange()?.to
                      }

                      // 更新数据
                      seriesRef.current.setData(combinedData)
                      setChartData(combinedData)

                      // 重新设置交易标记（因为现在有了更多的历史数据）
                      setTimeout(() => {
                        refreshTradeMarkers(combinedData)
                      }, 50)

                      // 使用 setTimeout 确保在数据渲染后恢复视图
                      setTimeout(() => {
                        if (fromTime !== undefined && toTime !== undefined && chartRef.current) {
                          // 计算当前视图位置的偏移量
                          const offset = uniqueNewData.length
                          // 调整视图范围，考虑新增的数据点
                          chartRef.current.timeScale().setVisibleLogicalRange({
                            from: fromTime + offset,
                            to: toTime + offset,
                          })
                        }
                      }, 0)
                    }
                  }
                } else {
                  // 如果没有获取到更早的数据，认为已经到达边界
                  setReachedDataLimit(true)
                }
              } else {
                // 无数据返回，认为已经到达边界
                setReachedDataLimit(true)
              }

              isLoadingMoreData = false
            })
            .catch((error) => {
              isLoadingMoreData = false
            })
        }
      }

      // 监听图表滚动事件
      const currentChart = chartRef.current
      const timeScale = currentChart.timeScale()
      timeScale.subscribeVisibleTimeRangeChange(handleVisibleRangeChange)

      // 清理订阅
      return () => {
        // 使用之前保存的timeScale引用
        timeScale.unsubscribeVisibleTimeRangeChange(handleVisibleRangeChange)
      }
    }
  }, [
    chartData,
    paramSymbol,
    selectedPeriod,
    reachedDataLimit,
    binanceTimeZone,
    isBinanceSupport,
    getMarksTimeRange,
    triggerGetKlineData,
    getConvertPeriod,
    refreshTradeMarkers,
    seriesRef,
    chartRef,
    setChartData,
    setReachedDataLimit,
  ])

  // 重置数据边界状态当周期改变时
  useEffect(() => {
    setReachedDataLimit(false)
  }, [selectedPeriod, setReachedDataLimit])

  return {
    handlePeriodChange,
  }
}
