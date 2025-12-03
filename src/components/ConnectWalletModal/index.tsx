/**
 * Vaults钱包连接模态框组件
 */
import { memo, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { useConnectWalletModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import ConnectWallets from 'pages/Home/components/HomeContent/components/ConnectWallets'
import { ApplicationModal } from 'store/application/application'
import { useAppKitAccount } from '@reown/appkit/react'

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

// 内部组件，处理实际的UI渲染
export default memo(function ConnectWalletModal() {
  const { isConnected } = useAppKitAccount()
  const connectWalletModalOpen = useModalOpen(ApplicationModal.CONNECT_WALLET_MODAL)
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (isConnected && connectWalletModalOpen) {
      toggleConnectWalletModal()
    }
  }, [isConnected, toggleConnectWalletModal, connectWalletModalOpen])

  const renderContent = () => {
    return (
      <>
        <Title>
          <Trans>Connect Wallet</Trans>
        </Title>

        <LoginButtonsContainer>
          <ConnectWallets type='vaults' />
        </LoginButtonsContainer>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={connectWalletModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `${vm(480)}` }}
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
