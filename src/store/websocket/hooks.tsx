import { useCallback, useMemo } from 'react'
import { holomindsDomain } from 'utils/url'
import { WsConnectStatus, WsKeyEnumType } from './websocket.d'
import { connectWebsocket, disconnectWebsocket } from './actions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'

export function useConnectMultipleWs(): () => string {
  const dispatch = useDispatch()
  return useCallback(() => {
    const wsKey = WsKeyEnumType.MultipleWs
    const result = [{
      wsKey,
      wsDomain: `${holomindsDomain['wsDomain' as keyof typeof holomindsDomain]}${wsKey}`,
    }]
    dispatch(connectWebsocket({ wsDomainArray: result }))
    return wsKey
  }, [dispatch])
}

export function useConnectSingleWs(): (address: string) => string {
  const dispatch = useDispatch()
  return useCallback((address: string) => {
    const wsKey = `${WsKeyEnumType.SingleWs}/account@${address}`
    const result = [{
      wsKey,
      wsDomain: `${holomindsDomain['wsDomain' as keyof typeof holomindsDomain]}${wsKey}`,
    }]
    dispatch(connectWebsocket({ wsDomainArray: result }))
    return wsKey
  }, [dispatch])
}

export function useConnectOrderlyPublicWs(): () => string {
  const dispatch = useDispatch()
  return useCallback(() => {
    const wsKey = WsKeyEnumType.OrderlyPublicWs
    const result = [{
      wsKey,
      wsDomain: `wss://testnet-ws-evm.orderly.org${wsKey}`,
    }]
    dispatch(connectWebsocket({ wsDomainArray: result }))
    return wsKey
  }, [dispatch])
}

export function useConnectOrderlyPrivateWs(): (address: string) => string {
  const dispatch = useDispatch()
  return useCallback((accountId: string) => {
    const wsKey = `${WsKeyEnumType.OrderlyPrivateWs}/${accountId}`
    const result = [{
      wsKey,
      wsDomain: `${holomindsDomain['wsDomain' as keyof typeof holomindsDomain]}${wsKey}`,
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

// ws是否开启的映射表
export function useOrderlyPublicWebsocketOpenStatusMap(): [boolean, WsKeyEnumType, WsConnectStatus] {
  const websocketOpenStatusMap = useSelector((state: RootState) => state.websocket.websocketOpenStatusMap)
  return useMemo(() => {
    return [
      websocketOpenStatusMap[WsKeyEnumType.OrderlyPublicWs] === WsConnectStatus.OPEN,
      WsKeyEnumType.OrderlyPublicWs,
      websocketOpenStatusMap[WsKeyEnumType.OrderlyPublicWs]
    ]
  }, [websocketOpenStatusMap])
}
