import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'

const NodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 160px;
  padding: 12px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, #004F6E 0%, #002838 100%);
  border: 2px solid #00A9DE;
  box-shadow: 0 4px 20px rgba(0, 169, 222, 0.3);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background-color: #00A9DE;
  color: #000;
  font-size: 14px;
`

const Title = styled.div`
  font-size: 13px;
  font-weight: 600;
  color: #fff;
`

const FieldsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

const FieldTag = styled.span`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: rgba(0, 169, 222, 0.2);
  color: #00A9DE;
  font-size: 10px;
  font-weight: 500;
`

interface DataSourceNodeData {
  api: string
  fields: string[]
}

function DataSourceNode({ data }: NodeProps) {
  const rawData = data as unknown as DataSourceNodeData
  // 防御性编程：确保字段有默认值
  const nodeData = {
    api: rawData.api || 'API',
    fields: Array.isArray(rawData.fields) ? rawData.fields : [],
  }

  return (
    <NodeWrapper>
      <Handle type="target" position={Position.Top} style={{ background: '#00A9DE' }} />
      <Header>
        <IconWrapper>
          <IconBase className="icon-database" />
        </IconWrapper>
        <Title>{nodeData.api}</Title>
      </Header>
      <FieldsWrapper>
        {nodeData.fields.map((field, i) => (
          <FieldTag key={i}>{field}</FieldTag>
        ))}
      </FieldsWrapper>
      <Handle type="source" position={Position.Right} style={{ background: '#00A9DE' }} />
    </NodeWrapper>
  )
}

export default memo(DataSourceNode)
