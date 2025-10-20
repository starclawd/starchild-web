import styled, { css, useTheme } from 'styled-components'
import Modal from 'components/Modal'
import { useModalOpen, useToggleModal } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useCallback, useState } from 'react'
import { vm } from 'pages/helper'
import { useCurrentEditAgentData, useDeleteMyAgent } from 'store/myagent/hooks'
import { TOAST_STATUS } from 'components/Toast'
import useToast from 'components/Toast'
import { useGetSubscribedAgents } from 'store/agenthub/hooks/useSubscription'
import { useAgentDetailData, useGetAgentDetail } from 'store/agentdetail/hooks'

const DeleteAgentModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(320)};
      padding: 0 ${vm(12)};
    `}
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0 28px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      padding: ${vm(16)} 0 ${vm(28)};
    `}
`

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const BottomContent = styled.div`
  display: flex;
  gap: 12px;
  padding: 0 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: 0 0 ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  flex: 1;
  height: 60px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
    `}
`

const ButtonDelete = styled(ButtonCommon)<{ $disabled?: boolean }>`
  flex: 1;
  height: 60px;
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
      height: ${vm(40)};
    `}
`

export default function DeleteMyAgentModal() {
  const [agent] = useCurrentEditAgentData()
  const [agentDetailData] = useAgentDetailData()
  const triggerGetAgentDetail = useGetAgentDetail()
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
        // 如果当前AgentDetail页面显示的是被删除的agent，重新获取数据
        if (agentDetailData?.id === agent.id) {
          await triggerGetAgentDetail(agent.id.toString())
        }

        toast({
          title: <Trans>Agent deleted</Trans>,
          description: <Trans>The agent has been successfully deleted.</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-chat-rubbish',
          iconTheme: theme.ruby50,
        })
        toggleDeleteAgentModal()
      } else {
        toast({
          title: <Trans>Failed to Delete Agent</Trans>,
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
  }, [
    agent,
    deleteMyAgent,
    isDeleting,
    toggleDeleteAgentModal,
    toast,
    theme,
    triggerGetSubscribedAgents,
    agentDetailData,
    triggerGetAgentDetail,
  ])

  return (
    <Modal useDismiss isOpen={deleteAgentModalOpen} onDismiss={toggleDeleteAgentModal} forceWeb={true}>
      <DeleteAgentModalWrapper>
        <Header>
          <Trans>Delete Agent</Trans>
        </Header>
        <Content>
          <Description>
            <Trans>Are you sure you want to delete this agent? This action is permanent and cannot be undone.</Trans>
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
      </DeleteAgentModalWrapper>
    </Modal>
  )
}
