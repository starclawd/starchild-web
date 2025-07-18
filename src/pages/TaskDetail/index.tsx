import styled, { css } from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import ChatHistory from './components/ChatHistory'
import TaskDescription from './components/TaskDescription'
import Code from './components/Code'
import { useGetTaskDetail, useIsCodeTaskType, useTabIndex, useTaskDetail } from 'store/backtest/hooks'
import { GENERATION_STATUS, TASK_TYPE } from 'store/backtest/backtest'
import { ANI_DURATION } from 'constants/index'

const TaskDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  width: 100%;
`

const Content = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const Left = styled.div<{ $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  width: 65%;
  height: 100%;
  padding: 0 20px;
  transition: width ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black900};
  ${({ $shouldExpandRightSection }) =>
    $shouldExpandRightSection &&
    css`
      width: 35%;
    `}
`

const Title = styled(BorderBottom1PxBox)`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 68px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  color: ${({ theme }) => theme.textL2};
  .icon-task-detail-his,
  .icon-task-detail {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`

const LeftContent = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 20px;
  height: calc(100% - 68px);
`

const Right = styled.div<{ $shouldExpandRightSection: boolean }>`
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 100%;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.black1000};
  transition: width ${ANI_DURATION}s;
  ${({ $shouldExpandRightSection }) =>
    $shouldExpandRightSection &&
    css`
      width: 65%;
    `}
`

const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 0;
  height: calc(100% - 68px);
`

export default function TaskDetail() {
  const theme = useTheme()
  const leftContentRef = useScrollbarClass<HTMLDivElement>()
  const triggerGetTaskDetail = useGetTaskDetail()
  const [tabIndex] = useTabIndex()
  const [isLoading, setIsLoading] = useState(false)
  const { taskId, agentId } = useParsedQueryString()
  const isCodeTaskType = useIsCodeTaskType()
  const [{ generation_status, task_type }] = useTaskDetail()
  const pollingTimer = useRef<NodeJS.Timeout | null>(null)

  const shouldExpandRightSection = useMemo(() => {
    return tabIndex === 1 && task_type === TASK_TYPE.BACKTEST_TASK
  }, [tabIndex, task_type])

  const getTaskDetail = useCallback(
    async (showLoading = false) => {
      if (!taskId && !agentId) return

      try {
        if (showLoading) {
          setIsLoading(true)
        }
        const data = await triggerGetTaskDetail(agentId || taskId || '')
        if (!(data as any).isSuccess) {
          if (showLoading) {
            setIsLoading(false)
          }
        } else {
          if (showLoading) {
            setIsLoading(false)
          }
        }
      } catch (error) {
        if (showLoading) {
          setIsLoading(false)
        }
      }
    },
    [taskId, agentId, triggerGetTaskDetail],
  )

  const startPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
    }

    pollingTimer.current = setInterval(() => {
      getTaskDetail(false) // 轮询时不显示loading
    }, 5000) // 5秒轮询一次
  }, [getTaskDetail])

  const stopPolling = useCallback(() => {
    if (pollingTimer.current) {
      clearInterval(pollingTimer.current)
      pollingTimer.current = null
    }
  }, [])

  // 初始加载
  useEffect(() => {
    getTaskDetail(true) // 初始加载时显示loading
  }, [getTaskDetail])

  // 根据generation_status控制轮询
  useEffect(() => {
    if (generation_status === GENERATION_STATUS.PENDING && isCodeTaskType) {
      startPolling()
    } else {
      stopPolling()
    }

    // 清理函数：组件卸载时清除定时器
    return () => {
      stopPolling()
    }
  }, [generation_status, isCodeTaskType, startPolling, stopPolling])

  return (
    <TaskDetailWrapper>
      <Content>
        {isLoading ? (
          <Pending isFetching />
        ) : (
          <>
            <Left $shouldExpandRightSection={shouldExpandRightSection}>
              <Title $borderColor={theme.lineDark8}>
                <IconBase className='icon-task-detail-his' />
                <Trans>Chat history</Trans>
              </Title>
              <LeftContent ref={leftContentRef} className='scroll-style'>
                <ChatHistory />
              </LeftContent>
            </Left>
            <Right $shouldExpandRightSection={shouldExpandRightSection}>
              <Title $borderColor={theme.lineDark8}>
                <IconBase className='icon-task-detail' />
                <Trans>Agent details</Trans>
              </Title>
              <RightContent>
                <TaskDescription />
                <Code />
              </RightContent>
            </Right>
          </>
        )}
      </Content>
    </TaskDetailWrapper>
  )
}
