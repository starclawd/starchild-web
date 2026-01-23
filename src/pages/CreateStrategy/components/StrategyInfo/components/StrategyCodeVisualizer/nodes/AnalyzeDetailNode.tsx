import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { AnalyzeStep } from 'utils/parseStrategyCode'

const NodeWrapper = styled.div`
  min-width: 200px;
  max-width: 280px;
  padding: 12px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f20a0 0%, #2a1060 100%);
  border: 2px solid #a87fff;
  box-shadow: 0 4px 20px rgba(168, 127, 255, 0.3);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(168, 127, 255, 0.3);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background-color: #a87fff;
  color: #000;
  font-size: 16px;
`

const Title = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #a87fff;
  text-transform: uppercase;
`

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.3);
`

const StepNumber = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #a87fff;
  color: #000;
  font-size: 10px;
  font-weight: 700;
`

const StepContent = styled.div`
  flex: 1;
`

const StepLabel = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
`

const StepDescription = styled.div`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
`

interface AnalyzeDetailNodeData {
  steps: AnalyzeStep[]
}

function AnalyzeDetailNode({ data }: NodeProps) {
  const nodeData = data as unknown as AnalyzeDetailNodeData

  return (
    <NodeWrapper>
      <Handle type="target" position={Position.Top} style={{ background: '#A87FFF' }} />
      <Header>
        <IconWrapper>
          <IconBase className="icon-chart-5" />
        </IconWrapper>
        <Title>ANALYZE</Title>
      </Header>
      <StepList>
        {nodeData.steps.map((step, index) => (
          <StepItem key={step.id}>
            <StepNumber>{index + 1}</StepNumber>
            <StepContent>
              <StepLabel>{step.label}</StepLabel>
              <StepDescription>{step.description}</StepDescription>
            </StepContent>
          </StepItem>
        ))}
      </StepList>
      <Handle type="source" position={Position.Bottom} style={{ background: '#A87FFF' }} />
    </NodeWrapper>
  )
}

export default memo(AnalyzeDetailNode)
