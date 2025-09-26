import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { useCreateAgentModalToggle, useCurrentRouter, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { useCallback, useEffect, useState } from 'react'
import { t } from '@lingui/core/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import {
  useCurrentEditAgentData,
  useCurrentMyAgentDetailData,
  useEditMyAgent,
  useFetchCurrentAgentDetailData,
} from 'store/myagent/hooks'
import { useAddNewThread, useSendAiContent } from 'store/chat/hooks'
import { ROUTER } from 'pages/router'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useGetSubscribedAgents } from 'store/agenthub/hooks'
import { useAgentDetailData, useGetAgentDetail } from 'store/agentdetail/hooks'
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
      padding: ${vm(12)} 0;
      .input-area {
        height: ${vm(160)};
        max-height: ${vm(160)};
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
      padding: ${vm(8)} ${vm(8)} ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
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
  width: 50%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export function CreateAgentModal() {
  const isMobile = useIsMobile()
  const [prompt, setPrompt] = useState('')
  const toast = useToast()
  const sendAiContent = useSendAiContent()
  const addNewThread = useAddNewThread()
  const [, setCurrentRouter] = useCurrentRouter()
  const [currentEditAgentData, setCurrentEditAgentData] = useCurrentEditAgentData()
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const createAgentModalOpen = useModalOpen(ApplicationModal.CREATE_AGENT_MODAL)
  const { editMyAgent, isLoading: isEditLoading } = useEditMyAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const [currentAgentDetailData] = useCurrentMyAgentDetailData()
  const { fetchCurrentAgentDetailData } = useFetchCurrentAgentDetailData()
  const [agentDetailData] = useAgentDetailData()
  const triggerGetAgentDetail = useGetAgentDetail()
  const changePrompt = useCallback((value: string) => {
    setPrompt(value)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (!prompt.trim()) return

    // 如果是编辑模式
    if (currentEditAgentData) {
      try {
        const result = await editMyAgent(String(currentEditAgentData.id), prompt)
        if (result.success) {
          toast({
            title: '编辑成功',
            description: 'Agent 已成功更新',
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-chat-complete',
            iconTheme: '#10B981',
          })
          setCurrentEditAgentData(null)
          toggleCreateAgentModal()
          triggerGetSubscribedAgents()
          if (currentAgentDetailData?.id === currentEditAgentData.id) {
            fetchCurrentAgentDetailData()
          }
          if (agentDetailData?.id === currentEditAgentData.id) {
            triggerGetAgentDetail(currentEditAgentData.id.toString())
          }
        } else {
          toast({
            title: '编辑失败',
            description: '更新 Agent 失败，请稍后重试',
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-chat-close',
            iconTheme: '#EF4444',
          })
        }
      } catch (error) {
        console.error('Edit agent error:', error)
        toast({
          title: '编辑失败',
          description: '更新 Agent 时发生错误',
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-chat-close',
          iconTheme: '#EF4444',
        })
      }
    } else {
      // 创建模式
      addNewThread()
      setCurrentRouter(ROUTER.CHAT)
      sendAiContent({
        value: prompt,
      })
      toggleCreateAgentModal()
    }
  }, [
    prompt,
    currentEditAgentData,
    editMyAgent,
    toast,
    setCurrentEditAgentData,
    toggleCreateAgentModal,
    addNewThread,
    sendAiContent,
    setCurrentRouter,
  ])

  useEffect(() => {
    if (currentEditAgentData) {
      setPrompt(currentEditAgentData.description)
    } else {
      setPrompt('')
    }
  }, [currentEditAgentData])

  const renderContent = () => (
    <>
      <Header>{currentEditAgentData ? <Trans>Edit Agent</Trans> : <Trans>Create Agent</Trans>}</Header>
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
        <ButtonConfirm onClick={handleConfirm} $disabled={!prompt.trim() || isEditLoading}>
          <Trans>Confirm</Trans>
        </ButtonConfirm>
      </BottomContent>
    </>
  )

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={createAgentModalOpen}
      rootStyle={{ height: 'fit-content' }}
      onClose={toggleCreateAgentModal}
    >
      <CreateAgentModalMobileWrapper>{renderContent()}</CreateAgentModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={createAgentModalOpen} onDismiss={toggleCreateAgentModal}>
      <CreateAgentModalWrapper>{renderContent()}</CreateAgentModalWrapper>
    </Modal>
  )
}
