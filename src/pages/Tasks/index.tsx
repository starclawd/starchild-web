import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import styled from 'styled-components'

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

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 20px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bgL1};
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
`

const TopLeft = styled.div`
  display: flex;
  align-items: center;
  span:first-child {
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }
  
`

const TopRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  .icon-chat-rubbish {
    color: ${({ theme }) => theme.ruby50};
  }
`

export default function Tasks() {
  const taskList: any[] = []
  const isSuspense = true
  return <TasksWrapper>
    <InnerContent>
      <TitleContent>
        <span>
          <IconBase className="icon-task-list"/>
          <Trans>Task List</Trans>
        </span>
        <ButtonCreate>
          <IconBase className="icon-chat-upload"/>
          <span><Trans>Create</Trans></span>
        </ButtonCreate>
      </TitleContent>
      <TaskList className="scroll-style">
        {taskList.map((item) => (
          <TaskItem key={item.id}>
            <ItemTop>
              <TopLeft>
                <span></span>
                <span>Active</span>
                <span>Once</span>
              </TopLeft>
              <TopRight>
                <IconBase className="icon-chat-new"/>
                <IconBase className={isSuspense ? "icon-chat-stop-play" : "icon-chat-play"}/>
                <IconBase className="icon-chat-rubbish"/>
              </TopRight>
            </ItemTop>
            <ItemBottom>

            </ItemBottom>
          </TaskItem>
        ))}
      </TaskList>
    </InnerContent>
  </TasksWrapper>
}
