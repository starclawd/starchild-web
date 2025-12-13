import { useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { useLazyGetTransactionHistoryListQuery, VaultTransactionHistory } from 'api/vaults'
import { updateTransactionHistoryList, setLoadingTransactionHistoryList } from '../reducer'
import { usePagination, type PaginationParams, type PaginatedResponse } from 'hooks/usePagination'

const PAGE_SIZE = 10

/**
 * Transaction History 分页数据获取 hook
 */
export function useTransactionHistory({ walletAddress }: { walletAddress: string }) {
  const dispatch = useDispatch()
  const [triggerGetTransactionHistoryList] = useLazyGetTransactionHistoryListQuery()
  const accumulatedDataRef = useRef<VaultTransactionHistory[]>([])

  const {
    data: transactionHistoryList,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalCount,
    error,
    loadFirstPage: originalLoadFirstPage,
    loadNextPage,
    refresh: originalRefresh,
    reset: originalReset,
  } = usePagination<VaultTransactionHistory>({
    initialPageSize: PAGE_SIZE,
    autoLoadFirstPage: !!walletAddress,
    fetchFunction: async (params: PaginationParams): Promise<PaginatedResponse<VaultTransactionHistory>> => {
      if (!walletAddress) {
        return {
          data: [],
          hasNextPage: false,
          totalCount: 0,
        }
      }
      const result = await triggerGetTransactionHistoryList({
        walletAddress,
        page: params.page,
        size: params.pageSize,
      })
      if (result.data) {
        const data = result.data
        // 根据返回数据长度判断是否还有下一页
        const hasNextPage = data.length >= params.pageSize
        return {
          data,
          hasNextPage,
          totalCount: 0, // API 未返回 total，设为 0
        }
      }
      throw new Error('Failed to fetch transaction history')
    },
    onSuccess: (newData: VaultTransactionHistory[], isLoadMore: boolean) => {
      // 更新累积数据
      if (isLoadMore) {
        accumulatedDataRef.current = [...accumulatedDataRef.current, ...newData]
      } else {
        accumulatedDataRef.current = newData
      }
      // 同步到 Redux store
      dispatch(updateTransactionHistoryList(accumulatedDataRef.current))
    },
    onError: (error: any) => {
      console.error('Failed to load transaction history:', error)
    },
  })

  // 同步 loading 状态到 Redux store
  useEffect(() => {
    dispatch(setLoadingTransactionHistoryList(isLoading || isLoadingMore))
  }, [isLoading, isLoadingMore, dispatch])

  // 包装 loadFirstPage 方法，重置累积数据
  const loadFirstPage = useCallback(async () => {
    accumulatedDataRef.current = []
    await originalLoadFirstPage()
  }, [originalLoadFirstPage])

  // 包装 refresh 方法，重置累积数据
  const refresh = useCallback(async () => {
    accumulatedDataRef.current = []
    await originalRefresh()
  }, [originalRefresh])

  // 包装 reset 方法，清空 store 数据
  const reset = useCallback(() => {
    accumulatedDataRef.current = []
    dispatch(updateTransactionHistoryList([]))
    originalReset()
  }, [originalReset, dispatch])

  return {
    transactionHistoryList,
    isLoading,
    isLoadingMore,
    hasNextPage,
    totalCount,
    error,
    loadFirstPage,
    loadNextPage,
    refresh,
    reset,
  }
}

/**
 * Transaction History Redux 状态管理 hook
 */
export function useTransactionHistoryList(): [VaultTransactionHistory[], (list: VaultTransactionHistory[]) => void] {
  const dispatch = useDispatch()
  const transactionHistoryList = useSelector((state: RootState) => state.myvault.transactionHistoryList)

  const setTransactionHistoryList = useCallback(
    (list: VaultTransactionHistory[]) => {
      dispatch(updateTransactionHistoryList(list))
    },
    [dispatch],
  )

  return [transactionHistoryList, setTransactionHistoryList]
}

export function useIsLoadingTransactionHistory(): [boolean, (isLoading: boolean) => void] {
  const dispatch = useDispatch()
  const isLoading = useSelector((state: RootState) => state.myvault.isLoadingTransactionHistoryList)

  const setIsLoading = useCallback(
    (loading: boolean) => {
      dispatch(setLoadingTransactionHistoryList(loading))
    },
    [dispatch],
  )

  return [isLoading, setIsLoading]
}
