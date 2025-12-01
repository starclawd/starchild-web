import { useState, useCallback, useEffect } from 'react'
import { useLazyGetVaultOpenOrdersQuery, VaultOpenOrder } from 'api/vaults'

// Vault Open Orders 服务端分页hook (专为Table组件设计)
export function useVaultOpenOrdersPaginated(
  vaultId: string,
  filters?: {
    symbol?: string
    side?: 'buy' | 'sell'
  },
) {
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // API调用
  const [triggerGetVaultOpenOrders, { data: apiResponse, isLoading, error }] = useLazyGetVaultOpenOrdersQuery()

  // 提取数据
  const orders = apiResponse?.data.rows || []
  const totalCount = apiResponse?.data.meta.total || 0

  // 加载指定页面
  const loadPage = useCallback(
    async (page: number, size: number) => {
      if (!vaultId) return
      await triggerGetVaultOpenOrders({
        vault_id: vaultId,
        page,
        size,
        symbol: filters?.symbol,
        side: filters?.side,
      })
    },
    [vaultId, triggerGetVaultOpenOrders, filters?.symbol, filters?.side],
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
    setPageSize(10)
    if (vaultId) {
      loadPage(1, 10)
    }
  }, [vaultId, loadPage])

  // 初始加载
  useEffect(() => {
    if (vaultId) {
      loadPage(1, 10)
    }
  }, [vaultId, loadPage])

  // 当过滤条件变化时，重置到第一页
  useEffect(() => {
    if (vaultId) {
      setCurrentPage(1)
      loadPage(1, pageSize)
    }
  }, [filters?.symbol, filters?.side, vaultId, pageSize, loadPage])

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
