import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'

const NodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 140px;
  padding: 10px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #4F20A0 0%, #2A1060 100%);
  border: 2px solid #A87FFF;
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
  background-color: #A87FFF;
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
  const nodeData = data as unknown as IndicatorNodeData
  const shortName = nodeData.name.substring(0, 3).toUpperCase()

  return (
    <NodeWrapper>
      <Handle type="target" position={Position.Left} style={{ background: '#A87FFF' }} />
      <Header>
        <IconWrapper>{shortName}</IconWrapper>
        <Content>
          <Title>{nodeData.name}</Title>
          <Params>{nodeData.params}</Params>
        </Content>
      </Header>
      <Handle type="source" position={Position.Bottom} style={{ background: '#A87FFF' }} />
    </NodeWrapper>
  )
}

export default memo(IndicatorNode)
