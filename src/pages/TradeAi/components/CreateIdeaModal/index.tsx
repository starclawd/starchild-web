/**
 * RewardModal奖励通知组件
 * 基于Modal实现的系统通知展示组件
 * 提供重要信息和公告的展示功能
 */

import Modal from 'components/Modal'
import { useIsMobile, useModalOpen, useCreateIdeaModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import styled, { css } from 'styled-components'
import { useCallback, Fragment, memo, useState } from 'react'
import ModalWrapper from 'components/ModalWrapper'
import InputArea from 'components/InputArea'
import { Trans } from '@lingui/react/macro'
import { IconImgUpload } from 'components/Icons'
import AiLoading from '../AiLoading'

/**
 * 确认弹窗容器样式组件
 * 控制弹窗的布局和响应式样式
 */
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 360px;
  height: auto;
  padding: 0 24px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      padding: 20px 14px 0;
      border-radius: 16px 16px 0 0;
    `
  }
`

/**
 * 标题文本样式组件
 */
const Title = styled.span`
  display: flex;
  align-items: center;
  height: 64px;
  font-size: 16px;
  font-weight: 800;
  line-height: 20px;
  color: ${({ theme }) => theme.text1};
`

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 212px;
  border-radius: 12px;
  padding: 12px;
  background-color: ${({ theme }) => theme.bg7};
  .input-area {
    max-height: 126px;
  }
`

const OperatorWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  height: 74px;
`

const OperatorContent = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Line = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${({ theme }) => theme.line1};
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 8px;
  margin: 20px 0;
`

const CancelButton = styled.div`
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
`
/**
 * 确认按钮样式组件
 */
const ConfirmButton = styled.div`
  width: 100%;
  height: 44px;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
`

/**
 * RewardModal组件
 * 展示系统通知和重要公告
 */
export default memo(function CreateIdeaModal() {
  const isMobile = useIsMobile()

  const [value, setValue] = useState('')
  const createIdeaModalOpen = useModalOpen(ApplicationModal.CREATE_IDEA_MODAL)
  const toggleCreateIdeaModal = useCreateIdeaModalToggle()
  const uploadImg = useCallback(() => {
    console.log('uploadImg')
  }, [])
  const closeCallback = useCallback(() => {
    toggleCreateIdeaModal()
  }, [toggleCreateIdeaModal])
  /* 根据设备类型选择包装组件 */
  const Wrapper = isMobile ? ModalWrapper : Fragment
  const props = isMobile ? {
    isShow: createIdeaModalOpen,
  } : {}

  return (
    <Modal useDismiss isOpen={createIdeaModalOpen} onDismiss={closeCallback}>
      <Wrapper {...(props as any)}>
        <ContentWrapper>
          <Title>Create an idea</Title>
          <InputWrapper>
            <InputArea
              value={value}
              setValue={setValue}
            />
            <OperatorWrapper>
              <OperatorContent>
                <IconImgUpload onClick={uploadImg} />
                <Line></Line>
                <AiLoading isLoading={false} isRecording={false} />
              </OperatorContent>
            </OperatorWrapper>
          </InputWrapper>
          <ButtonWrapper>
            <CancelButton onClick={closeCallback}><Trans>Cancel</Trans></CancelButton>
            <ConfirmButton onClick={closeCallback}><Trans>Confirm</Trans></ConfirmButton>
          </ButtonWrapper>
        </ContentWrapper>
      </Wrapper>
    </Modal>
  )
})
