import styled from 'styled-components'
import { TaskDataType } from 'store/setting/setting.d'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { useCallback } from 'react'
import { useCloseTask, useCurrentTaskData, useDeleteTask, useGetTaskList } from 'store/setting/hooks'
import { useCreateTaskModalToggle } from 'store/application/hooks'
import { Trans } from '@lingui/react/macro'

const TaskItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  padding: 20px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bgL1};
  &:hover {
    .top-right {
      opacity: 1;
    }
  }
`

const ItemTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const ItemBottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  > span:first-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL1};
  }
  > span:nth-child(2) {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  > span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
    span {
      color: ${({ theme }) => theme.textL1};
    }
  }
`

const TopLeft = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  > span:first-child {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 4px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background-color: transparent;
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${({ theme, $isActive }) => $isActive ? theme.jade10 : theme.textL4};
      ${({ theme, $isActive }) => $isActive && `
        box-shadow: 0px 0px 8px ${theme.jade10};
        animation: breathe 5s infinite ease-in-out;
        @keyframes breathe {
          0% {
            box-shadow: 0px 0px 4px ${theme.jade10};
          }
          50% {
            box-shadow: 0px 0px 15px ${theme.jade10};
          }
          100% {
            box-shadow: 0px 0px 4px ${theme.jade10};
          }
        }
      `}
    }
  }
  > span:nth-child(2) {
    margin-right: 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme, $isActive }) => $isActive ? theme.jade10 : theme.textL4};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: 18px;
    padding: 0 6px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 500;
    line-height: 14px;
    color: ${({ theme }) => theme.textL2};
    background-color: ${({ theme }) => theme.text20};
  }
  
`

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transition: opacity ${ANI_DURATION}s;
  i {
    cursor: pointer;
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  .icon-chat-rubbish {
    color: ${({ theme }) => theme.ruby50};
  }
`

export default function TaskItem({
  data
}: {
  data: TaskDataType
}) {
  const { id, isActive, title, description, time } = data
  const triggerGetTaskList = useGetTaskList()
  const triggerCloseTask = useCloseTask()
  const triggerDeleteTask = useDeleteTask()
  const [, setCurrentTaskData] = useCurrentTaskData()
  const toggleCreateTaskModal = useCreateTaskModalToggle()

  const editTask = useCallback(() => {
    setCurrentTaskData(data)
    toggleCreateTaskModal()
  }, [setCurrentTaskData, toggleCreateTaskModal, data])

  const closeTask = useCallback(async () => {
    await triggerCloseTask(id)
  }, [id, triggerCloseTask])

  const deleteTask = useCallback(async () => {
    await triggerDeleteTask(id)
  }, [id, triggerDeleteTask])

  return <TaskItemWrapper key={id}>
  <ItemTop>
    <TopLeft $isActive={isActive}>
      <span><span></span></span>
      <span>Active</span>
      <span>Once</span>
    </TopLeft>
    <TopRight className="top-right">
      <IconBase onClick={editTask} className="icon-chat-new"/>
      <IconBase onClick={closeTask} className={!isActive ? "icon-chat-stop-play" : "icon-play"}/>
      <IconBase onClick={deleteTask} className="icon-chat-rubbish"/>
    </TopRight>
  </ItemTop>
  <ItemBottom>
    <span>{title}</span>
    <span>{description}</span>
    <span><Trans>Execution time</Trans>:&nbsp;<span>{time}</span></span>
  </ItemBottom>
</TaskItemWrapper>
}
