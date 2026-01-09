import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled, { css } from 'styled-components'

const NodeWrapper = styled.div<{ $direction: string; $category: string }>`
  display: flex;
  flex-direction: column;
  min-width: 200px;
  max-width: 240px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${({ $direction, $category }) => {
    if ($category === 'exit') {
      return 'linear-gradient(135deg, #A21E39 0%, #501020 100%)'
    }
    return $direction === 'long'
      ? 'linear-gradient(135deg, #00763B 0%, #003820 100%)'
      : 'linear-gradient(135deg, #A21E39 0%, #501020 100%)'
  }};
  border: 2px solid ${({ $direction, $category }) => {
    if ($category === 'exit') return '#FF375B'
    return $direction === 'long' ? '#00DE73' : '#FF375B'
  }};
  box-shadow: 0 4px 20px ${({ $direction, $category }) => {
    if ($category === 'exit') return 'rgba(255, 55, 91, 0.3)'
    return $direction === 'long' ? 'rgba(0, 222, 115, 0.3)' : 'rgba(255, 55, 91, 0.3)'
  }};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
`

const DirectionBadge = styled.span<{ $direction: string }>`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${({ $direction }) => ($direction === 'long' ? '#00DE73' : '#FF375B')};
  color: #000;
`

const CategoryBadge = styled.span`
  display: inline-flex;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 500;
  background-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
`

const TriggerBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 500;
  background-color: ${({ $type }) => {
    switch ($type) {
      case 'take_profit': return 'rgba(0, 222, 115, 0.3)'
      case 'stop_loss': return 'rgba(255, 55, 91, 0.3)'
      case 'crossover': return 'rgba(168, 127, 255, 0.3)'
      case 'reversal': return 'rgba(255, 169, 64, 0.3)'
      default: return 'rgba(255, 255, 255, 0.15)'
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'take_profit': return '#00DE73'
      case 'stop_loss': return '#FF375B'
      case 'crossover': return '#A87FFF'
      case 'reversal': return '#FFA940'
      default: return 'rgba(255, 255, 255, 0.8)'
    }
  }};
`

const ConditionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const ConditionItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 10px;
  line-height: 14px;
  color: rgba(255, 255, 255, 0.85);

  &::before {
    content: '•';
    color: rgba(255, 255, 255, 0.5);
    flex-shrink: 0;
  }
`

interface ConditionNodeData {
  direction: 'long' | 'short' | 'both'
  category: 'entry' | 'exit'
  triggerType: string
  conditions: string[]
  description: string
}

function ConditionNode({ data }: NodeProps) {
  const nodeData = data as unknown as ConditionNodeData

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'take_profit': return 'TP'
      case 'stop_loss': return 'SL'
      case 'crossover': return 'Cross'
      case 'reversal': return 'Rev'
      default: return 'Signal'
    }
  }

  return (
    <NodeWrapper $direction={nodeData.direction} $category={nodeData.category}>
      <Handle type="target" position={Position.Top} style={{ background: nodeData.direction === 'long' ? '#00DE73' : '#FF375B' }} />
      <Header>
        <DirectionBadge $direction={nodeData.direction}>
          {nodeData.direction === 'both' ? 'ALL' : nodeData.direction}
        </DirectionBadge>
        <CategoryBadge>{nodeData.category}</CategoryBadge>
        <TriggerBadge $type={nodeData.triggerType}>{getTriggerLabel(nodeData.triggerType)}</TriggerBadge>
      </Header>
      <ConditionsList>
        {nodeData.conditions.slice(0, 4).map((cond, i) => (
          <ConditionItem key={i}>{cond}</ConditionItem>
        ))}
      </ConditionsList>
      <Handle type="source" position={Position.Bottom} style={{ background: nodeData.direction === 'long' ? '#00DE73' : '#FF375B' }} />
    </NodeWrapper>
  )
}

export default memo(ConditionNode)
