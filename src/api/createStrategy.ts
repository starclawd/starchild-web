import {
  ChatContentDataType,
  DEPLOYING_STATUS,
  PaperTradingCurrentDataType,
  STRATEGY_STATUS,
} from 'store/createstrategy/createstrategy'
import { chatApi } from './baseChat'

// Paper Trading 相关接口
export interface ContainerStatus {
  success: boolean
  container: string
  status: string
}

export interface PaperTradingData {
  deployment_id: string
  strategy_id: string
  mode: string
  status: string
  deployment_number: number
  deploy_time: number
  container_status: ContainerStatus
  message: string
}

export interface StartPaperTradingResponse {
  status: string
  data: PaperTradingData
}

export interface PausePaperTradingResponse {
  status: string
  data: PaperTradingData
}

export interface GetPaperTradingCurrentResponse {
  status: string
  data: PaperTradingCurrentDataType | null
}

export interface StrategyDeployStatusData {
  strategy_id: string
  status: STRATEGY_STATUS
  deploy_status?: DEPLOYING_STATUS // 部署流程状态
  wallet_id?: string
  chainId?: string // 仅用于部署第二步充值后在block explorer查看tx
  txid?: string // 仅用于部署第二步充值后在block explorer查看tx
  deploy_time: number
}

export interface StrategyDeployStatusResponse {
  status: string
  data: StrategyDeployStatusData
}

export interface CreateTradingAccountRequest {
  strategy_id: string
  policyId?: string
  chainType: string
  chainId: string
}

export interface CreateTradingAccountData {
  strategy_id: string
  wallet_address: string
  account_id: string
  broker_hash: string
}

export interface CreateTradingAccountResponse {
  status: string
  data: CreateTradingAccountData
}

export interface DepositConfirmRequest {
  strategy_id: string
  txid: string
  chainId: string
  usdc: number
}

export interface DepositConfirmResponse {
  status: string
  message?: string
}

export interface EntryLiveDeployingResponse {
  status: string
  data: {
    strategy_id: string
    success: boolean
  }
}

export interface DeployVaultContractResponse {
  status: string
  data: {
    strategy_id: string
    success: boolean
  }
}

// Wallet 查询接口相关类型定义
export interface WalletInfoData {
  strategy_id: string
  wallet_address: string
  account_id: string
  broker_hash: string
  holding: number
}

export interface WalletInfoResponse {
  status: string
  data: WalletInfoData
}

// Strategy API (使用 chatApi)
export const strategyApi = chatApi.injectEndpoints({
  endpoints: (builder) => ({
    // 获取策略持仓信息
    getStrategyChatContent: builder.query<
      any,
      {
        strategyId: string
      }
    >({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/chat_content?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
    getStrategyDetail: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/strategy?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),
    editStrategy: builder.query<any, { name: string; strategyId: string; description: string }>({
      query: ({ name, strategyId, description }) => ({
        url: `/vibe-trading/edit_strategy`,
        method: 'PUT',
        body: {
          strategy_id: strategyId,
          name,
          description,
        },
      }),
    }),
    generateStrategyCode: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/strategy-generator/generate-code`,
        method: 'POST',
        body: {
          strategy_id: strategyId,
        },
      }),
    }),
    getStrategyCode: builder.query<any, { strategyId: string }>({
      query: ({ strategyId }) => ({
        url: `/vibe-trading/signal?strategy_id=${strategyId}`,
        method: 'GET',
      }),
    }),

    // 进入实盘部署状态
    entryLiveDeploying: builder.mutation<EntryLiveDeployingResponse, { strategy_id: string }>({
      query: (data) => ({
        url: '/vibe-trading/deployments/enter-live-deploying',
        method: 'POST',
        body: data,
      }),
    }),

    // 创建交易账户
    createTradingAccount: builder.mutation<CreateTradingAccountResponse, CreateTradingAccountRequest>({
      query: (data) => ({
        url: '/vibe-trading/deployments/prepare-orderly-account',
        method: 'POST',
        body: data,
      }),
    }),

    // 确认存款
    confirmDeposit: builder.mutation<DepositConfirmResponse, DepositConfirmRequest>({
      query: (data) => ({
        url: '/vibe-trading/deployments/deposit/confirm',
        method: 'POST',
        body: data,
      }),
    }),

    // 部署金库合约
    deployVaultContract: builder.mutation<
      DeployVaultContractResponse,
      {
        strategy_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/deployments/vault/deploy',
        method: 'POST',
        body: data,
      }),
    }),

    // 获取策略部署状态
    getStrategyDeployStatus: builder.query<
      StrategyDeployStatusResponse,
      {
        strategy_id: string
      }
    >({
      query: ({ strategy_id }) => {
        const params = new URLSearchParams()
        params.append('strategy_id', strategy_id)
        return {
          url: `/vibe-trading/deployments/state?${params.toString()}`,
          method: 'GET',
        }
      },
    }),

    // 获取钱包信息
    getWalletInfo: builder.query<
      WalletInfoResponse,
      {
        strategy_id: string
      }
    >({
      query: ({ strategy_id }) => {
        const params = new URLSearchParams()
        params.append('strategy_id', strategy_id)
        return {
          url: `/vibe-trading/deployments/wallet?${params.toString()}`,
          method: 'GET',
        }
      },
    }),

    // 开始 Paper Trading
    startPaperTrading: builder.mutation<
      StartPaperTradingResponse,
      {
        strategy_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/paper-trading/start',
        method: 'POST',
        body: data,
      }),
    }),

    // 暂停 Paper Trading
    pausePaperTrading: builder.mutation<
      PausePaperTradingResponse,
      {
        strategy_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/paper-trading/stop',
        method: 'POST',
        body: data,
      }),
    }),

    // 获取当前 Paper Trading 状态
    getPaperTradingCurrent: builder.query<
      GetPaperTradingCurrentResponse,
      {
        strategy_id: string
      }
    >({
      query: ({ strategy_id }) => ({
        url: '/vibe-trading/paper-trading/status',
        method: 'GET',
        params: { strategy_id },
      }),
    }),

    // 获取当前 Paper Trading 状态（公开版本）
    getPaperTradingCurrentPublic: builder.query<
      GetPaperTradingCurrentResponse,
      {
        strategy_id: string
      }
    >({
      query: ({ strategy_id }) => ({
        url: '/vibe-trading/paper-trading/status/public',
        method: 'GET',
        params: { strategy_id },
      }),
    }),

    // 暂停 strategy
    pauseStrategy: builder.query<
      any,
      {
        strategy_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/live-trading/stop',
        method: 'POST',
        body: data,
      }),
    }),
    // 重启 strategy
    restartStrategy: builder.query<
      any,
      {
        strategy_id: string
        wallet_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/live-trading/start',
        method: 'POST',
        body: data,
      }),
    }),
    // delist strategy
    delistStrategy: builder.query<
      any,
      {
        strategy_id: string
        wallet_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/strategy/delist',
        method: 'POST',
        body: data,
      }),
    }),
    // delete strategy
    deleteStrategy: builder.query<
      any,
      {
        strategy_id: string
      }
    >({
      query: (data) => ({
        url: '/vibe-trading/strategy/delete',
        method: 'POST',
        body: data,
      }),
    }),
    followStrategy: builder.mutation<any, { strategy_id: string }>({
      query: (data) => ({
        url: '/vibe-trading/strategy/follow',
        method: 'POST',
        body: data,
      }),
    }),
    unfollowStrategy: builder.mutation<any, { strategy_id: string }>({
      query: (data) => ({
        url: '/vibe-trading/strategy/unfollow',
        method: 'POST',
        body: data,
      }),
    }),
    getOnchainBalance: builder.query<any, any>({
      query: () => ({
        url: '/vibe-trading/user/onchain-balance',
        method: 'GET',
      }),
    }),
    getIsFollowedStrategy: builder.query<any, { strategy_id: string }>({
      query: ({ strategy_id }) => ({
        url: '/vibe-trading/strategy/is-following',
        method: 'GET',
        params: { strategy_id },
      }),
    }),
    generateGuestUser: builder.query<any, { guestUuid: string }>({
      query: ({ guestUuid }) => ({
        url: '/vibe-trading/guest/register',
        method: 'POST',
        body: { guest_uuid: guestUuid },
      }),
    }),
    bindStrategyToGuest: builder.query<any, { guestUuid: string; userInfoId: string; guestApiKey: string }>({
      query: ({ guestUuid, userInfoId, guestApiKey }) => ({
        url: '/vibe-trading/guest/claim',
        method: 'POST',
        body: { guest_uuid: guestUuid, target_user_info_id: Number(userInfoId), guest_api_key: guestApiKey },
      }),
    }),
    getUserConfig: builder.query<any, any>({
      query: () => ({
        url: '/vibe-trading/user_config',
        method: 'GET',
      }),
    }),
  }),
})

// 导出 strategy hooks
export const {
  useGetStrategyChatContentQuery,
  useLazyGetStrategyChatContentQuery,
  useGetStrategyDetailQuery,
  useLazyGetStrategyDetailQuery,
  useGenerateStrategyCodeQuery,
  useLazyGenerateStrategyCodeQuery,
  useGetStrategyCodeQuery,
  useLazyGetStrategyCodeQuery,
  useEditStrategyQuery,
  useLazyEditStrategyQuery,
  // Deploy 相关hooks
  useEntryLiveDeployingMutation,
  useCreateTradingAccountMutation,
  useConfirmDepositMutation,
  useDeployVaultContractMutation,
  useGetStrategyDeployStatusQuery,
  useLazyGetStrategyDeployStatusQuery,
  // Paper Trading 相关hooks
  useStartPaperTradingMutation,
  usePausePaperTradingMutation,
  useGetPaperTradingCurrentQuery,
  useLazyGetPaperTradingCurrentQuery,
  useGetPaperTradingCurrentPublicQuery,
  useLazyGetPaperTradingCurrentPublicQuery,
  // Wallet 相关hooks
  useGetWalletInfoQuery,
  useLazyGetWalletInfoQuery,
  // Strategy 相关hooks
  usePauseStrategyQuery,
  useLazyPauseStrategyQuery,
  useRestartStrategyQuery,
  useLazyRestartStrategyQuery,
  useDelistStrategyQuery,
  useLazyDelistStrategyQuery,
  useDeleteStrategyQuery,
  useLazyDeleteStrategyQuery,
  useFollowStrategyMutation,
  useUnfollowStrategyMutation,
  useGetOnchainBalanceQuery,
  useLazyGetOnchainBalanceQuery,
  useGetIsFollowedStrategyQuery,
  useLazyGetIsFollowedStrategyQuery,
  useGenerateGuestUserQuery,
  useLazyGenerateGuestUserQuery,
  useBindStrategyToGuestQuery,
  useLazyBindStrategyToGuestQuery,
  useGetUserConfigQuery,
  useLazyGetUserConfigQuery,
} = strategyApi
