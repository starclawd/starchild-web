/**
 * 给ws实例添加状态回调
 */
import { websocketFuc } from './websocketBase'
import { WsKeyEnumType, AnyFunc, CallBackFuncType } from './websocket.d'
class WebSocketClient {
  webSocket: WebSocket | null
  connected: boolean
  isNeedReconnect: boolean
  reconnectTimeInterval: number
  onClose: CallBackFuncType
  onConnect: CallBackFuncType
  onError: CallBackFuncType
  onMsgReceive: CallBackFuncType
  wsKey: WsKeyEnumType | string
  checkConnectTime: number
  constructor(wsKey: WsKeyEnumType | string) {
    this.webSocket = null
    this.connected = false
    // 是否需要重连, 默认需要
    this.isNeedReconnect = true
    // 重连时间间隔
    this.reconnectTimeInterval = -1
    // 连接关闭时的回调
    this.onClose = null
    // 连接建立后的回调
    this.onConnect = null
    // 连接出错的回调
    this.onError = null
    // 推送消息的外部回调函数 onMsgReceive(topic,data)
    this.onMsgReceive = null
    this.wsKey = wsKey
    // 超过一定时间没响应，则重连
    this.checkConnectTime = 10000
  }

  /**
   * 连接
   * @param wsDomain
   * @returns
   */
  connect = (wsDomain: string): void => {
    try {
      this.webSocket = websocketFuc({
        wsDomain,
        touch: this.touch,
        connect: this.connect,
        onClose: this.onClose,
        onError: this.onError,
        onConnect: this.onConnect,
        disconnect: this.disconnect,
        onMsgReceive: this.onMsgReceive,
        getIsNeedReconnect: this.getIsNeedReconnect,
      })
    } catch (e) {
      console.error('websocket连接失败', e)
    }
  }

  getIsNeedReconnect = (): boolean => {
    return this.isNeedReconnect
  }

  /**
   * 设置关闭回调方法
   * @param func
   */
  setOnClose = (func: AnyFunc): void => {
    if (func) {
      this.onClose = func
    }
  }

  /**
   * 设置连接成功回调方法
   * @param func
   */
  setOnConnect = (func: AnyFunc): void => {
    this.onConnect = () => {
      this.connected = true
      func()
    }
  }

  /**
   * 设置连接成功回调方法
   * @param func
   */
  setOnError = (func: AnyFunc): void => {
    if (func) {
      this.onError = func
    }
  }

  /**
   * 发送请求
   * @param data
   */
  send = (data: any): void => {
    this.webSocket?.send(JSON.stringify(data))
  }

  /**
   * 消息接收回调
   * @param callback
   */
  register = (callback: AnyFunc): void => {
    this.onMsgReceive = callback
  }

  /**
   * 设置是否需要重连
   * 如果调用此方法且参数值不为null和undefined config配置将会无效
   * @param isNeedReconnect
   */
  setNeedReconnect = (isNeedReconnect: boolean): void => {
    if (isNeedReconnect !== null && isNeedReconnect !== undefined) {
      this.isNeedReconnect = isNeedReconnect
    }
  }

  /**
   * 设置重连时间间隔
   * 如果调用此方法且参数值是大于0的整数 config配置将会无效
   * @param reconnectTimeInterval
   */
  setReconnectTimeInterval = (reconnectTimeInterval: number): void => {
    const reg = /^\d+$/
    if (reg.test(String(reconnectTimeInterval))) {
      this.reconnectTimeInterval = reconnectTimeInterval
    }
  }

  /**
   * 订阅
   * @param data
   */
  sendData = (data: any): void => {
    if (this.connected) {
      this.webSocket?.send(JSON.stringify(data))
    }
  }

  /**
   * 断开连接
   * @param data
   */
  disconnect = (): void => {
    this.webSocket?.close(1000, '关闭连接')
    this.webSocket = null
    this.connected = false
  }

  /**
   * 判断是否连接
   * @param data
   */
  isConnected = (): boolean => {
    return this.connected
  }

  /**
   * 保持连接 心跳
   * @param data
   */
  touch = (data: string): void => {
    if (this.connected) {
      this.webSocket?.send(data)
    }
  }
}

export default WebSocketClient
