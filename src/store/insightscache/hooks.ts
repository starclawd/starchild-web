import { useDispatch, useSelector } from "react-redux"
import { updateCurrentInsightToken } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"

export function useCurrentInsightToken(): [string, (newInsightToken: string) => void] {
  const dispatch = useDispatch()
  const currentInsightToken = useSelector((state: RootState) => state.insightsCache.currentInsightToken)

  const setCurrentInsightToken = useCallback(
    (newInsightToken: string) => {
      dispatch(updateCurrentInsightToken(newInsightToken))
    },
    [dispatch]
  )

  return [currentInsightToken, setCurrentInsightToken]
}
