import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { StateManagementInfo } from 'utils/parseStrategyCode'

// ============================================
// Styled Components
// ============================================

const NodeWrapper = styled.div`
  min-width: 180px;
  max-width: 240px;
  padding: 12px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2a2040 0%, #151025 100%);
  border: 2px solid #8b5cf6;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  font-size: 14px;
`

const Title = styled.div`
  font-size: 12px;
  font-weight: 700;
  color: #8b5cf6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FieldItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
`

const FieldIcon = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #8b5cf6;
`

const FieldName = styled.div`
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  font-family: 'IBM Plex Mono', monospace;
`

const ResetTrigger = styled.div`
  margin-top: 10px;
  padding: 6px 8px;
  border-radius: 4px;
  background-color: rgba(139, 92, 246, 0.1);
  border: 1px dashed rgba(139, 92, 246, 0.3);
`

const ResetLabel = styled.div`
  font-size: 8px;
  font-weight: 600;
  color: rgba(139, 92, 246, 0.7);
  text-transform: uppercase;
  margin-bottom: 2px;
`

const ResetValue = styled.div`
  font-size: 10px;
  color: #8b5cf6;
`

// ============================================
// Component
// ============================================

interface StateNodeData extends StateManagementInfo {
  // 额外的显示属性
}

function StateNode({ data }: NodeProps) {
  const rawData = data as unknown as StateNodeData
  // 防御性编程：确保字段有默认值
  const nodeData = {
    fields: Array.isArray(rawData.fields) ? rawData.fields : [],
    resetTrigger: rawData.resetTrigger || undefined,
    needsState: rawData.needsState ?? true,
  }

  return (
    <NodeWrapper>
      <Handle type='target' position={Position.Top} style={{ background: '#8B5CF6' }} />

      <Header>
        <IconWrapper>
          <IconBase className='icon-database' />
        </IconWrapper>
        <Title>State</Title>
      </Header>

      <FieldList>
        {nodeData.fields.map((field, index) => (
          <FieldItem key={index}>
            <FieldIcon />
            <FieldName>{field}</FieldName>
          </FieldItem>
        ))}
      </FieldList>

      {nodeData.resetTrigger && (
        <ResetTrigger>
          <ResetLabel>Reset On</ResetLabel>
          <ResetValue>{nodeData.resetTrigger}</ResetValue>
        </ResetTrigger>
      )}

      <Handle type='source' position={Position.Bottom} style={{ background: '#8B5CF6' }} />
    </NodeWrapper>
  )
}

export default memo(StateNode)
