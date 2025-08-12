import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { useCreateAgentModalToggle, useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import Popover from 'components/Popover'
import { vm } from 'pages/helper'
import { ROUTER } from 'pages/router'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useIsSelfAgent } from 'store/agenthub/hooks'
import { useAgentLastViewTimestamp } from 'store/myagentcache/hooks'

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

const OperatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 4px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black700};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(160)};
      padding: ${vm(4)};
      border-radius: ${vm(12)};
    `}
`

const EditWrapper = styled.div<{ $isSelfAgent: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 8px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  &:last-child {
    i {
      color: ${({ theme, $isSelfAgent }) => ($isSelfAgent ? theme.red100 : theme.textL1)};
    }
    span {
      color: ${({ theme, $isSelfAgent }) => ($isSelfAgent ? theme.red100 : theme.textL2)};
    }
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(36)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
          gap: ${vm(6)};
          i {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.14rem;
            font-weight: 400;
            line-height: 0.2rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT20};
          }
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
  height: 14px;
  padding: 0 6px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  color: ${({ theme }) => theme.brand100};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(14)};
      padding: 0 ${vm(6)};
      font-size: 0.1rem;
      line-height: 0.14rem;
    `}
`

export default function AgentOperator({ data }: { data: AgentDetailDataType }) {
  const theme = useTheme()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isShowTaskOperator, setIsShowTaskOperator] = useState(false)
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const isSelfAgent = useIsSelfAgent(data.task_id)
  const lastViewTimestamp = useAgentLastViewTimestamp(data.task_id)

  // 计算未读的 trigger history 数量
  const { trigger_history } = data
  const len = useMemo(() => {
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

  const editAgent = useCallback(() => {
    // setCurrentAgentData(data)
    toggleCreateAgentModal()
    setIsShowTaskOperator(false)
  }, [toggleCreateAgentModal])

  const closeAgent = useCallback(async () => {
    // await triggerCloseTask(id)
    setIsShowTaskOperator(false)
  }, [])

  const deleteAgent = useCallback(async () => {
    // await triggerDeleteTask(id)
    setIsShowTaskOperator(false)
  }, [])

  const itemList = useMemo(() => {
    return [
      {
        key: 'edit',
        icon: 'icon-chat-new',
        text: <Trans>Edit</Trans>,
        onClick: editAgent,
      },
      {
        key: 'close',
        icon: 'icon-chat-stop-play',
        text: <Trans>Pause</Trans>,
        onClick: closeAgent,
      },
      {
        key: 'delete',
        icon: isSelfAgent ? 'icon-chat-rubbish' : 'icon-chat-noti-enable',
        text: isSelfAgent ? <Trans>Delete</Trans> : <Trans>Subscribed</Trans>,
        onClick: deleteAgent,
      },
    ]
  }, [isSelfAgent, editAgent, closeAgent, deleteAgent])

  const showTaskOperator = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      setIsShowTaskOperator(!isShowTaskOperator)
    },
    [isShowTaskOperator],
  )

  return (
    <TopRight onClick={showTaskOperator} className='top-right'>
      {len > 0 && (
        <TriggerTimes $borderRadius={44} $borderColor={theme.bgT20}>
          {len}
        </TriggerTimes>
      )}
      <Popover
        placement='top-end'
        show={isShowTaskOperator}
        onClickOutside={() => setIsShowTaskOperator(false)}
        offsetTop={-10}
        offsetLeft={-10}
        content={
          <OperatorWrapper>
            {itemList.map((item) => (
              <EditWrapper $isSelfAgent={isSelfAgent} key={item.key} onClick={item.onClick}>
                <IconWrapper>
                  <IconBase className={item.icon} />
                </IconWrapper>
                <span>{item.text}</span>
              </EditWrapper>
            ))}
          </OperatorWrapper>
        }
      >
        <IconWrapper $showHover={true}>
          <IconBase className='icon-chat-more' />
        </IconWrapper>
      </Popover>
    </TopRight>
  )
}
