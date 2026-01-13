import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy.d'

export type MyStrategyDataType = {
  id: string
  user_id: number
  name: string
  description: string
  status: STRATEGY_STATUS
  mode: string
  wallet_id: string | null
  signal_id: string
  agent_id: string
  thread_id: string
  version: number
  deploy_time: number | null
  created_at: number
  updated_at: number
}
