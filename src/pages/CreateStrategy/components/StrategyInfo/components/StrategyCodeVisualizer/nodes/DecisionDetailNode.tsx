import { memo } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { DecisionBranch } from 'utils/parseStrategyCode'

const NodeWrapper = styled.div`
  min-width: 200px;
  max-width: 280px;
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #bd4d00 0%, #5e2600 100%);
  border: 2px solid #ffa940;
  box-shadow:
    0 4px 24px rgba(255, 169, 64, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #ffa940;
  color: #000;
  font-size: 18px;
`

const Title = styled.div`
  font-size: 15px;
  font-weight: 700;
  color: #ffa940;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const BranchesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const BranchSection = styled.div<{ $type: 'entry' | 'exit' }>`
  padding: 10px 12px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  border-left: 4px solid ${({ $type }) => ($type === 'entry' ? '#00DE73' : '#FF375B')};
`

const BranchHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
`

const BranchTitle = styled.div<{ $type: 'entry' | 'exit' }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $type }) => ($type === 'entry' ? '#00DE73' : '#FF375B')};
  text-transform: uppercase;
  letter-spacing: 0.3px;
`

const BranchCount = styled.div`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.5);
`

const BranchItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`

const BranchTag = styled.span<{ $action: string }>`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 9px;
  font-weight: 600;
  background-color: ${({ $action }) =>
    $action === 'BUY' || $action === 'OPEN' || $action.includes('LONG')
      ? 'rgba(0, 222, 115, 0.2)'
      : 'rgba(255, 55, 91, 0.2)'};
  color: ${({ $action }) =>
    $action === 'BUY' || $action === 'OPEN' || $action.includes('LONG') ? '#00DE73' : '#FF375B'};
  border: 1px solid
    ${({ $action }) =>
      $action === 'BUY' || $action === 'OPEN' || $action.includes('LONG')
        ? 'rgba(0, 222, 115, 0.3)'
        : 'rgba(255, 55, 91, 0.3)'};
`

interface DecisionDetailNodeData {
  hasPosition: DecisionBranch[]
  noPosition: DecisionBranch[]
  // 实际的条件节点数量
  entryConditionsCount?: number
  exitConditionsCount?: number
}

function DecisionDetailNode({ data }: NodeProps) {
  const rawData = data as unknown as DecisionDetailNodeData
  // 辅助函数：安全转换为字符串
  const safeString = (val: unknown, fallback = ''): string => {
    if (typeof val === 'string') return val
    if (val && typeof val === 'object') {
      const obj = val as Record<string, unknown>
      if ('action' in obj) return String(obj.action || fallback)
      if ('value' in obj) return String(obj.value || fallback)
    }
    return val ? String(val) : fallback
  }
  // 防御性编程：确保字段有默认值
  const nodeData = {
    hasPosition: Array.isArray(rawData.hasPosition) ? rawData.hasPosition : [],
    noPosition: Array.isArray(rawData.noPosition) ? rawData.noPosition : [],
    entryConditionsCount: typeof rawData.entryConditionsCount === 'number' ? rawData.entryConditionsCount : undefined,
    exitConditionsCount: typeof rawData.exitConditionsCount === 'number' ? rawData.exitConditionsCount : undefined,
  }

  // 提取简化的分支动作
  const getSimplifiedActions = (branches: DecisionBranch[]) => {
    if (!Array.isArray(branches)) return []
    const actions = branches.map((b) => safeString(b?.action, 'UNKNOWN')).filter(Boolean)
    // 去重并限制显示数量
    return [...new Set(actions)].slice(0, 3)
  }

  const noPositionActions = getSimplifiedActions(nodeData.noPosition)
  const hasPositionActions = getSimplifiedActions(nodeData.hasPosition)

  // 使用实际的条件数量（如果传递了的话），否则使用 decisionLogic 的数量
  const entryCount = nodeData.entryConditionsCount ?? nodeData.noPosition?.length ?? 0
  const exitCount = nodeData.exitConditionsCount ?? nodeData.hasPosition?.length ?? 0

  return (
    <NodeWrapper>
      <Handle type='target' position={Position.Top} style={{ background: '#FFA940' }} />
      <Header>
        <IconWrapper>
          <IconBase className='icon-question' />
        </IconWrapper>
        <Title>DECIDE</Title>
      </Header>

      <BranchesContainer>
        {(nodeData.noPosition?.length > 0 || entryCount > 0) && (
          <BranchSection $type='entry'>
            <BranchHeader>
              <BranchTitle $type='entry'>IF NO POSITION</BranchTitle>
              <BranchCount>
                {entryCount} condition{entryCount !== 1 ? 's' : ''}
              </BranchCount>
            </BranchHeader>
            <BranchItems>
              {noPositionActions.map((action, i) => (
                <BranchTag key={i} $action={action}>
                  → {action}
                </BranchTag>
              ))}
            </BranchItems>
          </BranchSection>
        )}

        {(nodeData.hasPosition?.length > 0 || exitCount > 0) && (
          <BranchSection $type='exit'>
            <BranchHeader>
              <BranchTitle $type='exit'>IF HAS POSITION</BranchTitle>
              <BranchCount>
                {exitCount} condition{exitCount !== 1 ? 's' : ''}
              </BranchCount>
            </BranchHeader>
            <BranchItems>
              {hasPositionActions.map((action, i) => (
                <BranchTag key={i} $action={action}>
                  → {action}
                </BranchTag>
              ))}
            </BranchItems>
          </BranchSection>
        )}
      </BranchesContainer>

      <Handle type='source' position={Position.Bottom} style={{ background: '#FFA940' }} />
    </NodeWrapper>
  )
}

export default memo(DecisionDetailNode)
