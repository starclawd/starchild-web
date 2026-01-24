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

const AdvancedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

const HardStopsSection = styled.div`
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 55, 91, 0.3);
`

const HardStopsTitle = styled.div`
  font-size: 9px;
  font-weight: 600;
  color: #ff375b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '⚠️';
    font-size: 10px;
  }
`

const HardStopItem = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  padding: 4px 8px;
  margin-bottom: 4px;
  border-radius: 4px;
  background-color: rgba(255, 55, 91, 0.1);
  border-left: 2px solid #ff375b;

  &:last-child {
    margin-bottom: 0;
  }
`

const AsymmetricRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
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
  // 非对称仓位大小
  longPositionSize?: string
  shortPositionSize?: string
  // 高级风控
  maxRoeLoss?: string
  maxDrawdown?: string
  maxAccountRisk?: string
  // 新版 - hard stops 列表
  hardStops?: string[]
}

function RiskNode({ data }: NodeProps) {
  const rawData = data as unknown as RiskNodeData
  // 辅助函数：安全转换为字符串
  const safeString = (val: unknown, fallback = ''): string => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
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
  const nodeData = {
    takeProfit: safeString(rawData.takeProfit, 'Dynamic'),
    stopLoss: safeString(rawData.stopLoss, 'Dynamic'),
    leverage: safeString(rawData.leverage, '1x'),
    positionSize: safeString(rawData.positionSize, '100%'),
    longPositionSize: rawData.longPositionSize ? safeString(rawData.longPositionSize) : undefined,
    shortPositionSize: rawData.shortPositionSize ? safeString(rawData.shortPositionSize) : undefined,
    maxRoeLoss: rawData.maxRoeLoss ? safeString(rawData.maxRoeLoss) : undefined,
    maxDrawdown: rawData.maxDrawdown ? safeString(rawData.maxDrawdown) : undefined,
    maxAccountRisk: rawData.maxAccountRisk ? safeString(rawData.maxAccountRisk) : undefined,
    hardStops: Array.isArray(rawData.hardStops) 
      ? rawData.hardStops.map((s) => safeString(s)).filter(Boolean)
      : [],
  }

  const hasAsymmetricSize = nodeData.longPositionSize || nodeData.shortPositionSize
  const hasAdvancedRisk = nodeData.maxRoeLoss || nodeData.maxDrawdown || nodeData.maxAccountRisk
  const hasHardStops = nodeData.hardStops.length > 0

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

      {hasAsymmetricSize && (
        <AsymmetricRow>
          {nodeData.longPositionSize && (
            <RiskItem $type="profit">
              <RiskLabel>Long Size</RiskLabel>
              <RiskValue $type="profit">{nodeData.longPositionSize}</RiskValue>
            </RiskItem>
          )}
          {nodeData.shortPositionSize && (
            <RiskItem $type="loss">
              <RiskLabel>Short Size</RiskLabel>
              <RiskValue $type="loss">{nodeData.shortPositionSize}</RiskValue>
            </RiskItem>
          )}
        </AsymmetricRow>
      )}

      {hasAdvancedRisk && (
        <AdvancedGrid>
          {nodeData.maxRoeLoss && (
            <RiskItem $type="loss">
              <RiskLabel>Max ROE Loss</RiskLabel>
              <RiskValue $type="loss">-{nodeData.maxRoeLoss}</RiskValue>
            </RiskItem>
          )}
          {nodeData.maxDrawdown && (
            <RiskItem $type="loss">
              <RiskLabel>Max Drawdown</RiskLabel>
              <RiskValue $type="loss">{nodeData.maxDrawdown}</RiskValue>
            </RiskItem>
          )}
          {nodeData.maxAccountRisk && (
            <RiskItem $type="loss">
              <RiskLabel>Max Risk</RiskLabel>
              <RiskValue $type="loss">{nodeData.maxAccountRisk}</RiskValue>
            </RiskItem>
          )}
        </AdvancedGrid>
      )}

      {/* 新版格式 - Hard Stops 列表 */}
      {hasHardStops && (
        <HardStopsSection>
          <HardStopsTitle>Hard Stops</HardStopsTitle>
          {nodeData.hardStops.map((stop, index) => (
            <HardStopItem key={index}>{stop}</HardStopItem>
          ))}
        </HardStopsSection>
      )}
    </NodeWrapper>
  )
}

export default memo(RiskNode)
