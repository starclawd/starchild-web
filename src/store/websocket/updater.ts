import { useEffect } from "react"
import { useConnectOrderlyPublicWs, useDisconnecWs } from "./hooks"

export default function Updater(): null {
  // const isLogin = useIsLogin()
  const connectOrderlyPublicWs = useConnectOrderlyPublicWs()
  // const connectOrderlyPrivateWs = useConnectOrderlyPrivateWs()
  const disconnectWs = useDisconnecWs()
  // 链接ws orderly
  useEffect(() => {
    let wsKey = ''
    wsKey = connectOrderlyPublicWs()
    return () => {
      if (wsKey) {
        disconnectWs(wsKey)
      }
    }
  }, [connectOrderlyPublicWs, disconnectWs])
  // useEffect(() => {
  //   let wsKey = ''
  //   if (isLogin) {
  //     wsKey = connectOrderlyPrivateWs('')
  //   }
  //   return () => {
  //     if (wsKey) {
  //       disconnectWs(wsKey)
  //     }
  //   }
  // }, [isLogin, connectOrderlyPrivateWs, disconnectWs])

  return null
}