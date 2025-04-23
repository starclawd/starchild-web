/**
 * ws实例化
 */
import pako from 'pako'
import { ParamDataType } from './websocket.d'
import { parse } from 'json-bigint'

export const websocketFuc = ({
  wsDomain,
  touch,
  connect,
  onClose,
  onError,
  onConnect,
  disconnect,
  onMsgReceive,
  getIsNeedReconnect,
}: ParamDataType): WebSocket => {
  // let lastMessageTime: number
  const checkConnectTime = 3000
  let isReConnecting = false
  let isVisibilityConnecting = false
  const webSocket = new WebSocket(wsDomain)
  // 电脑休眠唤起的时候，快速重连
  const visibilityCallback = () => {
    if (document.visibilityState !== 'hidden') {
      if (!isReConnecting && webSocket.readyState !== 0 && webSocket.readyState !== 1) {
        document.removeEventListener('visibilitychange', visibilityCallback)
        isVisibilityConnecting = true
        webSocket.onclose = null
        webSocket.onmessage = null
        connect(wsDomain)
      }
      
    }
  }
  document.addEventListener('visibilitychange', visibilityCallback)
  webSocket.onopen = function () {
    onConnect && onConnect()
  }
  /**
   * web socket 错误
   * @param event 回调参数
   */
  webSocket.onerror = () => {
    onError && onError()
    disconnect && disconnect()
  }

  const reConnect = function () {
    if (webSocket.readyState !== 3 || isVisibilityConnecting || isReConnecting) return
    isReConnecting = true
    // clearInterval(checkConnectTimer)
    disconnect && disconnect()
    // 重连
    setTimeout(function () {
      connect(wsDomain)
    }, checkConnectTime)
  }

  webSocket.onclose = () => {
    //------------- 关掉当前ws
    onClose && onClose()
    getIsNeedReconnect() && reConnect()
  }

  // let messageCount = 0
  // let lastCheckTime = Date.now()
  /**
   * web socket 消息
   * @param event 回调参数
   */
  webSocket.onmessage = (event) => {
    try {
      // 防止id超出16位
      const msg = parse(event.data)
      if (msg.event === 'ping') {
        touch && touch(JSON.stringify({
          event: 'pong',
          ts: Date.now(),
        }))
      }
      onMsgReceive && onMsgReceive(msg)
    } catch (err) {
      // 当data传输二进制时，如下处理读取数据
      if (typeof event.data !== 'string') {
        try {
          const reader = new FileReader()
          reader.readAsArrayBuffer(event.data)
          reader.onload = () => {
            const text = pako.inflate(reader.result, { to: 'string' })
            const msg = parse(text)
            onMsgReceive && onMsgReceive(msg)
          }
        } catch (e) {
          console.log('websocket onmessage error', e)
        }
      } else {
        if (event.data === 'ping') {
          touch && touch('pong')
          onMsgReceive && onMsgReceive('ping')
        }
      }
    }
  }
  return webSocket
}
