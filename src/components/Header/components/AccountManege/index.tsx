import styled, { css } from 'styled-components'
import Modal, { CommonModalContent } from 'components/Modal'
import { useIsMobile, useModalOpen, useAccountManegeModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import BottomSheet from 'components/BottomSheet'
import UserInfo from './components/userInfo'
import { useCallback, useMemo } from 'react'
import { IconBase } from 'components/Icons'
import { CommonModalContentWrapper, CommonModalHeader } from 'components/Modal'
import accountModalBg from 'assets/png/account-modal-bg.png'
import { ButtonCommon } from 'components/Button'
import { useLogout, useUserInfo } from 'store/login/hooks'
import { formatAddress, getChainLabel } from 'utils'
import useCopyContent from 'hooks/useCopyContent'

const AccountManegeWrapper = styled(CommonModalContentWrapper)``

const AccountManegeMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
`

const Header = styled(CommonModalHeader)``

const Content = styled(CommonModalContent)`
  height: 188px;
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: right center;
`

const LoginMethods = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black800};
  background: rgba(0, 0, 0, 0.54);
  backdrop-filter: blur(4px);
`

const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
  }
`

const WalletAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  color: ${({ theme }) => theme.black0};
  > span:last-child {
    color: ${({ theme }) => theme.black200};
  }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const CopyButton = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
  background-color: ${({ theme }) => theme.black1000};
  i {
    font-size: 14px;
    color: ${({ theme }) => theme.black100};
  }
`

const ExitButton = styled(CopyButton)``

export function AccountManegeModal() {
  const isMobile = useIsMobile()
  const { copyRawContent } = useCopyContent()
  const [{ walletAddress }] = useUserInfo()
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const handleCopyWalletAddress = useCallback(() => {
    copyRawContent(walletAddress)
  }, [walletAddress, copyRawContent])
  const logout = useLogout()
  const renderContent = () => {
    return (
      <>
        <Header>
          <Trans>Account management</Trans>
        </Header>
        <Content style={{ backgroundImage: `url(${accountModalBg})` }}>
          <UserInfo />
          <LoginMethods>
            <Left>
              <span>
                <Trans>My wallet</Trans>
              </span>
              <WalletAddress>
                <span>{formatAddress(walletAddress)}</span>
                <span>({getChainLabel(walletAddress)})</span>
              </WalletAddress>
            </Left>
            <Right>
              <CopyButton onClick={handleCopyWalletAddress}>
                <IconBase className='icon-copy' />
              </CopyButton>
              <ExitButton onClick={logout}>
                <IconBase className='icon-logout' />
              </ExitButton>
            </Right>
          </LoginMethods>
        </Content>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={accountManegeModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `calc(100vh - ${vm(44)})` }}
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
