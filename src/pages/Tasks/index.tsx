import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import styled from 'styled-components'
import { useCreateTaskModalToggle, useCurrentRouter } from 'store/application/hooks'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useEffect, useState } from 'react'
import { ROUTER } from 'pages/router'
import { useGetTaskList, useIsFromTaskPage, useTaskList } from 'store/setting/hooks'
import { useAddNewThread } from 'store/tradeai/hooks'
import NoData from 'components/NoData'
import { useIsLogin } from 'store/login/hooks'
import Pending from 'components/Pending'
import { useIsShowRecommand } from 'store/settingcache/hooks'
import TaskItem from './components/TaskItem'

const TasksWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-top: 20px;
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  gap: 20px;
`

const TitleContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 44px;
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.white};
    .icon-task-list {
      font-size: 24px;
      color: ${({ theme }) => theme.textL2};
    }
  }
`

const ButtonCreate = styled(ButtonBorder)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  gap: 8px;
  height: 44px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-upload {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  gap: 8px;
`

const TryWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 4px;
  padding: 20px;
  border-radius: 24px;
  background-color: rgba(218, 99, 19, 0.12);
  .icon-warn {
    font-size: 18px;
    color: ${({ theme }) => theme.autumn50};
  }
  .icon-chat-close {
    opacity: 0.2;
    font-size: 18px;
    cursor: pointer;
    color: ${({ theme }) => theme.textL2};
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 8px;
  span:first-child {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.autumn50};
  }
  span:nth-child(2) {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    opacity: 0.8;
    color: ${({ theme }) => theme.autumn50};
  }
  span:last-child {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.autumn50};
  }
`

const TryChat = styled.span`
  display: flex;
  align-items: center;
  height: 28px;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  padding: 0 12px;
  border-radius: 60px;
  background-color: rgba(218, 99, 19, 0.12);
  cursor: pointer;
  .icon-chat-back {
    transform: rotate(180deg);
    font-size: 14px;
    color: ${({ theme }) => theme.autumn50};
  }
`

export default function Tasks() {
  const [taskList] = useTaskList()
  const isLogin = useIsLogin()
  const addNewThread = useAddNewThread()
  const triggerGetTaskList = useGetTaskList()
  const [, setCurrentRouter] = useCurrentRouter()
  const [, setIsFromTaskPage] = useIsFromTaskPage()
  const [isLoadingTaskList, setIsLoadingTaskList] = useState(false)
  const [isShowRecommand, setIsShowRecommand] = useIsShowRecommand()
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const toggleCreateTaskModal = useCreateTaskModalToggle()
  const goChatPage = useCallback(() => {
    addNewThread()
    setIsFromTaskPage(true)
    setCurrentRouter(ROUTER.TRADE_AI)
  }, [addNewThread, setCurrentRouter, setIsFromTaskPage])
  const fetchTaskList = useCallback(async () => {
    if (isLogin) {
      try {
        setIsLoadingTaskList(true)
        const data = await triggerGetTaskList()
        console.log('data', data)
        setIsLoadingTaskList(false)
      } catch (error) {
        setIsLoadingTaskList(false)
      }
    }
  }, [isLogin, triggerGetTaskList])

  const closeRecommand = useCallback(() => {
    setIsShowRecommand(false)
  }, [setIsShowRecommand])

  useEffect(() => {
    fetchTaskList()
  }, [fetchTaskList])
  return (
    <TasksWrapper>
      <InnerContent>
        <TitleContent>
          <span>
            <IconBase className='icon-task-list' />
            <Trans>Task List</Trans>
          </span>
          <ButtonCreate onClick={toggleCreateTaskModal}>
            <IconBase className='icon-chat-upload' />
            <span>
              <Trans>Create</Trans>
            </span>
          </ButtonCreate>
        </TitleContent>
        <TaskList ref={scrollRef} className='scroll-style'>
          {!isLoadingTaskList && isShowRecommand && (
            <TryWrapper>
              <IconBase className='icon-warn' />
              <Content>
                <span>
                  <Trans>Did you know?</Trans>
                </span>
                <span>
                  <Trans>
                    You can describe tasks in the chat, and Holominds will automatically create them for you — including
                    time, trigger, and details.
                  </Trans>
                </span>
                <span>
                  <Trans>Tasks can be modified anytime.</Trans>
                  <TryChat onClick={goChatPage}>
                    <Trans>Try it in chat</Trans>
                    <IconBase className='icon-chat-back' />
                  </TryChat>
                </span>
              </Content>
              <IconBase onClick={closeRecommand} className='icon-chat-close' />
            </TryWrapper>
          )}
          {taskList.length > 0 ? (
            taskList.map((item) => <TaskItem key={item.id} data={item} />)
          ) : isLoadingTaskList ? (
            <Pending isFetching />
          ) : (
            <NoData />
          )}
        </TaskList>
      </InnerContent>
    </TasksWrapper>
  )
}
