import { useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'
import { parseWebSocketMessage } from './utils'
import { useInsightsList, useKlineSubData } from 'store/insights/hooks'
import { InsightsDataType, KlineSubDataType } from 'store/insights/insights'
import eventEmitter, { EventEmitterKey } from 'utils/eventEmitter'
import { useIsLogin } from 'store/login/hooks'
import { useNewTriggerList } from 'store/myagent/hooks'
import { NewTriggerDataType } from 'store/myagent/reducer'

// K线订阅参数类型
export interface KlineSubscriptionParams {
  symbol: string
  interval: string
  timeZone?: string // 可选的时区参数
}

// 基础 WebSocket Hook
export function useWebSocketConnection(wsUrl: string) {
  const [, setKlineSubData] = useKlineSubData()
  const [, setAllInsightsData] = useInsightsList()
  const [, addNewTrigger] = useNewTriggerList()
  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
    share: true,
    retryOnError: true,
  })
  useEffect(() => {
    const message = lastMessage ? parseWebSocketMessage(lastMessage) : null
    const steam = message?.stream
    if (message && steam?.includes('@kline_')) {
      setKlineSubData(message as KlineSubDataType)
    } else if (message && steam?.includes('ai-trigger-notification')) {
      setAllInsightsData(message.data as InsightsDataType)
      eventEmitter.emit(EventEmitterKey.INSIGHTS_NOTIFICATION, message.data)
    } else if (message && steam?.includes('agent-new-trigger')) {
      // 处理agent new trigger消息
      const triggerData = message.data as NewTriggerDataType
      if (triggerData && triggerData.agentId) {
        addNewTrigger({
          agentId: triggerData.agentId,
          timestamp: Date.now(),
        })
        eventEmitter.emit(EventEmitterKey.AGENT_NEW_TRIGGER, triggerData)
      }
    }
  }, [lastMessage, setKlineSubData, setAllInsightsData, addNewTrigger])

  useEffect(() => {
    if (lastMessage && lastMessage.data === 'ping') {
      sendMessage('pong')
    }
  }, [lastMessage, sendMessage])

  return {
    sendMessage,
    readyState,
    isConnecting: readyState === ReadyState.CONNECTING,
    isOpen: readyState === ReadyState.OPEN,
    isClosing: readyState === ReadyState.CLOSING,
    isClosed: readyState === ReadyState.CLOSED,
  }
}
