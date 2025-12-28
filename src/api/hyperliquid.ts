import { hyperliquidChainId } from 'utils/url'
import { hyperliquidApi } from './base'

// 签名对象类型
export interface SignatureObject {
  r: string
  s: string
  v: number
}

// Hyperliquid 账户状态响应类型
export interface HyperliquidClearinghouseState {
  assetPositions: Array<{
    position: {
      coin: string
      entryPx: string
      leverage: {
        type: string
        value: number
      }
      liquidationPx: string | null
      marginUsed: string
      maxTradeSzs: [string, string]
      positionValue: string
      returnOnEquity: string
      szi: string
      unrealizedPnl: string
    }
    type: string
  }>
  crossMaintenanceMarginUsed: string
  crossMarginSummary: {
    accountValue: string
    totalMarginUsed: string
    totalNtlPos: string
    totalRawUsd: string
  }
  marginSummary: {
    accountValue: string
    totalMarginUsed: string
    totalNtlPos: string
    totalRawUsd: string
  }
  time: number
  withdrawable: string
}

// Hyperliquid Vault Follower 状态
export interface HyperliquidFollowerState {
  user: string
  vaultEquity: string // 用户在 vault 中的权益
  pnl: string
  allTimePnl: string
  daysFollowing: number
  vaultEntryTime: number
  lockupUntil: number
}

// Hyperliquid Vault 详情响应类型
export interface HyperliquidVaultDetails {
  name: string
  vaultAddress: string
  leader: string
  description: string
  portfolio: Array<[string, any]> // [timeRange, data] 格式
  apr: number
  leaderFraction: number
  leaderCommission: number
  followers: Array<HyperliquidFollowerState>
  followerState?: HyperliquidFollowerState // 当前用户的状态
  maxDistributable: number
  maxWithdrawable: number // 最大可提取金额
  isClosed: boolean
  allowDeposits: boolean
  alwaysCloseOnWithdraw: boolean
  relationship: {
    type: string
  }
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
    // Withdraw from Hyperliquid Vault
    withdrawFromHyperliquidVault: builder.query({
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
              type: 'vaultTransfer',
              vaultAddress: vaultAddress.toLowerCase(),
              isDeposit: false,
              usd: amount,
            },
            nonce,
            signature,
          },
        }
      },
    }),
    // 获取用户账户状态（包括余额）
    getClearinghouseState: builder.query<HyperliquidClearinghouseState, { user: string }>({
      query: ({ user }) => {
        return {
          url: `/info`,
          method: 'post',
          body: {
            type: 'clearinghouseState',
            user: user.toLowerCase(),
          },
        }
      },
    }),
    // 获取 Vault 详情（包括用户在 vault 中的仓位）
    getVaultDetails: builder.query<HyperliquidVaultDetails, { vaultAddress: string; user?: string }>({
      query: ({ vaultAddress, user }) => {
        return {
          url: `/info`,
          method: 'post',
          body: {
            type: 'vaultDetails',
            vaultAddress: vaultAddress.toLowerCase(),
            user: user?.toLowerCase(),
          },
        }
      },
    }),
  }),
  overrideExisting: false,
})

export const {
  useLazyApproveAgentQuery,
  useLazyDepositToHyperliquidVaultQuery,
  useLazyWithdrawFromHyperliquidVaultQuery,
  useGetClearinghouseStateQuery,
  useGetVaultDetailsQuery,
} = postsApi
export default postsApi
