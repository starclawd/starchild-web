import { ChatContentDataType, DEPLOYING_STATUS } from 'store/createstrategy/createstrategy'
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

// 部署状态相关接口
export interface DeploymentStep {
  step_number: number
  step_name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  message?: string
  timestamp?: number
}

export interface StrategyDeployStatusResponse {
  strategy_id: string
  deployment_id: string
  overall_status: DEPLOYING_STATUS
  steps: DeploymentStep[]
  created_at: number
  updated_at: number
}

export interface CreateTradingAccountResponse {
  success: boolean
  account_id: string
  message: string
}

export interface DeployVaultContractResponse {
  success: boolean
  contract_address: string
  transaction_hash: string
  message: string
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

    // 创建交易账户
    createTradingAccount: builder.mutation<
      CreateTradingAccountResponse,
      {
        strategy_id: string
      }
    >({
      // 暂时使用模拟接口成功 - TODO: 替换为真实接口
      queryFn: async (data) => {
        // 模拟接口延迟
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return {
          data: {
            success: true,
            account_id: `trading_account_${data.strategy_id}_${Date.now()}`,
            message: '交易账户创建成功',
          },
        }
      },
      // 真实接口实现（暂时注释）
      // query: (data) => ({
      //   url: '/vibe-trading/create-trading-account',
      //   method: 'POST',
      //   body: data,
      // }),
    }),

    // 部署金库合约
    deployVaultContract: builder.mutation<
      DeployVaultContractResponse,
      {
        strategy_id: string
      }
    >({
      // 暂时使用模拟接口成功 - TODO: 替换为真实接口
      queryFn: async (data) => {
        // 模拟接口延迟
        await new Promise((resolve) => setTimeout(resolve, 2000))

        return {
          data: {
            success: true,
            contract_address: `0x${Math.random().toString(16).substr(2, 40)}`,
            transaction_hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            message: '金库合约部署成功',
          },
        }
      },
      // 真实接口实现（暂时注释）
      // query: (data) => ({
      //   url: '/vibe-trading/deploy',
      //   method: 'POST',
      //   body: data,
      // }),
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
          url: `/vibe-trading/deploy/status?${params.toString()}`,
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
        url: '/vibe-trading/paper-trading/startg',
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
  useCreateTradingAccountMutation,
  useDeployVaultContractMutation,
  useGetStrategyDeployStatusQuery,
  useLazyGetStrategyDeployStatusQuery,
  // Paper Trading 相关hooks
  useStartPaperTradingMutation,
  useGetPaperTradingCurrentQuery,
  useLazyGetPaperTradingCurrentQuery,
} = strategyApi
