import { createReducer } from '@reduxjs/toolkit'

import { updateWebsocketStatus } from './actions'
import { WsConnectStatus, WsKeyEnumType } from './websocket.d'

export interface SocketState {
  readonly websocketOpenStatusMap: {
    [key: string]: WsConnectStatus
  }
  readonly isOrderlyPrivateWsAuthSuccess: boolean
}

const initialState: SocketState = {
  websocketOpenStatusMap: {
    [WsKeyEnumType.BinanceWs]: WsConnectStatus.UNCONNECT,
  },
  isOrderlyPrivateWsAuthSuccess: false,
}

export default createReducer<SocketState>(initialState, (builder) =>
  builder.addCase(updateWebsocketStatus, (state, { payload: { websocketOpenStatusMap } }) => {
    state.websocketOpenStatusMap = Object.assign(state.websocketOpenStatusMap, websocketOpenStatusMap)
  })
)
