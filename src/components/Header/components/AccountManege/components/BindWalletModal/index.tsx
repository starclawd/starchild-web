/**
 * 钱包绑定模态框组件
 */
import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import {
  useAccountManegeModalToggle,
  useIsMobile,
  useModalOpen,
  useBindWalletModalAddress,
  useCloseBindWalletModal,
  useOpenBindWalletModal,
} from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import ConnectWallets from 'pages/Home/components/HomeContent/components/ConnectWallets'
import { useGetUserInfo } from 'store/login/hooks'

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
  color: ${({ theme }) => theme.black0};
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
const BindWalletModalContent = memo(function BindWalletModalContent() {
  const isMobile = useIsMobile()
  const isOpen = useModalOpen(ApplicationModal.BIND_WALLET_MODAL)
  const bindWalletAddress = useBindWalletModalAddress()
  const closeBindWalletModal = useCloseBindWalletModal()
  const toggleAccountManageModal = useAccountManegeModalToggle()
  const triggerGetUserInfo = useGetUserInfo()

  const handleSuccess = (result?: any) => {
    triggerGetUserInfo()
    closeBindWalletModal()
    toggleAccountManageModal()
  }
  const handleError = (error: Error) => {
    closeBindWalletModal()
    toggleAccountManageModal()
  }

  const handleClose = () => {
    closeBindWalletModal()
    toggleAccountManageModal()
  }

  const renderContent = () => {
    return (
      <>
        <Title>
          <Trans>Connect</Trans>
        </Title>

        <LoginButtonsContainer>
          {/* 钱包绑定 */}
          <ConnectWallets
            type='bind'
            oldWalletAddress={bindWalletAddress || undefined}
            onSuccess={handleSuccess}
            onError={handleError}
          />
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
      rootStyle={{ overflowY: 'hidden', maxHeight: `${vm(480)}` }}
      onClose={handleClose}
    >
      <MobileModalContent>{renderContent()}</MobileModalContent>
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onDismiss={handleClose} hideClose={false} zIndex={300}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  )
})

// 导出的主组件
export default function BindWalletModal() {
  return <BindWalletModalContent />
}

// 导出handleBindWalletModal函数供其他组件使用
export { useOpenBindWalletModal as handleBindWalletModal }
