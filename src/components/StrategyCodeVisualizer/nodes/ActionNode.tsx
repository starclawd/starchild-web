import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled, { keyframes } from 'styled-components'
import { IconBase } from 'components/Icons'

const pulseGreen = keyframes`
  0%, 100% {
    box-shadow: 0 4px 24px rgba(0, 222, 115, 0.4), 0 0 0 0 rgba(0, 222, 115, 0.4);
  }
  50% {
    box-shadow: 0 4px 24px rgba(0, 222, 115, 0.4), 0 0 0 8px rgba(0, 222, 115, 0);
  }
`

const pulseRed = keyframes`
  0%, 100% {
    box-shadow: 0 4px 24px rgba(255, 55, 91, 0.4), 0 0 0 0 rgba(255, 55, 91, 0.4);
  }
  50% {
    box-shadow: 0 4px 24px rgba(255, 55, 91, 0.4), 0 0 0 8px rgba(255, 55, 91, 0);
  }
`

const NodeWrapper = styled.div<{ $action: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
  padding: 14px 18px;
  border-radius: 14px;
  background: ${({ $action }) => {
    switch ($action) {
      case 'buy':
        return 'linear-gradient(135deg, #00763B 0%, #003820 100%)'
      case 'sell':
        return 'linear-gradient(135deg, #A21E39 0%, #501020 100%)'
      case 'process':
        return 'linear-gradient(135deg, #4F20A0 0%, #2A1060 100%)'
      case 'decision':
        return 'linear-gradient(135deg, #BD4D00 0%, #5E2600 100%)'
      default:
        return 'linear-gradient(135deg, #232527 0%, #121315 100%)'
    }
  }};
  border: 2px solid
    ${({ $action }) => {
      switch ($action) {
        case 'buy':
          return '#00DE73'
        case 'sell':
          return '#FF375B'
        case 'process':
          return '#A87FFF'
        case 'decision':
          return '#FFA940'
        default:
          return '#636567'
      }
    }};
  animation: ${({ $action }) => {
      if ($action === 'buy') return pulseGreen
      if ($action === 'sell') return pulseRed
      return 'none'
    }}
    3s ease-in-out infinite;
`

const IconWrapper = styled.div<{ $action: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background-color: ${({ $action }) => {
    switch ($action) {
      case 'buy':
        return '#00DE73'
      case 'sell':
        return '#FF375B'
      case 'process':
        return '#A87FFF'
      case 'decision':
        return '#FFA940'
      default:
        return '#636567'
    }
  }};
  color: #000;
  font-size: 18px;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div<{ $action: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $action }) => {
    switch ($action) {
      case 'buy':
        return '#00DE73'
      case 'sell':
        return '#FF375B'
      case 'process':
        return '#A87FFF'
      case 'decision':
        return '#FFA940'
      default:
        return '#fff'
    }
  }};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const Description = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 3px;
`

interface ActionNodeData {
  action: 'buy' | 'sell' | 'hold' | 'process' | 'decision'
  description: string
}

function ActionNode({ data }: NodeProps) {
  const nodeData = data as unknown as ActionNodeData

  const getIcon = (action: string) => {
    switch (action) {
      case 'buy':
        return 'icon-arrow-up'
      case 'sell':
        return 'icon-arrow-down'
      case 'process':
        return 'icon-chart-5'
      case 'decision':
        return 'icon-question'
      default:
        return 'icon-pause'
    }
  }

  const getTitle = (action: string) => {
    switch (action) {
      case 'buy':
        return 'BUY'
      case 'sell':
        return 'SELL'
      case 'process':
        return 'ANALYZE'
      case 'decision':
        return 'DECIDE'
      default:
        return 'HOLD'
    }
  }

  return (
    <NodeWrapper $action={nodeData.action}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: nodeData.action === 'buy' ? '#00DE73' : '#FF375B' }}
      />
      <IconWrapper $action={nodeData.action}>
        <IconBase className={getIcon(nodeData.action)} />
      </IconWrapper>
      <Content>
        <Title $action={nodeData.action}>{getTitle(nodeData.action)}</Title>
        <Description>{nodeData.description}</Description>
      </Content>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: nodeData.action === 'buy' ? '#00DE73' : '#FF375B' }}
      />
    </NodeWrapper>
  )
}

export default memo(ActionNode)
