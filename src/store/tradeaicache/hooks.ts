import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { ParamFun } from "types/global"
import { changeCurrentAiThreadId } from "./reducer"
import { useCallback } from "react"

// 设置 ai 显示 thread
export function useCurrentAiThreadId(): [string, ParamFun<string>] {
  const dispatch = useDispatch()
  const currentAiThreadId = useSelector((state: RootState) => state.tradeaicache.currentAiThreadId)
  const setCurrentAiThreadId = useCallback(
    (currentAiThreadId: string) => {
      dispatch(changeCurrentAiThreadId({ currentAiThreadId }))
    },
    [dispatch]
  )
  return [currentAiThreadId, setCurrentAiThreadId]
}