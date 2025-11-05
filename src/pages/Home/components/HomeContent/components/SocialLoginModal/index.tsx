/**
 * 社交登录模态框组件
 * 提供多种登录方式：Google、MetaMask、Phantom、WalletConnect
 */
import { memo, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { useIsMobile, useModalOpen, useSocialLoginModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'

// 导入图标资源
import googleIcon from 'assets/media/google.png'
import Divider from 'components/Divider'
import { ButtonCommon } from 'components/Button'
import { googleOneTapLogin } from 'utils/googleAuth'
import { useGoogleLoginErrorHandler } from 'hooks/useGoogleLoginErrorHandler'
import Pending from 'components/Pending'
import ConnectWallets from '../ConnectWallets'
import { useGetAuthTokenGoogle } from 'store/login/hooks'

// 桌面端模态框内容容器
const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 20px;
  position: relative;
`

// 移动端模态框内容容器
const MobileModalContent = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
`

// 标题
const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  text-align: center;
  margin: 20px 0 8px 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: ${vm(24)};
      line-height: ${vm(32)};
      margin: ${vm(20)} 0 ${vm(8)} 0;
    `}
`

// 登录按钮容器
const LoginButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
      gap: ${vm(16)};
    `}
`

// Google 登录按钮
const GoogleLoginButton = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 40px;
  padding: 11px;
  background: ${({ theme }) => theme.black500};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 4px;

  &:hover {
    opacity: 0.7;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
      height: ${vm(40)};
      padding: ${vm(11)};
      border-radius: ${vm(8)};
      gap: ${vm(4)};
    `}
`

// 按钮图标
const ButtonIcon = styled.div`
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
      width: ${vm(18)};
      height: ${vm(18)};
    `}
`

// 按钮文本
const ButtonText = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

// 提示文本容器
const HintContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) =>
    theme.isMobile &&
    `
      gap: ${vm(8)};
    `}
`

// 提示文本
const HintText = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.orange200};

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

// 内部组件，处理实际的UI渲染
const SocialLoginModalContent = memo(function SocialLoginModalContent() {
  const isMobile = useIsMobile()
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const isOpen = useModalOpen(ApplicationModal.SOCIAL_LOGIN_MODAL)
  const toggleModal = useSocialLoginModalToggle()
  const handleGoogleError = useGoogleLoginErrorHandler()
  const triggerGetAuthTokenGoogle = useGetAuthTokenGoogle()

  // Google 登录处理
  const handleGoogleLogin = useCallback(async () => {
    try {
      if (isGoogleLoading) return
      setIsGoogleLoading(true)
      await googleOneTapLogin(async (credential: string) => {
        await triggerGetAuthTokenGoogle(credential)
      })
      setIsGoogleLoading(false)
    } catch (error) {
      // 使用统一的错误处理
      handleGoogleError(error, 'login')
      setIsGoogleLoading(false)
    }
  }, [isGoogleLoading, triggerGetAuthTokenGoogle, handleGoogleError])

  const renderContent = () => {
    return (
      <>
        <Title>
          <Trans>Connect</Trans>
        </Title>

        {/* Google 登录 */}
        <LoginButtonsContainer>
          <GoogleLoginButton onClick={handleGoogleLogin}>
            {isGoogleLoading ? (
              <Pending />
            ) : (
              <>
                <ButtonIcon>
                  <img src={googleIcon} alt='Google' />
                </ButtonIcon>
                <ButtonText>
                  <Trans>Google</Trans>
                </ButtonText>
              </>
            )}
          </GoogleLoginButton>

          <Divider />

          {/* 钱包登录 */}
          <ConnectWallets type='login' />

          {/* 提示信息 */}
          <HintContainer>
            <HintText>
              <Trans>
                Please sign in with your original method first. Using a new method will create a new account.
              </Trans>
            </HintText>
            <HintText>
              <Trans>We recommend signing in with Telegram for the best experience.</Trans>
            </HintText>
          </HintContainer>
        </LoginButtonsContainer>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={isOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `${vm(560)}` }}
      onClose={toggleModal}
    >
      <MobileModalContent>{renderContent()}</MobileModalContent>
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onDismiss={toggleModal} hideClose={false} zIndex={300}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  )
})

// 导出的主组件
export default function SocialLoginModal() {
  return <SocialLoginModalContent />
}

// 导出handleSocialAccountModal函数供其他组件使用
export { useSocialLoginModalToggle as handleSocialAccountModal }
