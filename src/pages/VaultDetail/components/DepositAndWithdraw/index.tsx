import { memo, useState, useCallback, useMemo, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Address } from 'viem'
import { formatUnits, parseUnits } from 'viem'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import { useOrderlyVaultDeposit, useOrderlyVaultWithdraw } from 'hooks/contract/useOrderlyVaultContract'
import { useUsdcContract, useUsdcBalanceOf, useUsdcAllowance, useUsdcApprove } from 'hooks/contract/useUsdcContract'
import { getChainInfo } from 'constants/chainInfo'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import {
  useDepositAndWithdrawModalToggle,
  useIsMobile,
  useModalOpen,
  useSwitchChainModalToggle,
} from 'store/application/hooks'
import BottomSheet from 'components/BottomSheet'
import Modal from 'components/Modal'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { ApplicationModal } from 'store/application/application'
import { vm } from 'pages/helper'
import { useAllStrategiesOverview, useCurrentDepositAndWithdrawVault } from 'store/vaults/hooks'
import Input from 'components/Input'
import usdc from 'assets/tokens/usdc.png'
import { ANI_DURATION } from 'constants/index'
import InfoList from './components/InfoList'
import Process from './components/Process'
import Title from './components/Title'
import { useLatestTransactionHistory } from 'store/vaultsdetail/hooks/useTransactionData'
import { useDepositAndWithdrawTabIndex, useRecordDepositAddress } from 'store/vaultsdetail/hooks/useDepositAndWithdraw'
import { useVaultLpInfo } from 'store/myvault/hooks/useVaultLpInfo'
import { useFetchClaimInfoData } from 'store/vaultsdetail/hooks/useClaimInfo'
import { BROKER_HASH } from 'constants/brokerHash'
import { formatContractError } from 'utils/handleError'
import { useSleep } from 'hooks/useSleep'
import useValidVaultWalletAddress from 'hooks/useValidVaultWalletAddress'
import { useReadOrderlyVaultQuoteOperation } from 'hooks/contract/useGeneratedHooks'
import { useUserInfo } from 'store/login/hooks'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'

const DepositWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  min-height: 420px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 20px;
  position: relative;
`

const DepositMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
  min-height: ${vm(420)};
`

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  flex-grow: 1;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
    `}
`

const InputWrapper = styled.div`
  position: relative;
  margin-bottom: 8px;
  .input-wrapper {
    height: 80px;
    border-radius: 12px;
    background-color: ${({ theme }) => theme.black700};
    input {
      font-size: 26px;
      font-style: normal;
      font-weight: 500;
      line-height: 34px;
      padding: 0 80px 0 16px;
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(8)};
      .input-wrapper {
        height: ${vm(80)};
        border-radius: ${vm(12)};
        input {
          font-size: 0.26rem;
          line-height: 0.34rem;
          padding: 0 ${vm(80)} 0 ${vm(16)};
        }
      }
    `}
`

const Usdc = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  position: absolute;
  right: 16px;
  top: 50%;
  height: 18px;
  transform: translateY(-50%);
  img {
    width: 18px;
    height: 18px;
  }
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      right: ${vm(16)};
      gap: ${vm(4)};
      height: ${vm(18)};
      img {
        width: ${vm(18)};
        height: ${vm(18)};
      }
      span {
        font-size: 0.14rem;
        line-height: 0.2rem;
      }
    `}
`

const ErrorText = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.red100};
  margin-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
      margin-bottom: ${vm(8)};
    `}
`

const AvailableRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      margin-top: ${vm(8)};
    `}
`

const AvailableText = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const AvailableAmount = styled.span`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textDark98};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const MaxButton = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.brand4};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;

  &:hover {
    opacity: 0.7;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const Shares = styled.span`
  span {
    color: ${({ theme }) => theme.textDark98};
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 20px 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(8)} ${vm(20)} ${vm(20)};
    `}
`

const CancelButton = styled(ButtonBorder)`
  height: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const ActionButton = styled(ButtonCommon)`
  height: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const WrongNetwork = styled(ButtonCommon)`
  height: 40px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const DepositAndWithdraw = memo(() => {
  const isMobile = useIsMobile()
  const [userInfo] = useUserInfo()
  const { address: account } = useAppKitAccount()
  const [isValidWallet] = useValidVaultWalletAddress()
  const { chainId } = useAppKitNetwork()
  const toast = useToast()
  const theme = useTheme()
  const { fetchClaimData } = useFetchClaimInfoData()
  const recordDepositAddress = useRecordDepositAddress()

  const [depositAndWithdrawTabIndex, setDepositAndWithdrawTabIndex] = useDepositAndWithdrawTabIndex()
  const [amount, setAmount] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [isTransacting, setIsTransacting] = useState(false)
  const depositAndWithdrawModalOpen = useModalOpen(ApplicationModal.DEPOSIT_AND_WITHDRAW_MODAL)
  const toggleDepositAndWithdrawModal = useDepositAndWithdrawModalToggle()
  const toggleSwitchChainModal = useSwitchChainModalToggle()

  const [currentDepositAndWithdrawVault] = useCurrentDepositAndWithdrawVault()
  const vaultAddress = currentDepositAndWithdrawVault?.vault_address as Address | undefined
  const vaultId = currentDepositAndWithdrawVault?.vault_id as string | undefined
  const minDepositAmount = currentDepositAndWithdrawVault?.min_deposit_amount as number | undefined
  const minWithdrawalAmount = currentDepositAndWithdrawVault?.min_withdrawal_amount as number | undefined
  const supportedChains = currentDepositAndWithdrawVault?.supported_chains
  const [allStrategies] = useAllStrategiesOverview()
  const strategyDetail = useMemo(() => {
    return allStrategies.find((strategy) => strategy.vaultId === vaultId)?.raw
  }, [allStrategies, vaultId])
  const depositDisabled = useMemo(() => {
    return (
      strategyDetail?.status === STRATEGY_STATUS.ARCHIVED ||
      strategyDetail?.status === STRATEGY_STATUS.DELISTED ||
      strategyDetail?.status === STRATEGY_STATUS.PAUSED
    )
  }, [strategyDetail])
  const { vaultLpInfo, refetch: refetchVaultLpInfo } = useVaultLpInfo({
    walletAddress: account && isValidWallet ? account : '',
    vaultId: vaultId || '',
  })
  const { refetch: refetchLatestTransactionHistory } = useLatestTransactionHistory({
    vaultId: vaultId || '',
    type: depositAndWithdrawTabIndex === 0 ? 'deposit' : 'withdrawal',
    walletAddress: account as string,
  })

  // 获取链信息
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const usdcAddress = chainInfo?.usdcContractAddress as Address | undefined

  // USDC 合约信息
  const { decimals, symbol, isLoading: isLoadingUsdc } = useUsdcContract()

  // USDC 余额
  const { balance, isLoading: isLoadingBalance } = useUsdcBalanceOf(account as Address)

  // USDC 授权额度
  const {
    allowance,
    isLoading: isLoadingAllowance,
    refetch: refetchAllowance,
  } = useUsdcAllowance(account as Address, vaultAddress as Address)
  const availableShares = vaultLpInfo?.available_main_shares || 0

  // 合约方法
  const deposit = useOrderlyVaultDeposit()
  const withdraw = useOrderlyVaultWithdraw()
  const approveUsdc = useUsdcApprove()
  const { sleep } = useSleep()

  // 计算余额显示
  const balanceDisplay = useMemo(() => {
    // withdraw 模式使用 availableShares
    if (depositAndWithdrawTabIndex === 1) {
      return String(availableShares)
    }
    // deposit 模式使用 USDC 余额
    if (!balance || !decimals) return '0'
    return formatUnits(balance, decimals)
  }, [balance, decimals, depositAndWithdrawTabIndex, availableShares])

  // 计算输入金额的 BigInt 值
  const amountBigInt = useMemo(() => {
    if (!amount || !decimals) return BigInt(0)
    try {
      return parseUnits(amount, decimals)
    } catch {
      return BigInt(0)
    }
  }, [amount, decimals])

  // 通过 quoteOperation 获取跨链手续费
  const { data: crossChainFee } = useReadOrderlyVaultQuoteOperation({
    address: vaultAddress,
    args: [
      depositAndWithdrawTabIndex as 0 | 1, // payloadType: 0 = deposit, 1 = withdraw
      (depositAndWithdrawTabIndex === 0 ? vaultAddress : account) as Address, // receiver
      amountBigInt as bigint, // amount
    ],
    query: {
      enabled: !!vaultAddress && !!account && amountBigInt > BigInt(0),
    } as any,
  })

  // 检查是否需要授权
  const needsApproval = useMemo(() => {
    // 只有在存款时才需要检查授权
    if (depositAndWithdrawTabIndex !== 0) return false
    // 如果 allowance 未加载或金额为 0，不需要授权
    if (allowance === undefined || !amountBigInt) return false
    // 比较授权额度和输入金额
    return allowance < amountBigInt
  }, [allowance, amountBigInt, depositAndWithdrawTabIndex])

  // 检查余额是否足够（仅 deposit 模式）
  const hasInsufficientBalance = useMemo(() => {
    if (depositAndWithdrawTabIndex !== 0) return false
    if (balance === undefined || !amountBigInt) return false
    return balance < amountBigInt
  }, [balance, amountBigInt, depositAndWithdrawTabIndex])

  // 检查 shares 是否足够（仅 withdraw 模式）
  const hasInsufficientShares = useMemo(() => {
    if (depositAndWithdrawTabIndex !== 1) return false
    if (!amount) return false
    const numericAmount = parseFloat(amount)
    return numericAmount > availableShares
  }, [amount, availableShares, depositAndWithdrawTabIndex])

  // 检查是否小于最低存款金额
  const isBelowMinDeposit = useMemo(() => {
    if (depositAndWithdrawTabIndex !== 0) return false
    if (!amount || !minDepositAmount) return false
    const numericAmount = parseFloat(amount)
    return numericAmount > 0 && numericAmount < minDepositAmount
  }, [amount, minDepositAmount, depositAndWithdrawTabIndex])

  // 检查是否小于最低提款金额
  const isBelowMinWithdrawal = useMemo(() => {
    if (depositAndWithdrawTabIndex !== 1) return false
    if (!amount || !minWithdrawalAmount) return false
    const numericAmount = parseFloat(amount)
    // 如果输入数量等于 availableShares（全部提取），则允许
    if (numericAmount === availableShares) return false
    return numericAmount > 0 && numericAmount < minWithdrawalAmount
  }, [amount, minWithdrawalAmount, depositAndWithdrawTabIndex, availableShares])

  // 获取按钮文本
  const getButtonText = useMemo(() => {
    if (!account) return <Trans>Connect Wallet</Trans>
    if (needsApproval) return <Trans>Approve {symbol}</Trans>
    return depositAndWithdrawTabIndex === 0 ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>
  }, [account, needsApproval, symbol, depositAndWithdrawTabIndex])

  // 检查按钮是否禁用
  const isButtonDisabled = useMemo(() => {
    const baseDisabled = !account || isApproving || isTransacting || !amount

    if (depositAndWithdrawTabIndex === 0) {
      // deposit 模式
      return baseDisabled || amountBigInt === BigInt(0) || hasInsufficientBalance || isBelowMinDeposit
    } else {
      // withdraw 模式
      const numericAmount = parseFloat(amount || '0')
      return baseDisabled || numericAmount <= 0 || hasInsufficientShares || isBelowMinWithdrawal
    }
  }, [
    account,
    isApproving,
    isTransacting,
    amount,
    amountBigInt,
    hasInsufficientBalance,
    hasInsufficientShares,
    isBelowMinDeposit,
    isBelowMinWithdrawal,
    depositAndWithdrawTabIndex,
  ])

  // 处理输入变化
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许数字和小数点
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }, [])

  // 设置最大金额
  const handleMaxClick = useCallback(() => {
    if (depositAndWithdrawTabIndex === 1) {
      // withdraw 模式使用 availableShares
      setAmount(String(availableShares))
    } else {
      // deposit 模式使用 USDC 余额
      if (balance && decimals) {
        setAmount(formatUnits(balance, decimals))
      }
    }
  }, [balance, decimals, depositAndWithdrawTabIndex, availableShares])

  // 处理授权
  const handleApprove = useCallback(async () => {
    if (!vaultAddress || !amountBigInt) return

    try {
      setIsApproving(true)

      // 授权用户输入的金额
      await approveUsdc(vaultAddress, amountBigInt)
      await sleep(2000)
      // 刷新 allowance 数据
      await refetchAllowance()

      toast({
        title: <Trans>Approval Successful</Trans>,
        description: '',
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-complete',
        iconTheme: theme.green100,
      })
    } catch (error: any) {
      toast({
        title: <Trans>Approval Failed</Trans>,
        description: formatContractError(error),
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
    } finally {
      setIsApproving(false)
    }
  }, [vaultAddress, amountBigInt, sleep, approveUsdc, refetchAllowance, toast, theme])

  // 处理存款
  const handleDeposit = useCallback(async () => {
    if (!account || !usdcAddress || !vaultAddress || !amountBigInt || !vaultId || !crossChainFee) return

    try {
      setIsTransacting(true)

      await deposit({
        contractAddress: vaultAddress as Address,
        payloadType: 0,
        receiver: account as Address,
        token: usdcAddress,
        amount: amountBigInt,
        brokerHash: BROKER_HASH,
        value: crossChainFee,
      })

      // 等待 2 秒后同步调用 refetchLatestTransactionHistory
      await sleep(4000)
      await refetchLatestTransactionHistory()
      await recordDepositAddress(userInfo.userInfoId, account as string)
      if (depositAndWithdrawModalOpen) {
        toggleDepositAndWithdrawModal()
      }
      toast({
        title: <Trans>Deposit in progress</Trans>,
        description: <Trans>You can open the deposit window to view the progress</Trans>,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-complete',
        iconTheme: theme.green100,
      })
      setAmount('')
    } catch (error: any) {
      toast({
        title: <Trans>Deposit Failed</Trans>,
        description: formatContractError(error),
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
    } finally {
      setIsTransacting(false)
    }
  }, [
    account,
    usdcAddress,
    vaultAddress,
    amountBigInt,
    vaultId,
    deposit,
    sleep,
    refetchLatestTransactionHistory,
    toast,
    recordDepositAddress,
    theme,
    crossChainFee,
    userInfo.userInfoId,
    toggleDepositAndWithdrawModal,
    depositAndWithdrawModalOpen,
  ])

  // 处理提款
  const handleWithdraw = useCallback(async () => {
    if (!account || !usdcAddress || !amountBigInt || !vaultId || !crossChainFee) return

    try {
      setIsTransacting(true)

      await withdraw({
        contractAddress: vaultAddress as Address,
        payloadType: 1,
        token: usdcAddress,
        amount: amountBigInt,
        brokerHash: BROKER_HASH,
        value: crossChainFee,
      })

      // 等待 2 秒后同步调用 refetchLatestTransactionHistory 和 refetchVaultLpInfo
      await sleep(4000)
      await refetchLatestTransactionHistory()
      await refetchVaultLpInfo()

      if (depositAndWithdrawModalOpen) {
        toggleDepositAndWithdrawModal()
      }

      toast({
        title: <Trans>Withdraw in progress</Trans>,
        description: <Trans>You can open the withdraw window to view the progress</Trans>,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-complete',
        iconTheme: theme.green100,
      })
      setAmount('')
    } catch (error: any) {
      toast({
        title: <Trans>Withdraw Failed</Trans>,
        description: formatContractError(error),
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
    } finally {
      setIsTransacting(false)
    }
  }, [
    account,
    usdcAddress,
    amountBigInt,
    vaultId,
    vaultAddress,
    withdraw,
    sleep,
    refetchLatestTransactionHistory,
    refetchVaultLpInfo,
    toast,
    theme,
    crossChainFee,
    toggleDepositAndWithdrawModal,
    depositAndWithdrawModalOpen,
  ])

  // 处理提交
  const handleSubmit = useCallback(() => {
    if (isButtonDisabled) return
    if (depositAndWithdrawTabIndex === 0) {
      if (needsApproval) {
        handleApprove()
      } else {
        handleDeposit()
      }
    } else {
      handleWithdraw()
    }
  }, [isButtonDisabled, depositAndWithdrawTabIndex, needsApproval, handleApprove, handleDeposit, handleWithdraw])

  useEffect(() => {
    if (account && vaultId && isValidWallet) {
      refetchLatestTransactionHistory()
    }
  }, [account, vaultId, isValidWallet, depositAndWithdrawTabIndex, refetchLatestTransactionHistory])

  // 处理claim数据获取
  useEffect(() => {
    if (account && vaultId && isValidWallet && currentDepositAndWithdrawVault) {
      fetchClaimData({ vaultInfo: currentDepositAndWithdrawVault, walletAddress: account as string })
    }
  }, [account, vaultId, isValidWallet, currentDepositAndWithdrawVault, fetchClaimData])

  const renderContent = function () {
    return (
      <>
        <Title depositDisabled={depositDisabled} />
        <InputSection>
          <InputWrapper>
            <Input inputValue={amount} onChange={handleAmountChange} placeholder='0' />
            <Usdc>
              {depositAndWithdrawTabIndex === 0 && <img src={usdc} alt='usdc' />}
              {depositAndWithdrawTabIndex === 0 ? <span>USDC</span> : <span>Shares</span>}
            </Usdc>
          </InputWrapper>
          {isBelowMinDeposit && (
            <ErrorText>
              <Trans>The minimum amount is {minDepositAmount}. Please enter a larger amount to continue.</Trans>
            </ErrorText>
          )}
          {!isBelowMinDeposit && hasInsufficientBalance && (
            <ErrorText>
              <Trans>Insufficient Balance</Trans>
            </ErrorText>
          )}
          {isBelowMinWithdrawal && (
            <ErrorText>
              <Trans>The minimum amount is {minWithdrawalAmount}. Please enter a larger amount to continue.</Trans>
            </ErrorText>
          )}
          {!isBelowMinWithdrawal && hasInsufficientShares && (
            <ErrorText>
              <Trans>Insufficient Shares</Trans>
            </ErrorText>
          )}

          <AvailableRow>
            <AvailableText>
              <Trans>Available:</Trans> <AvailableAmount>{balanceDisplay}</AvailableAmount>
            </AvailableText>
            <MaxButton onClick={handleMaxClick}>
              <Trans>Max</Trans>
            </MaxButton>
          </AvailableRow>
          {currentDepositAndWithdrawVault && (
            <InfoList amount={amount} currentDepositAndWithdrawVault={currentDepositAndWithdrawVault} />
          )}
        </InputSection>
        <ButtonGroup>
          {chainInfo ? (
            <>
              <CancelButton onClick={toggleDepositAndWithdrawModal}>
                <Trans>Cancel</Trans>
              </CancelButton>
              <ActionButton onClick={handleSubmit} $disabled={isButtonDisabled} $pending={isApproving || isTransacting}>
                {isApproving || isTransacting ? <Pending /> : getButtonText}
              </ActionButton>
            </>
          ) : (
            <WrongNetwork onClick={toggleSwitchChainModal}>
              <Trans>Wrong network</Trans>
            </WrongNetwork>
          )}
        </ButtonGroup>
        {currentDepositAndWithdrawVault && chainInfo && <Process vaultId={vaultId || ''} account={account || ''} />}
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={depositAndWithdrawModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `calc(100vh - ${vm(44)})` }}
      onClose={toggleDepositAndWithdrawModal}
    >
      <DepositMobileWrapper>{renderContent()}</DepositMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={depositAndWithdrawModalOpen} onDismiss={toggleDepositAndWithdrawModal}>
      <DepositWrapper>{renderContent()}</DepositWrapper>
    </Modal>
  )
})

DepositAndWithdraw.displayName = 'DepositAndWithdraw'

export default DepositAndWithdraw
