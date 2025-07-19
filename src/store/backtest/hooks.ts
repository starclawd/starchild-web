import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateBacktestData, updateMobileBacktestType, updateTabIndex, updateTaskDetail } from './reducer'
import { useLazyGetBacktestDataQuery, useLazyGetTaskDetailQuery } from 'api/tradeai'
import {
  BACKTEST_STATUS,
  BacktestData,
  GENERATION_STATUS,
  MOBILE_BACKTEST_TYPE,
  TASK_STATUS,
  TASK_TYPE,
  TaskDetailType,
} from './backtest'

export function useMobileBacktestType(): [MOBILE_BACKTEST_TYPE, (isShow: MOBILE_BACKTEST_TYPE) => void] {
  const mobileBacktestType = useSelector((state: RootState) => state.backTest.mobileBacktestType)
  const dispatch = useDispatch()
  const setMobileBacktestType = useCallback(
    (isShow: MOBILE_BACKTEST_TYPE) => {
      dispatch(updateMobileBacktestType(isShow))
    },
    [dispatch],
  )
  return [mobileBacktestType, setMobileBacktestType]
}

const defaultBacktestData: BacktestData = {
  code: '',
  rule: '',
  period: '',
  details: [],
  final_value: '',
  requirement: '',
  sharpe_ratio: '',
  total_return_rates: '',
  funding_trends: [],
  maximum_drawdown_rates: '',
  maximum_drawdown_value: '',
  annualized_return_rates: '',
  symbol: '',
  win_rates: '',
  run_up: '',
  initial_value: '',
  profit_factor: '',
  trades_per_day: '',
  avg_losing_trade: '',
  avg_winning_trade: '',
  run_up_rates: '',
  error_msg: '',
  status: BACKTEST_STATUS.RUNNING,
}

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
          if (result) {
            setBacktestData({
              ...result,
              status: BACKTEST_STATUS.SUCCESS,
            } as BacktestData)
          } else {
            if (backtestResult.message) {
              setBacktestData({
                ...defaultBacktestData,
                status: BACKTEST_STATUS.FAILED,
                error_msg: backtestResult.message,
              } as BacktestData)
            } else {
              setBacktestData({
                ...defaultBacktestData,
                status: BACKTEST_STATUS.RUNNING,
              } as BacktestData)
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

export function useBacktestData(): [BacktestData, (data: BacktestData | null) => void] {
  const backtestData = useSelector((state: RootState) => state.backTest.backtestData)
  const dispatch = useDispatch()
  const setBacktestData = useCallback(
    (data: BacktestData | null) => {
      dispatch(updateBacktestData(data))
    },
    [dispatch],
  )
  return [backtestData || defaultBacktestData, setBacktestData]
}

export function useGetTaskDetail() {
  const [, setTaskDetail] = useTaskDetail()
  const [triggerGetTaskDetail] = useLazyGetTaskDetailQuery()
  return useCallback(
    async (taskId: string) => {
      try {
        const data = await triggerGetTaskDetail({ taskId })
        if (data.isSuccess) {
          setTaskDetail(data.data as TaskDetailType)
        }
        return data
      } catch (error) {
        return error
      }
    },
    [setTaskDetail, triggerGetTaskDetail],
  )
}

export function useTaskDetail(): [TaskDetailType, (data: TaskDetailType | null) => void] {
  const taskDetail = useSelector((state: RootState) => state.backTest.taskDetail)
  const dispatch = useDispatch()
  const setTaskDetail = useCallback(
    (data: TaskDetailType | null) => {
      dispatch(updateTaskDetail(data))
    },
    [dispatch],
  )
  return [
    taskDetail || {
      task_id: '',
      user_id: '',
      task_type: TASK_TYPE.AI_TASK,
      description: '',
      code: '',
      trigger_time: 0,
      status: TASK_STATUS.PENDING,
      created_at: 0,
      updated_at: 0,
      interval: 0,
      last_checked_at: 0,
      trigger_type: '',
      subscription_user_count: 0,
      user_name: '',
      condition_mode: '',
      trigger_history: [],
      tokens: '',
      title: '',
      user_avatar: '',
      id: 0,
      tags: '',
      category: '',
      display_user_name: '',
      display_user_avatar: '',
      code_description: '',
      generation_msg: '',
      generation_status: GENERATION_STATUS.PENDING,
      workflow: '',
    },
    setTaskDetail,
  ]
}

export function useTabIndex(): [number, (index: number) => void] {
  const tabIndex = useSelector((state: RootState) => state.backTest.tabIndex)
  const dispatch = useDispatch()
  const setTabIndex = useCallback(
    (index: number) => {
      dispatch(updateTabIndex(index))
    },
    [dispatch],
  )
  return [tabIndex, setTabIndex]
}

export function useIsCodeTaskType(): boolean {
  const [{ task_type }] = useTaskDetail()
  return task_type === TASK_TYPE.CODE_TASK || task_type === TASK_TYPE.BACKTEST_TASK
}

export function useIsGeneratingCode(): boolean {
  const [{ generation_status }] = useTaskDetail()
  const isCodeTaskType = useIsCodeTaskType()
  return generation_status === GENERATION_STATUS.PENDING && isCodeTaskType
}

export function useIsRunningBacktestTask(): boolean {
  const [{ task_type, generation_status }] = useTaskDetail()
  const [{ status }] = useBacktestData()
  return (
    task_type === TASK_TYPE.BACKTEST_TASK &&
    status === BACKTEST_STATUS.RUNNING &&
    generation_status === GENERATION_STATUS.SUCCESS
  )
}
