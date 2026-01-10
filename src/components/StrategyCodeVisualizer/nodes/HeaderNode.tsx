import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'

const NodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 280px;
  padding: 16px 24px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1A1C1E 0%, #0B0C0E 100%);
  border: 2px solid #F84600;
  box-shadow: 0 4px 30px rgba(248, 70, 0, 0.3);
`

const StrategyName = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 8px;
`

const TypeBadge = styled.span`
  display: inline-flex;
  padding: 4px 12px;
  border-radius: 6px;
  background-color: rgba(248, 70, 0, 0.2);
  color: #F84600;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 12px;
`

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

const CrossAssetBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  background-color: rgba(168, 127, 255, 0.15);
  border: 1px solid rgba(168, 127, 255, 0.3);
`

const AssetLabel = styled.span<{ $type: 'signal' | 'trade' }>`
  font-size: 10px;
  font-weight: 500;
  color: ${({ $type }) => ($type === 'signal' ? '#A87FFF' : '#00DE73')};
  text-transform: uppercase;
`

const AssetValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #fff;
`

const ArrowIcon = styled.span`
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InfoLabel = styled.span`
  font-size: 9px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const InfoValue = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-top: 2px;
`

interface HeaderNodeData {
  name: string
  strategyType: string
  timeframe: string
  symbol: string
  // Cross-Asset 信息
  crossAssetInfo?: {
    signalSymbol: string
    tradingSymbol: string
    signalAsset: string
    tradingAsset: string
  }
}

function HeaderNode({ data }: NodeProps) {
  const nodeData = data as unknown as HeaderNodeData
  const { crossAssetInfo } = nodeData

  return (
    <NodeWrapper>
      <StrategyName>{nodeData.name}</StrategyName>
      <TypeBadge>{nodeData.strategyType}</TypeBadge>
      <InfoRow>
        <InfoItem>
          <InfoLabel>Symbol</InfoLabel>
          <InfoValue>{nodeData.symbol || 'BTC-PERP'}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Timeframe</InfoLabel>
          <InfoValue>{nodeData.timeframe?.toUpperCase() || '1H'}</InfoValue>
        </InfoItem>
      </InfoRow>
      {crossAssetInfo && (
        <CrossAssetBadge>
          <div>
            <AssetLabel $type="signal">Signal</AssetLabel>
            <AssetValue>{crossAssetInfo.signalAsset}</AssetValue>
          </div>
          <ArrowIcon>→</ArrowIcon>
          <div>
            <AssetLabel $type="trade">Trade</AssetLabel>
            <AssetValue>{crossAssetInfo.tradingAsset}</AssetValue>
          </div>
        </CrossAssetBadge>
      )}
      <Handle type="source" position={Position.Bottom} style={{ background: '#F84600' }} />
    </NodeWrapper>
  )
}

export default memo(HeaderNode)
