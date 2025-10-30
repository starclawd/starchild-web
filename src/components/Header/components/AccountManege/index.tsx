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
import googleIcon from 'assets/media/google.png'
import { IconBase } from 'components/Icons'

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

const Title = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const LoginMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const LoginMethod = styled.div`
  display: flex;
  align-items: center;
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
  color: ${({ theme }) => theme.textL3};
  i {
    font-size: 18px;
  }
  img {
    width: 18px;
    height: 18px;
  }
`

const Right = styled.div``

export function AccountManegeModal() {
  const isMobile = useIsMobile()
  const accountManegeModalOpen = useModalOpen(ApplicationModal.ACCOUNT_MANEGE_MODAL)
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const loginMethods = useMemo(() => {
    return [
      {
        key: 'Google',
        name: <Trans>Google</Trans>,
        icon: <img src={googleIcon} alt='Google' />,
        value: <Google />,
      },
      {
        key: 'Telegram',
        name: <Trans>Telegram</Trans>,
        icon: <IconBase className='icon-telegram' />,
        value: <Telegram />,
      },
      {
        key: 'Wallet',
        name: <Trans>Wallet</Trans>,
        icon: <IconBase className='icon-account-wallet' />,
        value: '',
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
