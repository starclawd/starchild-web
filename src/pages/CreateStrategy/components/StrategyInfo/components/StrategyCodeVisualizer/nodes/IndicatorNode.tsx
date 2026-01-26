import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'

const NodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4f20a0 0%, #2a1060 100%);
  border: 2px solid #a87fff;
  box-shadow: 0 4px 20px rgba(168, 127, 255, 0.3);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background-color: #a87fff;
  color: #000;
  font-size: 11px;
  font-weight: 700;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
`

const Params = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 2px;
`

interface IndicatorNodeData {
  name: string
  params: string
}

function IndicatorNode({ data }: NodeProps) {
  const rawData = data as unknown as IndicatorNodeData
  // 辅助函数：安全转换为字符串
  const safeString = (val: unknown, fallback = ''): string => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
      if ('name' in obj) return String(obj.name || fallback)
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
  // 防御性编程：确保字段有默认值
  const name = safeString(rawData.name, 'IND')
  const shortName = name.substring(0, 3).toUpperCase()
  const params = safeString(rawData.params)

  return (
    <NodeWrapper>
      <Handle type='target' position={Position.Left} style={{ background: '#A87FFF' }} />
      <Header>
        <IconWrapper>{shortName}</IconWrapper>
        <Content>
          <Title>{name}</Title>
          <Params>{params}</Params>
        </Content>
      </Header>
      <Handle type='source' position={Position.Bottom} style={{ background: '#A87FFF' }} />
    </NodeWrapper>
  )
}

export default memo(IndicatorNode)
