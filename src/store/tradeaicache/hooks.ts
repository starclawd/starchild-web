import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { ParamFun } from "types/global"
import { changeCurrentAiThreadId, changeShowHistory, changeAiStyleType } from "./reducer"
import { useCallback } from "react"
import { AI_STYLE_TYPE } from "./tradeaicache.d"

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

// 设置 ai 显示 history
export function useShowHistory(): [boolean, ParamFun<boolean>] {
  const dispatch = useDispatch()
  const showHistory = useSelector((state: RootState) => state.tradeaicache.showHistory)
  const setShowHistory = useCallback((showHistory: boolean) => {
    dispatch(changeShowHistory({ showHistory }))
  }, [dispatch])  
  return [showHistory, setShowHistory]
}

// 设置 ai 显示 style
export function useAiStyleType(): [AI_STYLE_TYPE, ParamFun<AI_STYLE_TYPE>] {
  const dispatch = useDispatch()
  const aiStyleType = useSelector((state: RootState) => state.tradeaicache.aiStyleType)
  const setAiStyleType = useCallback((aiStyleType: AI_STYLE_TYPE) => {
    dispatch(changeAiStyleType({ aiStyleType }))
  }, [dispatch])
  return [aiStyleType, setAiStyleType]
}
