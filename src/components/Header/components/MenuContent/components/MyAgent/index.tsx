import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import AgentItem from 'pages/MyAgent/components/AgentItem'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useCreateAgentModalToggle } from 'store/application/hooks'
import { useSubscribedAgents } from 'store/myagent/hooks'
import styled from 'styled-components'

const MyAgentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

const AgentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100% - 52px);
`

export default function MyAgent() {
  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const [subscribedAgents] = useSubscribedAgents()
  return (
    <MyAgentWrapper>
      <CreateTask onClick={toggleCreateAgentModal}>
        <IconBase className='icon-chat-upload' />
        <Trans>Create Agent</Trans>
      </CreateTask>
      <AgentList className='scroll-style'>
        {subscribedAgents.length > 0
          ? subscribedAgents.map((item) => {
              return <AgentItem key={item.id} data={item} />
            })
          : null}
      </AgentList>
    </MyAgentWrapper>
  )
}
