
export const CONNECT_WEBSOCKET_TYPE = 'websocket/connectWebsocket'
export const DISCONNECT_WEBSOCKET_TYPE = 'websocket/disconnectWebsocket'
export const SUBSCRIBE_WEBSOCKET_TYPE = 'websocket/subscribeWebsocket'
export const UNSUBSCRIBE_WEBSOCKET_TYPE = 'websocket/unsubscribeWebsocket'
export const UPDATE_WEBSOCKET_STATUS_TYPE = 'websocket/updateWebsocketStatus'
export const SUB_INTERVALS = 125
export const KLINE_SUB_ID = 1
export const KLINE_UNSUB_ID = 101

export enum WsConnectStatus {
  UNCONNECT = -1,
  CONNECTING,
  OPEN,
  CLOSING,
  CLOSED,
}
// ws数据是否压缩:  -1 不压缩，  0、1： 压缩
export const wsDataCompressType = 1
export enum WsKeyEnumType {
  BinanceWs = '/stream',
}

export interface ConnectActionType {
  wsKey: string
  wsDomain: string
}

export interface UpdateStatusType {
  [propName: string]: boolean
}
export interface AnyFunc {
  (data?: any | number | string): void | boolean
}
export type CallBackFuncType = AnyFunc | null
export interface ParamDataType {
  wsDomain: string
  connect: AnyFunc
  touch: CallBackFuncType
  onClose: CallBackFuncType
  onError: CallBackFuncType
  onConnect: CallBackFuncType
  getIsNeedReconnect: AnyFunc
  disconnect: CallBackFuncType
  onMsgReceive: CallBackFuncType
}
