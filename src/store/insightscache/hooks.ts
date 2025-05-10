import { useDispatch, useSelector } from "react-redux"
import { updateCurrentInsightToken, updateIsNotiEnable, updateIssShowCharts, updateSelectedPeriod } from "./reducer"
import { useCallback, useEffect, useMemo } from "react"
import { RootState } from "store"
import { PERIOD_OPTIONS } from "./insightscache"
import { useTokenList } from "store/insights/hooks"
import eventEmitter, { EventEmitterKey } from "utils/eventEmitter"
import useToast, { TOAST_STATUS } from "components/Toast"
import { useTheme } from "store/themecache/hooks"

export function useCurrentInsightToken(): [string, (newInsightToken: string) => void] {
  const dispatch = useDispatch()
  const tokenList = useTokenList()
  const currentInsightToken = useSelector((state: RootState) => state.insightscache.currentInsightToken)
  const isCurrentInsightTokenExit = useMemo(() => {
    return tokenList.some((token) => token.symbol === currentInsightToken)
  }, [tokenList, currentInsightToken])
  const setCurrentInsightToken = useCallback(
    (newInsightToken: string) => {
      dispatch(updateCurrentInsightToken(newInsightToken))
    },
    [dispatch]
  )

  return [isCurrentInsightTokenExit ? currentInsightToken : '', setCurrentInsightToken]
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

export function useIsNotiEnable(): [boolean, (newIsNotiEnable: boolean) => void] {
  const dispatch = useDispatch()
  const isNotiEnable = useSelector((state: RootState) => state.insightscache.isNotiEnable)

  const setIsNotiEnable = useCallback(
    (newIsNotiEnable: boolean) => {
      dispatch(updateIsNotiEnable(newIsNotiEnable))
    },
    [dispatch]
  )

  return [isNotiEnable, setIsNotiEnable]
}

export function useListenInsightsNotification() {
  const toast = useToast()
  const theme = useTheme()
  const [isNotiEnable] = useIsNotiEnable()
  useEffect(() => {
    eventEmitter.on(EventEmitterKey.INSIGHTS_NOTIFICATION, (data: any) => {
      if (isNotiEnable) {
        toast({
          title: data.alertType,
          description: data.aiContent,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-noti-enable',
          iconTheme: theme.jade10,
          autoClose: 10000,
        })
      }
    })
    return () => {
      eventEmitter.remove(EventEmitterKey.INSIGHTS_NOTIFICATION)
    }
  }, [isNotiEnable, toast, theme])
}