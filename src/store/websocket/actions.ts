import { createAction } from '@reduxjs/toolkit'
import {
  WsKeyEnumType,
  UpdateStatusType,
  ConnectActionType,
  CONNECT_WEBSOCKET_TYPE,
  SUBSCRIBE_WEBSOCKET_TYPE,
  DISCONNECT_WEBSOCKET_TYPE,
  UNSUBSCRIBE_WEBSOCKET_TYPE,
  UPDATE_WEBSOCKET_STATUS_TYPE,
} from './websocket.d'

// 连接
export const connectWebsocket = createAction<{
  wsDomainArray: ConnectActionType[]
}>(CONNECT_WEBSOCKET_TYPE)
// 取消链接
export const disconnectWebsocket = createAction<{
  wsKeyArray: (WsKeyEnumType | string)[]
}>(DISCONNECT_WEBSOCKET_TYPE)
// 订阅
export const subscribeWebsocket = createAction<{
  wsKey: WsKeyEnumType | string
  sendData: any
}>(SUBSCRIBE_WEBSOCKET_TYPE)
// 取消订阅
export const unsubscribeWebsocket = createAction<{
  wsKey: WsKeyEnumType
  sendData: any
}>(UNSUBSCRIBE_WEBSOCKET_TYPE)
// 更新ws的连接状态
export const updateWebsocketStatus = createAction<{
  websocketOpenStatusMap: UpdateStatusType
}>(UPDATE_WEBSOCKET_STATUS_TYPE)
