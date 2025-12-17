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
  updateDeployChainId,
  updateDeployTxid,
} from '../reducer'
import { RootState } from 'store'
import {
  useEntryLiveDeployingMutation,
  useCreateTradingAccountMutation,
  useConfirmDepositMutation,
  useDeployVaultContractMutation,
  useLazyGetStrategyDeployStatusQuery,
  useGetStrategyDeployStatusQuery,
  useGetWalletInfoQuery,
  useLazyGetWalletInfoQuery,
} from 'api/createStrategy'
import { Address, keccak256 } from 'viem'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useVaultDepositTo, useVaultGetDepositFee } from 'hooks/contract/useVaultContract'
import { useUsdcAllowance, useUsdcApprove } from 'hooks/contract/useUsdcContract'
import { USDC_HASH, VAULT_CONTRACT_ADDRESSES } from 'constants/vaultContractInfo'
import { getChainInfo, CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { useSleep } from 'hooks/useSleep'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'styled-components'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { isPro } from 'utils/url'

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
  const deployChainId = useSelector((state: RootState) => state.createstrategy.deployChainId)
  const deployTxid = useSelector((state: RootState) => state.createstrategy.deployTxid)

  // 获取链信息和USDC地址
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const usdcAddress = chainInfo?.usdcContractAddress as Address | undefined

  // 根据环境获取vault合约地址
  const vaultContractAddress = useMemo(() => {
    return isPro ? VAULT_CONTRACT_ADDRESSES.production : VAULT_CONTRACT_ADDRESSES.test
  }, []) as `0x${string}`

  // USDC 合约相关
  const tokenAmount = useMemo(() => {
    return isPro ? BigInt(1000000000) : BigInt(1000000)
  }, [])
  const decimals = 6 // EVM USDC decimals 写死为 6
  const approveUsdc = useUsdcApprove()
  const { allowance, refetch: refetchAllowance } = useUsdcAllowance(account as Address, vaultContractAddress)
  // 使用步骤1返回的账户信息，如果还没有则使用默认值
  const depositData = useMemo(
    () => ({
      accountId: tradingAccountInfo?.accountId as `0x${string}`,
      brokerHash: tradingAccountInfo?.brokerHash as `0x${string}`,
      tokenHash: USDC_HASH,
      tokenAmount,
    }),
    [tradingAccountInfo, tokenAmount],
  )

  // 获取存款手续费
  const {
    depositFee,
    isLoading: isFeeLoading,
    isError: isFeeError,
    error: feeError,
    refetch: refetchDepositFee,
  } = useVaultGetDepositFee({
    contractAddress: vaultContractAddress,
    receiver: tradingAccountInfo?.walletAddress as Address,
    data: depositData,
    enabled: !!vaultContractAddress && !!tradingAccountInfo && !!tradingAccountInfo.walletAddress,
  })

  const { depositTo } = useVaultDepositTo({
    contractAddress: vaultContractAddress,
    receiver: tradingAccountInfo?.walletAddress as Address,
    data: depositData,
    value: depositFee ?? BigInt('5000000000000000'), // 传入手续费作为 ETH 值，失败时使用预估值 0.005 ETH
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

  // 判断是否需要wallet信息轮询：在特定状态下启动
  const shouldPollWallet =
    enablePolling &&
    strategyId &&
    (deployingStatus === DEPLOYING_STATUS.STEP1_SUCCESS || // account_initialized
      deployingStatus === DEPLOYING_STATUS.STEP2_IN_PROGRESS || // deposit_confirming
      deployingStatus === DEPLOYING_STATUS.STEP2_FAILED) // failed_deposit

  // API hooks
  const [entryLiveDeploying] = useEntryLiveDeployingMutation()
  const [createTradingAccount] = useCreateTradingAccountMutation()
  const [confirmDeposit] = useConfirmDepositMutation()
  const [deployVaultContract] = useDeployVaultContractMutation()
  const [getDeployStatus] = useLazyGetStrategyDeployStatusQuery()
  const [getWalletInfo] = useLazyGetWalletInfoQuery()

  // deploy status polling
  const { data: deployStatusData } = useGetStrategyDeployStatusQuery(
    { strategy_id: strategyId! },
    {
      skip: !shouldPoll, // 不满足条件时跳过查询
      pollingInterval: 10000, // 10秒轮询一次
      refetchOnMountOrArgChange: true,
    },
  )

  // wallet info polling
  const { data: walletInfoData } = useGetWalletInfoQuery(
    { strategy_id: strategyId! },
    {
      skip: !shouldPollWallet, // 不满足条件时跳过查询
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
      dispatch(updateDeployChainId(deployStatusData.data.chainId || null))
      dispatch(updateDeployTxid(deployStatusData.data.txid || null))

      // 如果部署完成或失败，自动停止轮询并设置模态框状态
      if (deployStatus === DEPLOYING_STATUS.STEP3_SUCCESS) {
        dispatch(updateDeployEnablePolling(false))
        setModalStatus('success')
      } else if (deployStatus === DEPLOYING_STATUS.STEP3_FAILED) {
        dispatch(updateDeployEnablePolling(false))
        setModalStatus('failed')
      }
    }
  }, [deployStatusData, dispatch, setDeployingStatus, setModalStatus])

  // 监听wallet轮询结果，自动更新交易账户信息
  useEffect(() => {
    if (walletInfoData && walletInfoData.status === 'success') {
      const walletInfo = walletInfoData.data
      dispatch(
        updateTradingAccountInfo({
          accountId: walletInfo.account_id as `0x${string}`,
          brokerHash: walletInfo.broker_hash as `0x${string}`,
          walletAddress: walletInfo.wallet_address as `0x${string}`,
        }),
      )
    }
  }, [walletInfoData, dispatch])

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
              walletAddress: tradingAccountResponse.data.walletAddress as `0x${string}`,
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
    console.log('executeStep2 =================')
    console.log('account', account)
    console.log('usdcAddress', usdcAddress)
    console.log('vaultContractAddress', vaultContractAddress)
    console.log('decimals', decimals)
    if (!account || !usdcAddress || !vaultContractAddress || !decimals) {
      throw new Error('缺少必要的参数')
    }

    try {
      setDeployingStatus(DEPLOYING_STATUS.STEP2_IN_PROGRESS)

      // 获取存款手续费，如果获取失败则使用预估值
      if (isFeeLoading) {
        console.log('正在获取存款手续费...')
        // 等待费用加载完成，最多等待10秒
        let waitCount = 0
        while (isFeeLoading && waitCount < 20) {
          await sleep(500)
          waitCount++
        }
      }

      if (isFeeError || !depositFee) {
        console.warn('获取存款手续费失败，将使用预估值 0.005 ETH:', feeError)
      }

      console.log('存款手续费:', depositFee ?? BigInt('5000000000000000'))

      // 存入金额：1 USDC (根据实际需求修改)
      const depositAmount = tokenAmount

      // 检查是否需要授权
      const needsApproval = allowance !== undefined && allowance < depositAmount
      console.log('needsApproval', vaultContractAddress, needsApproval, allowance, depositAmount)

      if (needsApproval) {
        console.log('开始授权 USDC...', vaultContractAddress, depositAmount)
        await approveUsdc(vaultContractAddress, depositAmount)
        await sleep(2000)
        await refetchAllowance()
        console.log('USDC 授权完成')
      }

      console.log('开始存入保证金...', depositAmount)
      console.log('usdcAddress', usdcAddress)

      // 执行 depositTo
      const txHash = await depositTo()

      console.log('存入保证金交易已提交，txHash:', txHash)

      // 调用确认存款接口
      try {
        await confirmDeposit({
          strategy_id: strategyId!,
          txid: txHash,
          chainId: chainId?.toString() || '',
          usdc: 1, // 存入的 USDC 数量
        }).unwrap()
        console.log('存款确认接口调用成功')
      } catch (confirmError: any) {
        console.error('存款确认接口调用失败:', confirmError)
        // 这里不抛出错误，因为合约交易已经成功，只是确认接口失败
      }

      console.log('存入保证金txHash:', txHash)
    } catch (error: any) {
      console.error('步骤2执行失败:', error)
      setDeployingStatus(DEPLOYING_STATUS.STEP2_FAILED)
      setErrorMessage(error.message)
    }
  }, [
    account,
    usdcAddress,
    vaultContractAddress,
    tokenAmount,
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
    isFeeLoading,
    isFeeError,
    feeError,
    depositFee,
  ])

  // 执行步骤3: 部署金库合约
  const executeStep3 = useCallback(
    async (strategyId: string) => {
      try {
        setDeployingStatus(DEPLOYING_STATUS.STEP3_IN_PROGRESS)

        const contractResponse = await deployVaultContract({
          strategy_id: strategyId,
        }).unwrap()

        if (contractResponse.status === 'success') {
          // 异步的，此时只是部署请求成功，所以状态依旧是IN_PROGRESS
          setDeployingStatus(DEPLOYING_STATUS.STEP3_IN_PROGRESS)
        } else {
          setDeployingStatus(DEPLOYING_STATUS.STEP3_FAILED)
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

        // 更新chainId和txid到reducer
        if (response.data.chainId && response.data.txid) {
          dispatch(updateDeployChainId(response.data.chainId))
          dispatch(updateDeployTxid(response.data.txid))
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

  // 查询钱包信息
  const checkWalletInfo = useCallback(
    async (strategyId: string) => {
      try {
        const response = await getWalletInfo({
          strategy_id: strategyId,
        }).unwrap()

        if (response.status === 'success') {
          const walletInfo = response.data
          dispatch(
            updateTradingAccountInfo({
              accountId: walletInfo.account_id as `0x${string}`,
              brokerHash: walletInfo.broker_hash as `0x${string}`,
              walletAddress: walletInfo.wallet_address as `0x${string}`,
            }),
          )
        }

        return response
      } catch (error) {
        console.error('查询钱包信息失败:', error)
      }
    },
    [getWalletInfo, dispatch],
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
    deployChainId,
    deployTxid,

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
    checkWalletInfo,
  }
}

export function useIsStep3Deploying(): boolean {
  const { deployingStatus } = useDeployment()
  return useMemo(() => {
    return (
      deployingStatus === DEPLOYING_STATUS.STEP3_IN_PROGRESS ||
      deployingStatus === DEPLOYING_STATUS.STEP3_SUCCESS ||
      deployingStatus === DEPLOYING_STATUS.STEP3_FAILED
    )
  }, [deployingStatus])
}
