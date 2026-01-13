import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { memo, useCallback, useState, useMemo } from 'react'
import { useApproveAgent } from 'store/vaultsdetail/hooks/useHyperliquid'
import styled from 'styled-components'
import { useSignTypedData } from 'wagmi'
import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { hyperliquidChainId } from 'utils/url'
import type { SignatureObject } from 'api/hyperliquid'
import { useLocalApproveWalletData } from 'store/vaultsdetailcache/hooks'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'

const ApproveAgentWrapper = styled(ButtonCommon)`
  display: flex;
  height: 32px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

// EIP-712 Domain 配置
// 参考: https://github.com/nktkas/hyperliquid
const getEIP712Domain = (chainId: number) => ({
  name: 'HyperliquidSignTransaction',
  version: '1',
  chainId,
  verifyingContract: '0x0000000000000000000000000000000000000000' as `0x${string}`,
})

// EIP-712 Types 配置
// 参考: https://github.com/nktkas/hyperliquid
const EIP712_TYPES = {
  'HyperliquidTransaction:ApproveAgent': [
    { name: 'hyperliquidChain', type: 'string' },
    { name: 'agentAddress', type: 'address' },
    { name: 'agentName', type: 'string' },
    { name: 'nonce', type: 'uint64' },
  ],
} as const

/**
 * 将签名字符串解析为 { r, s, v } 对象
 * wagmi signTypedData 返回的是 65 字节的签名字符串
 */
function parseSignature(signature: `0x${string}`): SignatureObject {
  // 签名格式: 0x + r(64 chars) + s(64 chars) + v(2 chars)
  const r = `0x${signature.slice(2, 66)}`
  const s = `0x${signature.slice(66, 130)}`
  const v = parseInt(signature.slice(130, 132), 16)
  return { r, s, v }
}

export default memo(function ApproveAgent() {
  const [, setLocalApproveWalletData] = useLocalApproveWalletData()
  const triggerApproveAgent = useApproveAgent()
  const { signTypedDataAsync } = useSignTypedData()
  const { address } = useAppKitAccount()
  const { chainId } = useAppKitNetwork()
  const [isLoading, setIsLoading] = useState(false)

  // 初始化时随机生成 agent 钱包（私钥和地址）
  const agentWallet = useMemo(() => {
    const privateKey = generatePrivateKey()
    const account = privateKeyToAccount(privateKey)
    return {
      privateKey,
      agentAddress: account.address,
    }
  }, [])

  const handleApprove = useCallback(async () => {
    if (!address || !chainId || !agentWallet.agentAddress) {
      console.error('Missing required parameters: address, chainId, or agentAddress')
      return
    }

    setIsLoading(true)

    try {
      // 1. 生成 nonce（当前时间戳，毫秒）
      const nonce = Date.now()

      // 2. 获取 hyperliquidChain（"Mainnet" 或 "Testnet"）
      const hyperliquidChain = hyperliquidChainId.chainId as string // "Mainnet" 或 "Testnet"

      // 3. 格式化 chainId 为十六进制字符串
      const signatureChainId = `0x${Number(chainId).toString(16)}`

      // 4. 构建 EIP-712 签名消息
      // 参考: https://github.com/nktkas/hyperliquid
      const domain = getEIP712Domain(Number(chainId))

      const message = {
        hyperliquidChain,
        agentAddress: agentWallet.agentAddress as `0x${string}`,
        agentName: '', // 可选，空字符串表示未命名的 API 钱包
        nonce: BigInt(nonce),
      }

      // 5. 使用 wagmi signTypedData 进行 EIP-712 签名
      const signatureHex = await signTypedDataAsync({
        domain,
        types: EIP712_TYPES,
        primaryType: 'HyperliquidTransaction:ApproveAgent',
        message,
      })

      // 6. 解析签名为 { r, s, v } 格式
      const signature = parseSignature(signatureHex)

      // 7. 调用 approveAgent API
      const result = await triggerApproveAgent(signatureChainId, agentWallet.agentAddress, nonce, signature)

      console.log('Approve agent result:', result)

      // 8. 成功后存储 agentAddress 和 privateKey 到 localApproveWalletData
      // key 是当前用户的 account 地址
      if (result?.data?.status === 'ok') {
        setLocalApproveWalletData({
          [address]: {
            agentAddress: agentWallet.agentAddress,
            privateKey: agentWallet.privateKey,
          },
        })
        console.log('Agent wallet saved for account:', address)
      }

      return result
    } catch (error) {
      console.error('Error approving agent:', error)
    } finally {
      setIsLoading(false)
    }
  }, [address, chainId, agentWallet, signTypedDataAsync, triggerApproveAgent, setLocalApproveWalletData])

  return (
    <ApproveAgentWrapper onClick={handleApprove} $disabled={isLoading}>
      {isLoading ? <Trans>Approving...</Trans> : <Trans>Approve Agent</Trans>}
    </ApproveAgentWrapper>
  )
})
