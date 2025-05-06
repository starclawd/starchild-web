import { useEffect } from "react"
import { useConnectBinanceWs, useDisconnecWs } from "./hooks"

export default function Updater(): null {
  // const isLogin = useIsLogin()
  const connectBinanceWs = useConnectBinanceWs()
  // const connectOrderlyPrivateWs = useConnectOrderlyPrivateWs()
  const disconnectWs = useDisconnecWs()
  // 链接ws binance
  useEffect(() => {
    let wsKey = ''
    wsKey = connectBinanceWs()
    return () => {
      if (wsKey) {
        disconnectWs(wsKey)
      }
    }
  }, [connectBinanceWs, disconnectWs])
  return null
}