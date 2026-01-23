import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled, { css } from 'styled-components'
import { CandlePatternInfo } from 'utils/parseStrategyCode'

// ============================================
// Styled Components
// ============================================

const NodeWrapper = styled.div`
  min-width: 220px;
  max-width: 300px;
  padding: 14px 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1a3a1a 0%, #0a1f0a 100%);
  border: 2px solid #00de73;
  box-shadow: 0 4px 20px rgba(0, 222, 115, 0.25);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(0, 222, 115, 0.3);
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: rgba(0, 222, 115, 0.2);
  color: #00de73;
  font-size: 18px;
`

const TitleWrapper = styled.div`
  flex: 1;
`

const Title = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #00de73;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const PatternName = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 2px;
`

// K线可视化
const CandleContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  padding: 12px 8px;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 12px;
`

const Candle = styled.div<{ $color: 'green' | 'red'; $height: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  /* 上影线 */
  &::before {
    content: '';
    width: 2px;
    height: ${({ $height }) => Math.max(4, $height * 0.3)}px;
    background-color: ${({ $color }) => ($color === 'green' ? '#00de73' : '#ff375b')};
  }

  /* 下影线 */
  &::after {
    content: '';
    width: 2px;
    height: ${({ $height }) => Math.max(4, $height * 0.25)}px;
    background-color: ${({ $color }) => ($color === 'green' ? '#00de73' : '#ff375b')};
  }
`

const CandleBody = styled.div<{ $color: 'green' | 'red'; $height: number }>`
  width: 16px;
  height: ${({ $height }) => Math.max(12, $height)}px;
  background-color: ${({ $color }) => ($color === 'green' ? '#00de73' : '#ff375b')};
  border-radius: 2px;
  ${({ $color }) =>
    $color === 'green'
      ? css`
          box-shadow: 0 0 8px rgba(0, 222, 115, 0.5);
        `
      : css`
          box-shadow: 0 0 8px rgba(255, 55, 91, 0.5);
        `}
`

const CandleLabel = styled.div<{ $color: 'green' | 'red' }>`
  font-size: 8px;
  font-weight: 600;
  color: ${({ $color }) => ($color === 'green' ? '#00de73' : '#ff375b')};
  margin-top: 4px;
  text-transform: uppercase;
`

// 条件显示
const ConditionSection = styled.div`
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`

const ConditionLabel = styled.div`
  font-size: 9px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  margin-bottom: 4px;
  letter-spacing: 0.5px;
`

const ConditionValue = styled.div<{ $type?: 'entry' | 'exit' }>`
  font-size: 11px;
  color: #fff;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.3);
  border-left: 3px solid ${({ $type }) => ($type === 'entry' ? '#00de73' : '#ff375b')};
`

const Description = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.4;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`

// ============================================
// Component
// ============================================

interface CandlePatternNodeData extends CandlePatternInfo {
  // 额外的显示属性
}

function CandlePatternNode({ data }: NodeProps) {
  const nodeData = data as unknown as CandlePatternNodeData

  // 生成 K 线展示数据
  const candles = nodeData.colorPattern || ['green', 'green', 'green']
  const candleHeights = candles.map((_, i) => 20 + i * 8) // 递增高度

  return (
    <NodeWrapper>
      <Handle type="target" position={Position.Top} style={{ background: '#00DE73' }} />

      <Header>
        <IconWrapper>📊</IconWrapper>
        <TitleWrapper>
          <Title>Candle Pattern</Title>
          <PatternName>{nodeData.name}</PatternName>
        </TitleWrapper>
      </Header>

      {/* K线可视化 */}
      <CandleContainer>
        {candles.map((color, index) => (
          <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Candle $color={color} $height={candleHeights[index]}>
              <CandleBody $color={color} $height={candleHeights[index]} />
            </Candle>
            <CandleLabel $color={color}>{index + 1}</CandleLabel>
          </div>
        ))}
      </CandleContainer>

      {/* 入场条件 */}
      {nodeData.entryCondition && (
        <ConditionSection>
          <ConditionLabel>Entry Condition</ConditionLabel>
          <ConditionValue $type="entry">{nodeData.entryCondition}</ConditionValue>
        </ConditionSection>
      )}

      {/* 出场条件 */}
      {nodeData.exitCondition && (
        <ConditionSection>
          <ConditionLabel>Exit Condition</ConditionLabel>
          <ConditionValue $type="exit">{nodeData.exitCondition}</ConditionValue>
        </ConditionSection>
      )}

      {/* 描述 */}
      {nodeData.description && <Description>{nodeData.description}</Description>}

      <Handle type="source" position={Position.Bottom} style={{ background: '#00DE73' }} />
    </NodeWrapper>
  )
}

export default memo(CandlePatternNode)
