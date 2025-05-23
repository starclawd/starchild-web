import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import styled from 'styled-components'
import { CreateTaskModal } from './components/CreateModal'
import { useCreateTaskModalToggle, useModalOpen } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

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
  .icon-chat-back {
    transform: rotate(180deg);
    font-size: 14px;
    color: ${({ theme }) => theme.autumn50};
  }
`

const TaskItem = styled.div`
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
    background-color: rgba(47, 245, 130, 0.08);
    span {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: ${({ theme, $isActive }) => $isActive ? theme.jade10 : theme.textL4};
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

export default function Tasks() {
  const scrollRef = useScrollbarClass<HTMLDivElement>();
  const createTaskModalOpen = useModalOpen(ApplicationModal.CREATE_TASK_MODAL)
  const toggleCreateTaskModal = useCreateTaskModalToggle()
  const taskList = [
    {
      id: 1,
      isActive: true,
      title: 'Task 1',
      description: 'Task 1 description',
      time: '2021-01-01 12:00:00'
    },
    
  ]
  return <TasksWrapper>
    <InnerContent>
      <TitleContent>
        <span>
          <IconBase className="icon-task-list"/>
          <Trans>Task List</Trans>
        </span>
        <ButtonCreate onClick={toggleCreateTaskModal}>
          <IconBase className="icon-chat-upload"/>
          <span><Trans>Create</Trans></span>
        </ButtonCreate>
      </TitleContent>
      <TaskList ref={scrollRef} className="scroll-style">
        <TryWrapper>
          <IconBase className="icon-warn"/>
          <Content>
            <span><Trans>Did you know?</Trans></span>
            <span><Trans>You can describe tasks in the chat, and Holominds will automatically create them for you — including time, trigger, and details.</Trans></span>
            <span>
              <Trans>Tasks can be modified anytime.</Trans>
              <TryChat>
                <Trans>Try it in chat</Trans>
                <IconBase className="icon-chat-back"/>
              </TryChat>
            </span>
          </Content>
          <IconBase className="icon-chat-close"/>
        </TryWrapper>
        {taskList.map((item) => {
          const { id, isActive, title, description, time } = item
          return <TaskItem key={id}>
            <ItemTop>
              <TopLeft $isActive={isActive}>
                <span><span></span></span>
                <span>Active</span>
                <span>Once</span>
              </TopLeft>
              <TopRight className="top-right">
                <IconBase className="icon-chat-new"/>
                <IconBase className={!isActive ? "icon-chat-stop-play" : "icon-play"}/>
                <IconBase className="icon-chat-rubbish"/>
              </TopRight>
            </ItemTop>
            <ItemBottom>
              <span>{title}</span>
              <span>{description}</span>
              <span><Trans>Execution time</Trans>:&nbsp;<span>{time}</span></span>
            </ItemBottom>
          </TaskItem>
        })}
      </TaskList>
    </InnerContent>
    {createTaskModalOpen && <CreateTaskModal />}
  </TasksWrapper>
}
