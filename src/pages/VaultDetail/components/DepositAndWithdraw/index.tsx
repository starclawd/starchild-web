import { memo, useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { Address, keccak256, stringToHex } from 'viem'
import { formatUnits, parseUnits } from 'viem'
import Input from 'components/Input'
import { ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import { useOrderlyVaultDeposit, useOrderlyVaultWithdraw } from 'hooks/contract/useOrderlyVaultContract'
import { useUsdcContract, useUsdcBalanceOf, useUsdcAllowance, useUsdcApprove } from 'hooks/contract/useUsdcContract'
import { getChainInfo } from 'constants/chainInfo'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
  padding: 24px;
  gap: 20px;
`

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
`

const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 8px;
`

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 500;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ theme, $active }) => ($active ? theme.bgL0 : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.textL1 : theme.textL3)};

  &:hover {
    opacity: 0.8;
  }
`

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const InputLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
`

const BalanceText = styled.span`
  color: ${({ theme }) => theme.textL3};
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.textL1};
  }
`

const InputWrapper = styled.div`
  position: relative;
`

const MaxButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  background: ${({ theme }) => theme.brand200};
  color: ${({ theme }) => theme.textL1};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 8px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`

const InfoLabel = styled.span`
  color: ${({ theme }) => theme.textL2};
`

const InfoValue = styled.span`
  color: ${({ theme }) => theme.textL1};
  font-weight: 500;
`

const ErrorText = styled.div`
  color: ${({ theme }) => theme.ruby50};
  font-size: 14px;
  padding: 8px;
  text-align: center;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100px;
`

type TabType = 'deposit' | 'withdraw'

// Broker Hash - keccak256(abi.encodePacked("orderly"))
const BROKER_HASH = keccak256(stringToHex('orderly'))

const DepositAndWithdraw = memo(() => {
  const { address: account } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const toast = useToast()
  const theme = useTheme()

  const [activeTab, setActiveTab] = useState<TabType>('deposit')
  const [amount, setAmount] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [isTransacting, setIsTransacting] = useState(false)

  // 获取链信息
  const numericChainId = chainId ? Number(chainId) : undefined
  const chainInfo = getChainInfo(numericChainId)
  const vaultAddress = chainInfo?.orderlyVaultContractAddress as Address | undefined
  const usdcAddress = chainInfo?.usdcContractAddress as Address | undefined

  // USDC 合约信息
  const { decimals, symbol, isLoading: isLoadingUsdc } = useUsdcContract()

  // USDC 余额
  const { balance, isLoading: isLoadingBalance } = useUsdcBalanceOf(account as Address)

  // USDC 授权额度
  const { allowance, isLoading: isLoadingAllowance } = useUsdcAllowance(account as Address, vaultAddress as Address)

  // 合约方法
  const deposit = useOrderlyVaultDeposit()
  const withdraw = useOrderlyVaultWithdraw()
  const approveUsdc = useUsdcApprove()

  // 计算余额显示
  const balanceDisplay = useMemo(() => {
    if (!balance || !decimals) return '0'
    return formatUnits(balance, decimals)
  }, [balance, decimals])

  // 计算授权额度
  const allowanceDisplay = useMemo(() => {
    if (!allowance || !decimals) return '0'
    return formatUnits(allowance, decimals)
  }, [allowance, decimals])

  // 计算输入金额的 BigInt 值
  const amountBigInt = useMemo(() => {
    if (!amount || !decimals) return BigInt(0)
    try {
      return parseUnits(amount, decimals)
    } catch {
      return BigInt(0)
    }
  }, [amount, decimals])
  // 检查是否需要授权
  const needsApproval = useMemo(() => {
    // 只有在存款时才需要检查授权
    if (activeTab !== 'deposit') return false
    // 如果 allowance 未加载或金额为 0，不需要授权
    if (allowance === undefined || !amountBigInt) return false
    // 比较授权额度和输入金额
    return allowance < amountBigInt
  }, [allowance, amountBigInt, activeTab])

  // 检查余额是否足够
  const hasInsufficientBalance = useMemo(() => {
    if (!balance || !amountBigInt) return false
    return balance < amountBigInt
  }, [balance, amountBigInt])

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
    if (balance && decimals) {
      setAmount(formatUnits(balance, decimals))
    }
  }, [balance, decimals])

  // 处理授权
  const handleApprove = useCallback(async () => {
    if (!vaultAddress || !amountBigInt) return

    try {
      setIsApproving(true)

      // 授权用户输入的金额
      await approveUsdc(vaultAddress, amountBigInt)

      toast({
        title: <Trans>Approval Successful</Trans>,
        description: '',
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-agent',
        iconTheme: theme.jade10,
      })
    } catch (error: any) {
      console.error('Approve failed:', error)
      toast({
        title: <Trans>Approval Failed</Trans>,
        description: error?.message || '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-agent',
        iconTheme: theme.ruby50,
      })
    } finally {
      setIsApproving(false)
    }
  }, [vaultAddress, amountBigInt, approveUsdc, toast, theme])

  // 处理存款
  const handleDeposit = useCallback(async () => {
    if (!account || !usdcAddress || !vaultAddress || !amountBigInt) return

    try {
      setIsTransacting(true)

      await deposit({
        payloadType: 0,
        receiver: account as Address,
        token: usdcAddress,
        amount: amountBigInt,
        brokerHash: BROKER_HASH,
      })

      toast({
        title: <Trans>Deposit Successful</Trans>,
        description: '',
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-agent',
        iconTheme: theme.jade10,
      })
      setAmount('')
    } catch (error: any) {
      console.error('Deposit failed:', error)
      toast({
        title: <Trans>Deposit Failed</Trans>,
        description: error?.message || '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-agent',
        iconTheme: theme.ruby50,
      })
    } finally {
      setIsTransacting(false)
    }
  }, [account, usdcAddress, vaultAddress, amountBigInt, deposit, toast, theme])

  // 处理提款
  const handleWithdraw = useCallback(async () => {
    if (!usdcAddress || !amountBigInt) return

    try {
      setIsTransacting(true)

      await withdraw({
        payloadType: 0,
        token: usdcAddress,
        amount: amountBigInt,
        brokerHash: BROKER_HASH,
      })

      toast({
        title: <Trans>Withdraw Successful</Trans>,
        description: '',
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-chat-agent',
        iconTheme: theme.jade10,
      })
      setAmount('')
    } catch (error: any) {
      console.error('Withdraw failed:', error)
      toast({
        title: <Trans>Withdraw Failed</Trans>,
        description: error?.message || '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-agent',
        iconTheme: theme.ruby50,
      })
    } finally {
      setIsTransacting(false)
    }
  }, [usdcAddress, amountBigInt, withdraw, toast, theme])

  // 处理提交
  const handleSubmit = useCallback(() => {
    if (activeTab === 'deposit') {
      if (needsApproval) {
        handleApprove()
      } else {
        handleDeposit()
      }
    } else {
      handleWithdraw()
    }
  }, [activeTab, needsApproval, handleApprove, handleDeposit, handleWithdraw])

  // 获取按钮文本
  const getButtonText = useMemo(() => {
    if (!account) return <Trans>Connect Wallet</Trans>
    if (isApproving) return <Trans>Approving...</Trans>
    if (isTransacting) return activeTab === 'deposit' ? <Trans>Depositing...</Trans> : <Trans>Withdrawing...</Trans>
    if (!amount || amountBigInt === BigInt(0)) return <Trans>Enter Amount</Trans>
    if (hasInsufficientBalance) return <Trans>Insufficient Balance</Trans>
    if (needsApproval) return <Trans>Approve {symbol}</Trans>
    return activeTab === 'deposit' ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>
  }, [
    account,
    isApproving,
    isTransacting,
    amount,
    amountBigInt,
    hasInsufficientBalance,
    needsApproval,
    symbol,
    activeTab,
  ])

  // 检查按钮是否禁用
  const isButtonDisabled = useMemo(() => {
    return !account || isApproving || isTransacting || !amount || amountBigInt === BigInt(0) || hasInsufficientBalance
  }, [account, isApproving, isTransacting, amount, amountBigInt, hasInsufficientBalance])

  // 加载中状态
  if (isLoadingUsdc || isLoadingBalance || isLoadingAllowance) {
    return (
      <Container>
        <Title>
          <Trans>Deposit / Withdraw</Trans>
        </Title>
        <LoadingContainer>
          <Pending isFetching />
        </LoadingContainer>
      </Container>
    )
  }

  return (
    <Container>
      <Title>
        <Trans>Deposit / Withdraw</Trans>
      </Title>

      <TabContainer>
        <Tab $active={activeTab === 'deposit'} onClick={() => setActiveTab('deposit')}>
          <Trans>Deposit</Trans>
        </Tab>
        <Tab $active={activeTab === 'withdraw'} onClick={() => setActiveTab('withdraw')}>
          <Trans>Withdraw</Trans>
        </Tab>
      </TabContainer>

      <InputSection>
        <InputLabel>
          <span>
            <Trans>Amount</Trans>
          </span>
          <BalanceText onClick={handleMaxClick}>
            <Trans>Balance</Trans>: {balanceDisplay} {symbol}
          </BalanceText>
        </InputLabel>

        <InputWrapper>
          <Input type='text' inputMode='decimal' placeholder='0.00' inputValue={amount} onChange={handleAmountChange} />
          <MaxButton onClick={handleMaxClick}>
            <Trans>MAX</Trans>
          </MaxButton>
        </InputWrapper>
      </InputSection>

      <InfoSection>
        <InfoRow>
          <InfoLabel>
            <Trans>Token</Trans>
          </InfoLabel>
          <InfoValue>{symbol || 'USDC'}</InfoValue>
        </InfoRow>

        {activeTab === 'deposit' && (
          <InfoRow>
            <InfoLabel>
              <Trans>Current Allowance</Trans>
            </InfoLabel>
            <InfoValue>
              {allowanceDisplay} {symbol}
            </InfoValue>
          </InfoRow>
        )}

        <InfoRow>
          <InfoLabel>
            <Trans>Action</Trans>
          </InfoLabel>
          <InfoValue>{activeTab === 'deposit' ? <Trans>Deposit</Trans> : <Trans>Withdraw</Trans>}</InfoValue>
        </InfoRow>
      </InfoSection>

      {hasInsufficientBalance && (
        <ErrorText>
          <Trans>Insufficient Balance</Trans>
        </ErrorText>
      )}

      <ButtonCommon
        as='button'
        onClick={handleSubmit}
        $disabled={isButtonDisabled}
        $pending={isApproving || isTransacting}
      >
        {isApproving || isTransacting ? <Pending /> : getButtonText}
      </ButtonCommon>
    </Container>
  )
})

DepositAndWithdraw.displayName = 'DepositAndWithdraw'

export default DepositAndWithdraw
