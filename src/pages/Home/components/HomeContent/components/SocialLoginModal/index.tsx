/**
 * 社交登录模态框组件
 * 提供多种登录方式：Google、MetaMask、Phantom、WalletConnect
 */
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { useIsMobile, useModalOpen, useSocialLoginModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { useAppKitWallet } from '@reown/appkit-wallet-button/react'

// 导入图标资源
import googleIcon from 'assets/media/google.png'
import metamaskIcon from 'assets/media/metamask.png'
import phantomIcon from 'assets/media/phantom.png'
import walletConnectIcon from 'assets/media/wallet_connect.png'
import Divider from 'components/Divider'
import { ButtonCommon } from 'components/Button'
import { googleOneTapLogin } from 'utils/googleAuth'
import { useGoogleLoginErrorHandler } from 'hooks/useGoogleLoginErrorHandler'
import Pending from 'components/Pending'

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

// 登录按钮
const LoginButton = styled(ButtonCommon)`
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

// 分组容器
const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

// 分组标题
const SectionTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  text-align: left;

  ${({ theme }) =>
    theme.isMobile &&
    `
      font-size: 0.14rem;
      line-height: 0.2rem;
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

  const {
    isReady: isEVMReady,
    isPending: isEVMPending,
    connect: connectEVM,
  } = useAppKitWallet({
    namespace: 'eip155',
    onSuccess(parsedCaipAddress) {
      console.log('EVM Connected successfully!', parsedCaipAddress)
    },
    onError(error) {
      console.error('EVM Connection error:', error)
    },
  })

  const {
    isReady: isSolanaReady,
    isPending: isSolanaPending,
    connect: connectSolana,
  } = useAppKitWallet({
    namespace: 'solana',
    onSuccess(parsedCaipAddress) {
      console.log('Solana Connected successfully!', parsedCaipAddress)
    },
    onError(error) {
      console.error('Solana Connection error:', error)
    },
  })

  // Google 登录处理
  const handleGoogleLogin = useCallback(async () => {
    try {
      if (isGoogleLoading) return
      setIsGoogleLoading(true)
      await googleOneTapLogin(async (credential: string) => {
        console.log('credential', credential)
      })
      setIsGoogleLoading(false)
    } catch (error) {
      // 使用统一的错误处理
      handleGoogleError(error, 'login')
    }
  }, [isGoogleLoading, handleGoogleError])

  // MetaMask 登录处理
  const handleMetaMaskEVMLogin = useCallback(() => {
    connectEVM('metamask')
  }, [connectEVM])

  const handleMetaMaskSolanaLogin = useCallback(() => {
    connectSolana('metamask')
  }, [connectSolana])

  // Phantom 登录处理
  const handlePhantomEVMLogin = useCallback(() => {
    connectEVM('phantom')
  }, [connectEVM])

  const handlePhantomSolanaLogin = useCallback(() => {
    connectSolana('phantom')
  }, [connectSolana])

  // WalletConnect 登录处理
  const handleWalletConnectLogin = useCallback(() => {
    connectEVM('walletConnect')
  }, [connectEVM])

  const renderContent = () => {
    return (
      <>
        <Title>
          <Trans>Connect</Trans>
        </Title>

        {/* Google 登录 */}
        <LoginButtonsContainer>
          <LoginButton onClick={handleGoogleLogin}>
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
          </LoginButton>

          <Divider />

          {/* EVM 钱包分组 */}
          <SectionWrapper>
            <SectionTitle>EVM</SectionTitle>

            <LoginButton onClick={handleMetaMaskEVMLogin}>
              <ButtonIcon>
                <img src={metamaskIcon} alt='MetaMask' />
              </ButtonIcon>
              <ButtonText>
                <Trans>MetaMask</Trans>
              </ButtonText>
            </LoginButton>

            <LoginButton onClick={handlePhantomEVMLogin}>
              <ButtonIcon>
                <img src={phantomIcon} alt='Phantom' />
              </ButtonIcon>
              <ButtonText>
                <Trans>Phantom</Trans>
              </ButtonText>
            </LoginButton>

            <LoginButton onClick={handleWalletConnectLogin}>
              <ButtonIcon>
                <img src={walletConnectIcon} alt='WalletConnect' />
              </ButtonIcon>
              <ButtonText>
                <Trans>WalletConnect</Trans>
              </ButtonText>
            </LoginButton>
          </SectionWrapper>
          {/* Solana 钱包分组 */}

          <SectionWrapper>
            <SectionTitle>Solana</SectionTitle>

            <LoginButton onClick={handleMetaMaskSolanaLogin}>
              <ButtonIcon>
                <img src={metamaskIcon} alt='MetaMask' />
              </ButtonIcon>
              <ButtonText>
                <Trans>MetaMask</Trans>
              </ButtonText>
            </LoginButton>

            <LoginButton onClick={handlePhantomSolanaLogin}>
              <ButtonIcon>
                <img src={phantomIcon} alt='Phantom' />
              </ButtonIcon>
              <ButtonText>
                <Trans>Phantom</Trans>
              </ButtonText>
            </LoginButton>
          </SectionWrapper>
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
