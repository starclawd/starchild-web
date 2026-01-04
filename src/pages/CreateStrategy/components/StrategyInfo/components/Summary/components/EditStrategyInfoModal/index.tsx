import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { useEditStrategyInfoModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { ChangeEvent, memo, useCallback, useState } from 'react'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import Input from 'components/Input'
import { ANI_DURATION } from 'constants/index'
import { useEditStrategy, useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { t } from '@lingui/core/macro'
import { useTheme } from 'store/themecache/hooks'
const CreateAgentModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 580px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const CreateAgentModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${vm(12)};
  background: transparent;
  /* 移除背景和模糊效果，因为 BottomSheet 会提供 */
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(8)} ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 20px 0;
`

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  > span {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 12px;
    height: 28px;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
    .icon-flower {
      font-size: 8px;
      color: ${({ theme }) => theme.autumn50};
    }
  }
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 44px;
  .input-wrapper {
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.bgT30};
    background: ${({ theme }) => theme.black700};
    backdrop-filter: blur(8px);
    input {
      padding: 12px;
    }
  }
`

const AreaWrapper = styled.div<{ $isFocused: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 44px;
  max-height: 64px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background: ${({ theme }) => theme.black700};
  backdrop-filter: blur(8px);
  transition: all ${ANI_DURATION}s;
  .input-area {
    padding: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
  }
  ${({ $isFocused }) =>
    $isFocused &&
    css`
      border-color: ${({ theme }) => theme.textL3};
    `}
`

const BottomContent = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(8)} ${vm(8)} ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 50%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const ButtonConfirm = styled(ButtonCommon)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 50%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export default memo(function EditStrategyInfoModal({
  nameProp,
  descriptionProp,
}: {
  nameProp: string
  descriptionProp: string
}) {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const { strategyId } = useParsedQueryString()
  const [name, setName] = useState(nameProp)
  const { refetch: refetchStrategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const triggerEditStrategy = useEditStrategy()
  const toggleEditStrategyInfoModal = useEditStrategyInfoModalToggle()
  const editStrategyInfoModalOpen = useModalOpen(ApplicationModal.EDIT_STRATEGY_INFO_MODAL)
  const changeName = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // if (value.length > 20) {
    //   return
    // }
    setName(value)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!name.trim() || isLoading) {
      return
    }
    setIsLoading(true)
    try {
      const data = await triggerEditStrategy({ name, strategyId: strategyId || '', description: descriptionProp })
      if ((data as any).data?.status === 'success') {
        await refetchStrategyDetail()
        if (editStrategyInfoModalOpen) {
          toggleEditStrategyInfoModal()
        }
        toast({
          title: <Trans>Edit success</Trans>,
          description: <Trans>Strategy has been successfully updated</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-edit',
          iconTheme: theme.jade10,
        })
      }
    } catch (error) {
      console.error('handleConfirm error', error)
    } finally {
      setIsLoading(false)
    }
    setIsLoading(false)
  }, [
    name,
    isLoading,
    descriptionProp,
    editStrategyInfoModalOpen,
    strategyId,
    theme.jade10,
    toast,
    refetchStrategyDetail,
    triggerEditStrategy,
    toggleEditStrategyInfoModal,
  ])

  const renderContent = () => (
    <>
      <Header>
        <Trans>Strategy info</Trans>
      </Header>
      <ContentWrapper>
        <ContentItem>
          <span>
            <Trans>Name</Trans>
            <IconBase className='icon-flower' />
          </span>
          <InputWrapper>
            <Input inputValue={name} onChange={changeName} />
          </InputWrapper>
        </ContentItem>
      </ContentWrapper>
      <BottomContent>
        <ButtonCancel onClick={toggleEditStrategyInfoModal}>
          <Trans>Cancel</Trans>
        </ButtonCancel>
        <ButtonConfirm onClick={handleConfirm} $disabled={!name.trim()}>
          {isLoading ? <Pending /> : <Trans>Confirm</Trans>}
        </ButtonConfirm>
      </BottomContent>
    </>
  )

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={editStrategyInfoModalOpen}
      rootStyle={{ height: 'fit-content' }}
      onClose={toggleEditStrategyInfoModal}
    >
      <CreateAgentModalMobileWrapper>{renderContent()}</CreateAgentModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={editStrategyInfoModalOpen} onDismiss={toggleEditStrategyInfoModal}>
      <CreateAgentModalWrapper>{renderContent()}</CreateAgentModalWrapper>
    </Modal>
  )
})
