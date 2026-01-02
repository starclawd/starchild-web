import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * 使用 React Router 的 navigate 来更新 URL 参数
 * 这样可以触发 useLocation 的更新，使得 useParsedQueryString 能够实时响应
 * 注意：使用 window.location 获取最新的路径，避免闭包中的旧值导致跳转错误
 */
export function useAddUrlParam() {
  const navigate = useNavigate()

  return useCallback(
    (key: string, value: string) => {
      // 使用 window.location 获取最新的路径和查询参数，避免闭包问题
      const currentPathname = window.location.pathname
      const currentSearch = window.location.search
      const searchParams = new URLSearchParams(currentSearch)
      searchParams.set(key, value)
      navigate(`${currentPathname}?${searchParams.toString()}`, { replace: true })
    },
    [navigate],
  )
}

/**
 * 切换 URL 中的 strategyId 参数
 */
export function useToggleStrategyId() {
  const navigate = useNavigate()

  return useCallback(
    (id: string) => {
      const currentPathname = window.location.pathname
      const currentSearch = window.location.search
      const searchParams = new URLSearchParams(currentSearch)
      searchParams.set('strategyId', id)
      navigate(`${currentPathname}?${searchParams.toString()}`, { replace: true })
    },
    [navigate],
  )
}
