import styled, { css } from 'styled-components'
import Modal, {
  CommonModalContent,
  CommonModalContentWrapper,
  CommonModalFooter,
  CommonModalHeader,
} from 'components/Modal'
import {
  useIsMobile,
  useModalOpen,
  useAccountManegeModalToggle,
  useEditNicknameModalToggle,
} from 'store/application/hooks'
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
import { useChangeNickname, useGetUserInfo } from 'store/login/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'

const AccountManegeMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  background: transparent;
`

const Content = styled(CommonModalContent)`
  gap: 0;
`

const Nickname = styled.div<{ $currentNicknameLength: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 0;
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black100};
    .icon-flower {
      font-size: 8px;
      color: ${({ theme }) => theme.autumn50};
    }
  }
  > span:last-child {
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black300};
    ${({ $currentNicknameLength }) =>
      $currentNicknameLength > 0 &&
      css`
        span {
          color: ${({ theme }) => theme.black0};
        }
      `}
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} 0;
      > span:first-child {
        gap: ${vm(4)};
        font-size: 0.13rem;
        line-height: 0.2rem;
        .icon-flower {
          font-size: 0.08rem;
        }
      }
      > span:last-child {
        font-size: 0.13rem;
        line-height: 0.2rem;
      }
    `}
`

const NicknameInput = styled.div`
  display: flex;
  align-items: center;
  .input-wrapper {
    background-color: ${({ theme }) => theme.black700};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .input-wrapper {
        border-radius: ${vm(12)};
        input {
          padding: 0 ${vm(16)};
        }
      }
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  width: 50%;
  border: 1px solid ${({ theme }) => theme.black600};
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
  const toast = useToast()
  const theme = useTheme()
  const changeNickname = useChangeNickname()
  const triggerGetUserInfo = useGetUserInfo()
  const editNicknameModalOpen = useModalOpen(ApplicationModal.EDIT_NICKNAME_MODAL)
  // const toggleAccountManegeModal = useAccountManegeModalToggle()
  const toggleEditNicknameModal = useEditNicknameModalToggle()
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

  const handleConfirm = useCallback(async () => {
    if (isLoading || !nickname.trim()) return
    if (currentNicknameLength > maxNicknameLength) {
      setErrorKey('nickname')
      return
    }
    setIsLoading(true)
    const result = await changeNickname(nickname)
    if (result.isSuccess) {
      await triggerGetUserInfo()
      toast({
        title: <Trans>Updated successfully</Trans>,
        description: nickname,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-account',
        iconTheme: theme.black0,
      })
      if (editNicknameModalOpen) {
        toggleEditNicknameModal()
      }
    }
    setIsLoading(false)
  }, [
    theme,
    isLoading,
    nickname,
    currentNicknameLength,
    maxNicknameLength,
    editNicknameModalOpen,
    toggleEditNicknameModal,
    toast,
    triggerGetUserInfo,
    changeNickname,
  ])

  const renderContent = () => {
    return (
      <>
        <CommonModalHeader>
          <Trans>Change Nickname</Trans>
        </CommonModalHeader>
        <Content>
          <Nickname $currentNicknameLength={currentNicknameLength}>
            <span>
              <Trans>Nickname</Trans>
              <IconBase className='icon-flower' />
            </span>
            <span>
              <span>{currentNicknameLength}</span>/{maxNicknameLength}
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
        <CommonModalFooter>
          <ButtonCancel onClick={toggleEditNicknameModal}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm $disabled={isLoading || !nickname.trim()} onClick={handleConfirm}>
            {isLoading ? <Pending /> : <Trans>Confirm</Trans>}
          </ButtonConfirm>
        </CommonModalFooter>
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
      onClose={toggleEditNicknameModal}
    >
      <AccountManegeMobileWrapper>{renderContent()}</AccountManegeMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={editNicknameModalOpen} onDismiss={toggleEditNicknameModal}>
      <CommonModalContentWrapper>{renderContent()}</CommonModalContentWrapper>
    </Modal>
  )
}
