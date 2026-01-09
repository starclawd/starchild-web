import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'

const NodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 300px;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1A1C1E 0%, #0B0C0E 100%);
  border: 2px solid #FFA940;
  box-shadow: 0 4px 20px rgba(255, 169, 64, 0.2);
`

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #FFA940;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  text-align: center;
`

const RiskGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
`

const RiskItem = styled.div<{ $type?: 'profit' | 'loss' | 'neutral' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border-radius: 8px;
  background-color: ${({ $type }) => {
    switch ($type) {
      case 'profit': return 'rgba(0, 222, 115, 0.1)'
      case 'loss': return 'rgba(255, 55, 91, 0.1)'
      default: return 'rgba(255, 255, 255, 0.05)'
    }
  }};
`

const RiskLabel = styled.span`
  font-size: 9px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`

const RiskValue = styled.span<{ $type?: 'profit' | 'loss' | 'neutral' }>`
  font-size: 13px;
  font-weight: 600;
  color: ${({ $type }) => {
    switch ($type) {
      case 'profit': return '#00DE73'
      case 'loss': return '#FF375B'
      default: return '#fff'
    }
  }};
`

interface RiskNodeData {
  takeProfit: string
  stopLoss: string
  leverage: string
  positionSize: string
}

function RiskNode({ data }: NodeProps) {
  const nodeData = data as unknown as RiskNodeData

  return (
    <NodeWrapper>
      <Handle type="target" position={Position.Top} style={{ background: '#FFA940' }} />
      <Title>Risk Management</Title>
      <RiskGrid>
        <RiskItem $type="profit">
          <RiskLabel>Take Profit</RiskLabel>
          <RiskValue $type="profit">{nodeData.takeProfit}</RiskValue>
        </RiskItem>
        <RiskItem $type="loss">
          <RiskLabel>Stop Loss</RiskLabel>
          <RiskValue $type="loss">{nodeData.stopLoss}</RiskValue>
        </RiskItem>
        <RiskItem>
          <RiskLabel>Leverage</RiskLabel>
          <RiskValue>{nodeData.leverage}</RiskValue>
        </RiskItem>
        <RiskItem>
          <RiskLabel>Size</RiskLabel>
          <RiskValue>{nodeData.positionSize}</RiskValue>
        </RiskItem>
      </RiskGrid>
    </NodeWrapper>
  )
}

export default memo(RiskNode)
