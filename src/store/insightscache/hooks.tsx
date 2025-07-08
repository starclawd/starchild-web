import { useDispatch, useSelector } from "react-redux"
import { updateCurrentInsightToken, updateIsNotiEnable, updateIssShowCharts, updateSelectedPeriod } from "./reducer"
import { useCallback, useEffect, useMemo } from "react"
import { RootState } from "store"
import { InsightTokenDataType, PERIOD_OPTIONS } from "./insightscache"
import { getIsInsightLong, useTokenList } from "store/insights/hooks"
import eventEmitter, { EventEmitterKey } from "utils/eventEmitter"
import useToast, { TOAST_STATUS } from "components/Toast"
import { useTheme } from "store/themecache/hooks"
import { ALERT_TYPE, InsightsDataType, InstitutionalTradeOptions, NewsAlertOptions, PriceAlertOptions, PriceChange24hOptions } from "store/insights/insights"
import { formatKMBNumber, formatPercent } from "utils/format"
import { div } from "utils/calc"
import { t } from "@lingui/core/macro"
import { DefaultTheme } from "styled-components"
import { useIsLogin } from "store/login/hooks"
import Markdown from "components/Markdown"
import { useCurrentRouter } from "store/application/hooks"
import { isMatchCurrentRouter } from "utils"
import { ROUTER } from "pages/router"
import { Trans } from "@lingui/react/macro"

export function useCurrentInsightTokenData(): [InsightTokenDataType, (newInsightToken: InsightTokenDataType) => void] {
  const dispatch = useDispatch()
  const tokenList = useTokenList()
  const currentInsightTokenData = useSelector((state: RootState) => state.insightscache.currentInsightTokenData)
  const isCurrentInsightTokenExit = useMemo(() => {
    return tokenList.some((token) => token.symbol === currentInsightTokenData.symbol)
  }, [tokenList, currentInsightTokenData])
  const setCurrentInsightToken = useCallback(
    (newInsightToken: InsightTokenDataType) => {
      dispatch(updateCurrentInsightToken(newInsightToken))
    },
    [dispatch]
  )

  return [isCurrentInsightTokenExit ? currentInsightTokenData : { symbol: '', isBinanceSupport: false }, setCurrentInsightToken]
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

export function useGetConvertPeriod(): (selectedPeriod: PERIOD_OPTIONS, isBinanceSupport: boolean) => PERIOD_OPTIONS {
  const getConvertPeriod = useCallback((selectedPeriod: PERIOD_OPTIONS, isBinanceSupport: boolean) => {
    if (isBinanceSupport) {
      return selectedPeriod
    }
    if (selectedPeriod === '15m' || selectedPeriod === '1h' || selectedPeriod === '4h') {
      return '1h'
    } else if (selectedPeriod === '1d' || selectedPeriod === '1w' || selectedPeriod === '1M') {
      return '1d'
    }
    return selectedPeriod
  }, [])

  return getConvertPeriod
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
  const { postContent } = alertOptions as NewsAlertOptions;
  const isLong = getIsInsightLong(data)
  const symbol = marketId.toUpperCase()
  const change = formatPercent({ value: div(priceChange, 100), mark: priceChange > 0 ? '+' : '' })
  const change24h = formatPercent({ value: div(priceChange24h, 100), mark: priceChange24h > 0 ? '+' : '' })
  const formatValue = formatKMBNumber(value)
  const sideText = isLong ? <Trans>Buy</Trans> : <Trans>Sell</Trans>
  if (alertType === ALERT_TYPE.PRICE_ALERT) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{change}</span> within 15m</span>
  } else if (alertType === ALERT_TYPE.PRICE_CHANGE_24H) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{change24h}</span> within 24H</span>
  } else if (alertType === ALERT_TYPE.INSTITUTIONAL_TRADE) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{formatValue}</span> <span>{sideText}</span></span>
  } else if (alertType === ALERT_TYPE.NEWS_ALERT) {
    return <span>{symbol} <span style={{ color: isLong ? theme.jade10 : theme.ruby50 }}>{postContent}</span></span>
  }
  return <Markdown>{alertQuery}</Markdown>
}

export function useListenInsightsNotification() {
  const toast = useToast()
  const theme = useTheme()
  const isLogin = useIsLogin()
  const [isNotiEnable] = useIsNotiEnable()
  const [currentRouter] = useCurrentRouter()
  const isBackTestPage = isMatchCurrentRouter(currentRouter, ROUTER.BACK_TEST)
  useEffect(() => {
    eventEmitter.on(EventEmitterKey.INSIGHTS_NOTIFICATION, (data: any) => {
      if (isNotiEnable && isLogin && !isBackTestPage) {
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
  }, [isNotiEnable, isBackTestPage, theme, isLogin, toast])
}