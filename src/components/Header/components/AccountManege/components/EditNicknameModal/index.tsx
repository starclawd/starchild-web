import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import { useIsMobile, useModalOpen, useAccountManegeModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import BottomSheet from 'components/BottomSheet'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import { IconBase } from 'components/Icons'
import Input from 'components/Input'
import { t } from '@lingui/core/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'

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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(20)} ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px 0;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(12)} ${vm(12)};
    `}
`

const Nickname = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 16px;
  span:first-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
    .icon-flower {
      font-size: 8px;
      color: ${({ theme }) => theme.autumn50};
    }
  }
  span:last-child {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL4};
  }
`

const NicknameInput = styled.div`
  display: flex;
  align-items: center;
  .input-wrapper {
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.bgT30};
    background-color: ${({ theme }) => theme.black700};
    &:hover {
      border-color: ${({ theme }) => theme.textL4};
    }
    input {
      padding: 0 16px;
    }
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 8px 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(8)} 0 ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  width: 50%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
    `}
`

const ButtonConfirm = styled(ButtonCommon)`
  width: 50%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
    `}
`

export function EditNicknameModal() {
  const isMobile = useIsMobile()
  const [errorKey, setErrorKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [nickname, setNickname] = useState('')
  const editNicknameModalOpen = useModalOpen(ApplicationModal.EDIT_NICKNAME_MODAL)
  const toggleAccountManegeModal = useAccountManegeModalToggle()
  const maxNicknameLength = 20
  const currentNicknameLength = useMemo(() => {
    // 中文字符计为2个长度，英文字符计为1个长度
    let length = 0
    for (let i = 0; i < nickname.length; i++) {
      const charCode = nickname.charCodeAt(i)
      // 判断是否为中文字符或全角字符（Unicode范围）
      if (charCode >= 0x4e00 && charCode <= 0x9fa5) {
        // 中文字符
        length += 2
      } else if (charCode >= 0xff00 && charCode <= 0xffef) {
        // 全角字符
        length += 2
      } else {
        // 其他字符（英文、数字等）
        length += 1
      }
    }
    return length
  }, [nickname])

  const inputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
  }, [])

  const handleConfirm = useCallback(() => {
    if (isLoading || !nickname.trim()) return
    if (currentNicknameLength > maxNicknameLength) {
      setErrorKey('nickname')
      return
    }
    setIsLoading(true)
    console.log('handleConfirm')
    setIsLoading(false)
  }, [isLoading, nickname, currentNicknameLength, maxNicknameLength])

  const renderContent = () => {
    return (
      <>
        <Header>
          <Trans>Change Nickname</Trans>
        </Header>
        <Content>
          <Nickname>
            <span>
              <Trans>Nickname</Trans>
              <IconBase className='icon-flower' />
            </span>
            <span>
              {currentNicknameLength} / {maxNicknameLength}
            </span>
          </Nickname>
          <NicknameInput>
            <Input
              showError={errorKey === 'nickname'}
              placeholder={t`Please enter your new nickname`}
              inputValue={nickname}
              onChange={inputChange}
              clearError={() => setErrorKey('')}
            />
          </NicknameInput>
        </Content>
        <ButtonWrapper>
          <ButtonCancel onClick={toggleAccountManegeModal}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm $disabled={isLoading || !nickname.trim()} onClick={handleConfirm}>
            {isLoading ? <Pending /> : <Trans>Confirm</Trans>}
          </ButtonConfirm>
        </ButtonWrapper>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={editNicknameModalOpen}
      rootStyle={{ overflowY: 'hidden', height: `auto` }}
      onClose={toggleAccountManegeModal}
    >
      <AccountManegeMobileWrapper>{renderContent()}</AccountManegeMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={editNicknameModalOpen} onDismiss={toggleAccountManegeModal}>
      <AccountManegeWrapper>{renderContent()}</AccountManegeWrapper>
    </Modal>
  )
}
