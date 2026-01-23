import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import AgentActions from 'pages/AgentDetail/components/AgentActions'
import { ActionType } from 'pages/AgentDetail/components/AgentActions/types'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import {
  useCreateAgentModalToggle,
  useDeleteMyAgentModalToggle,
  useIsMobile,
  useIsPopoverOpen,
  useIsShowMobileMenu,
} from 'store/application/hooks'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'
import { useTheme } from 'store/themecache/hooks'
import Popover from 'components/Popover'
import { IconBase } from 'components/Icons'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { useCurrentEditAgentData } from 'store/myagent/hooks'
import useSubErrorInfo from 'hooks/useSubErrorInfo'
import {
  useGetSubscribedAgents,
  useIsAgentSubscribed,
  useSubscribeAgent,
  useUnsubscribeAgent,
} from 'store/agenthub/hooks'
import { isPro } from 'utils/url'
import DeleteMyAgentModal from '../DeleteMyAgentModal'
import { ApplicationModal } from 'store/application/application'

const TopRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      height: ${vm(24)};
    `}
`

const IconWrapper = styled.div<{ $showHover?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 18px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black200};
  ${({ theme, $showHover }) =>
    theme.isMobile
      ? css`
          width: ${vm(24)};
          height: ${vm(24)};
          font-size: 0.18rem;
        `
      : css`
          cursor: pointer;
          ${$showHover &&
          css`
            &:hover {
              background-color: ${({ theme }) => theme.black800};
            }
          `}
        `}
`

const TriggerTimes = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 24px;
  height: 14px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: ${({ theme }) => theme.brand100};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: ${vm(24)};
      height: ${vm(14)};
      padding: 0 ${vm(6)};
      font-size: 0.1rem;
      line-height: 0.14rem;
    `}
`

function AgentOperator({
  data,
  showTriggerTimes = true,
  offsetTop = -10,
  offsetLeft = -10,
}: {
  data: AgentDetailDataType
  showTriggerTimes?: boolean
  offsetTop?: number
  offsetLeft?: number
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const [isShowTaskOperator, setIsShowTaskOperator] = useState(false)
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const toggleDeleteMyAgentModal = useDeleteMyAgentModalToggle()
  const [lastViewTimestamp] = useAgentLastViewTimestamp(data.task_id)
  const [, setIsPopoverOpen] = useIsPopoverOpen()
  const [, setCurrentEditAgentData] = useCurrentEditAgentData()
  const subErrorInfo = useSubErrorInfo()
  const triggerSubscribeAgent = useSubscribeAgent()
  const triggerUnsubscribeAgent = useUnsubscribeAgent()
  const triggerGetSubscribedAgents = useGetSubscribedAgents()
  const { id } = data
  const isSubscribed = useIsAgentSubscribed(id)

  // 计算未读的 trigger history 数量
  const { trigger_history } = data
  const unreadCount = useMemo(() => {
    if (!trigger_history || !Array.isArray(trigger_history) || trigger_history.length === 0) {
      return 0
    }
    // 如果没有lastViewTimestamp，说明用户从未查看过，返回所有记录数
    if (!lastViewTimestamp) {
      return trigger_history.length
    }
    // 过滤出 trigger_time 比最后查看时间戳新的记录
    return trigger_history.filter((item: { trigger_time: number }) => item.trigger_time > lastViewTimestamp).length
  }, [trigger_history, lastViewTimestamp])

  const handleEdit = useCallback(() => {
    setCurrentEditAgentData(data)
    toggleCreateAgentModal()
    if (isMobile) {
      setIsShowMobileMenu(false)
    }
  }, [data, isMobile, setIsShowMobileMenu, toggleCreateAgentModal, setCurrentEditAgentData])

  const handlePause = useCallback(async () => {
    // await triggerCloseTask(id)
    console.log('Pause agent:', data.task_id)
  }, [data.task_id])

  const handleDelete = useCallback(async () => {
    setCurrentEditAgentData(data)
    toggleDeleteMyAgentModal()
    if (isMobile) {
      setIsShowMobileMenu(false)
    }
  }, [data, isMobile, setIsShowMobileMenu, toggleDeleteMyAgentModal, setCurrentEditAgentData])

  const handleSubscribe = useCallback(async () => {
    setIsSubscribeLoading(true)
    try {
      if (subErrorInfo()) {
        setIsSubscribeLoading(false)
        return
      }
      const res = await (isSubscribed ? triggerUnsubscribeAgent : triggerSubscribeAgent)(id)
      if (res) {
        await triggerGetSubscribedAgents()
      }
      setIsSubscribeLoading(false)
    } catch (error) {
      setIsSubscribeLoading(false)
    }
  }, [id, triggerGetSubscribedAgents, triggerSubscribeAgent, triggerUnsubscribeAgent, isSubscribed, subErrorInfo])

  const showTaskOperator = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      const newValue = !isShowTaskOperator
      setIsShowTaskOperator(newValue)
      if (isMobile) {
        setIsShowMobileMenu(false)
      }
    },
    [isShowTaskOperator, isMobile, setIsShowMobileMenu],
  )

  const closeTaskOperator = useCallback(() => {
    setIsShowTaskOperator(false)
    if (isMobile) {
      setIsShowMobileMenu(false)
    }
  }, [isMobile, setIsShowMobileMenu])

  return (
    <TopRight onClick={showTaskOperator} className='top-right'>
      {unreadCount > 0 && showTriggerTimes && (
        <TriggerTimes $borderRadius={44} $borderColor={theme.black800}>
          {unreadCount}
        </TriggerTimes>
      )}
      <Popover
        placement='top-end'
        show={isShowTaskOperator}
        onClickOutside={closeTaskOperator}
        offsetTop={offsetTop}
        offsetLeft={offsetLeft}
        content={
          <AgentActions
            data={data}
            mode='dropdown'
            actions={
              isPro
                ? [ActionType.SHARE, ActionType.EDIT, ActionType.DELETE, ActionType.SUBSCRIBE]
                : [ActionType.SHARE, ActionType.EDIT, ActionType.DELETE, ActionType.SUBSCRIBE]
            }
            onEdit={handleEdit}
            onPause={handlePause}
            onDelete={handleDelete}
            onSubscribe={handleSubscribe}
            onClose={closeTaskOperator}
          />
        }
      >
        <IconWrapper $showHover={true}>
          <IconBase className='icon-chat-more' />
        </IconWrapper>
      </Popover>
    </TopRight>
  )
}

export default memo(AgentOperator)
