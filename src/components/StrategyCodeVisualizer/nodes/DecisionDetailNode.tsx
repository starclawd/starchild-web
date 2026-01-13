import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { DecisionBranch } from 'utils/parseStrategyCode'

const NodeWrapper = styled.div`
  min-width: 220px;
  max-width: 300px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #bd4d00 0%, #5e2600 100%);
  border: 2px solid #ffa940;
  box-shadow: 0 4px 20px rgba(255, 169, 64, 0.3);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 169, 64, 0.3);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #ffa940;
  color: #000;
  font-size: 16px;
`

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #ffa940;
  text-transform: uppercase;
`

const Section = styled.div`
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 4px;
`

const BranchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const BranchItem = styled.div<{ $action: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
  border-left: 3px solid ${({ $action }) => ($action === 'BUY' || $action === 'OPEN' ? '#00DE73' : '#FF375B')};
`

const BranchCondition = styled.div`
  flex: 1;
  font-size: 10px;
  color: #fff;
`

const BranchAction = styled.div<{ $action: string }>`
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  background-color: ${({ $action }) => ($action === 'BUY' || $action === 'OPEN' ? '#00DE73' : '#FF375B')};
  color: #000;
`

interface DecisionDetailNodeData {
  hasPosition: DecisionBranch[]
  noPosition: DecisionBranch[]
}

function DecisionDetailNode({ data }: NodeProps) {
  const nodeData = data as unknown as DecisionDetailNodeData

  return (
    <NodeWrapper>
      <Handle type="target" position={Position.Top} style={{ background: '#FFA940' }} />
      <Header>
        <IconWrapper>
          <IconBase className="icon-question" />
        </IconWrapper>
        <Title>DECIDE</Title>
      </Header>

      {nodeData.hasPosition && nodeData.hasPosition.length > 0 && (
        <Section>
          <SectionTitle>If Has Position</SectionTitle>
          <BranchList>
            {nodeData.hasPosition.map((branch, index) => (
              <BranchItem key={`has-${index}`} $action={branch.action}>
                <BranchCondition>{branch.condition}</BranchCondition>
                <BranchAction $action={branch.action}>{branch.action}</BranchAction>
              </BranchItem>
            ))}
          </BranchList>
        </Section>
      )}

      {nodeData.noPosition && nodeData.noPosition.length > 0 && (
        <Section>
          <SectionTitle>If No Position</SectionTitle>
          <BranchList>
            {nodeData.noPosition.map((branch, index) => (
              <BranchItem key={`no-${index}`} $action={branch.action}>
                <BranchCondition>{branch.condition}</BranchCondition>
                <BranchAction $action={branch.action}>{branch.action}</BranchAction>
              </BranchItem>
            ))}
          </BranchList>
        </Section>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: '#FFA940' }} />
    </NodeWrapper>
  )
}

export default memo(DecisionDetailNode)
