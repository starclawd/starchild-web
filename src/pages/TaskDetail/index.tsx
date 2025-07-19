import styled, { css } from 'styled-components'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useMemo } from 'react'
import Pending from 'components/Pending'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { BorderBottom1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import ChatHistory from './components/ChatHistory'
import TaskDescription from './components/TaskDescription'
import Code from './components/Code'
import { useTabIndex, useTaskDetail } from 'store/backtest/hooks'
import { TASK_TYPE } from 'store/backtest/backtest'
import { ANI_DURATION } from 'constants/index'
import { useTaskDetailPolling } from './components/hooks'

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
  const [tabIndex] = useTabIndex()
  const [{ task_type }] = useTaskDetail()
  const { isLoading } = useTaskDetailPolling()

  const shouldExpandRightSection = useMemo(() => {
    return tabIndex === 1 && task_type === TASK_TYPE.BACKTEST_TASK
  }, [tabIndex, task_type])

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
