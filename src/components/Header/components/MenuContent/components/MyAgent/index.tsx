import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import AgentItem from 'pages/MyAgent/components/AgentItem'
import { useMemo } from 'react'
import { useCreateTaskModalToggle } from 'store/application/hooks'
import { TaskDataType } from 'store/setting/setting'
import styled from 'styled-components'

const MyAgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 8px;
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
  cursor: pointer;
  color: ${({ theme }) => theme.textL3};
  border: 1px dashed ${({ theme }) => theme.bgT20};
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

export default function MyAgent() {
  const toggleCreateTaskModal = useCreateTaskModalToggle()
  const list: TaskDataType[] = []
  return (
    <MyAgentWrapper>
      <CreateTask onClick={toggleCreateTaskModal}>
        <IconBase className='icon-chat-upload' />
        <Trans>Create Agent</Trans>
      </CreateTask>
      {list.length > 0
        ? list.map((item) => {
            return <AgentItem key={item.id} isHeaderMenu scrollHeight={0} data={item} />
          })
        : null}
    </MyAgentWrapper>
  )
}
