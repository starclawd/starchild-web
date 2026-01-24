import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'

const NodeWrapper = styled.div<{ $direction: string; $category: string }>`
  display: flex;
  flex-direction: column;
  min-width: 180px;
  max-width: 220px;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${({ $direction, $category }) => {
    if ($category === 'exit') {
      return 'linear-gradient(135deg, #6B1226 0%, #3D0A15 100%)'
    }
    return $direction === 'long'
      ? 'linear-gradient(135deg, #005E30 0%, #002E18 100%)'
      : 'linear-gradient(135deg, #6B1226 0%, #3D0A15 100%)'
  }};
  border: 2px solid
    ${({ $direction, $category }) => {
      if ($category === 'exit') return '#FF375B'
      return $direction === 'long' ? '#00DE73' : '#FF375B'
    }};
  box-shadow: 0 4px 16px
    ${({ $direction, $category }) => {
      if ($category === 'exit') return 'rgba(255, 55, 91, 0.25)'
      return $direction === 'long' ? 'rgba(0, 222, 115, 0.25)' : 'rgba(255, 55, 91, 0.25)'
    }};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const DirectionBadge = styled.span<{ $direction: string }>`
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  background-color: ${({ $direction }) => ($direction === 'long' ? '#00DE73' : '#FF375B')};
  color: #000;
`

const TriggerBadge = styled.span<{ $type: string }>`
  display: inline-flex;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  background-color: ${({ $type }) => {
    switch ($type) {
      case 'take_profit':
        return 'rgba(0, 222, 115, 0.25)'
      case 'stop_loss':
        return 'rgba(255, 55, 91, 0.25)'
      case 'crossover':
        return 'rgba(168, 127, 255, 0.25)'
      case 'reversal':
        return 'rgba(255, 169, 64, 0.25)'
      case 'indicator':
        return 'rgba(0, 169, 222, 0.25)'
      default:
        return 'rgba(255, 255, 255, 0.1)'
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'take_profit':
        return '#00DE73'
      case 'stop_loss':
        return '#FF375B'
      case 'crossover':
        return '#A87FFF'
      case 'reversal':
        return '#FFA940'
      case 'indicator':
        return '#00A9DE'
      default:
        return 'rgba(255, 255, 255, 0.7)'
    }
  }};
  border: 1px solid
    ${({ $type }) => {
      switch ($type) {
        case 'take_profit':
          return 'rgba(0, 222, 115, 0.3)'
        case 'stop_loss':
          return 'rgba(255, 55, 91, 0.3)'
        case 'crossover':
          return 'rgba(168, 127, 255, 0.3)'
        case 'reversal':
          return 'rgba(255, 169, 64, 0.3)'
        case 'indicator':
          return 'rgba(0, 169, 222, 0.3)'
        default:
          return 'rgba(255, 255, 255, 0.15)'
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
  font-size: 11px;
  line-height: 15px;
  color: rgba(255, 255, 255, 0.9);

  &::before {
    content: '•';
    color: rgba(255, 255, 255, 0.4);
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
  const rawData = data as unknown as ConditionNodeData
  // 辅助函数：安全转换为字符串
  const safeString = (val: unknown, fallback = ''): string => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
      if ('condition' in obj) return String(obj.condition || fallback)
      if ('description' in obj) return String(obj.description || fallback)
      if ('value' in obj) return String(obj.value || fallback)
      try {
        const json = JSON.stringify(val)
        return json.length > 100 ? json.substring(0, 97) + '...' : json
      } catch {
        return fallback
      }
    }
    return val ? String(val) : fallback
  }
  // 防御性编程：确保所有字段都有默认值
  const nodeData = {
    direction: rawData.direction || 'both',
    category: rawData.category || 'entry',
    triggerType: rawData.triggerType || 'signal',
    conditions: Array.isArray(rawData.conditions) 
      ? rawData.conditions.map((c) => safeString(c)).filter(Boolean)
      : [],
    description: safeString(rawData.description),
  }

  const getTriggerLabel = (type: string) => {
    switch (type) {
      case 'take_profit':
        return 'TP'
      case 'stop_loss':
        return 'SL'
      case 'crossover':
        return 'Cross'
      case 'reversal':
        return 'Reversal'
      case 'indicator':
        return 'IND'
      default:
        return 'Signal'
    }
  }

  return (
    <NodeWrapper $direction={nodeData.direction} $category={nodeData.category}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: nodeData.direction === 'long' ? '#00DE73' : '#FF375B' }}
      />
      <Header>
        <DirectionBadge $direction={nodeData.direction}>
          {nodeData.category.toUpperCase()}
        </DirectionBadge>
        <TriggerBadge $type={nodeData.triggerType}>{getTriggerLabel(nodeData.triggerType)}</TriggerBadge>
      </Header>
      <ConditionsList>
        {nodeData.conditions.map((cond, i) => (
          <ConditionItem key={i}>{cond}</ConditionItem>
        ))}
      </ConditionsList>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: nodeData.direction === 'long' ? '#00DE73' : '#FF375B' }}
      />
    </NodeWrapper>
  )
}

export default memo(ConditionNode)
