import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { memo, useCallback, useState, useMemo } from 'react'
import {
  useDepositToHyperliquidVault,
  useWithdrawFromHyperliquidVault,
  useHyperliquidAccountBalance,
  useHyperliquidVaultPosition,
} from 'store/vaultsdetail/hooks/useHyperliquid'
import styled, { css } from 'styled-components'
import { useAppKitAccount } from '@reown/appkit/react'
import { privateKeyToAccount } from 'viem/accounts'
import { parseUnits } from 'viem'
import { signL1Action } from 'utils/hyperliquidSign'
import { useLocalApproveWalletData } from 'store/vaultsdetailcache/hooks'
import { hyperliquidChainId } from 'utils/url'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import Input from 'components/Input'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { toFix } from 'utils/calc'

const DepositHyperliquidVaultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 20px;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(20)};
      padding: ${vm(20)};
    `}
`

const TitleWrapper = styled.div`
  margin-bottom: 20px;
  .move-tab-item,
  .active-indicator {
    height: 42px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(20)};
      .move-tab-item,
      .active-indicator {
        height: ${vm(42)};
      }
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

const InfoListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      margin-bottom: ${vm(20)};
    `}
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InfoLabel = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textDark54};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const InfoValue = styled.span`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textDark36};

  span {
    color: ${({ theme }) => theme.textDark98};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
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

// USDC 精度：6 位小数
const USDC_DECIMALS = 6

interface DepositHyperliquidVaultProps {
  vaultAddress: string
  onClose?: () => void
}

export default memo(function DepositHyperliquidVault({ vaultAddress, onClose }: DepositHyperliquidVaultProps) {
  const theme = useTheme()
  const toast = useToast()

  // 确保 vaultAddress 是小写格式（Hyperliquid 要求地址小写）
  const normalizedVaultAddress = vaultAddress.toLowerCase() as `0x${string}`
  const [localApproveWalletData] = useLocalApproveWalletData()
  const triggerDepositToHyperliquidVault = useDepositToHyperliquidVault()
  const triggerWithdrawFromHyperliquidVault = useWithdrawFromHyperliquidVault()
  const { address } = useAppKitAccount()

  const [tabIndex, setTabIndex] = useState(0) // 0: Deposit, 1: Withdraw
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // 获取 Hyperliquid 账户余额（可 deposit 的数量）
  const { availableBalance, refetch: refetchBalance } = useHyperliquidAccountBalance(address)

  // 获取用户在 Vault 中的存款信息（可 withdraw 的数量）
  const {
    depositedAmount,
    withdrawableAmount,
    refetch: refetchVaultPosition,
  } = useHyperliquidVaultPosition(normalizedVaultAddress, address)

  // Tab 切换配置
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Deposit</Trans>,
        clickCallback: () => {
          setTabIndex(0)
          setAmount('')
        },
        value: 'deposit',
      },
      {
        key: 1,
        text: <Trans>Withdraw</Trans>,
        clickCallback: () => {
          setTabIndex(1)
          setAmount('')
        },
        value: 'withdraw',
      },
    ]
  }, [])

  // 计算可用余额显示
  const balanceDisplay = useMemo(() => {
    if (tabIndex === 0) {
      return toFix(availableBalance.toString(), 2)
    } else {
      return toFix(withdrawableAmount.toString(), 2)
    }
  }, [tabIndex, availableBalance, withdrawableAmount])

  // 检查余额是否足够
  const hasInsufficientBalance = useMemo(() => {
    if (!amount) return false
    const numericAmount = parseFloat(amount)
    if (tabIndex === 0) {
      return numericAmount > availableBalance
    } else {
      return numericAmount > withdrawableAmount
    }
  }, [amount, tabIndex, availableBalance, withdrawableAmount])

  // 获取按钮文本
  const getButtonText = useMemo(() => {
    if (!address) return <Trans>Connect Wallet</Trans>
    return tabIndex === 0 ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>
  }, [address, tabIndex])

  // 检查按钮是否禁用
  const isButtonDisabled = useMemo(() => {
    if (!address || isLoading || !amount) return true
    const numericAmount = parseFloat(amount)
    if (isNaN(numericAmount) || numericAmount <= 0) return true
    return hasInsufficientBalance
  }, [address, isLoading, amount, hasInsufficientBalance])

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
    if (tabIndex === 0) {
      setAmount(availableBalance.toString())
    } else {
      setAmount(withdrawableAmount.toString())
    }
  }, [tabIndex, availableBalance, withdrawableAmount])

  // 处理 Deposit
  const handleDeposit = useCallback(async () => {
    if (!address || !amount) return

    const apiWallet = localApproveWalletData[address]
    if (!apiWallet) {
      toast({
        title: <Trans>No API Wallet</Trans>,
        description: <Trans>Please approve agent first</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
      return
    }

    setIsLoading(true)

    try {
      const agentAccount = privateKeyToAccount(apiWallet.privateKey as `0x${string}`)
      const nonce = Date.now()
      const usdAmount = Number(parseUnits(amount, USDC_DECIMALS))

      const action = {
        type: 'vaultTransfer' as const,
        vaultAddress: normalizedVaultAddress,
        isDeposit: true,
        usd: usdAmount,
      }

      const signature = await signL1Action({
        wallet: agentAccount,
        action,
        nonce,
        isTestnet: hyperliquidChainId.chainId === 'Testnet',
      })

      const result = await triggerDepositToHyperliquidVault(normalizedVaultAddress, usdAmount, nonce, signature)

      if (result?.data?.status === 'ok') {
        toast({
          title: <Trans>Deposit Successful</Trans>,
          description: '',
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-complete',
          iconTheme: theme.green100,
        })
        setAmount('')
        // 刷新余额
        await refetchBalance()
        await refetchVaultPosition()
      } else {
        throw new Error(result?.data?.response || 'Deposit failed')
      }
    } catch (error: any) {
      toast({
        title: <Trans>Deposit Failed</Trans>,
        description: error?.message || 'Unknown error',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
    } finally {
      setIsLoading(false)
    }
  }, [
    address,
    amount,
    localApproveWalletData,
    normalizedVaultAddress,
    triggerDepositToHyperliquidVault,
    toast,
    theme,
    refetchBalance,
    refetchVaultPosition,
  ])

  // 处理 Withdraw
  const handleWithdraw = useCallback(async () => {
    if (!address || !amount) return

    const apiWallet = localApproveWalletData[address]
    if (!apiWallet) {
      toast({
        title: <Trans>No API Wallet</Trans>,
        description: <Trans>Please approve agent first</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
      return
    }

    setIsLoading(true)

    try {
      const agentAccount = privateKeyToAccount(apiWallet.privateKey as `0x${string}`)
      const nonce = Date.now()
      const usdAmount = Number(parseUnits(amount, USDC_DECIMALS))

      const action = {
        type: 'vaultTransfer' as const,
        vaultAddress: normalizedVaultAddress,
        isDeposit: false,
        usd: usdAmount,
      }

      const signature = await signL1Action({
        wallet: agentAccount,
        action,
        nonce,
        isTestnet: hyperliquidChainId.chainId === 'Testnet',
      })

      const result = await triggerWithdrawFromHyperliquidVault(normalizedVaultAddress, usdAmount, nonce, signature)

      if (result?.data?.status === 'ok') {
        toast({
          title: <Trans>Withdraw Successful</Trans>,
          description: '',
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-complete',
          iconTheme: theme.green100,
        })
        setAmount('')
        // 刷新余额
        await refetchBalance()
        await refetchVaultPosition()
      } else {
        throw new Error(result?.data?.response || 'Withdraw failed')
      }
    } catch (error: any) {
      toast({
        title: <Trans>Withdraw Failed</Trans>,
        description: error?.message || 'Unknown error',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-close',
        iconTheme: theme.red100,
      })
    } finally {
      setIsLoading(false)
    }
  }, [
    address,
    amount,
    localApproveWalletData,
    normalizedVaultAddress,
    triggerWithdrawFromHyperliquidVault,
    toast,
    theme,
    refetchBalance,
    refetchVaultPosition,
  ])

  // 处理提交
  const handleSubmit = useCallback(() => {
    if (isButtonDisabled) return
    if (tabIndex === 0) {
      handleDeposit()
    } else {
      handleWithdraw()
    }
  }, [isButtonDisabled, tabIndex, handleDeposit, handleWithdraw])

  // 信息列表
  const infoList = useMemo(() => {
    if (tabIndex === 0) {
      return [
        {
          key: 'available-to-deposit',
          label: <Trans>Hyperliquid Balance</Trans>,
          value: (
            <span>
              <span>${toFix(availableBalance.toString(), 2)}</span> USDC
            </span>
          ),
        },
        {
          key: 'deposited-amount',
          label: <Trans>Deposited in Vault</Trans>,
          value: (
            <span>
              <span>${toFix(depositedAmount.toString(), 2)}</span> USDC
            </span>
          ),
        },
      ]
    } else {
      return [
        {
          key: 'withdrawable-amount',
          label: <Trans>Withdrawable Amount</Trans>,
          value: (
            <span>
              <span>${toFix(withdrawableAmount.toString(), 2)}</span> USDC
            </span>
          ),
        },
        {
          key: 'deposited-amount',
          label: <Trans>Total Deposited</Trans>,
          value: (
            <span>
              <span>${toFix(depositedAmount.toString(), 2)}</span> USDC
            </span>
          ),
        },
      ]
    }
  }, [tabIndex, availableBalance, depositedAmount, withdrawableAmount])

  return (
    <DepositHyperliquidVaultWrapper>
      <TitleWrapper>
        <MoveTabList tabKey={tabIndex} moveType={MoveType.LINE} tabList={tabList} />
      </TitleWrapper>

      <InputWrapper>
        <Input inputValue={amount} onChange={handleAmountChange} placeholder='0' />
        <Usdc>
          <span>USDC</span>
        </Usdc>
      </InputWrapper>

      {hasInsufficientBalance && (
        <ErrorText>
          <Trans>Insufficient Balance</Trans>
        </ErrorText>
      )}

      <AvailableRow>
        <AvailableText>
          <Trans>Available:</Trans> <AvailableAmount>{balanceDisplay} USDC</AvailableAmount>
        </AvailableText>
        <MaxButton onClick={handleMaxClick}>
          <Trans>Max</Trans>
        </MaxButton>
      </AvailableRow>

      <InfoListWrapper>
        {infoList.map((item) => (
          <InfoRow key={item.key}>
            <InfoLabel>{item.label}</InfoLabel>
            <InfoValue>{item.value}</InfoValue>
          </InfoRow>
        ))}
      </InfoListWrapper>

      <ButtonGroup>
        {onClose && (
          <CancelButton onClick={onClose}>
            <Trans>Cancel</Trans>
          </CancelButton>
        )}
        <ActionButton onClick={handleSubmit} $disabled={isButtonDisabled} $pending={isLoading}>
          {isLoading ? <Pending /> : getButtonText}
        </ActionButton>
      </ButtonGroup>
    </DepositHyperliquidVaultWrapper>
  )
})
