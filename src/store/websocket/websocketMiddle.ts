/**
 * webSocket 中间件，各种状态变化后action处理
 */
import { Dispatch, UnknownAction, MiddlewareAPI, Action } from 'redux'
import WebSocketClientClass from './websocketClient'
import {
  WsKeyEnumType,
  ConnectActionType,
  CONNECT_WEBSOCKET_TYPE,
  DISCONNECT_WEBSOCKET_TYPE,
  SUBSCRIBE_WEBSOCKET_TYPE,
  UNSUBSCRIBE_WEBSOCKET_TYPE,
  UPDATE_WEBSOCKET_STATUS_TYPE,
  WsConnectStatus,
} from './websocket.d'

function wsClosed(wsKey: WsKeyEnumType | string): UnknownAction {
  return {
    type: UPDATE_WEBSOCKET_STATUS_TYPE,
    payload: {
      websocketOpenStatusMap: {
        [wsKey]: WsConnectStatus.CLOSED,
      },
    },
  }
}
function wsOpen(wsKey: WsKeyEnumType | string): UnknownAction {
  return {
    type: UPDATE_WEBSOCKET_STATUS_TYPE,
    payload: {
      websocketOpenStatusMap: {
        [wsKey]: WsConnectStatus.OPEN,
      },
    },
  }
}
function wsConnecting(wsKey: WsKeyEnumType | string): UnknownAction {
  return {
    type: UPDATE_WEBSOCKET_STATUS_TYPE,
    payload: {
      websocketOpenStatusMap: {
        [wsKey]: WsConnectStatus.CONNECTING,
      },
    },
  }
}

let time = Date.now()
/**
 * webscoket 消息接收处理
 * @param data 数据
 * @param wsKey
 */
export function wsMessage(data: any, wsKey: WsKeyEnumType | string): UnknownAction {
  const emptyAction = {
    type: '',
    payload: {},
  }
  const stream = data.stream
  const topic = data.topic
  const event = data.event
  // orderly ws
  if (topic || event === 'request' || event === 'auth') {
    return {
      type: '',
      payload: {
        orderBookData: data
      }
    }
  }
  return emptyAction
}

// 自定义Action类型，包含payload属性
interface PayloadAction extends Action {
  payload?: any;
}

const createWebSocketMiddleware = () => {
  const webSocketClient: {
    [key: string]: WebSocketClientClass | null
  } = {}

  /**
   * 连接webSocket
   */
  const connect = ({ dispatch, getState }: MiddlewareAPI, { wsKey, wsDomain }: ConnectActionType) => {
    const wsClient = (webSocketClient[wsKey] = new WebSocketClientClass(wsKey))
    wsClient?.setOnClose(() => {
      dispatch(wsClosed(wsKey))
      // 关闭了都会重连，所以可以马上置为链接中
      dispatch(wsConnecting(wsKey))
    })
    wsClient?.setOnConnect(() => {
      time = Date.now()
      const timer = setInterval(() => {
        if (Date.now() - time > 10000) {
          wsClient.webSocket?.close()
          dispatch(wsConnecting(wsKey))
          clearInterval(timer)
        }
      }, 1000)
      dispatch(wsOpen(wsKey))
    })
    wsClient?.register((data) => {
      if (data === 'ping' || data.event === 'ping') {
        time = Date.now()
        // const websocketOpenStatusMap = getState().websocket.websocketOpenStatusMap
        // if (websocketOpenStatusMap[wsKey] !== WsConnectStatus.OPEN) {
        //   dispatch(wsOpen(wsKey))
        // }
        return
      }
      dispatch(wsMessage(data, wsKey))
    })
    wsClient?.setNeedReconnect(true)
    wsClient?.connect(wsDomain)
    dispatch(wsConnecting(wsKey))
  }

  /**
   * 关闭webSocket
   */
  const close = (wsKeyArray: (WsKeyEnumType | string)[]) => {
    wsKeyArray.forEach((wsKey: WsKeyEnumType | string) => {
      // 主动关掉的ws，不需要重连
      webSocketClient[wsKey]?.setNeedReconnect(false)
      // 断开连接
      webSocketClient[wsKey]?.disconnect()
      webSocketClient[wsKey] = null
    })
  }

  return (api: MiddlewareAPI) => (next: Dispatch<PayloadAction>) => (action: PayloadAction) => {
    if (action) {
      switch (action.type) {
        case CONNECT_WEBSOCKET_TYPE: {
          const wsDomainArray = action.payload?.wsDomainArray
          wsDomainArray?.forEach(({ wsKey, wsDomain }: ConnectActionType) => {
            if (!webSocketClient[wsKey] || !webSocketClient[wsKey]?.isConnected()) {
              const extendData = {
                wsKey,
                wsDomain,
              }
              close([wsKey])
              connect(api, extendData)
              next(action)
            }
          })
          break
        }
        case DISCONNECT_WEBSOCKET_TYPE: {
          const wsKeyArray = action.payload?.wsKeyArray
          close([wsKeyArray])
          next(action)
          break
        }
        // ws sub 请求
        case SUBSCRIBE_WEBSOCKET_TYPE: {
          const wsKey: WsKeyEnumType = action.payload?.wsKey
          const sendDataTemp = action.payload?.sendData
          const sendData = Object.assign({}, sendDataTemp)
          webSocketClient[wsKey]?.sendData(sendData)
          next(action)
          break
        }
        // ws unsub 请求
        case UNSUBSCRIBE_WEBSOCKET_TYPE: {
          const wsKey: WsKeyEnumType = action.payload?.wsKey
          const sendData = action.payload?.sendData
          webSocketClient[wsKey]?.sendData(sendData)
          next(action)
          break
        }
        default:
          next(action)
      }
    }
  }
}

// 使用any类型绕过类型检查
export default createWebSocketMiddleware() as any
