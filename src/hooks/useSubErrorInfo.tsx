import { Trans } from '@lingui/react/macro'
import { useAppKitAccount } from '@reown/appkit/react'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { ROUTER } from 'pages/router'
import { ReactNode, useCallback } from 'react'
import { useCurrentRouter, useIsBindTelegram, useIsWhiteList } from 'store/application/hooks'
import { useIsLogin } from 'store/login/hooks'
import { getTgLoginUrl } from 'store/login/utils'
import { useTheme } from 'store/themecache/hooks'

export default function useSubErrorInfo() {
  const toast = useToast()
  const theme = useTheme()
  const isLogin = useIsLogin()
  const isWhitelist = useIsWhiteList()
  const isBindTelegram = useIsBindTelegram()
  const [, setCurrentRouter] = useCurrentRouter()
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  return useCallback(() => {
    let title: ReactNode = ''
    if (!isLogin) {
      title = <Trans>You do not have permission to access, please login first.</Trans>
    } else if (!address) {
      title = <Trans>You do not have permission to access the bot. Please connect wallet to verify.</Trans>
    } else if (!isWhitelist) {
      title = <Trans>Your wallet address was not whitelisted. Share your Telegram account to join the waitlist.</Trans>
    } else if (!isBindTelegram) {
      title = <Trans> User has been identified. Please claim your Early Access Pass and link your telegram.</Trans>
    }
    if (title) {
      setCurrentRouter(`${ROUTER.HOME}?login=1`)
      toast({
        title,
        description: '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-rubbish',
        iconTheme: theme.ruby50,
      })
      return true
    }
  }, [theme, isLogin, address, isWhitelist, isBindTelegram, toast, setCurrentRouter])
}
