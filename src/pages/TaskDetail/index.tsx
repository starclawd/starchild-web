import styled from 'styled-components'
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
import { useGetTaskDetail, useTaskDetail } from 'store/backtest/hooks'
import MoveTabList from 'components/MoveTabList'

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

const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  height: 100%;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.black900};
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

const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 100%;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.black1000};
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
  const [isLoading, setIsLoading] = useState(false)
  const { taskId } = useParsedQueryString()
  const [taskDetail] = useTaskDetail()
  const { generation_status } = taskDetail
  const pollingTimer = useRef<NodeJS.Timeout | null>(null)

  const getTaskDetail = useCallback(
    async (showLoading = false) => {
      if (!taskId) return

      try {
        if (showLoading) {
          setIsLoading(true)
        }
        const data = await triggerGetTaskDetail(taskId)
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
    [taskId, triggerGetTaskDetail],
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
    if (generation_status === 'pending') {
      startPolling()
    } else {
      stopPolling()
    }

    // 清理函数：组件卸载时清除定时器
    return () => {
      stopPolling()
    }
  }, [generation_status, startPolling, stopPolling])

  return (
    <TaskDetailWrapper>
      <Content>
        {isLoading ? (
          <Pending isFetching />
        ) : (
          <>
            <Left>
              <Title $borderColor={theme.lineDark8}>
                <IconBase className='icon-task-detail-his' />
                <Trans>Chat history</Trans>
              </Title>
              <LeftContent ref={leftContentRef} className='scroll-style'>
                <ChatHistory />
              </LeftContent>
            </Left>
            <Right>
              <Title $borderColor={theme.lineDark8}>
                <IconBase className='icon-task-detail' />
                <Trans>Task details</Trans>
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
