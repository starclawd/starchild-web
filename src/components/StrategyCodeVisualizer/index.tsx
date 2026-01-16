import { memo, useMemo, useCallback, useRef } from 'react'
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  MarkerType,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import styled, { css, useTheme } from 'styled-components'
import { parseStrategyCode, ParsedStrategy } from 'utils/parseStrategyCode'
import { isNewCodeFormat } from 'utils/extractExecutableCode'
import { vm } from 'pages/helper'

// Custom Node Components
import DataSourceNode from './nodes/DataSourceNode'
import IndicatorNode from './nodes/IndicatorNode'
import ConditionNode from './nodes/ConditionNode'
import ActionNode from './nodes/ActionNode'
import HeaderNode from './nodes/HeaderNode'
import RiskNode from './nodes/RiskNode'
import AnalyzeDetailNode from './nodes/AnalyzeDetailNode'
import DecisionDetailNode from './nodes/DecisionDetailNode'
// 新增节点类型 - 支持新版代码格式
import CandlePatternNode from './nodes/CandlePatternNode'
import StateNode from './nodes/StateNode'
import PollingNode from './nodes/PollingNode'

// ============================================
// Styled Components
// ============================================

const FlowWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-height: 500px;
  border-radius: 8px;
  overflow: hidden;

  .react-flow__controls {
    background-color: ${({ theme }) => theme.black800};
    border: 1px solid ${({ theme }) => theme.black700};
    border-radius: 8px;
    overflow: hidden;

    button {
      background-color: ${({ theme }) => theme.black800};
      border-color: ${({ theme }) => theme.black700};
      color: ${({ theme }) => theme.black200};

      &:hover {
        background-color: ${({ theme }) => theme.black700};
      }

      svg {
        fill: ${({ theme }) => theme.black200};
      }
    }
  }

  .react-flow__minimap {
    background-color: ${({ theme }) => theme.black900};
    border: 1px solid ${({ theme }) => theme.black700};
    border-radius: 8px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-height: ${vm(400)};
      border-radius: ${vm(6)};
    `}
`

// ============================================
// Node Types Registration
// ============================================

const nodeTypes = {
  datasource: DataSourceNode,
  indicator: IndicatorNode,
  condition: ConditionNode,
  action: ActionNode,
  header: HeaderNode,
  risk: RiskNode,
  analyzeDetail: AnalyzeDetailNode,
  decisionDetail: DecisionDetailNode,
  // 新增节点类型 - 支持新版代码格式
  candlePattern: CandlePatternNode,
  state: StateNode,
  polling: PollingNode,
}

// ============================================
// Flow Generation
// ============================================

/**
 * 生成流程图元素
 * 支持新旧两种代码格式，自动检测并选择合适的布局
 */
function generateFlowElements(
  strategy: ParsedStrategy,
  theme: ReturnType<typeof useTheme>,
  code?: string,
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // 检测是否为新版代码格式
  const isNewFormat = code ? isNewCodeFormat(code) : !!strategy.candlePattern

  const COLUMN_X = {
    left: 50,
    center: 350,
    right: 650,
  }

  let currentY = 20

  // 1. Header Node
  nodes.push({
    id: 'header',
    type: 'header',
    position: { x: COLUMN_X.center - 100, y: currentY },
    data: {
      name: strategy.name,
      strategyType: strategy.strategyType,
      timeframe: strategy.config.timeframe,
      symbol: strategy.config.trading_symbol,
      crossAssetInfo: strategy.crossAssetInfo,
      // 新版字段
      vibe: strategy.vibe,
    },
  })

  currentY += 120

  // ============================================
  // 新版代码格式 - 增加轮询和状态管理节点
  // ============================================

  // 2a. Polling Node (新版格式 - 右上角)
  if (strategy.pollingConfig) {
    nodes.push({
      id: 'polling',
      type: 'polling',
      position: { x: COLUMN_X.right, y: currentY - 80 },
      data: {
        mode: strategy.pollingConfig.mode,
        baseInterval: strategy.pollingConfig.baseInterval,
        minInterval: strategy.pollingConfig.minInterval,
      },
    })

    // 连接 header 到 polling
    edges.push({
      id: 'edge-header-polling',
      source: 'header',
      target: 'polling',
      type: 'smoothstep',
      style: { stroke: '#00A9DE', strokeWidth: 1, strokeDasharray: '5,5' },
    })
  }

  // 2. Data Sources (Left column)
  const dsStartY = currentY
  strategy.dataSources.forEach((ds, i) => {
    nodes.push({
      id: ds.id,
      type: 'datasource',
      position: { x: COLUMN_X.left, y: dsStartY + i * 90 },
      data: { api: ds.api, fields: ds.fields },
    })
  })

  // 3. Indicators (Center column, connected to data sources)
  // 对于新版格式，如果没有传统指标但有 K 线模式，跳过指标节点
  const hasTraditionalIndicators = strategy.indicators.length > 0
  const indStartY = currentY

  if (hasTraditionalIndicators) {
    strategy.indicators.forEach((ind, i) => {
      nodes.push({
        id: ind.id,
        type: 'indicator',
        position: { x: COLUMN_X.center, y: indStartY + i * 80 },
        data: { name: ind.name, params: ind.params },
      })
    })

    // 连接所有数据源到第一个指标节点
    if (strategy.dataSources.length > 0 && strategy.indicators.length > 0) {
      const firstIndicatorId = strategy.indicators[0].id
      strategy.dataSources.forEach((ds) => {
        edges.push({
          id: `edge-${ds.id}-${firstIndicatorId}`,
          source: ds.id,
          target: firstIndicatorId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#00A9DE', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00A9DE' },
        })
      })
    }
  }

  // Calculate max Y from data sources and indicators
  const dsMaxY = dsStartY + strategy.dataSources.length * 90
  const indMaxY = hasTraditionalIndicators ? indStartY + strategy.indicators.length * 80 : dsMaxY
  currentY = Math.max(dsMaxY, indMaxY) + 40

  // ============================================
  // 新版代码格式 - K线模式节点
  // ============================================

  let candlePatternNodeId: string | null = null

  if (strategy.candlePattern) {
    candlePatternNodeId = 'candle-pattern'
    nodes.push({
      id: candlePatternNodeId,
      type: 'candlePattern',
      position: { x: COLUMN_X.center - 40, y: currentY },
      data: {
        type: strategy.candlePattern.type,
        name: strategy.candlePattern.name,
        description: strategy.candlePattern.description,
        requiredCandles: strategy.candlePattern.requiredCandles,
        colorPattern: strategy.candlePattern.colorPattern,
        entryCondition: strategy.candlePattern.entryCondition,
        exitCondition: strategy.candlePattern.exitCondition,
      },
    })

    // 连接所有数据源到 K 线模式节点
    if (strategy.dataSources.length > 0) {
      const targetNodeId = candlePatternNodeId // TypeScript narrowing
      strategy.dataSources.forEach((ds) => {
        edges.push({
          id: `edge-${ds.id}-candle`,
          source: ds.id,
          target: targetNodeId,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#00DE73', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
        })
      })
    }

    currentY += 200
  }

  // 4. Analyze Detail Node (Center) - 展示详细的分析步骤
  const processNodeId = 'process-analyze'
  nodes.push({
    id: processNodeId,
    type: 'analyzeDetail',
    position: { x: COLUMN_X.center - 40, y: currentY },
    data: { steps: strategy.analyzeSteps },
  })

  // Connect indicators to process (旧版格式)
  if (hasTraditionalIndicators) {
    strategy.indicators.forEach((ind) => {
      edges.push({
        id: `edge-${ind.id}-process`,
        source: ind.id,
        target: processNodeId,
        type: 'smoothstep',
        style: { stroke: '#A87FFF', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#A87FFF' },
      })
    })
  }

  // Connect candle pattern to process (新版格式)
  if (candlePatternNodeId) {
    edges.push({
      id: 'edge-candle-process',
      source: candlePatternNodeId,
      target: processNodeId,
      type: 'smoothstep',
      style: { stroke: '#00DE73', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
    })
  }

  // 如果没有指标也没有 K 线模式，直接连接所有数据源到分析节点
  if (!hasTraditionalIndicators && !candlePatternNodeId && strategy.dataSources.length > 0) {
    strategy.dataSources.forEach((ds) => {
      edges.push({
        id: `edge-${ds.id}-process`,
        source: ds.id,
        target: processNodeId,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#A87FFF', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#A87FFF' },
      })
    })
  }

  // 根据分析步骤数量计算高度
  const analyzeNodeHeight = Math.max(120, strategy.analyzeSteps.length * 50 + 60)
  currentY += analyzeNodeHeight

  // ============================================
  // 新版代码格式 - 状态管理节点
  // ============================================

  if (strategy.stateManagement) {
    const stateNodeId = 'state-management'
    nodes.push({
      id: stateNodeId,
      type: 'state',
      position: { x: COLUMN_X.right, y: currentY - analyzeNodeHeight + 20 },
      data: {
        needsState: strategy.stateManagement.needsState,
        fields: strategy.stateManagement.fields,
        resetTrigger: strategy.stateManagement.resetTrigger,
      },
    })

    // 连接分析节点到状态节点
    edges.push({
      id: 'edge-process-state',
      source: processNodeId,
      target: stateNodeId,
      type: 'smoothstep',
      style: { stroke: '#8B5CF6', strokeWidth: 1, strokeDasharray: '4,4' },
    })
  }

  // 5. Decision Detail Node - 展示详细的决策逻辑
  const decisionNodeId = 'decision'
  nodes.push({
    id: decisionNodeId,
    type: 'decisionDetail',
    position: { x: COLUMN_X.center - 60, y: currentY },
    data: {
      hasPosition: strategy.decisionLogic.hasPosition,
      noPosition: strategy.decisionLogic.noPosition,
    },
  })

  edges.push({
    id: 'edge-process-decision',
    source: processNodeId,
    target: decisionNodeId,
    type: 'smoothstep',
    style: { stroke: '#FFA940', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FFA940' },
  })

  // 根据决策分支数量计算高度
  const decisionBranches = strategy.decisionLogic.hasPosition.length + strategy.decisionLogic.noPosition.length
  const decisionNodeHeight = Math.max(120, decisionBranches * 30 + 80)
  currentY += decisionNodeHeight

  // 6. Entry Conditions (Left side)
  const entryStartY = currentY
  strategy.entryConditions.forEach((cond, i) => {
    nodes.push({
      id: cond.id,
      type: 'condition',
      position: { x: COLUMN_X.left, y: entryStartY + i * 120 },
      data: {
        direction: cond.direction,
        category: 'entry',
        triggerType: cond.triggerType,
        conditions: cond.conditions,
        description: cond.description,
      },
    })

    edges.push({
      id: `edge-decision-${cond.id}`,
      source: decisionNodeId,
      target: cond.id,
      type: 'smoothstep',
      label: 'No Position',
      labelStyle: { fill: theme.black100, fontSize: 10 },
      labelBgStyle: { fill: '#121315' },
      style: { stroke: '#00DE73', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
    })
  })

  // 7. Exit Conditions (Right side)
  const exitStartY = currentY
  strategy.exitConditions.forEach((cond, i) => {
    nodes.push({
      id: cond.id,
      type: 'condition',
      position: { x: COLUMN_X.right, y: exitStartY + i * 100 },
      data: {
        direction: cond.direction,
        category: 'exit',
        triggerType: cond.triggerType,
        conditions: cond.conditions,
        description: cond.description,
      },
    })

    edges.push({
      id: `edge-decision-${cond.id}`,
      source: decisionNodeId,
      target: cond.id,
      type: 'smoothstep',
      label: 'Has Position',
      labelStyle: { fill: theme.black100, fontSize: 10 },
      labelBgStyle: { fill: '#121315' },
      style: { stroke: '#FF375B', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
    })
  })

  // Calculate max Y
  const entryMaxY = entryStartY + strategy.entryConditions.length * 120
  const exitMaxY = exitStartY + strategy.exitConditions.length * 100
  currentY = Math.max(entryMaxY, exitMaxY) + 40

  // 8. Action Nodes
  // Buy action
  const buyNodeId = 'action-buy'
  nodes.push({
    id: buyNodeId,
    type: 'action',
    position: { x: COLUMN_X.left + 50, y: currentY },
    data: { action: 'buy', description: 'Open Long / Close Short' },
  })

  // Sell action
  const sellNodeId = 'action-sell'
  nodes.push({
    id: sellNodeId,
    type: 'action',
    position: { x: COLUMN_X.right - 50, y: currentY },
    data: { action: 'sell', description: 'Open Short / Close Long' },
  })

  // Connect entry conditions to buy
  strategy.entryConditions
    .filter((c) => c.direction === 'long')
    .forEach((cond) => {
      edges.push({
        id: `edge-${cond.id}-buy`,
        source: cond.id,
        target: buyNodeId,
        type: 'smoothstep',
        style: { stroke: '#00DE73', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
      })
    })

  // Connect entry conditions to sell
  strategy.entryConditions
    .filter((c) => c.direction === 'short')
    .forEach((cond) => {
      edges.push({
        id: `edge-${cond.id}-sell`,
        source: cond.id,
        target: sellNodeId,
        type: 'smoothstep',
        style: { stroke: '#FF375B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
      })
    })

  // Connect exit conditions
  strategy.exitConditions.forEach((cond) => {
    if (cond.triggerType === 'take_profit' || cond.direction === 'long') {
      edges.push({
        id: `edge-${cond.id}-sell`,
        source: cond.id,
        target: sellNodeId,
        type: 'smoothstep',
        style: { stroke: '#FF375B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
      })
    }
    if (cond.triggerType === 'reversal') {
      edges.push({
        id: `edge-${cond.id}-buy`,
        source: cond.id,
        target: buyNodeId,
        type: 'smoothstep',
        style: { stroke: '#00DE73', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
      })
    }
  })

  currentY += 120

  // 9. Risk Management Node
  nodes.push({
    id: 'risk',
    type: 'risk',
    position: { x: COLUMN_X.center - 50, y: currentY },
    data: {
      takeProfit: strategy.riskParams.takeProfit,
      stopLoss: strategy.riskParams.stopLoss,
      leverage: strategy.riskParams.leverage,
      positionSize: strategy.riskParams.positionSize,
      // 非对称仓位大小
      longPositionSize: strategy.riskParams.longPositionSize,
      shortPositionSize: strategy.riskParams.shortPositionSize,
      // 高级风控参数
      maxRoeLoss: strategy.riskParams.maxRoeLoss,
      maxDrawdown: strategy.riskParams.maxDrawdown,
      maxAccountRisk: strategy.riskParams.maxAccountRisk,
      // 新版 - hard stops
      hardStops: strategy.riskParams.hardStops,
    },
  })

  return { nodes, edges }
}

// ============================================
// Main Component
// ============================================

interface Props {
  code: string
  className?: string
  visible?: boolean
}

// 内部组件
function StrategyFlowInner({ strategy, visible, code }: { strategy: ParsedStrategy; visible: boolean; code?: string }) {
  const theme = useTheme()
  const reactFlowInstance = useRef<any>(null)

  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = generateFlowElements(strategy, theme, code)
    return { initialNodes: nodes, initialEdges: edges }
  }, [strategy, theme, code])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const proOptions = { hideAttribution: true }

  // 保存 ReactFlow 实例
  const handleInit = useCallback((instance: any) => {
    reactFlowInstance.current = instance
  }, [])

  // 当组件变为可见时，调用 fitView
  // useEffect(() => {
  //   if (visible && reactFlowInstance.current) {
  //     // 延迟执行确保容器尺寸正确
  //     setTimeout(() => {
  //       reactFlowInstance.current?.fitView({
  //         padding: 0.1,
  //         duration: 200,
  //         maxZoom: 1,
  //         minZoom: 0.4,
  //       })
  //     }, 50)
  //   }
  // }, [visible])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onInit={handleInit}
      minZoom={0.4}
      maxZoom={1}
      proOptions={proOptions}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      panOnDrag={true}
      zoomOnScroll={true}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={theme.black700} />
    </ReactFlow>
  )
}

function StrategyCodeVisualizer({ code, className, visible = true }: Props) {
  const strategy = useMemo(() => parseStrategyCode(code), [code])

  if (!strategy) return null

  return (
    <FlowWrapper className={className}>
      <ReactFlowProvider>
        <StrategyFlowInner strategy={strategy} visible={visible} code={code} />
      </ReactFlowProvider>
    </FlowWrapper>
  )
}

export default memo(StrategyCodeVisualizer)
