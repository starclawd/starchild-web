import { useDispatch, useSelector } from "react-redux"
import { updateCurrentInsightToken, updateIssShowCharts, updateSelectedPeriod } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"
import { PERIOD_OPTIONS } from "./insightscache"

export function useCurrentInsightToken(): [string, (newInsightToken: string) => void] {
  const dispatch = useDispatch()
  const currentInsightToken = useSelector((state: RootState) => state.insightscache.currentInsightToken)

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
  const issShowCharts = useSelector((state: RootState) => state.insightscache.issShowCharts)

  const setIssShowCharts = useCallback(
    (newIssShowCharts: boolean) => {
      dispatch(updateIssShowCharts(newIssShowCharts))
    },
    [dispatch]
  )

  return [issShowCharts, setIssShowCharts]
}

export function useSelectedPeriod(): [PERIOD_OPTIONS, (newSelectedPeriod: PERIOD_OPTIONS) => void] {
  const dispatch = useDispatch()
  const selectedPeriod = useSelector((state: RootState) => state.insightscache.selectedPeriod)

  const setSelectedPeriod = useCallback(
    (newSelectedPeriod: PERIOD_OPTIONS) => {
      dispatch(updateSelectedPeriod(newSelectedPeriod))
    },
    [dispatch]
  )

  return [selectedPeriod, setSelectedPeriod]
}
