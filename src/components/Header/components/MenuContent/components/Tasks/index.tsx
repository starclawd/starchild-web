import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import TaskItem from 'pages/MyAgent/components/AgentItem'
import { useMemo } from 'react'
import styled from 'styled-components'

const TasksWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Item = styled.div<{ $listLength: number }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  gap: 8px;
  cursor: pointer;
  &:hover {
    .task-list {
      height: ${({ $listLength }) => 135 * $listLength + 8 * ($listLength - 1)}px;
    }
  }
`

const Title = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 6px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 0;
  overflow: hidden;
  transition: all ${ANI_DURATION}s;
`

const CreateTask = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  border: 1px dashed ${({ theme }) => theme.bgT20};
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

export default function Tasks() {
  const list = useMemo(() => {
    return [
      {
        key: 'My subscription',
        title: <Trans>My subscription</Trans>,
        icon: 'icon-subscription',
        list: [
          {
            id: '1',
            isActive: true,
            title: 'Daily Market Brief',
            description: 'Monitor BTC, ETH, SOL, DOGE, UNI, ONDO, AAVE, and PEPE sdfasdfasdfasdfas',
            time: '10:00',
          },
        ],
      },
      {
        key: 'My tasks',
        title: <Trans>My tasks</Trans>,
        icon: 'icon-task',
        list: [
          {
            id: '1',
            isActive: true,
            title: 'Task 1',
            description: 'Monitor BTC, ETH, SOL, DOGE, UNI, ONDO, AAVE, and PEPE sdfasdfasdfasdfas',
            time: '10:00',
          },
        ],
      },
    ]
  }, [])
  return (
    <TasksWrapper>
      {list.map((item) => {
        const { key, title, icon, list } = item
        return (
          <Item $listLength={list.length} key={key}>
            <Title>
              <IconBase className={icon} />
              <span>{title}</span>
            </Title>
            <List className='task-list'>
              {list.map((item) => {
                return <TaskItem isHeaderMenu scrollHeight={0} data={item} />
              })}
            </List>
          </Item>
        )
      })}
      <CreateTask>
        <IconBase className='icon-chat-upload' />
        <Trans>Create Task</Trans>
      </CreateTask>
    </TasksWrapper>
  )
}
