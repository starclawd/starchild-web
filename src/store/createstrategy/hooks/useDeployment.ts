import { useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DEPLOYING_STATUS, STRATEGY_STATUS, DEPLOY_MODAL_STATUS } from '../createstrategy'
import {
  updateDeployingStatus,
  updateDeployModalStatus,
  updateDeployIsLoading,
  updateDeployError,
  updateDeployEnablePolling,
  updateDeployStrategyStatus,
  updateDeployCheckStatusLoading,
} from '../reducer'
import { RootState } from 'store'
import {
  useEntryLiveDeployingMutation,
  useDeployVaultContractMutation,
  useLazyGetStrategyDeployStatusQuery,
  useGetStrategyDeployStatusQuery,
} from 'api/createStrategy'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'
import { useIsLogin } from 'store/login/hooks'

export function useDeployment(strategyId: string) {
  const dispatch = useDispatch()
  const toast = useToast()
  const theme = useTheme()
  const isLogin = useIsLogin()
  // Redux 状态 - 确保所有组件共享同一状态实例
  const deployingStatus = useSelector((state: RootState) => state.createstrategy.deployingStatus)
  const deployModalStatus = useSelector((state: RootState) => state.createstrategy.deployModalStatus)
  const isLoading = useSelector((state: RootState) => state.createstrategy.deployIsLoading)
  const error = useSelector((state: RootState) => state.createstrategy.deployError)
  const enablePolling = useSelector((state: RootState) => state.createstrategy.deployEnablePolling)
  const strategyStatus = useSelector((state: RootState) => state.createstrategy.deployStrategyStatus)
  const checkDeployStatusLoading = useSelector((state: RootState) => state.createstrategy.deployCheckStatusLoading)

  // 判断是否需要轮询：有策略ID且处于部署中的状态
  const shouldPoll = enablePolling && strategyId && deployingStatus !== DEPLOYING_STATUS.DEPLOYING_SUCCESS

  // API hooks
  const [entryLiveDeploying] = useEntryLiveDeployingMutation()
  const [deployVaultContract] = useDeployVaultContractMutation()
  const [getDeployStatus] = useLazyGetStrategyDeployStatusQuery()

  // deploy status polling
  const { data: deployStatusData } = useGetStrategyDeployStatusQuery(
    { strategy_id: strategyId },
    {
      skip: !shouldPoll || !isLogin, // 不满足条件时跳过查询
      pollingInterval: 10000, // 10秒轮询一次
      refetchOnMountOrArgChange: true,
    },
  )

  // 设置模态框状态
  const setModalStatus = useCallback(
    (status: DEPLOY_MODAL_STATUS) => {
      dispatch(updateDeployModalStatus(status))
    },
    [dispatch],
  )

  // 更新部署状态
  const setDeployingStatus = useCallback(
    (status: DEPLOYING_STATUS) => {
      dispatch(updateDeployingStatus(status))
    },
    [dispatch],
  )

  // 设置加载状态
  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(updateDeployIsLoading(loading))
    },
    [dispatch],
  )

  // 设置错误信息
  const setErrorMessage = useCallback(
    (errorMessage: string | undefined) => {
      dispatch(updateDeployError(errorMessage))
    },
    [dispatch],
  )

  // 重置部署状态
  const resetDeployingStatus = useCallback(() => {
    dispatch(updateDeployingStatus(DEPLOYING_STATUS.NONE))
    dispatch(updateDeployError(undefined))
    dispatch(updateDeployEnablePolling(false))
  }, [dispatch])

  // 开启轮询
  const startPolling = useCallback(() => {
    console.log('startPolling')
    dispatch(updateDeployEnablePolling(true))
  }, [dispatch])

  // 停止轮询
  const stopPolling = useCallback(() => {
    dispatch(updateDeployEnablePolling(false))
  }, [dispatch])

  // 监听轮询结果，自动更新部署状态
  useEffect(() => {
    if (deployStatusData) {
      // deploy_status 直接对应 DEPLOYING_STATUS 枚举值
      const deployStatus = deployStatusData.data.deploy_status || DEPLOYING_STATUS.NONE

      setDeployingStatus(deployStatus)

      // 如果部署完成或失败，自动停止轮询并设置模态框状态
      if (deployStatus === DEPLOYING_STATUS.DEPLOYING_SUCCESS) {
        dispatch(updateDeployEnablePolling(false))
        setModalStatus(DEPLOY_MODAL_STATUS.DEPLOYING_SUCCESS)
      } else if (deployStatus === DEPLOYING_STATUS.DEPLOYING) {
        setModalStatus(DEPLOY_MODAL_STATUS.DEPLOYING)
      } else if (deployStatus === DEPLOYING_STATUS.DEPLOYING_FAILED) {
        dispatch(updateDeployEnablePolling(false))
        setModalStatus(DEPLOY_MODAL_STATUS.DEPLOYING_FAILED)
      }
    }
  }, [deployStatusData, dispatch, setDeployingStatus, setModalStatus])

  // 执行步骤3: 部署金库合约
  const deployVault = useCallback(
    async (strategyId: string) => {
      try {
        setDeployingStatus(DEPLOYING_STATUS.DEPLOYING)

        const contractResponse = await deployVaultContract({
          strategy_id: strategyId,
        }).unwrap()

        if (contractResponse.status === 'success') {
          // 异步的，此时只是部署请求成功，所以状态依旧是IN_PROGRESS
          setDeployingStatus(DEPLOYING_STATUS.DEPLOYING)

          // 显示成功 toast
          toast({
            title: 'Deployment in progress. Please wait.',
            description: '',
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-send',
            iconTheme: theme.black0,
          })
        } else {
          setDeployingStatus(DEPLOYING_STATUS.DEPLOYING_FAILED)
        }
      } catch (error: any) {
        console.error('步骤3执行失败:', error)
        setDeployingStatus(DEPLOYING_STATUS.DEPLOYING_FAILED)
        setErrorMessage(error.message)
      }
    },
    [deployVaultContract, setDeployingStatus, setErrorMessage, toast, theme],
  )

  // 查询部署状态
  const checkDeployStatus = useCallback(
    async (strategyId: string) => {
      try {
        if (!isLogin) return
        dispatch(updateDeployCheckStatusLoading(true))
        const response = await getDeployStatus({
          strategy_id: strategyId,
        }).unwrap()

        // deploy_status 直接对应 DEPLOYING_STATUS 枚举值
        const deployStatus = response.data.deploy_status || DEPLOYING_STATUS.NONE
        setDeployingStatus(deployStatus)

        // 设置策略状态，使用 response.data.status
        if (response.data.status) {
          dispatch(updateDeployStrategyStatus(response.data.status as STRATEGY_STATUS))
        }

        return response
      } catch (error) {
        console.error('查询部署状态失败:', error)
      } finally {
        dispatch(updateDeployCheckStatusLoading(false))
      }
    },
    [getDeployStatus, dispatch, setDeployingStatus, isLogin],
  )

  // 进入实盘部署状态
  const enterLiveDeploying = useCallback(
    async (strategyId: string) => {
      try {
        const response = await entryLiveDeploying({
          strategy_id: strategyId,
        }).unwrap()

        if (response.status === 'success' && response.data.success) {
          return true
        } else {
          throw new Error('进入实盘部署状态失败')
        }
      } catch (error: any) {
        console.error('进入实盘部署状态失败:', error)
        throw error
      }
    },
    [entryLiveDeploying],
  )

  return {
    // 状态
    strategyId,
    deployModalStatus,
    deployingStatus,
    strategyStatus,
    isLoading,
    error,
    enablePolling,
    shouldPoll,
    checkDeployStatusLoading,

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
    enterLiveDeploying,
    deployVault,
    checkDeployStatus,
  }
}

export function useIsStep3Deploying(strategyId: string): boolean {
  const { deployingStatus } = useDeployment(strategyId)
  return useMemo(() => {
    return (
      deployingStatus === DEPLOYING_STATUS.DEPLOYING ||
      deployingStatus === DEPLOYING_STATUS.DEPLOYING_SUCCESS ||
      deployingStatus === DEPLOYING_STATUS.DEPLOYING_FAILED
    )
  }, [deployingStatus])
}
