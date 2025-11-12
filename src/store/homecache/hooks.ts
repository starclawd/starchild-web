import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { setHasSkipped } from './reducer'

export function useHasSkipped(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const hasSkipped = useSelector((state: RootState) => state.homecache.hasSkipped)
  const setHasSkippedValue = useCallback(
    (value: boolean) => {
      dispatch(setHasSkipped(value))
    },
    [dispatch],
  )
  return [hasSkipped, setHasSkippedValue]
}
