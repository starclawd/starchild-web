import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { memo, useCallback, useState } from 'react'
import { useDepositToHyperliquidVault } from 'store/vaultsdetail/hooks/useHyperliquid'
import styled from 'styled-components'
import { useAppKitAccount } from '@reown/appkit/react'
import { privateKeyToAccount } from 'viem/accounts'
import { parseUnits } from 'viem'
import { signL1Action } from 'utils/hyperliquidSign'
import { useLocalApproveWalletData } from 'store/vaultsdetailcache/hooks'
import { hyperliquidDomain } from 'utils/url'

const DepositHyperliquidVaultWrapper = styled(ButtonCommon)`
  display: flex;
  height: 32px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

// USDC 精度：6 位小数
const USDC_DECIMALS = 6

interface DepositHyperliquidVaultProps {
  depositAmount?: number // 存款金额，单位 USD（不带精度，如 10 表示 10 USD）
}

export default memo(function DepositHyperliquidVault({ depositAmount = 10 }: DepositHyperliquidVaultProps) {
  // 确保 vaultAddress 是小写格式（Hyperliquid 要求地址小写）
  const vaultAddress = '0x5f67facb7b0002b1b1bb16e31ad8382cf92a3557'.toLowerCase() as `0x${string}`
  const [localApproveWalletData] = useLocalApproveWalletData()
  const triggerDepositToHyperliquidVault = useDepositToHyperliquidVault()
  const { address } = useAppKitAccount()
  const [isLoading, setIsLoading] = useState(false)

  const handleDeposit = useCallback(async () => {
    if (!address) {
      return
    }

    // 获取当前账户的 API 钱包信息
    const apiWallet = localApproveWalletData[address]
    if (!apiWallet) {
      return
    }

    setIsLoading(true)

    try {
      // 1. 使用 API 钱包私钥创建账户
      const agentAccount = privateKeyToAccount(apiWallet.privateKey as `0x${string}`)

      // 2. 生成 nonce（当前时间戳，毫秒）
      const nonce = Date.now()

      // 3. 将金额转换为 USDC 精度（6位小数）
      // 使用 viem 的 parseUnits：10 USD -> 10000000n
      const usdAmount = Number(parseUnits(depositAmount.toString(), USDC_DECIMALS))

      // 4. 构建 action 对象（确保 key 顺序与 Hyperliquid 一致：type, vaultAddress, isDeposit, usd）
      // 重要：签名时使用的 action 必须与 API 发送时的 action 完全一致
      const action = {
        type: 'vaultTransfer' as const,
        vaultAddress,
        isDeposit: true,
        usd: usdAmount,
      }

      // 5. 使用 signL1Action 进行签名
      // isTestnet: true 表示测试网，source 会是 "b"
      // isTestnet: false 表示主网，source 会是 "a"
      // 重要：这个参数必须与 API 请求发送的网络一致！
      // 注意：不要传入外层 vaultAddress 参数，那是用于"代表 vault 签名"的场景
      // 普通用户存款只需要 action 内部包含 vaultAddress 即可
      const signature = await signL1Action({
        wallet: agentAccount,
        action,
        nonce,
        isTestnet: hyperliquidDomain.chainId === 'Testnet', // 发送到 testnet 端点时必须为 true
      })

      // 6. 调用 deposit API（使用与签名完全相同的参数）
      const result = await triggerDepositToHyperliquidVault(vaultAddress, usdAmount, nonce, signature)

      if (result?.data?.status === 'ok') {
        console.log('Deposit successful!')
      }

      return result
    } catch (error) {
      return error
    } finally {
      setIsLoading(false)
    }
  }, [address, depositAmount, vaultAddress, triggerDepositToHyperliquidVault, localApproveWalletData])

  return (
    <DepositHyperliquidVaultWrapper onClick={handleDeposit} $disabled={isLoading}>
      {isLoading ? <Trans>Depositing...</Trans> : <Trans>Deposit</Trans>}
    </DepositHyperliquidVaultWrapper>
  )
})
