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
import AgentItem from './components/AgentItem'

const MyAgentWrapper = styled.div`
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
  .no-data-wrapper {
    height: 100%;
  }
`

export default function MyAgent() {
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
    <MyAgentWrapper>
      <InnerContent>
        <TaskList ref={scrollRef} className='scroll-style'>
          {taskList.length > 0 ? (
            taskList.map((item) => <AgentItem key={item.id} data={item} />)
          ) : isLoadingTaskList ? (
            <Pending isFetching />
          ) : (
            <NoData />
          )}
        </TaskList>
      </InnerContent>
    </MyAgentWrapper>
  )
}
