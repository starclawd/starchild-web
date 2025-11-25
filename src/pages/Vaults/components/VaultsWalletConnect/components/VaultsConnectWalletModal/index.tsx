/**
 * Vaults钱包连接模态框组件
 */
import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import ConnectWallets from 'pages/Home/components/HomeContent/components/ConnectWallets'

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

interface VaultsConnectWalletModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (result?: any) => void
  onError?: (error: Error) => void
}

// 内部组件，处理实际的UI渲染
const VaultsConnectWalletModalContent = memo(function VaultsConnectWalletModalContent({
  isOpen,
  onClose,
  onSuccess,
  onError,
}: VaultsConnectWalletModalProps) {
  const isMobile = useIsMobile()

  const handleSuccess = (result?: any) => {
    onSuccess?.(result)
    onClose()
  }

  const handleError = (error: Error) => {
    onError?.(error)
    onClose()
  }

  const renderContent = () => {
    return (
      <>
        <Title>
          <Trans>Connect Wallet</Trans>
        </Title>

        <LoginButtonsContainer>
          <ConnectWallets type='vaults' onSuccess={handleSuccess} onError={handleError} />
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
      onClose={onClose}
    >
      <MobileModalContent>{renderContent()}</MobileModalContent>
    </BottomSheet>
  ) : (
    <Modal isOpen={isOpen} onDismiss={onClose} hideClose={false} zIndex={300}>
      <ModalContent>{renderContent()}</ModalContent>
    </Modal>
  )
})

// 导出的主组件
export default function VaultsConnectWalletModal(props: VaultsConnectWalletModalProps) {
  return <VaultsConnectWalletModalContent {...props} />
}
