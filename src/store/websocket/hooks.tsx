import { useEffect, useMemo } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { 
  WsKeyEnumType,
} from './websocket.d';
import { parseWebSocketMessage } from './utils';
import { useKlineSubData } from 'store/insights/hooks';

// K线订阅参数类型
export interface KlineSubscriptionParams {
  symbol: string;
  interval: string;
}

function getWebSocketUrl(wsKey: WsKeyEnumType): string {
  const WS_URLS: Record<WsKeyEnumType, string> = {
    [WsKeyEnumType.BinanceWs]: 'wss://stream.binance.com/stream'
  };
  return WS_URLS[wsKey];
}

// 基础 WebSocket Hook
export function useWebSocketConnection(wsKey: WsKeyEnumType) {
  const wsUrl = getWebSocketUrl(wsKey);
  const [, setKlineSubData] = useKlineSubData()
  
  const { sendMessage, lastMessage, readyState } = useWebSocket(wsUrl, {
    reconnectAttempts: 10,
    reconnectInterval: 3000,
    shouldReconnect: () => true,
  });
  useEffect(() => {
    const message = lastMessage ? parseWebSocketMessage(lastMessage) : null
    const steam = message?.stream
    if (message && steam?.includes('@kline_')) {
      setKlineSubData(message)
    }
  }, [lastMessage, setKlineSubData])
  

  return {
    sendMessage,
    readyState,
    isConnecting: readyState === ReadyState.CONNECTING,
    isOpen: readyState === ReadyState.OPEN,
    isClosing: readyState === ReadyState.CLOSING,
    isClosed: readyState === ReadyState.CLOSED,
  };
}
