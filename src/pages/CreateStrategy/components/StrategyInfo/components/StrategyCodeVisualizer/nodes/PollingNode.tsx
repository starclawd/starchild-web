import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'

// ============================================
// Styled Components
// ============================================

const NodeWrapper = styled.div`
  min-width: 160px;
  max-width: 200px;
  padding: 10px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1a2a3a 0%, #0a1520 100%);
  border: 2px solid #00a9de;
  box-shadow: 0 4px 16px rgba(0, 169, 222, 0.2);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 169, 222, 0.3);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: rgba(0, 169, 222, 0.2);
  color: #00a9de;
  font-size: 12px;
`

const Title = styled.div`
  font-size: 11px;
  font-weight: 700;
  color: #00a9de;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`

const InfoLabel = styled.span`
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
`

const InfoValue = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #fff;
`

const ModeBadge = styled.div<{ $mode: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ $mode }) => ($mode === 'adaptive' ? 'rgba(0, 222, 115, 0.15)' : 'rgba(255, 169, 64, 0.15)')};
  color: ${({ $mode }) => ($mode === 'adaptive' ? '#00de73' : '#ffa940')};
  font-size: 10px;
  font-weight: 600;
  margin-bottom: 8px;
`

const IntervalBar = styled.div`
  height: 4px;
  border-radius: 2px;
  background-color: rgba(0, 169, 222, 0.2);
  margin-top: 8px;
  position: relative;
  overflow: hidden;
`

const IntervalFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${({ $width }) => $width}%;
  background: linear-gradient(90deg, #00a9de 0%, #00de73 100%);
  border-radius: 2px;
`

// ============================================
// Component
// ============================================

interface PollingNodeData {
  mode: string
  baseInterval: number
  minInterval: number
}

function PollingNode({ data }: NodeProps) {
  const rawData = data as unknown as PollingNodeData
  // 防御性编程：确保字段有默认值
  const nodeData = {
    mode: rawData.mode || 'adaptive',
    baseInterval: rawData.baseInterval || 30,
    minInterval: rawData.minInterval || 5,
  }

  // 计算最小间隔相对于基础间隔的比例（防止除以零）
  const intervalRatio =
    nodeData.baseInterval > 0 ? ((nodeData.baseInterval - nodeData.minInterval) / nodeData.baseInterval) * 100 : 0

  return (
    <NodeWrapper>
      <Handle type='target' position={Position.Top} style={{ background: '#00A9DE' }} />

      <Header>
        <IconWrapper>
          <IconBase className='icon-clock' />
        </IconWrapper>
        <Title>Polling</Title>
      </Header>

      <ModeBadge $mode={nodeData.mode}>{nodeData.mode}</ModeBadge>

      <InfoRow>
        <InfoLabel>Base</InfoLabel>
        <InfoValue>{nodeData.baseInterval}s</InfoValue>
      </InfoRow>

      <InfoRow>
        <InfoLabel>Min</InfoLabel>
        <InfoValue>{nodeData.minInterval}s</InfoValue>
      </InfoRow>

      <IntervalBar>
        <IntervalFill $width={intervalRatio} />
      </IntervalBar>

      <Handle type='source' position={Position.Bottom} style={{ background: '#00A9DE' }} />
    </NodeWrapper>
  )
}

export default memo(PollingNode)
