export const SUB_INTERVALS = 125
export const KLINE_SUB_ID = 1
export const KLINE_UNSUB_ID = 101
export const SIGNAL_SUB_ID = 2
export const SIGNAL_UNSUB_ID = 102
export const LIVE_CHAT_SUB_ID = 3
export const LIVE_CHAT_UNSUB_ID = 103
export const LEADERBOARD_SUB_ID = 4
export const LEADERBOARD_UNSUB_ID = 104
export const STRATEGY_SIGNAL_SUB_ID = 5
export const STRATEGY_SIGNAL_UNSUB_ID = 105
export const STRATEGY_BALANCE_UPDATE_SUB_ID = 6
export const STRATEGY_BALANCE_UPDATE_UNSUB_ID = 106
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
  PRIVATE_WS = 'PRIVATE_WS',
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
