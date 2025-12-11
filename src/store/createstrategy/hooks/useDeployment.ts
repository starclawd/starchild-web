import { useCallback, useState } from 'react'
import { DeployModalStatus, DeployStepStatus } from '../createstrategy'
import {
  useCreateTradingAccountMutation,
  useDeployVaultContractMutation,
  useLazyGetStrategyDeployStatusQuery,
} from 'api/strategy'

const initialSteps: DeployStepStatus[] = [
  {
    stepNumber: 1,
    status: 'pending',
  },
  {
    stepNumber: 2,
    status: 'pending',
  },
  {
    stepNumber: 3,
    status: 'pending',
  },
]

export function useDeployment() {
  // 本地状态管理
  const [deployModalStatus, setDeployModalStatus] = useState<DeployModalStatus>('form')
  const [steps, setSteps] = useState<DeployStepStatus[]>(initialSteps)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  // API hooks
  const [createTradingAccount] = useCreateTradingAccountMutation()
  const [deployVaultContract] = useDeployVaultContractMutation()
  const [getDeployStatus] = useLazyGetStrategyDeployStatusQuery()

  // 设置模态框状态
  const setModalStatus = useCallback((status: DeployModalStatus) => {
    setDeployModalStatus(status)
  }, [])

  // 更新部署步骤状态
  const updateStepStatus = useCallback((stepNumber: number, status: DeployStepStatus['status'], message?: string) => {
    setSteps((prev) =>
      prev.map((step) => (step.stepNumber === stepNumber ? { ...step, status, ...(message && { message }) } : step)),
    )
  }, [])

  // 设置加载状态
  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  // 设置错误信息
  const setErrorMessage = useCallback((errorMessage: string | undefined) => {
    setError(errorMessage)
  }, [])

  // 重置部署步骤
  const resetSteps = useCallback(() => {
    setSteps(initialSteps)
    setCurrentStep(0)
    setError(undefined)
  }, [])

  // 执行步骤1: 创建交易账户
  const executeStep1 = useCallback(
    async (strategyId: string) => {
      try {
        setCurrentStep(1)
        updateStepStatus(1, 'in_progress', '正在创建交易账户...')

        const tradingAccountResponse = await createTradingAccount({
          strategy_id: strategyId,
        }).unwrap()

        if (tradingAccountResponse.success) {
          updateStepStatus(1, 'completed', '交易账户创建成功')
        } else {
          throw new Error(tradingAccountResponse.message || '创建交易账户失败')
        }
      } catch (error: any) {
        console.error('步骤1执行失败:', error)
        updateStepStatus(1, 'failed', error.message)
        setErrorMessage(error.message)
      }
    },
    [createTradingAccount, updateStepStatus, setErrorMessage],
  )

  // 执行步骤2: 存入保证金（合约调用）
  const executeStep2 = useCallback(async () => {
    try {
      setCurrentStep(2)
      updateStepStatus(2, 'in_progress', '正在存入保证金...')

      // TODO: 这里应该调用合约方法存入保证金
      // 暂时用延迟模拟合约调用
      await new Promise((resolve) => setTimeout(resolve, 2000))

      updateStepStatus(2, 'completed', '保证金存入完成')
    } catch (error: any) {
      console.error('步骤2执行失败:', error)
      updateStepStatus(2, 'failed', error.message)
      setErrorMessage(error.message)
    }
  }, [updateStepStatus, setErrorMessage])

  // 执行步骤3: 部署金库合约
  const executeStep3 = useCallback(
    async (strategyId: string, accountId: string) => {
      try {
        setCurrentStep(3)
        updateStepStatus(3, 'in_progress', '正在部署金库合约...')

        const contractResponse = await deployVaultContract({
          strategy_id: strategyId,
        }).unwrap()

        if (contractResponse.success) {
          updateStepStatus(3, 'completed', '金库合约部署成功')
          setCurrentStep(0) // 完成所有步骤
        } else {
          throw new Error(contractResponse.message || '金库合约部署失败')
        }
      } catch (error: any) {
        console.error('步骤3执行失败:', error)
        updateStepStatus(3, 'failed', error.message)
        setErrorMessage(error.message)
      }
    },
    [deployVaultContract, updateStepStatus, setErrorMessage],
  )

  // 查询部署状态
  const checkDeployStatus = useCallback(
    async (strategyId: string) => {
      try {
        const response = await getDeployStatus({
          strategy_id: strategyId,
        }).unwrap()

        // 根据返回的状态更新本地状态
        response.steps.forEach((step) => {
          updateStepStatus(step.step_number, step.status, step.message)
        })

        return response
      } catch (error) {
        console.error('查询部署状态失败:', error)
      }
    },
    [getDeployStatus, updateStepStatus],
  )

  return {
    // 状态
    deployModalStatus,
    steps,
    currentStep,
    isLoading,
    error,

    // Actions
    setModalStatus,
    updateStepStatus,
    setCurrentStep,
    setLoading,
    setError: setErrorMessage,
    resetSteps,

    // 部署流程
    executeStep1,
    executeStep2,
    executeStep3,
    checkDeployStatus,
  }
}
