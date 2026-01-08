import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import { useIsMobile, useModalOpen, useAccountManegeModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import BottomSheet from 'components/BottomSheet'
import Divider from 'components/Divider'
import UserInfo from './components/userInfo'
import { useMemo } from 'react'
import Google from './components/Google'
import Telegram from './components/Telegram'
import Wallet from './components/Wallet'
import googleIcon from 'assets/media/google.png'
import { IconBase } from 'components/Icons'

const AccountManegeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 580px;
  background: ${({ theme }) => theme.black900};
  border-radius: 8px;
  position: relative;
`

const AccountManegeMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 0 8px;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(12)} ${vm(12)};
    `}
`

const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const LoginMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const LoginMethod = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
  i {
    font-size: 18px;
  }
  img {
    width: 18px;
    height: 18px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      i {
        font-size: 0.18rem;
      }
      img {
        width: ${vm(18)};
        height: ${vm(18)};
      }
    `}
`

const Right = styled.div``

export function AccountManegeModal() {
  const isMobile = useIsMobile()
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const loginMethods = useMemo(() => {
    return [
      {
        key: 'Wallet',
        name: <Trans>Wallet</Trans>,
        icon: <IconBase className='icon-wallet' />,
        value: <Wallet />,
      },
    ]
  }, [])
  const renderContent = () => {
    return (
      <>
        <Header>
          <Trans>Account management</Trans>
        </Header>
        <Content>
          <Title>
            <Trans>Profile Summary</Trans>
          </Title>
          <Divider paddingVertical={20} paddingHorizontal={0} />
          <UserInfo />
          <Divider paddingVertical={20} paddingHorizontal={0} />
          <LoginMethods>
            {loginMethods.map((item) => {
              const { key, name, icon, value } = item
              return (
                <LoginMethod key={key}>
                  <Left>
                    {icon}
                    <span>{name}</span>
                  </Left>
                  <Right>{value}</Right>
                </LoginMethod>
              )
            })}
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
