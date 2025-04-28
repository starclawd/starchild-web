import { memo, useCallback, useEffect, useState } from 'react'
import styled, { css } from "styled-components"
import Modal from "components/Modal"
import { useAddQuestionModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ModalContentWrapper } from "components/ModalWrapper"
import { ApplicationModal } from 'store/application/application.d'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { ANI_DURATION } from 'constants/index'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'


const AddQuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: 36px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
  ${({ theme }) => !theme.isMobile && css`
    padding-bottom: 20px;
  `}
`

const AddQuestionMobileWrapper = styled(ModalContentWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: rgba(25, 27, 31, 0.85);
  backdrop-filter: blur(8px);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    justify-content: flex-start;
    padding: ${vm(20)} ${vm(20)} ${vm(8)};
    font-size: 0.20rem;
    font-weight: 500;
    line-height: 0.28rem;
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  span {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)};
    span {
      padding: ${vm(8)} ${vm(16)};
      font-size: 0.13rem;
      font-weight: 400;
      line-height: 0.20rem;
    }
  `}
`

const InputWrapper = styled(BorderAllSide1PxBox)<{ $isFocused: boolean }>`
  display: flex;
  align-items: center;
  min-height: 60px;
  max-height: 264px;
  padding: 12px 16px;
  transition: all ${ANI_DURATION}s;
  ${({ $isFocused }) => $isFocused && css`
    border-color: ${({ theme }) => theme.jade10};
  `}
  textarea {
    height: 24px;
    min-height: 24px;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
    background-color: transparent;
    &::placeholder {
      color: ${({ theme }) => theme.textL4};
    }
  }
  ${({ theme }) => theme.isMobile && css`
    min-height: ${vm(60)};
    max-height: ${vm(264)};
    padding: ${vm(12)} ${vm(16)};
   
    textarea {
      height: ${vm(24)};
      min-height: ${vm(24)};
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.24rem;
    }
  `}
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(8)} ${vm(20)};
  `}
`

const ButtonSave = styled(ButtonCommon)`
  width: 100%;
`

export default memo(function AddQuestionModal({
  text,
}: {
  text?: string
}) {
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const isMobile = useIsMobile()
  const [value, setValue] = useState('')
  const addQuestionModalOpen = useModalOpen(ApplicationModal.ADD_QUESTION_MODAL)
  const toggleAddQuestionModal = useAddQuestionModalToggle()
  const addQuestion = useCallback(() => {
    console.log('addQuestion', value)
  }, [value])
  const onFocus = useCallback(() => {
    setIsFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    setIsFocused(false)
  }, [])
  useEffect(() => {
    if (text) {
      setValue(text)
    }
  }, [text])
  const Wrapper = isMobile ? AddQuestionMobileWrapper : AddQuestionWrapper
  return (
    <Modal
      useDismiss
      isOpen={addQuestionModalOpen}
      onDismiss={toggleAddQuestionModal}
    >
      <Wrapper>
        <Header>
          {
            text ? <span>Edit Question</span> : <span>Add Question</span>
          }
        </Header>
        <Content>
          <span><Trans>Question</Trans></span>
          <InputWrapper
            $borderRadius={24}
            $borderColor={theme.textL5}
            $isFocused={isFocused}
          >
            <InputArea
              id="addQuestionInput"
              value={value}
              placeholder={t`Please enter`}
              setValue={setValue}
              onFocus={onFocus}
              onBlur={onBlur}
            />
          </InputWrapper>
        </Content>
        <ButtonWrapper>
          <ButtonSave disabled={!value} onClick={addQuestion}>
            <span><Trans>Save</Trans></span>
          </ButtonSave>
        </ButtonWrapper>
      </Wrapper>
    </Modal>
  ) 
})
   