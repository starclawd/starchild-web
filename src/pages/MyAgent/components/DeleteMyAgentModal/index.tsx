import styled, { css, useTheme } from 'styled-components'
import Modal from 'components/Modal'
import BottomSheet from 'components/BottomSheet'
import { useIsMobile, useModalOpen, useToggleModal } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useCallback, useState } from 'react'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { useCurrentEditAgentData, useDeleteMyAgent } from 'store/myagent/hooks'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import Toast, { TOAST_STATUS } from 'components/Toast'
import useToast from 'components/Toast'
import { useGetSubscribedAgents } from 'store/agenthub/hooks/useSubscription'

const DeleteAgentModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 320px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const DeleteAgentModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${vm(12)};
  background: transparent;
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
      font-size: ${vm(20)};
      line-height: ${vm(28)};
    `}
`

const CloseButton = styled.div`
  position: absolute;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(32)};
      height: ${vm(32)};
      border-radius: ${vm(8)};
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 0 24px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      padding: ${vm(16)} 0 ${vm(24)};
    `}
`

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  text-align: center;
  max-width: 320px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
      max-width: ${vm(320)};
    `}
`

const AgentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black600};
  width: 100%;
  max-width: 320px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding: ${vm(12)} ${vm(16)};
      border-radius: ${vm(12)};
      max-width: ${vm(320)};
    `}
`

const AgentName = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  flex: 1;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

const BottomContent = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding: 0 0 ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  flex: 1;
  height: 48px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(48)};
    `}
`

const ButtonDelete = styled(ButtonCommon)<{ $disabled?: boolean }>`
  flex: 1;
  height: 48px;
  background: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.white};
  ${({ $disabled, theme }) =>
    $disabled &&
    css`
      opacity: 0.5;
      cursor: not-allowed;
      background: ${theme.brand100};
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(48)};
    `}
`

interface DeleteMyAgentModalProps {
  agent: AgentDetailDataType
}

export default function DeleteMyAgentModal() {
  const isMobile = useIsMobile()
  const [agent] = useCurrentEditAgentData()
  const toggleDeleteAgentModal = useToggleModal(ApplicationModal.DELETE_MY_AGENT_MODAL)
  const deleteAgentModalOpen = useModalOpen(ApplicationModal.DELETE_MY_AGENT_MODAL)
  const { deleteMyAgent, isLoading } = useDeleteMyAgent()
  const [isDeleting, setIsDeleting] = useState(false)
  const toast = useToast()
  const theme = useTheme()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()

  const handleDelete = useCallback(async () => {
    if (!agent || isDeleting) return

    setIsDeleting(true)
    try {
      const result = await deleteMyAgent(agent.id)
      if (result.success) {
        triggerGetSubscribedAgents()

        toast({
          title: <Trans>Agent deleted successfully</Trans>,
          description: '',
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-rubbish',
          iconTheme: theme.jade10,
        })
        toggleDeleteAgentModal()
      } else {
        toast({
          title: <Trans>Failed to delete agent</Trans>,
          description: '',
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-chat-rubbish',
          iconTheme: theme.ruby50,
        })
      }
    } catch (error) {
      console.error('Delete agent error:', error)
      toast({
        title: <Trans>Failed to delete agent</Trans>,
        description: '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-chat-rubbish',
        iconTheme: theme.ruby50,
      })
    } finally {
      setIsDeleting(false)
    }
  }, [agent, deleteMyAgent, isDeleting, toggleDeleteAgentModal, toast, theme, triggerGetSubscribedAgents])

  const renderContent = () => (
    <>
      <Header>
        <Trans>Delete Agent</Trans>
      </Header>
      <Content>
        <Description>
          <Trans>Are you sure you want to delete this agent? This action cannot be undone.</Trans>
        </Description>
      </Content>
      <BottomContent>
        <ButtonCancel onClick={toggleDeleteAgentModal} $disabled={isDeleting}>
          <Trans>Cancel</Trans>
        </ButtonCancel>
        <ButtonDelete onClick={handleDelete} $disabled={!agent || isLoading || isDeleting}>
          <Trans>Delete</Trans>
        </ButtonDelete>
      </BottomContent>
    </>
  )

  return (
    <Modal useDismiss isOpen={deleteAgentModalOpen} onDismiss={toggleDeleteAgentModal}>
      <DeleteAgentModalWrapper>{renderContent()}</DeleteAgentModalWrapper>
    </Modal>
  )
}
