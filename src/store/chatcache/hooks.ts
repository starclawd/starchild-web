import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { ParamFun } from 'types/global'
import { changeCurrentAiThreadId, changeShowHistory } from './reducer'
import { useCallback } from 'react'

// 设置 ai 显示 thread
export function useCurrentAiThreadId(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const currentAiThreadId = useSelector((state: RootState) => state.chatcache.currentAiThreadId)
  const setCurrentAiThreadId = useCallback(
    (currentAiThreadId: string) => {
      dispatch(changeCurrentAiThreadId({ currentAiThreadId }))
    },
    [dispatch],
  )
  return [currentAiThreadId, setCurrentAiThreadId]
}

// 设置 ai 显示 history
export function useShowHistory(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const showHistory = useSelector((state: RootState) => state.chatcache.showHistory)
  const setShowHistory = useCallback(
    (showHistory: boolean) => {
      dispatch(changeShowHistory({ showHistory }))
    },
    [dispatch],
  )
  return [showHistory, setShowHistory]
}
