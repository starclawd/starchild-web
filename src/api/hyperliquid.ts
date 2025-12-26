import { hyperliquidChainId } from 'utils/url'
import { hyperliquidApi } from './base'

// 签名对象类型
export interface SignatureObject {
  r: string
  s: string
  v: number
}

const postsApi = hyperliquidApi.injectEndpoints({
  endpoints: (builder) => ({
    approveAgent: builder.query({
      query: ({
        signatureChainId,
        agentAddress,
        nonce,
        signature,
      }: {
        signatureChainId: string
        agentAddress: string
        nonce: number
        signature: SignatureObject
      }) => {
        return {
          url: `/exchange`,
          method: 'post',
          body: {
            action: {
              type: 'approveAgent',
              hyperliquidChain: hyperliquidChainId.chainId,
              signatureChainId,
              agentAddress,
              nonce,
            },
            nonce,
            signature,
            expiresAfter: null,
            vaultAddress: null,
          },
        }
      },
    }),
    depositToHyperliquidVault: builder.query({
      query: ({
        vaultAddress,
        amount,
        nonce,
        signature,
      }: {
        vaultAddress: string
        amount: number
        nonce: number
        signature: SignatureObject
      }) => {
        return {
          url: `/exchange`,
          method: 'post',
          body: {
            action: {
              // 确保 action 的 key 顺序与签名时一致：type, vaultAddress, isDeposit, usd
              type: 'vaultTransfer',
              vaultAddress: vaultAddress.toLowerCase(),
              isDeposit: true,
              usd: amount,
            },
            nonce,
            signature,
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useLazyApproveAgentQuery, useLazyDepositToHyperliquidVaultQuery } = postsApi
export default postsApi
