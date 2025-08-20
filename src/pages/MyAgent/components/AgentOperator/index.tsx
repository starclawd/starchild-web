import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import AgentActions, { ActionType } from 'components/AgentActions'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useCreateAgentModalToggle } from 'store/application/hooks'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'
import { useTheme } from 'store/themecache/hooks'
import Popover from 'components/Popover'
import { IconBase } from 'components/Icons'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

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
  color: ${({ theme }) => theme.textDark54};
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
              background-color: ${({ theme }) => theme.bgT20};
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

function AgentOperator({ data }: { data: AgentDetailDataType }) {
  const theme = useTheme()
  const [isShowTaskOperator, setIsShowTaskOperator] = useState(false)
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const [lastViewTimestamp] = useAgentLastViewTimestamp(data.task_id)

  // 计算未读的 trigger history 数量
  const { trigger_history } = data
  const unreadCount = useMemo(() => {
    if (!trigger_history || trigger_history.length === 0) {
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
    // setCurrentAgentData(data)
    toggleCreateAgentModal()
  }, [toggleCreateAgentModal])

  const handlePause = useCallback(async () => {
    // await triggerCloseTask(id)
    console.log('Pause agent:', data.task_id)
  }, [data.task_id])

  const handleDelete = useCallback(async () => {
    // await triggerDeleteTask(id)
    console.log('Delete agent:', data.task_id)
  }, [data.task_id])

  const handleSubscribe = useCallback(async () => {
    // Handle subscribe/unsubscribe logic
    console.log('Subscribe/Unsubscribe agent:', data.task_id)
  }, [data.task_id])

  const handleShare = useCallback(() => {
    console.log('Share agent:', data.task_id)
  }, [data.task_id])

  const showTaskOperator = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsShowTaskOperator(!isShowTaskOperator)
    },
    [isShowTaskOperator],
  )

  return (
    <TopRight onClick={showTaskOperator} className='top-right'>
      {unreadCount > 0 && (
        <TriggerTimes $borderRadius={44} $borderColor={theme.bgT20}>
          {unreadCount}
        </TriggerTimes>
      )}
      <Popover
        placement='top-end'
        show={isShowTaskOperator}
        onClickOutside={() => setIsShowTaskOperator(false)}
        offsetTop={-10}
        offsetLeft={-10}
        content={
          <AgentActions
            data={data}
            mode='dropdown'
            actions={[ActionType.EDIT, ActionType.PAUSE, ActionType.DELETE, ActionType.SUBSCRIBE]}
            onEdit={handleEdit}
            onPause={handlePause}
            onDelete={handleDelete}
            onSubscribe={handleSubscribe}
            onShare={handleShare}
            onClose={() => setIsShowTaskOperator(false)}
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
