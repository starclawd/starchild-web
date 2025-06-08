import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { updateBacktestData, updateIsShowPrice, updateKlineSubData } from './reducer';
import { KlineSubDataType, KlineSubInnerDataType } from 'store/insights/insights.d';
import { useLazyGetBacktestDataQuery } from 'api/tradeai';
import { BacktestData } from './backtest';

export function useIsShowPrice(): [boolean, (isShow: boolean) => void] {
  const isShowPrice = useSelector((state: RootState) => state.backTest.isShowPrice)
  const dispatch = useDispatch()
  const setIsShowPrice = useCallback((isShow: boolean) => {
    dispatch(updateIsShowPrice(isShow))
  }, [dispatch])
  return [isShowPrice, setIsShowPrice]
}

export function useKlineSubData(): [KlineSubInnerDataType, (data: KlineSubDataType | null) => void] {
  const klineSubData = useSelector((state: RootState) => state.backTest.klineSubData)
  const dispatch = useDispatch()
  const setKlineSubData = useCallback((data: KlineSubDataType | null) => {
    dispatch(updateKlineSubData(data))
  }, [dispatch])
  return [klineSubData?.data as KlineSubInnerDataType, setKlineSubData]
}


export function useGetBacktestData() {
  const [, setBacktestData] = useBacktestData()
  const [triggerGetBacktestData] = useLazyGetBacktestDataQuery()
  return useCallback(async (taskId: string) => {
    try {
      const data = await triggerGetBacktestData({ taskId })
      if (data.isSuccess) {
        setBacktestData((data.data as any).backtest_result.result as BacktestData)
      }
      return data
    } catch (error) {
      return error
    }
  }, [setBacktestData, triggerGetBacktestData])
}

export function useBacktestData(): [BacktestData, (data: BacktestData | null) => void] {
  const backtestData = useSelector((state: RootState) => state.backTest.backtestData)
  const dispatch = useDispatch()
  const setBacktestData = useCallback((data: BacktestData | null) => {
    dispatch(updateBacktestData(data))
  }, [dispatch])
  return [backtestData || {
    code: '',
    rule: '',
    period: '',
    details: [],
    final_value: '',
    requirement: '',
    sharpe_ratio: '',
    total_return: '',
    funding_trends: [],
    maximum_drawdown: '',
    symbol: '',
    win_rates: '',
  }, setBacktestData]
}