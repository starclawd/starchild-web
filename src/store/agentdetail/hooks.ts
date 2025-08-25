import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateBacktestData, updateTabIndex, updateAgentDetail } from './reducer'
import { useLazyGetBacktestDataQuery, useLazyGetAgentDetailQuery } from 'api/chat'
import {
  BACKTEST_STATUS,
  BacktestDataType,
  GENERATION_STATUS,
  AGENT_TYPE,
  AgentDetailDataType,
  DEFAULT_AGENT_DETAIL_DATA,
  DEFAULT_BACKTEST_DATA,
} from './agentdetail.d'
import { useBinanceSymbols } from 'store/insights/hooks'

export function useGetBacktestData() {
  const [, setBacktestData] = useBacktestData()
  const [triggerGetBacktestData] = useLazyGetBacktestDataQuery()
  return useCallback(
    async (taskId: string) => {
      try {
        const data = await triggerGetBacktestData({ taskId })
        if (data.isSuccess) {
          const backtestResult = (data.data as any).backtest_result
          const result = backtestResult.result
          if (result && result.symbol) {
            setBacktestData({
              ...result,
              status: BACKTEST_STATUS.SUCCESS,
            } as BacktestDataType)
          } else {
            if (backtestResult.message) {
              setBacktestData({
                ...DEFAULT_BACKTEST_DATA,
                status: BACKTEST_STATUS.FAILED,
                error_msg: backtestResult.message,
              } as BacktestDataType)
            } else {
              setBacktestData({
                ...DEFAULT_BACKTEST_DATA,
                status: BACKTEST_STATUS.RUNNING,
              } as BacktestDataType)
            }
          }
        }
        return data
      } catch (error) {
        return error
      }
    },
    [setBacktestData, triggerGetBacktestData],
  )
}

export function useBacktestData(): [BacktestDataType, (data: BacktestDataType | null) => void] {
  const backtestData = useSelector((state: RootState) => state.agentdetail.backtestData)
  const dispatch = useDispatch()
  const setBacktestData = useCallback(
    (data: BacktestDataType | null) => {
      dispatch(updateBacktestData(data))
    },
    [dispatch],
  )
  return [backtestData || DEFAULT_BACKTEST_DATA, setBacktestData]
}

export function useGetAgentDetail() {
  const [, setAgentDetail] = useAgentDetailData()
  const [triggerGetAgentDetail] = useLazyGetAgentDetailQuery()
  return useCallback(
    async (taskId: string) => {
      try {
        const data = await triggerGetAgentDetail({ taskId })
        if (data.isSuccess) {
          setAgentDetail(data.data as AgentDetailDataType)
        }
        return data
      } catch (error) {
        return error
      }
    },
    [setAgentDetail, triggerGetAgentDetail],
  )
}

export function useAgentDetailData(): [AgentDetailDataType, (data: AgentDetailDataType | null) => void] {
  const agentDetailData = useSelector((state: RootState) => state.agentdetail.agentDetailData)
  const dispatch = useDispatch()
  const setAgentDetail = useCallback(
    (data: AgentDetailDataType | null) => {
      dispatch(updateAgentDetail(data))
    },
    [dispatch],
  )
  return [agentDetailData && agentDetailData.id ? agentDetailData : DEFAULT_AGENT_DETAIL_DATA, setAgentDetail]
}

export function useTabIndex(): [number, (index: number) => void] {
  const tabIndex = useSelector((state: RootState) => state.agentdetail.tabIndex)
  const dispatch = useDispatch()
  const setTabIndex = useCallback(
    (index: number) => {
      dispatch(updateTabIndex(index))
    },
    [dispatch],
  )
  return [tabIndex, setTabIndex]
}

export function useIsCodeTaskType(agentDetailData: AgentDetailDataType): boolean {
  const { task_type } = agentDetailData
  return task_type === AGENT_TYPE.CODE_TASK || task_type === AGENT_TYPE.BACKTEST_TASK
}

export function useIsGeneratingCode(agentDetailData: AgentDetailDataType): boolean {
  const { generation_status } = agentDetailData
  const isCodeTaskType = useIsCodeTaskType(agentDetailData)
  return (
    (generation_status === GENERATION_STATUS.PENDING || generation_status === GENERATION_STATUS.GENERATING) &&
    isCodeTaskType
  )
}

export function useIsRunningBacktestAgent(
  agentDetailData: AgentDetailDataType,
  backtestData: BacktestDataType,
): boolean {
  const { task_type, generation_status } = agentDetailData
  const { status } = backtestData
  return (
    task_type === AGENT_TYPE.BACKTEST_TASK &&
    status === BACKTEST_STATUS.RUNNING &&
    generation_status === GENERATION_STATUS.SUCCESS
  )
}

export function useIsBinanceSupport(backtestData: BacktestDataType): boolean {
  const { symbol, coingecko_id } = backtestData
  const [binanceSymbols] = useBinanceSymbols()
  const propSymbol = useMemo(() => {
    return symbol.toUpperCase().replace('USDT', '')
  }, [symbol])
  const filterBinanceSymbols = binanceSymbols
    .filter((symbol: any) => symbol.quoteAsset === 'USDT')
    .map((symbol: any) => symbol.baseAsset)
  const isBinanceSupport = filterBinanceSymbols.includes(propSymbol)
  return isBinanceSupport && !coingecko_id
}
