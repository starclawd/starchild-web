import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateTimezone } from './reducer'

export function useTimezone(): [string, (timezone: string) => void] {
  const timezone = useSelector((state: RootState) => state.timezonecache.timezone)
  const dispatch = useDispatch()
  const setTimezone = useCallback(
    (timezone: string) => {
      dispatch(updateTimezone(timezone))
    },
    [dispatch],
  )
  return [timezone, setTimezone]
}
