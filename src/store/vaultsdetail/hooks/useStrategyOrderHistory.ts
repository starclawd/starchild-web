import { useState, useCallback, useEffect } from 'react'
import { useLazyGetStrategyOrderHistoryQuery } from 'api/strategy'

// Strategy Order History 服务端分页hook (专为Table组件设计)
export function useStrategyOrderHistoryPaginated(strategyId: string) {
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // API调用
  const [triggerGetStrategyOrderHistory, { data: apiResponse, isLoading, error }] =
    useLazyGetStrategyOrderHistoryQuery()

  // 提取数据
  const orders = apiResponse?.items || []
  const totalCount = apiResponse?.total || 0

  // 加载指定页面
  const loadPage = useCallback(
    async (page: number, size: number) => {
      if (!strategyId) return
      await triggerGetStrategyOrderHistory({
        strategy_id: strategyId,
        page,
        page_size: size,
        status: 'COMPLETED',
      })
    },
    [strategyId, triggerGetStrategyOrderHistory],
  )

  // 页码变化处理
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      loadPage(page, pageSize)
    },
    [pageSize, loadPage],
  )

  // 页面大小变化处理
  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size)
      setCurrentPage(1)
      loadPage(1, size)
    },
    [loadPage],
  )

  // 刷新当前页
  const refresh = useCallback(() => {
    loadPage(currentPage, pageSize)
  }, [currentPage, pageSize, loadPage])

  // 重置到第一页
  const reset = useCallback(() => {
    setCurrentPage(1)
    setPageSize(pageSize)
    if (strategyId) {
      loadPage(1, pageSize)
    }
  }, [strategyId, loadPage, pageSize])

  // 初始加载
  useEffect(() => {
    if (strategyId) {
      loadPage(1, pageSize)
    }
  }, [strategyId, loadPage, pageSize])

  // 轮询：每1分钟自动刷新当前页数据
  useEffect(() => {
    if (!strategyId) return

    const interval = setInterval(() => {
      refresh()
    }, 60000) // 60秒 = 1分钟

    return () => clearInterval(interval)
  }, [strategyId, refresh])

  return {
    orders,
    isLoading,
    currentPage,
    pageSize,
    totalCount,
    handlePageChange,
    handlePageSizeChange,
    refresh,
    reset,
    error,
  }
}
