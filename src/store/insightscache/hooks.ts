import { useDispatch, useSelector } from "react-redux"
import { updateCurrentInsightToken, updateIssShowCharts } from "./reducer"
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

export function useIssShowCharts(): [boolean, (newIssShowCharts: boolean) => void] {
  const dispatch = useDispatch()
  const issShowCharts = useSelector((state: RootState) => state.insightsCache.issShowCharts)

  const setIssShowCharts = useCallback(
    (newIssShowCharts: boolean) => {
      dispatch(updateIssShowCharts(newIssShowCharts))
    },
    [dispatch]
  )

  return [issShowCharts, setIssShowCharts]
}
