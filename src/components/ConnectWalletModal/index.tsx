/**
 * 社交登录模态框组件
 * 提供多种登录方式：Google、MetaMask、Phantom、WalletConnect
 */
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal, { CommonModalContent, CommonModalContentWrapper, CommonModalHeader } from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { useCurrentRouter, useIsMobile, useModalOpen, useConnectWalletModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'

import { ButtonCommon } from 'components/Button'
import { googleOneTapLogin } from 'utils/googleAuth'
import { useGoogleLoginErrorHandler } from 'hooks/useGoogleLoginErrorHandler'
import { useGetAuthTokenGoogle, useIsGetAuthToken, useIsLogin } from 'store/login/hooks'
import { trackEvent } from 'utils/common'
import { openTelegramLoginWindow } from 'store/login/utils'
import ChainConnect from './components/ChainConnect'
import Pending from 'components/Pending'

// 桌面端模态框内容容器
const ModalContent = styled(CommonModalContentWrapper)`
  width: 420px;
`

// 移动端模态框内容容器
const MobileModalContent = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
`

// Google 登录按钮
const GoogleLoginButton = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 40px;
  padding: 11px;
  background: ${({ theme }) => theme.black700};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 4px;

  &:hover {
    opacity: 0.7;
  }
`

export default memo(function ConnectWalletModal() {
  const isMobile = useIsMobile()

  const isLogin = useIsLogin()
  const currentRouter = useCurrentRouter()
  const [isGetAuthToken] = useIsGetAuthToken()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const connectWalletModalOpen = useModalOpen(ApplicationModal.CONNECT_WALLET_MODAL)
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const handleGoogleError = useGoogleLoginErrorHandler()
  const triggerGetAuthTokenGoogle = useGetAuthTokenGoogle()

  // Google 登录处理
  const handleGoogleLogin = useCallback(async () => {
    try {
      if (isGoogleLoading) return
      setIsGoogleLoading(true)
      await googleOneTapLogin(async (credential: string) => {
        const data = await triggerGetAuthTokenGoogle(credential)
        if (data.isSuccess && connectWalletModalOpen) {
          toggleConnectWalletModal()
        }
      })
      setIsGoogleLoading(false)
    } catch (error) {
      // 使用统一的错误处理
      handleGoogleError(error, 'login')
      setIsGoogleLoading(false)
    }
  }, [isGoogleLoading, triggerGetAuthTokenGoogle, handleGoogleError, connectWalletModalOpen, toggleConnectWalletModal])

  const handleTelegramLogin = useCallback(() => {
    if (isGetAuthToken) return
    if (!isLogin) {
      // Google Analytics 埋点：点击登录 Telegram
      // 使用回调确保事件发送完成后再跳转
      trackEvent(
        'login_with_telegram',
        {
          event_category: 'authentication',
          event_label: 'Login_with_telegram',
        },
        () => {
          // 在新窗口中打开登录页面
          openTelegramLoginWindow(currentRouter, 'telegram-login')
        },
      )
    }
  }, [isLogin, currentRouter, isGetAuthToken])

  const renderContent = () => {
    return (
      <>
        <CommonModalHeader>
          <Trans>Login</Trans>
        </CommonModalHeader>

        <CommonModalContent className='scroll-style'>
          {/* 钱包登录 */}
          <ChainConnect onSuccess={toggleConnectWalletModal} />
        </CommonModalContent>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={connectWalletModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `calc(100vh - ${vm(44)})` }}
      onClose={toggleConnectWalletModal}
    >
      <MobileModalContent>{renderContent()}</MobileModalContent>
    </BottomSheet>
  ) : (
    <Modal isOpen={connectWalletModalOpen} onDismiss={toggleConnectWalletModal} hideClose={false} zIndex={300}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  )
})
