import { useState, useCallback, useMemo } from 'react'
import { useGetVaultTradeHistoryQuery } from 'api/vaults'

export function useVaultOrderHistoryPaginated(vaultId: string) {
  // 分页状态管理
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 使用RTK Query获取数据
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useGetVaultTradeHistoryQuery(
    {
      vault_id: vaultId,
      page: currentPage,
      size: pageSize,
    },
    {
      skip: !vaultId, // 如果没有vaultId则跳过查询
    },
  )

  // 从响应中提取数据
  const orders = useMemo(() => response?.data?.rows || [], [response])
  const totalCount = useMemo(() => response?.data?.meta?.total || 0, [response])

  // 页码变化处理
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  // 页面大小变化处理
  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }, [])

  // 刷新当前页
  const refresh = useCallback(() => {
    refetch()
  }, [refetch])

  // 重置到第一页
  const reset = useCallback(() => {
    setCurrentPage(1)
  }, [])

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
