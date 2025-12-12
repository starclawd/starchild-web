import { useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * 使用 React Router 的 navigate 来更新 URL 参数
 * 这样可以触发 useLocation 的更新，使得 useParsedQueryString 能够实时响应
 */
export function useAddUrlParam() {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (key: string, value: string) => {
      const searchParams = new URLSearchParams(location.search)
      searchParams.set(key, value)
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
    },
    [navigate, location.pathname, location.search],
  )
}
