import { useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { parseWebSocketMessage } from './utils';
import { useInsightsList, useKlineSubData } from 'store/insights/hooks';
import { useDispatch } from 'react-redux';
import { updateAllInsightsData } from 'store/insights/reducer';

// K线订阅参数类型
export interface KlineSubscriptionParams {
  symbol: string;
  interval: string;
  timeZone?: string; // 可选的时区参数
}

// 基础 WebSocket Hook
export function useWebSocketConnection(wsUrl: string) {
  const [, setKlineSubData] = useKlineSubData()
  const [, setAllInsightsData] = useInsightsList()
  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
    share: true,
    retryOnError: true,
  });
  useEffect(() => {
    const message = lastMessage ? parseWebSocketMessage(lastMessage) : null
    const steam = message?.stream
    if (message && steam?.includes('@kline_')) {
      setKlineSubData(message)
    } else if (message && steam?.includes('ai-trigger-notification')) {
      setAllInsightsData(message.data)
    }
  }, [lastMessage, setKlineSubData, setAllInsightsData])

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
  };
}
