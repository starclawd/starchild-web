import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { updateIsShowRecommand } from './reducer'

export function useIsShowRecommand(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const isShowRecommand = useSelector((state: RootState) => state.settingcache.isShowRecommand)
  const setIsShowRecommand = useCallback(
    (value: boolean) => {
      dispatch(updateIsShowRecommand(value))
    },
    [dispatch],
  )
  return [isShowRecommand, setIsShowRecommand]
}
