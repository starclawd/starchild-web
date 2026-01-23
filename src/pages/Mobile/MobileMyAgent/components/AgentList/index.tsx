import { memo } from 'react'
import BottomSheet from 'components/BottomSheet'
import { vm } from 'pages/helper'
import MyAgent from 'pages/components/Header/components/MenuContent/components/MyAgent'
import Insights from 'pages/components/Header/components/MenuContent/components/Insights'
import { styled, useTheme } from 'styled-components'

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
  color: ${({ theme }) => theme.black0};
  text-align: center;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 12px;
`

const AgentList = memo(({ isOpen, onClose, type }: AgentListProps) => {
  const theme = useTheme()
  return (
    <BottomSheet
      placement='mobile'
      hideDragHandle={true}
      hideClose={false}
      isOpen={isOpen}
      onClose={onClose}
      rootStyle={{
        height: `calc(100vh - ${vm(44)})`,
        backgroundColor: theme.black700,
      }}
    >
      <Title>Agent list</Title>
      <ContentWrapper>{type === 'myagents' ? <MyAgent /> : <Insights />}</ContentWrapper>
    </BottomSheet>
  )
})

AgentList.displayName = 'AgentList'

export default AgentList
