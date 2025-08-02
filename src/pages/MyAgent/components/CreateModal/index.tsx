import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import { useCreateAgentModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { t } from '@lingui/core/macro'
import Input from 'components/Input'
import Select, { TriggerMethod } from 'components/Select'
import WeeklySelect, { WEEKLY_VALUE } from '../WeeklySelect'
import TimeSelect from '../TimeSelect'
import { IconBase } from 'components/Icons'
import TimezoneSelect from '../TimezoneSelect'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { vm } from 'pages/helper'
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
  padding: 0 ${vm(20)};
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
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
      padding: ${vm(20)} 0 ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const ContentItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
  .input-area {
    height: 120px !important;
    max-height: 120px !important;
    border-radius: 12px;
    border: 1px solid ${({ theme }) => theme.bgT30};
    background-color: ${({ theme }) => theme.black700};
    backdrop-filter: blur(8px);
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    &::placeholder {
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} 0;
      .input-area {
        height: ${vm(120)};
        max-height: ${vm(120)};
        border-radius: ${vm(12)};
        padding: ${vm(12)} ${vm(16)};
        font-size: 0.14rem;
        line-height: 0.2rem;
        &::placeholder {
          font-size: 0.14rem;
          line-height: 0.2rem;
        }
      }
    `}
`

const ContentTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  height: 36px;
  gap: 4px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .icon-required {
    font-size: 8px;
    color: ${({ theme }) => theme.autumn50};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(36)};
      padding: ${vm(8)} ${vm(16)};
      font-size: 0.13rem;
      line-height: 0.2rem;
      padding: ${vm(8)} ${vm(16)};
      .icon-required {
        font-size: 0.08rem;
      }
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
      padding: ${vm(8)} 0 ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

const ButtonConfirm = styled(ButtonCommon)<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
`

export function CreateAgentModal() {
  const isMobile = useIsMobile()
  const createAgentModalOpen = useModalOpen(ApplicationModal.CREATE_AGENT_MODAL)
  const [prompt, setPrompt] = useState('')
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const changePrompt = useCallback((value: string) => {
    setPrompt(value)
  }, [])
  const Wrapper = isMobile ? CreateAgentModalMobileWrapper : CreateAgentModalWrapper
  return (
    <Modal useDismiss isOpen={createAgentModalOpen} onDismiss={toggleCreateAgentModal}>
      <Wrapper>
        <Header>
          <Trans>Create agent</Trans>
        </Header>
        <ContentItem>
          <ContentTitle>
            <Trans>Prompt</Trans>
            <IconBase className='icon-required' />
          </ContentTitle>
          <InputArea
            disabledUpdateHeight
            placeholder={t`Please enter the Agent description`}
            value={prompt}
            setValue={changePrompt}
          />
        </ContentItem>
        <BottomContent>
          <ButtonCancel onClick={toggleCreateAgentModal}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm disabled={!prompt.trim()}>
            <Trans>Confirm</Trans>
          </ButtonConfirm>
        </BottomContent>
      </Wrapper>
    </Modal>
  )
}
