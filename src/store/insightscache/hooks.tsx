import { useDispatch, useSelector } from "react-redux"
import { updateCurrentInsightToken, updateIsNotiEnable, updateIssShowCharts, updateSelectedPeriod } from "./reducer"
import { useCallback, useEffect, useMemo } from "react"
import { RootState } from "store"
import { PERIOD_OPTIONS } from "./insightscache"
import { getIsInsightLong, useTokenList } from "store/insights/hooks"
import eventEmitter, { EventEmitterKey } from "utils/eventEmitter"
import useToast, { TOAST_STATUS } from "components/Toast"
import { useTheme } from "store/themecache/hooks"
import { ALERT_TYPE, InsightsDataType, InstitutionalTradeOptions, PriceAlertOptions, PriceChange24hOptions } from "store/insights/insights"
import { formatKMBNumber, formatPercent } from "utils/format"
import { div } from "utils/calc"
import { t } from "@lingui/core/macro"
import { DefaultTheme } from "styled-components"

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

function getInsightTitle(data: InsightsDataType, theme: DefaultTheme) {
  const { alertType, alertOptions, marketId, alertQuery } = data;
  const { priceChange } = alertOptions as PriceAlertOptions;
  const { value } = alertOptions as InstitutionalTradeOptions;
  const { priceChange24h } = alertOptions as PriceChange24hOptions;
  const isLong = getIsInsightLong(data)
  const symbol = marketId.toUpperCase()
  const change = formatPercent({ value: div(priceChange, 100), mark: priceChange > 0 ? '+' : '' })
  const change24h = formatPercent({ value: div(priceChange24h, 100), mark: priceChange24h > 0 ? '+' : '' })
  const formatValue = formatKMBNumber(value)
  const sideText = isLong ? t`Buy` : t`Sell`
  if (alertType === ALERT_TYPE.PRICE_ALERT) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{change}</span> within 15m</span>
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{change24h}</span> within 24H</span>
  } else if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{formatValue}</span> <span>{sideText}</span></span>
  } 
  return alertQuery
}

export function useListenInsightsNotification() {
  const toast = useToast()
  const theme = useTheme()
  const [isNotiEnable] = useIsNotiEnable()
  useEffect(() => {
    eventEmitter.on(EventEmitterKey.INSIGHTS_NOTIFICATION, (data: any) => {
      if (isNotiEnable) {
        toast({
          title: getInsightTitle(data, theme),
          description: '',
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