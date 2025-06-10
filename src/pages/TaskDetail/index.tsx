import styled from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useEffect, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import ChatHistory from './components/ChatHistory'
import TaskDescription from './components/TaskDescription'
import Code from './components/Code'
import { useGetTaskDetail } from 'store/backtest/hooks'

const TaskDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  max-width: 1920px;
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
  height: 100%;
  padding: 0 20px;
  background-color: #121315;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    width: calc(100% - 360px);
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    width: calc(100% - 480px);
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1360`
    width: calc(100% - 560px);
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
  .icon-task-detail-his {
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
  height: 100%;
  padding: 0 20px;
  background-color: #0B0C0E;
  ${({ theme }) => theme.mediaMinWidth.minWidth1024`
    width: 360px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1280`
    width: 480px;
  `}
  ${({ theme }) => theme.mediaMinWidth.minWidth1360`
    width: 560px;
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
  const triggerGetTaskDetail = useGetTaskDetail()
  const [isLoading, setIsLoading] = useState(false)
  const { taskId } = useParsedQueryString()
  const init = useCallback(async () => {
    try {
      if (taskId) {
        setIsLoading(true)
        const data = await triggerGetTaskDetail(taskId)
        if (!(data as any).isSuccess) {
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      }
    } catch (error) {
      setIsLoading(false)
    }
  }, [taskId, triggerGetTaskDetail])
  useEffect(() => {
    init()
  }, [init])
  return <TaskDetailWrapper>
    <Content>
      {isLoading
      ? <Pending isFetching />
      : <>
        <Left>
          <Title
            $borderColor={theme.lineDark8}
          >
            <IconBase className="icon-task-detail-his" />
            <Trans>Chat history</Trans>
          </Title>
          <LeftContent>
            <ChatHistory />
          </LeftContent>
        </Left>
        <Right>
          <Title
            $borderColor={theme.lineDark8}
          >
            <IconBase className="icon-task-detail" />
            <Trans>Task details</Trans>
          </Title>
          <RightContent>
            <TaskDescription />
            <Code />
          </RightContent>
        </Right>
      </>}
    </Content>
  </TaskDetailWrapper>
}
