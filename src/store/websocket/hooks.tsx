import { useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { parseWebSocketMessage } from './utils'
import { useKlineSubData } from 'store/insights/hooks'
import { KlineSubDataType, LiveChatDataType } from 'store/insights/insights'
import eventEmitter, { EventEmitterKey } from 'utils/eventEmitter'
import { useNewTriggerList } from 'store/myagent/hooks'
import { useUpdateLiveChatSubData } from 'store/insights/hooks/useLiveChatHooks'
import { useUpdateLeaderboardBalances } from 'store/vaults/hooks'
import { LeaderboardBalanceData } from 'store/vaults/vaults'
import { useSignalList } from 'store/vaultsdetail/hooks/useSignal'
import { SignalDataType } from 'store/vaultsdetail/vaultsdetail'

// K线订阅参数类型
export interface KlineSubscriptionParams {
  symbol: string
  interval: string
  timeZone?: string // 可选的时区参数
}

// 基础 WebSocket Hook
export function useWebSocketConnection(wsUrl: string, options?: { handleMessage?: boolean }) {
  const { handleMessage = true } = options || {}
  const [, setKlineSubData] = useKlineSubData()
  const setLiveChatSubData = useUpdateLiveChatSubData()
  const [, addNewTrigger] = useNewTriggerList()
  const updateLeaderboardBalances = useUpdateLeaderboardBalances()
  const [, setSignalList] = useSignalList()
  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
    share: true,
    retryOnError: true,
  })
  useEffect(() => {
    // 只有当 handleMessage 为 true 时才处理消息
    if (!handleMessage) return

    const message = lastMessage ? parseWebSocketMessage(lastMessage) : null
    const stream = message?.stream
    if (message && stream?.includes('@kline_')) {
      setKlineSubData(message as KlineSubDataType)
    } else if (message && stream?.includes('telegram@')) {
      // 处理agent new trigger消息
      eventEmitter.emit(EventEmitterKey.AGENT_NEW_TRIGGER, message.data)
    } else if (message && stream?.includes('live-chat-notification')) {
      setLiveChatSubData(message.data as LiveChatDataType)
    } else if (message && stream?.includes('all-agents-notification')) {
      eventEmitter.emit(EventEmitterKey.SIGNAL_NEW_TRIGGER, message.data)
    } else if (message && stream?.includes('leaderboard-balances')) {
      // 处理leaderboard余额更新消息
      updateLeaderboardBalances(message.data as LeaderboardBalanceData[])
    } else if (message && stream?.includes('strategy-signal-notification')) {
      setSignalList(message.data as SignalDataType)
    } else if (message && stream?.includes('strategy-balance-update')) {
      // TODO: 处理策略余额更新消息
    }
  }, [lastMessage, setSignalList, setKlineSubData, setLiveChatSubData, updateLeaderboardBalances, handleMessage])

  useEffect(() => {
    if (lastMessage && lastMessage.data === 'ping' && handleMessage) {
      sendMessage('pong')
    }
  }, [lastMessage, handleMessage, sendMessage])

  return {
    sendMessage,
    readyState,
    isConnecting: readyState === ReadyState.CONNECTING,
    isOpen: readyState === ReadyState.OPEN,
    isClosing: readyState === ReadyState.CLOSING,
    isClosed: readyState === ReadyState.CLOSED,
  }
}
