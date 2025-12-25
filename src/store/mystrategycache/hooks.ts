import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { setTabIndex } from './reducer'

// 获取和更新MyStrategy页面的tab索引
export function useMyStrategyTabIndex(): [number, (index: number) => void] {
  const dispatch = useDispatch()
  const tabIndex = useSelector((state: RootState) => state.mystrategycache.tabIndex)

  const updateTabIndex = useCallback(
    (index: number) => {
      dispatch(setTabIndex(index))
    },
    [dispatch],
  )

  return [tabIndex, updateTabIndex]
}
