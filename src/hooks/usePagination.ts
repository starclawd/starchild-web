import { useCallback, useState, useRef, useEffect, useMemo } from 'react'

// 分页参数接口
export interface PaginationParams {
  page: number
  pageSize: number
  [key: string]: any // 支持额外的查询参数
}

// 分页响应接口
export interface PaginatedResponse<T> {
  data: T[]
  hasNextPage: boolean
  totalCount: number
  [key: string]: any // 支持额外的响应字段
}

// 分页状态接口
export interface PaginationState {
  page: number
  pageSize: number
  hasNextPage: boolean
  isLoading: boolean
  isLoadingMore: boolean
  isRefreshing: boolean
  totalCount: number
  error: any
}

// 分页配置接口
export interface PaginationConfig<T> {
  initialPageSize?: number
  // API调用函数，返回Promise<PaginatedResponse<T>>
  fetchFunction: (params: PaginationParams) => Promise<PaginatedResponse<T>>
  // 额外的查询参数
  extraParams?: Record<string, any>
  // 是否在创建时自动加载第一页
  autoLoadFirstPage?: boolean
  // 错误处理函数
  onError?: (error: any) => void
  // 成功回调
  onSuccess?: (data: T[], isLoadMore: boolean) => void
}

// 分页操作接口
export interface PaginationActions<T> {
  loadFirstPage: () => Promise<void>
  loadNextPage: () => Promise<void>
  refresh: () => Promise<void>
  reset: () => void
  setPageSize: (pageSize: number) => void
  setExtraParams: (params: Record<string, any>) => void
}

// 分页结果接口
export interface PaginationResult<T> extends PaginationState, PaginationActions<T> {
  data: T[]
}

/**
 * 通用分页数据管理hook - 重构版本避免依赖循环
 *
 * @param config 分页配置
 * @returns 包含数据、状态和操作方法的对象
 */
export function usePagination<T = any>(config: PaginationConfig<T>): PaginationResult<T> {
  const {
    initialPageSize = 10,
    fetchFunction,
    extraParams = {},
    autoLoadFirstPage = false,
    onError,
    onSuccess,
  } = config

  // 数据状态
  const [data, setData] = useState<T[]>([])

  // 分页状态
  const [paginationState, setPaginationState] = useState<PaginationState>({
    page: 1,
    pageSize: initialPageSize,
    hasNextPage: true,
    isLoading: false,
    isLoadingMore: false,
    isRefreshing: false,
    totalCount: 0,
    error: null,
  })

  // 使用ref存储所有可能变化的值，避免依赖循环
  const stateRef = useRef(paginationState)
  const configRef = useRef({ fetchFunction, extraParams, onError, onSuccess })
  const hasLoadedFirstPageRef = useRef(false)

  // 更新ref值
  stateRef.current = paginationState
  configRef.current = { fetchFunction, extraParams, onError, onSuccess }

  // 通用的数据获取函数 - 不依赖任何状态
  const fetchData = useCallback(async (page: number, isLoadMore = false, isRefresh = false): Promise<void> => {
    try {
      // 设置加载状态
      setPaginationState((prev) => ({
        ...prev,
        isLoading: !isLoadMore && !isRefresh,
        isLoadingMore: isLoadMore,
        isRefreshing: isRefresh,
        error: null,
      }))

      const currentState = stateRef.current
      const currentConfig = configRef.current

      const params: PaginationParams = {
        page,
        pageSize: currentState.pageSize,
        ...currentConfig.extraParams,
      }

      const response = await currentConfig.fetchFunction(params)
      const { data: newData, hasNextPage, totalCount } = response

      // 更新数据
      setData((prevData) => {
        if (isLoadMore) {
          return [...prevData, ...newData]
        } else {
          return newData
        }
      })

      // 更新分页状态
      setPaginationState((prev) => ({
        ...prev,
        page: isLoadMore ? page + 1 : 2, // 下次要加载的页码
        hasNextPage,
        totalCount,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
      }))

      // 成功回调
      currentConfig.onSuccess?.(newData, isLoadMore)
    } catch (error) {
      // 错误处理
      setPaginationState((prev) => ({
        ...prev,
        error,
        isLoading: false,
        isLoadingMore: false,
        isRefreshing: false,
      }))

      configRef.current.onError?.(error)
      console.error('分页数据获取失败:', error)
    }
  }, []) // 空依赖数组，避免循环

  // 操作方法 - 使用useMemo确保引用稳定性
  const actions = useMemo(
    () => ({
      // 加载第一页
      loadFirstPage: async (): Promise<void> => {
        hasLoadedFirstPageRef.current = true
        await fetchData(1, false, false)
      },

      // 加载下一页
      loadNextPage: async (): Promise<void> => {
        const currentState = stateRef.current
        if (!currentState.hasNextPage || currentState.isLoadingMore) {
          return
        }
        await fetchData(currentState.page, true, false)
      },

      // 刷新数据
      refresh: async (): Promise<void> => {
        await fetchData(1, false, true)
      },

      // 重置分页状态
      reset: (): void => {
        hasLoadedFirstPageRef.current = false
        setData([])
        setPaginationState((prev) => ({
          page: 1,
          pageSize: prev.pageSize, // 保持当前的pageSize
          hasNextPage: true,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
          totalCount: 0,
          error: null,
        }))
      },

      // 设置每页数量
      setPageSize: (pageSize: number): void => {
        setPaginationState((prev) => ({
          ...prev,
          pageSize,
          page: 1,
        }))
        // 重新加载第一页
        setData([])
      },

      // 设置额外参数
      setExtraParams: (params: Record<string, any>): void => {
        configRef.current.extraParams = { ...configRef.current.extraParams, ...params }
        // 重置状态
        hasLoadedFirstPageRef.current = false
        setData([])
        setPaginationState((prev) => ({
          page: 1,
          pageSize: prev.pageSize,
          hasNextPage: true,
          isLoading: false,
          isLoadingMore: false,
          isRefreshing: false,
          totalCount: 0,
          error: null,
        }))
      },
    }),
    [fetchData],
  )

  // 自动加载第一页 - 只在初始化时触发一次
  useEffect(() => {
    if (autoLoadFirstPage && !hasLoadedFirstPageRef.current) {
      hasLoadedFirstPageRef.current = true
      fetchData(1, false, false)
    }
  }, [autoLoadFirstPage, fetchData])

  return {
    // 数据和状态
    data,
    ...paginationState,

    // 操作方法
    ...actions,
  }
}

// 类型定义已通过 export interface 导出

export default usePagination
