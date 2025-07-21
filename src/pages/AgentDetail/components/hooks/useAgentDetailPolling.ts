import { useCallback, useEffect, useRef, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import {
  useBacktestData,
  useGetBacktestData,
  useGetAgentDetail,
  useIsCodeTaskType,
  useAgentDetailData,
} from 'store/agentdetail/hooks'
import { BACKTEST_STATUS, GENERATION_STATUS, AGENT_TYPE } from 'store/agentdetail/agentdetail'

export function useAgentDetailPolling() {
  const { taskId, agentId } = useParsedQueryString()
  const triggerGetAgentDetail = useGetAgentDetail()
  const triggerGetBacktestData = useGetBacktestData()
  const [{ status }] = useBacktestData()
  const isCodeTaskType = useIsCodeTaskType()
  const [{ generation_status, task_type }] = useAgentDetailData()

  const [isLoading, setIsLoading] = useState(false)
  const pollingTimer = useRef<NodeJS.Timeout | null>(null)
  const backtestPollingTimer = useRef<NodeJS.Timeout | null>(null)

  const getTaskDetail = useCallback(
    async (showLoading = false) => {
      if (!taskId && !agentId) return

      try {
        if (showLoading) {
          setIsLoading(true)
        }
        const data = await triggerGetAgentDetail(agentId || taskId || '')
        if (!(data as any).isSuccess) {
          if (showLoading) {
            setIsLoading(false)
          }
        } else {
          if (showLoading) {
            setIsLoading(false)
          }
        }
      } catch (error) {
        if (showLoading) {
          setIsLoading(false)
        }
      }
    },
    [taskId, agentId, triggerGetAgentDetail],
  )

  const getBackTestData = useCallback(async () => {
    try {
      if (taskId || agentId) {
        await triggerGetBacktestData(agentId || taskId || '')
      }
    } catch (error) {
      console.error(error)
    }
  }, [taskId, agentId, triggerGetBacktestData])

  const startPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
    }

    pollingTimer.current = setInterval(() => {
      getTaskDetail(false) // 轮询时不显示loading
    }, 5000) // 5秒轮询一次
  }, [getTaskDetail])

  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
      pollingTimer.current = null
    }
  }, [])

  const startBacktestPolling = useCallback(() => {
    if (backtestPollingTimer.current) {
      clearInterval(backtestPollingTimer.current)
    }

    backtestPollingTimer.current = setInterval(() => {
      getBackTestData() // 轮询获取回测数据
    }, 5000) // 5秒轮询一次
  }, [getBackTestData])

  const stopBacktestPolling = useCallback(() => {
    if (backtestPollingTimer.current) {
      clearInterval(backtestPollingTimer.current)
      backtestPollingTimer.current = null
    }
  }, [])

  // 初始加载
  useEffect(() => {
    getTaskDetail(true) // 初始加载时显示loading
  }, [getTaskDetail])

  useEffect(() => {
    getBackTestData()
  }, [getBackTestData])

  // 根据generation_status控制轮询
  useEffect(() => {
    if (generation_status === GENERATION_STATUS.PENDING && isCodeTaskType) {
      startPolling()
    } else {
      stopPolling()
    }

    // 清理函数：组件卸载时清除定时器
    return () => {
      stopPolling()
    }
  }, [generation_status, isCodeTaskType, startPolling, stopPolling])
  // 根据backtestData.symbol和generation_status控制回测数据轮询
  useEffect(() => {
    if (
      status === BACKTEST_STATUS.RUNNING &&
      generation_status === GENERATION_STATUS.SUCCESS &&
      task_type === AGENT_TYPE.BACKTEST_TASK
    ) {
      startBacktestPolling()
    } else {
      stopBacktestPolling()
    }

    // 清理函数：组件卸载时清除定时器
    return () => {
      stopBacktestPolling()
    }
  }, [status, generation_status, startBacktestPolling, stopBacktestPolling, task_type])

  return {
    isLoading,
    getTaskDetail,
    getBackTestData,
  }
}
