import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import { useIsMobile, useModalOpen, useAccountManegeModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import BottomSheet from 'components/BottomSheet'

const AccountManegeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 580px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const AccountManegeMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  padding: 0 ${vm(20)};
  background: transparent;
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-back {
    position: absolute;
    left: 20px;
    font-size: 28px;
    color: ${({ theme }) => theme.textL1};
    cursor: pointer;
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 0;
`

export function AccountManegeModal() {
  const isMobile = useIsMobile()
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const renderContent = () => {
    return (
      <>
        <Header>
          <Trans>Account management</Trans>
        </Header>
        <Content></Content>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={accountManegeModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `100vh` }}
      onClose={toggleAccountManegeModal}
    >
      <AccountManegeMobileWrapper>{renderContent()}</AccountManegeMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={accountManegeModalOpen} onDismiss={toggleAccountManegeModal}>
      <AccountManegeWrapper>{renderContent()}</AccountManegeWrapper>
    </Modal>
  )
}
