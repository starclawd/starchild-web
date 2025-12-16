import { ChatContentDataType, DEPLOYING_STATUS, STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
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
  deploy_time: string
  container_status: ContainerStatus
  message: string
}

export interface StartPaperTradingResponse {
  status: string
  data: PaperTradingData
}

// Paper Trading 当前状态相关接口
export interface PaperTradingPerformanceMetrics {
  total_return: number
  win_rate: number
  total_trades: number
}

export interface PaperTradingCurrentDeployment {
  deployment_id: string
  strategy_id: string
  mode: string
  status: string
  deployment_number: number
  deploy_time: string
  running_duration_seconds: number
  performance_metrics: PaperTradingPerformanceMetrics
}

export interface GetPaperTradingCurrentResponse {
  status: string
  data: PaperTradingCurrentDeployment | null
}

export interface StrategyDeployStatusData {
  strategy_id: string
  status: STRATEGY_STATUS
  deploy_status?: DEPLOYING_STATUS // 部署流程状态
  wallet_id: string | null
  deploy_time: string
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
  walletAddress: string
  accountId: string
  brokerHash: string
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
  success: boolean
  contract_address: string
  transaction_hash: string
  message: string
}

// Wallet 查询接口相关类型定义
export interface WalletInfoData {
  strategy_id: string
  wallet_address: string
  accountId: string
  brokerHash: string
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
    getMyStrategies: builder.query<any, void>({
      query: () => ({
        url: `/vibe-trading/strategies`,
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
  }),
})

// 导出 strategy hooks
export const {
  useGetStrategyChatContentQuery,
  useLazyGetStrategyChatContentQuery,
  useGetMyStrategiesQuery,
  useLazyGetMyStrategiesQuery,
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
  useGetPaperTradingCurrentQuery,
  useLazyGetPaperTradingCurrentQuery,
  // Wallet 相关hooks
  useGetWalletInfoQuery,
  useLazyGetWalletInfoQuery,
} = strategyApi
