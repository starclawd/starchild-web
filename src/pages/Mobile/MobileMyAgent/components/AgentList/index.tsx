import { memo } from 'react'
import BottomSheet from 'components/BottomSheet'
import { vm } from 'pages/helper'
import MyAgent from 'components/Header/components/MenuContent/components/MyAgent'
import Insights from 'components/Header/components/MenuContent/components/Insights'
import ScrollPageContent from 'components/ScrollPageContent'
import { styled } from 'styled-components'

interface AgentListProps {
  isOpen: boolean
  onClose: () => void
  type: 'myagents' | 'signals'
}

const Title = styled.div`
  padding: ${vm(20)} 0 ${vm(8)} 0;
  font-size: 0.2rem;
  font-weight: 500;
  line-height: 0.28rem;
  color: ${({ theme }) => theme.textL1};
  text-align: center;
`

const AgentList = memo(({ isOpen, onClose, type }: AgentListProps) => {
  return (
    <BottomSheet
      placement='mobile'
      hideDragHandle={true}
      hideClose={false}
      isOpen={isOpen}
      onClose={onClose}
      rootStyle={{
        height: `calc(100vh - ${vm(44)})`,
      }}
    >
      <Title>Agent list</Title>
      <ScrollPageContent>{type === 'myagents' ? <MyAgent /> : <Insights />}</ScrollPageContent>
    </BottomSheet>
  )
})

AgentList.displayName = 'AgentList'

export default AgentList
