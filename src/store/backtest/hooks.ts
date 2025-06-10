import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { updateBacktestData, updateIsShowPrice, updateKlineSubData, updateTaskDetail } from './reducer';
import { KlineSubDataType, KlineSubInnerDataType } from 'store/insights/insights.d';
import { useLazyGetBacktestDataQuery, useLazyGetTaskDetailQuery } from 'api/tradeai';
import { BacktestData, TASK_STATUS, TASK_TYPE, TaskDetailType } from './backtest';

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

export function useGetTaskDetail() {
  const [, setTaskDetail] = useTaskDetail()
  const [triggerGetTaskDetail] = useLazyGetTaskDetailQuery()
  return useCallback(async (taskId: string) => {
    try {
      const data = await triggerGetTaskDetail({ taskId })
      if (data.isSuccess) {
        setTaskDetail(data.data as TaskDetailType)
      }
      return data
    } catch (error) {
      return error
    }
  }, [setTaskDetail, triggerGetTaskDetail])
}

export function useTaskDetail(): [TaskDetailType, (data: TaskDetailType | null) => void] {
  const taskDetail = useSelector((state: RootState) => state.backTest.taskDetail)
  const dispatch = useDispatch()
  const setTaskDetail = useCallback((data: TaskDetailType | null) => {
    dispatch(updateTaskDetail(data))
  }, [dispatch])
  return [taskDetail || {
    task_id: '',
    user_id: '',
    task_type: TASK_TYPE.AI_TASK,
    description: '',
    code: '',
    trigger_time: '',
    status: TASK_STATUS.PENDING,
    created_at: '',
    updated_at: '',
    interval: 0,
    last_checked_at: '',
    trigger_type: '',
    subscription_user_count: 0,
    user_name: '',
    condition_mode: '',
    trigger_history: '[]',
    tokens: '',
  }, setTaskDetail]
}