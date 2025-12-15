import { useCallback, useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { DeployModalStatus, DEPLOYING_STATUS, STRATEGY_STATUS } from '../createstrategy'
import {
  updateDeployingStatus,
  updateDeployModalStatus,
  updateDeployIsLoading,
  updateDeployError,
  updateDeployEnablePolling,
  updateDeployStrategyStatus,
  updateDeployCheckStatusLoading,
  updateTradingAccountInfo,
} from '../reducer'
import { RootState } from 'store'
import {
  useEntryLiveDeployingMutation,
  useCreateTradingAccountMutation,
  useConfirmDepositMutation,
  useDeployVaultContractMutation,
  useLazyGetStrategyDeployStatusQuery,
  useGetStrategyDeployStatusQuery,
} from 'api/createStrategy'
import { Address, keccak256 } from 'viem'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useVaultDepositTo, useVaultGetDepositFee } from 'hooks/contract/useVaultContract'
import { useUsdcAllowance, useUsdcApprove } from 'hooks/contract/useUsdcContract'
import { VAULT_CONTRACT_ADDRESSES } from 'constants/brokerHash'
import { getChainInfo, CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { useSleep } from 'hooks/useSleep'
import { isPro } from 'utils/url'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'
import useParsedQueryString from 'hooks/useParsedQueryString'

export function useDeployment() {
  const { strategyId } = useParsedQueryString()
  const dispatch = useDispatch()
  const { address: account } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const { sleep } = useSleep()
  const toast = useToast()
  const theme = useTheme()

  // Redux 状态 - 确保所有组件共享同一状态实例
  const deployingStatus = useSelector((state: RootState) => state.createstrategy.deployingStatus)
  const deployModalStatus = useSelector((state: RootState) => state.createstrategy.deployModalStatus)
  const isLoading = useSelector((state: RootState) => state.createstrategy.deployIsLoading)
  const error = useSelector((state: RootState) => state.createstrategy.deployError)
  const enablePolling = useSelector((state: RootState) => state.createstrategy.deployEnablePolling)
  const strategyStatus = useSelector((state: RootState) => state.createstrategy.deployStrategyStatus)
  const checkDeployStatusLoading = useSelector((state: RootState) => state.createstrategy.deployCheckStatusLoading)
  const tradingAccountInfo = useSelector((state: RootState) => state.createstrategy.tradingAccountInfo)

  // 获取链信息和USDC地址
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const usdcAddress = chainInfo?.usdcContractAddress as Address | undefined

  // 根据环境获取vault合约地址
  const vaultContractAddress = useMemo(() => {
    // return VAULT_CONTRACT_ADDRESSES.production
    return isPro ? VAULT_CONTRACT_ADDRESSES.production : VAULT_CONTRACT_ADDRESSES.test
  }, []) as Address

  // USDC 合约相关
  const decimals = 6 // EVM USDC decimals 写死为 6
  const approveUsdc = useUsdcApprove()
  const { allowance, refetch: refetchAllowance } = useUsdcAllowance(account as Address, vaultContractAddress)
  // 使用步骤1返回的账户信息，如果还没有则使用默认值
  const depositData = useMemo(
    () => ({
      accountId: tradingAccountInfo?.accountId as `0x${string}`,
      brokerHash: tradingAccountInfo?.brokerHash as `0x${string}`,
      tokenHash: keccak256(usdcAddress as `0x${string}`),
      tokenAmount: BigInt(1000000), // 这里需要实际的金额，暂时写死 1 USDC
    }),
    [tradingAccountInfo, usdcAddress],
  )

  const { depositTo } = useVaultDepositTo({
    contractAddress: vaultContractAddress,
    receiver: account as Address,
    data: depositData,
  })

  // 获取存款手续费
  const { depositFee } = useVaultGetDepositFee({
    contractAddress: vaultContractAddress,
    receiver: account as Address,
    data: depositData,
    enabled: !!vaultContractAddress && !!account && !!tradingAccountInfo,
  })

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
  const [entryLiveDeploying] = useEntryLiveDeployingMutation()
  const [createTradingAccount] = useCreateTradingAccountMutation()
  const [confirmDeposit] = useConfirmDepositMutation()
  const [deployVaultContract] = useDeployVaultContractMutation()
  const [getDeployStatus] = useLazyGetStrategyDeployStatusQuery()

  // deploy status polling
  const { data: deployStatusData } = useGetStrategyDeployStatusQuery(
    { strategy_id: strategyId! },
    {
      skip: !shouldPoll, // 不满足条件时跳过查询
      pollingInterval: 10000, // 10秒轮询一次
      refetchOnMountOrArgChange: true,
    },
  )

  // 设置模态框状态
  const setModalStatus = useCallback(
    (status: DeployModalStatus) => {
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

      // 如果部署完成或失败，自动停止轮询
      if (
        deployStatus === DEPLOYING_STATUS.STEP3_SUCCESS ||
        deployStatus === DEPLOYING_STATUS.STEP1_FAILED ||
        deployStatus === DEPLOYING_STATUS.STEP2_FAILED ||
        deployStatus === DEPLOYING_STATUS.STEP3_FAILED
      ) {
        dispatch(updateDeployEnablePolling(false))
      }
    }
  }, [deployStatusData, dispatch, setDeployingStatus])

  // 执行步骤1: 创建交易账户
  const executeStep1 = useCallback(
    async (strategyId: string) => {
      try {
        setDeployingStatus(DEPLOYING_STATUS.STEP1_IN_PROGRESS)

        // 检查当前网络是否支持
        if (!chainId) {
          throw new Error('请连接钱包')
        }

        const numericChainId = Number(chainId)
        const supportedChain = CHAIN_ID_TO_CHAIN[numericChainId]

        if (!supportedChain) {
          toast({
            title: '错误网络',
            description: '请切换到支持的网络',
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-chat-close',
            iconTheme: theme.red100,
          })
          throw new Error('不支持的网络')
        }

        const tradingAccountResponse = await createTradingAccount({
          strategy_id: strategyId,
          chainType: 'ethereum',
          chainId: chainId.toString(),
        }).unwrap()

        if (tradingAccountResponse.status === 'success') {
          // 保存交易账户信息到 Redux，确保组件间状态同步
          dispatch(
            updateTradingAccountInfo({
              accountId: tradingAccountResponse.data.accountId as `0x${string}`,
              brokerHash: tradingAccountResponse.data.brokerHash as `0x${string}`,
            }),
          )
          setDeployingStatus(DEPLOYING_STATUS.STEP1_SUCCESS)
        } else {
          throw new Error('创建交易账户失败')
        }
      } catch (error: any) {
        console.error('步骤1执行失败:', error)
        setDeployingStatus(DEPLOYING_STATUS.STEP1_FAILED)
        setErrorMessage(error.message)
      }
    },
    [createTradingAccount, dispatch, setDeployingStatus, setErrorMessage, chainId, toast, theme],
  )

  // 执行步骤2: 存入保证金（合约调用）
  const executeStep2 = useCallback(async () => {
    console.log('executeStep2', account, usdcAddress, vaultContractAddress, decimals)
    if (!account || !usdcAddress || !vaultContractAddress || !decimals) {
      throw new Error('缺少必要的参数')
    }

    try {
      setDeployingStatus(DEPLOYING_STATUS.STEP2_IN_PROGRESS)

      // 存入金额：1 USDC (根据实际需求修改)
      const depositAmount = BigInt(1) * BigInt(10 ** decimals) // 1 USDC

      // 检查是否需要授权
      const needsApproval = allowance !== undefined && allowance < depositAmount
      console.log('needsApproval', needsApproval, allowance, depositAmount)

      if (needsApproval) {
        console.log('开始授权 USDC...', vaultContractAddress, depositAmount)
        await approveUsdc(vaultContractAddress, depositAmount)
        await sleep(2000)
        await refetchAllowance()
        console.log('USDC 授权完成')
      }

      console.log('开始存入保证金...', depositAmount)

      // 执行 depositTo
      const txHash = await depositTo()

      console.log('存入保证金交易已提交，txHash:', txHash)

      // 调用确认存款接口
      if (strategyId) {
        try {
          await confirmDeposit({
            strategy_id: strategyId,
            txid: txHash,
            chainId: chainId?.toString() || '',
            usdc: 1000, // 存入的 USDC 数量
          }).unwrap()
          console.log('存款确认接口调用成功')
        } catch (confirmError: any) {
          console.error('存款确认接口调用失败:', confirmError)
          // 这里不抛出错误，因为合约交易已经成功，只是确认接口失败
        }
      } else {
        console.warn('没有 strategyId，跳过存款确认接口调用')
      }

      // 等待 2 秒后同步
      await sleep(2000)

      console.log('存入保证金完成，txHash:', txHash)

      setDeployingStatus(DEPLOYING_STATUS.STEP2_SUCCESS)
    } catch (error: any) {
      console.error('步骤2执行失败:', error)
      setDeployingStatus(DEPLOYING_STATUS.STEP2_FAILED)
      setErrorMessage(error.message)
    }
  }, [
    account,
    usdcAddress,
    vaultContractAddress,
    decimals,
    allowance,
    approveUsdc,
    depositTo,
    sleep,
    refetchAllowance,
    setDeployingStatus,
    setErrorMessage,
    confirmDeposit,
    strategyId,
    chainId,
  ])

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

        // 从 extra.deploy 中提取 tradingAccountInfo，保存到 Redux
        if (response.data.extra?.deploy) {
          const deployInfo = response.data.extra.deploy
          dispatch(
            updateTradingAccountInfo({
              accountId: deployInfo.accountId as `0x${string}`,
              brokerHash: deployInfo.brokerHash as `0x${string}`,
            }),
          )
        }

        return response
      } catch (error) {
        console.error('查询部署状态失败:', error)
      } finally {
        dispatch(updateDeployCheckStatusLoading(false))
      }
    },
    [getDeployStatus, dispatch, setDeployingStatus],
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
    executeStep1,
    executeStep2,
    executeStep3,
    checkDeployStatus,
  }
}
