import { useState, useCallback, useEffect } from 'react'
import { useLazyGetStrategyOpenOrdersQuery } from 'api/strategy'
import { DataModeType } from '../vaultsdetail'

// Strategy Open Orders 服务端分页hook (专为Table组件设计)
export function useStrategyOpenOrdersPaginated(strategyId: string, dataMode: DataModeType) {
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // API调用
  const [triggerGetStrategyOpenOrders, { data: apiResponse, isLoading, error }] = useLazyGetStrategyOpenOrdersQuery()

  // 提取数据
  const orders = apiResponse?.orders || []
  const totalCount = apiResponse?.total || 0
  const count = apiResponse?.count || 0

  // 加载指定页面
  const loadPage = useCallback(
    async (page: number, size: number) => {
      if (!strategyId) return
      await triggerGetStrategyOpenOrders({
        strategy_id: strategyId,
        page,
        page_size: size,
        dataMode,
      })
    },
    [strategyId, triggerGetStrategyOpenOrders, dataMode],
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

  return {
    orders,
    isLoading,
    currentPage,
    pageSize,
    totalCount,
    count,
    handlePageChange,
    handlePageSizeChange,
    refresh,
    reset,
    error,
  }
}
