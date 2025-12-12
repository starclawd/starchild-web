import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { resetCreateStrategy } from '../reducer'

export function useResetAllState() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(resetCreateStrategy())
  }, [dispatch])
}
