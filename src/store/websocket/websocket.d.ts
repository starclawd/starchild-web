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
export enum WS_TYPE {
  BINNANCE_WS = 'BINNANCE_WS',
  INSIGHTS_WS = 'INSIGHTS_WS',
}

export interface ConnectActionType {
  wsKey: string
  wsDomain: string
}

export interface UpdateStatusType {
  [propName: string]: WsConnectStatus
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
