import { useCallback, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DeployModalStatus, DEPLOYING_STATUS } from '../createstrategy'
import { updateDeployingStatus } from '../reducer'
import { RootState } from 'store'
import {
  useCreateTradingAccountMutation,
  useDeployVaultContractMutation,
  useLazyGetStrategyDeployStatusQuery,
  useGetStrategyDeployStatusQuery,
} from 'api/createStrategy'

export function useDeployment(strategyId: string) {
  const dispatch = useDispatch()

  // Redux 状态
  const deployingStatus = useSelector((state: RootState) => state.createstrategy.deployingStatus)

  // 本地状态管理
  const [deployModalStatus, setDeployModalStatus] = useState<DeployModalStatus>('form')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [enablePolling, setEnablePolling] = useState<boolean>(false)

  // 判断是否需要轮询：有策略ID且处于部署中的状态
  const shouldPoll =
    enablePolling &&
    strategyId &&
    deployingStatus !== DEPLOYING_STATUS.NONE &&
    deployingStatus !== DEPLOYING_STATUS.STEP3_SUCCESS &&
    deployingStatus !== DEPLOYING_STATUS.STEP1_FAILED &&
    deployingStatus !== DEPLOYING_STATUS.STEP2_FAILED &&
    deployingStatus !== DEPLOYING_STATUS.STEP3_FAILED

  // API hooks
  const [createTradingAccount] = useCreateTradingAccountMutation()
  const [deployVaultContract] = useDeployVaultContractMutation()
  const [getDeployStatus] = useLazyGetStrategyDeployStatusQuery()

  // RTK Query 轮询查询
  const { data: deployStatusData } = useGetStrategyDeployStatusQuery(
    { strategy_id: strategyId! },
    {
      skip: !shouldPoll, // 不满足条件时跳过查询
      pollingInterval: 10000, // 10秒轮询一次
      refetchOnMountOrArgChange: true,
    },
  )

  // 设置模态框状态
  const setModalStatus = useCallback((status: DeployModalStatus) => {
    setDeployModalStatus(status)
  }, [])

  // 更新部署状态
  const setDeployingStatus = useCallback(
    (status: DEPLOYING_STATUS) => {
      dispatch(updateDeployingStatus(status))
    },
    [dispatch],
  )

  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  // 设置错误信息
  const setErrorMessage = useCallback((errorMessage: string | undefined) => {
    setError(errorMessage)
  }, [])

  // 重置部署状态
  const resetDeployingStatus = useCallback(() => {
    setDeployingStatus(DEPLOYING_STATUS.NONE)
    setError(undefined)
    setEnablePolling(false)
  }, [setDeployingStatus])

  // 开启轮询
  const startPolling = useCallback(() => {
    setEnablePolling(true)
  }, [])

  // 停止轮询
  const stopPolling = useCallback(() => {
    setEnablePolling(false)
  }, [])

  // 监听轮询结果，自动更新部署状态
  useEffect(() => {
    if (deployStatusData) {
      setDeployingStatus(deployStatusData.overall_status)

      // 如果部署完成或失败，自动停止轮询
      if (
        deployStatusData.overall_status === DEPLOYING_STATUS.STEP3_SUCCESS ||
        deployStatusData.overall_status === DEPLOYING_STATUS.STEP1_FAILED ||
        deployStatusData.overall_status === DEPLOYING_STATUS.STEP2_FAILED ||
        deployStatusData.overall_status === DEPLOYING_STATUS.STEP3_FAILED
      ) {
        setEnablePolling(false)
      }
    }
  }, [deployStatusData, setDeployingStatus])

  // 执行步骤1: 创建交易账户
  const executeStep1 = useCallback(
    async (strategyId: string) => {
      try {
        setDeployingStatus(DEPLOYING_STATUS.STEP1_IN_PROGRESS)

        const tradingAccountResponse = await createTradingAccount({
          strategy_id: strategyId,
        }).unwrap()

        if (tradingAccountResponse.success) {
          setDeployingStatus(DEPLOYING_STATUS.STEP1_SUCCESS)
        } else {
          throw new Error(tradingAccountResponse.message || '创建交易账户失败')
        }
      } catch (error: any) {
        console.error('步骤1执行失败:', error)
        setDeployingStatus(DEPLOYING_STATUS.STEP1_FAILED)
        setErrorMessage(error.message)
      }
    },
    [createTradingAccount, setDeployingStatus, setErrorMessage],
  )

  // 执行步骤2: 存入保证金（合约调用）
  const executeStep2 = useCallback(async () => {
    try {
      setDeployingStatus(DEPLOYING_STATUS.STEP2_IN_PROGRESS)

      // TODO: 这里应该调用合约方法存入保证金
      // 暂时用延迟模拟合约调用
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setDeployingStatus(DEPLOYING_STATUS.STEP2_SUCCESS)
    } catch (error: any) {
      console.error('步骤2执行失败:', error)
      setDeployingStatus(DEPLOYING_STATUS.STEP2_FAILED)
      setErrorMessage(error.message)
    }
  }, [setDeployingStatus, setErrorMessage])

  // 执行步骤3: 部署金库合约
  const executeStep3 = useCallback(
    async (strategyId: string) => {
      try {
        setDeployingStatus(DEPLOYING_STATUS.STEP3_IN_PROGRESS)

        const contractResponse = await deployVaultContract({
          strategy_id: strategyId,
        }).unwrap()

        if (contractResponse.success) {
          setDeployingStatus(DEPLOYING_STATUS.STEP3_SUCCESS)
        } else {
          throw new Error(contractResponse.message || '金库合约部署失败')
        }
      } catch (error: any) {
        console.error('步骤3执行失败:', error)
        setDeployingStatus(DEPLOYING_STATUS.STEP3_FAILED)
        setErrorMessage(error.message)
      }
    },
    [deployVaultContract, setDeployingStatus, setErrorMessage],
  )

  // 查询部署状态
  const checkDeployStatus = useCallback(
    async (strategyId: string) => {
      try {
        const response = await getDeployStatus({
          strategy_id: strategyId,
        }).unwrap()

        // 直接设置部署状态
        setDeployingStatus(response.overall_status)

        return response
      } catch (error) {
        console.error('查询部署状态失败:', error)
      }
    },
    [getDeployStatus, setDeployingStatus],
  )

  return {
    // 状态
    deployModalStatus,
    deployingStatus,
    isLoading,
    error,
    enablePolling,
    shouldPoll,

    // Actions
    setModalStatus,
    setDeployingStatus,
    setLoading,
    setError: setErrorMessage,
    resetDeployingStatus,

    // 轮询控制
    startPolling,
    stopPolling,

    // 部署流程
    executeStep1,
    executeStep2,
    executeStep3,
    checkDeployStatus,
  }
}
