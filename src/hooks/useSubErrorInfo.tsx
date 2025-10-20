import { Trans } from '@lingui/react/macro'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { ROUTER } from 'pages/router'
import { ReactNode, useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useIsLogin } from 'store/login/hooks'
import { useTheme } from 'store/themecache/hooks'

export default function useSubErrorInfo() {
  const toast = useToast()
  const theme = useTheme()
  const isLogin = useIsLogin()
  const [, setCurrentRouter] = useCurrentRouter()
  return useCallback(() => {
    let title: ReactNode = ''
    if (!isLogin) {
      title = <Trans>You do not have permission to access, please login first.</Trans>
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
  }, [theme, isLogin, toast, setCurrentRouter])
}
