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

const TopRight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 18px;
  i {
    cursor: pointer;
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  .icon-chat-rubbish {
    color: ${({ theme }) => theme.ruby50};
  }
  .icon-chat-more {
    color: ${({ theme }) => theme.textDark54};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      height: ${vm(18)};
      i {
        font-size: 0.18rem;
      }
    `}
`

const OperatorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 12px;
  gap: 8px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: ${({ theme }) => theme.bgL0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(270)};
      padding: ${vm(20)};
      gap: ${vm(20)};
      border: none;
      border-radius: ${vm(24)};
      background-color: ${({ theme }) => theme.sfC2};
      box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.5);
    `}
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.bgT20};
`

const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    gap: 6px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(36)};
          > span:first-child {
            gap: ${vm(12)};
            font-size: 0.16rem;
            font-weight: 500;
            line-height: 0.24rem;
          }
        `
      : css`
          cursor: pointer;
          border-radius: 12px;
          padding: 0 12px;
          transition: all ${ANI_DURATION}s;
          &:hover {
            background-color: ${({ theme }) => theme.bgL2};
          }
        `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-new,
  .icon-chat-rubbish,
  .icon-chat-stop-play,
  .icon-task-list {
    font-size: 24px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(36)};
      height: ${vm(36)};
      border-radius: 50%;
      background-color: ${({ theme }) => theme.sfC1};
      .icon-chat-new,
      .icon-chat-rubbish,
      .icon-chat-stop-play,
      .icon-task-list {
        font-size: 0.18rem;
      }
    `}
`

const DeleteWrapper = styled(EditWrapper)`
  width: 100%;
  height: 36px;
  > span:first-child {
    color: ${({ theme }) => theme.ruby50};
    .icon-chat-rubbish {
      color: ${({ theme }) => theme.ruby50};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(36)};
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
  color: ${({ theme }) => theme.blue100};
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
  // 这里应该是未读的 trigger history 数量
  const { trigger_history } = data
  const len = 0

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

  const showTaskOperator = useCallback(() => {
    setIsShowTaskOperator(!isShowTaskOperator)
  }, [isShowTaskOperator])

  const goMyAgentPage = useCallback(() => {
    setIsShowTaskOperator(false)
    setCurrentRouter(ROUTER.MY_AGENT)
  }, [setCurrentRouter])

  return (
    <TopRight onClick={showTaskOperator} className='top-right'>
      {len > 0 && (
        <TriggerTimes $borderRadius={44} $borderColor={theme.bgT20}>
          {len}
        </TriggerTimes>
      )}
      <Popover
        placement='bottom-end'
        show={isShowTaskOperator}
        onClickOutside={() => setIsShowTaskOperator(false)}
        offsetTop={0}
        offsetLeft={0}
        content={
          <OperatorWrapper>
            <EditWrapper onClick={editAgent}>
              <span>
                <IconWrapper>
                  <IconBase className='icon-chat-new' />
                </IconWrapper>
                <span>
                  <Trans>Edit</Trans>
                </span>
              </span>
            </EditWrapper>
            <EditWrapper onClick={closeAgent}>
              <span>
                <IconWrapper>
                  <IconBase className='icon-chat-stop-play' />
                </IconWrapper>
                <span>
                  <Trans>Suspended</Trans>
                </span>
              </span>
            </EditWrapper>
            <DeleteWrapper onClick={deleteAgent}>
              <span>
                <IconWrapper>
                  <IconBase className='icon-chat-rubbish' />
                </IconWrapper>
                <span>
                  <Trans>Delete</Trans>
                </span>
              </span>
            </DeleteWrapper>
            <Line />
            <EditWrapper onClick={goMyAgentPage}>
              <span>
                <IconWrapper>
                  <IconBase className='icon-task-list' />
                </IconWrapper>
                <span>
                  <Trans>Task List</Trans>
                </span>
              </span>
            </EditWrapper>
          </OperatorWrapper>
        }
      >
        <IconWrapper style={{ backgroundColor: 'transparent' }}>
          <IconBase className='icon-chat-more' />
        </IconWrapper>
      </Popover>
    </TopRight>
  )
}
