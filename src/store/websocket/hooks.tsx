import { useCallback, useMemo } from 'react'
import { WsConnectStatus, WsKeyEnumType } from './websocket.d'
import { connectWebsocket, disconnectWebsocket } from './actions'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
export function useConnectBinanceWs(): () => string {
  const dispatch = useDispatch()
  return useCallback(() => {
    const wsKey = WsKeyEnumType.BinanceWs
    const result = [{
      wsKey,
      wsDomain: `wss://stream.binance.com${wsKey}`,
    }]
    dispatch(connectWebsocket({ wsDomainArray: result }))
    return wsKey
  }, [dispatch])
}

export function useDisconnecWs(): (wsKey: string) => void {
  const dispatch = useDispatch()
  return useCallback((wsKey: string) => {
    dispatch(disconnectWebsocket({ wsKeyArray: [wsKey] }))
  }, [dispatch])
}

export function useBinanceWebsocketOpenStatusMap(): [boolean, WsKeyEnumType, WsConnectStatus] {
  const websocketOpenStatusMap = useSelector((state: RootState) => state.websocket.websocketOpenStatusMap)
  return useMemo(() => {
    return [
      websocketOpenStatusMap[WsKeyEnumType.BinanceWs] === WsConnectStatus.OPEN,
      WsKeyEnumType.BinanceWs,
      websocketOpenStatusMap[WsKeyEnumType.BinanceWs]
    ]
  }, [websocketOpenStatusMap])
}
