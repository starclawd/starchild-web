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
  background: linear-gradient(135deg, #1a1c1e 0%, #0b0c0e 100%);
  border: 2px solid #f84600;
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
  color: #f84600;
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
  symbols?: string[] // 多币种支持
  // Cross-Asset 信息
  crossAssetInfo?: {
    signalSymbol: string
    tradingSymbol: string
    signalAsset: string
    tradingAsset: string
  }
}

function HeaderNode({ data }: NodeProps) {
  const rawData = data as unknown as HeaderNodeData
  // 防御性编程：确保字段有默认值，且所有值总是字符串
  const safeString = (val: unknown, fallback = ''): string => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') {
      // 尝试从对象中提取常用字段
      const obj = val as Record<string, unknown>
      if ('symbol' in obj) return String(obj.symbol || fallback)
      if ('name' in obj) return String(obj.name || fallback)
      if ('value' in obj) return String(obj.value || fallback)
    }
    return val ? String(val) : fallback
  }

  // 获取 symbols 数组，返回 null 表示无法提取
  const getSymbols = (): string[] | null => {
    if (Array.isArray(rawData.symbols) && rawData.symbols.length > 0) {
      const filtered = rawData.symbols.filter((s): s is string => typeof s === 'string' && s.length > 0)
      return filtered.length > 0 ? filtered : null
    }
    const singleSymbol = safeString(rawData.symbol, '')
    return singleSymbol ? [singleSymbol] : null
  }

  const symbols = getSymbols()

  // 格式化 symbol 显示：多个时用逗号连接，超过 3 个时显示前 3 个 + 数量
  const formatSymbolDisplay = (): string | null => {
    if (!symbols || symbols.length === 0) return null
    if (symbols.length <= 3) return symbols.join(', ')
    return `${symbols.slice(0, 3).join(', ')} +${symbols.length - 3}`
  }

  // 获取 timeframe，返回空字符串表示无法提取
  const timeframeValue = safeString(rawData.timeframe, '')

  const nodeData = {
    name: safeString(rawData.name, 'Trading Strategy'),
    strategyType: safeString(rawData.strategyType, 'Strategy'),
    timeframe: timeframeValue || null, // 空字符串转为 null
    symbol: formatSymbolDisplay(),
    crossAssetInfo: rawData.crossAssetInfo
      ? {
          signalSymbol: safeString(rawData.crossAssetInfo.signalSymbol),
          tradingSymbol: safeString(rawData.crossAssetInfo.tradingSymbol),
          signalAsset: safeString(rawData.crossAssetInfo.signalAsset),
          tradingAsset: safeString(rawData.crossAssetInfo.tradingAsset),
        }
      : undefined,
  }
  const { crossAssetInfo } = nodeData

  // 标签文字：多币种时显示 "Symbols"，单币种显示 "Symbol"
  const symbolLabel = symbols && symbols.length > 1 ? 'Symbols' : 'Symbol'

  // 检查是否有任何信息需要显示
  const hasSymbol = nodeData.symbol !== null
  const hasTimeframe = nodeData.timeframe !== null
  const showInfoRow = hasSymbol || hasTimeframe

  return (
    <NodeWrapper>
      <StrategyName>{nodeData.name}</StrategyName>
      <TypeBadge>{nodeData.strategyType}</TypeBadge>
      {showInfoRow && (
        <InfoRow>
          {hasSymbol && (
            <InfoItem>
              <InfoLabel>{symbolLabel}</InfoLabel>
              <InfoValue>{nodeData.symbol}</InfoValue>
            </InfoItem>
          )}
          {hasTimeframe && (
            <InfoItem>
              <InfoLabel>Timeframe</InfoLabel>
              <InfoValue>{nodeData.timeframe?.toUpperCase()}</InfoValue>
            </InfoItem>
          )}
        </InfoRow>
      )}
      {crossAssetInfo && crossAssetInfo.signalAsset && crossAssetInfo.tradingAsset && (
        <CrossAssetBadge>
          <div>
            <AssetLabel $type='signal'>Signal</AssetLabel>
            <AssetValue>{crossAssetInfo.signalAsset}</AssetValue>
          </div>
          <ArrowIcon>→</ArrowIcon>
          <div>
            <AssetLabel $type='trade'>Trade</AssetLabel>
            <AssetValue>{crossAssetInfo.tradingAsset}</AssetValue>
          </div>
        </CrossAssetBadge>
      )}
      <Handle type='source' position={Position.Bottom} style={{ background: '#F84600' }} />
    </NodeWrapper>
  )
}

export default memo(HeaderNode)
