import { memo, useMemo } from 'react'
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
import { ParsedStrategy } from 'utils/parseStrategyCode'
import { strategyConfigToVisualization, StrategyConfig } from 'utils/strategyConfigToVisualization'
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
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // 优化列间距，避免节点重叠
  const COLUMN_X = {
    left: 50,
    center: 480,
    right: 910,
  }

  // 节点垂直间距配置
  const SPACING = {
    dataSource: 100, // 数据源节点间距
    indicator: 90, // 指标节点间距
    entryCondition: 120, // 入场条件节点间距
    exitCondition: 110, // 退出条件节点间距
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
      symbols: strategy.config.symbols, // 传递所有 symbols
      crossAssetInfo: strategy.crossAssetInfo,
      // 新版字段
      vibe: strategy.vibe,
    },
  })

  currentY += 130

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
      position: { x: COLUMN_X.left, y: dsStartY + i * SPACING.dataSource },
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
        position: { x: COLUMN_X.center, y: indStartY + i * SPACING.indicator },
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
  const dsMaxY = dsStartY + strategy.dataSources.length * SPACING.dataSource
  const indMaxY = hasTraditionalIndicators ? indStartY + strategy.indicators.length * SPACING.indicator : dsMaxY
  currentY = Math.max(dsMaxY, indMaxY) + 50

  // ============================================
  // 新版代码格式 - K线模式节点
  // ============================================

  let candlePatternNodeId: string | null = null

  if (strategy.candlePattern) {
    candlePatternNodeId = 'candle-pattern'
    nodes.push({
      id: candlePatternNodeId,
      type: 'candlePattern',
      position: { x: COLUMN_X.center - 60, y: currentY },
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
    position: { x: COLUMN_X.center - 60, y: currentY },
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
    position: { x: COLUMN_X.center - 80, y: currentY },
    data: {
      hasPosition: strategy.decisionLogic.hasPosition,
      noPosition: strategy.decisionLogic.noPosition,
      // 传递实际的条件数量，用于显示
      entryConditionsCount: strategy.entryConditions.length,
      exitConditionsCount: strategy.exitConditions.length,
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

  // ============================================
  // 6. Entry & Exit Conditions - 优化布局
  // ============================================

  // 计算条件节点的起始位置
  const conditionStartY = currentY
  const hasEntryConditions = strategy.entryConditions.length > 0
  const hasExitConditions = strategy.exitConditions.length > 0

  // 6a. Entry Conditions (Left side) - 只有无持仓时触发
  strategy.entryConditions.forEach((cond, i) => {
    nodes.push({
      id: cond.id,
      type: 'condition',
      position: { x: COLUMN_X.left, y: conditionStartY + i * SPACING.entryCondition },
      data: {
        direction: cond.direction,
        category: 'entry',
        triggerType: cond.triggerType,
        conditions: cond.conditions,
        description: cond.description,
      },
    })

    // 每条连接线都显示 "No Position" 标签
    edges.push({
      id: `edge-decision-${cond.id}`,
      source: decisionNodeId,
      target: cond.id,
      type: 'smoothstep',
      label: 'No Position',
      labelStyle: { fill: '#00DE73', fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: '#121315', fillOpacity: 0.9 },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
      style: { stroke: '#00DE73', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
    })
  })

  // 6b. Exit Conditions (Right side) - 持仓时触发
  strategy.exitConditions.forEach((cond, i) => {
    nodes.push({
      id: cond.id,
      type: 'condition',
      position: { x: COLUMN_X.right, y: conditionStartY + i * SPACING.exitCondition },
      data: {
        direction: cond.direction,
        category: 'exit',
        triggerType: cond.triggerType,
        conditions: cond.conditions,
        description: cond.description,
      },
    })

    // 每条连接线都显示 "Has Position" 标签
    edges.push({
      id: `edge-decision-${cond.id}`,
      source: decisionNodeId,
      target: cond.id,
      type: 'smoothstep',
      label: 'Has Position',
      labelStyle: { fill: '#FF375B', fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: '#121315', fillOpacity: 0.9 },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
      style: { stroke: '#FF375B', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
    })
  })

  // Calculate max Y
  const entryMaxY = conditionStartY + Math.max(1, strategy.entryConditions.length) * SPACING.entryCondition
  const exitMaxY = conditionStartY + Math.max(1, strategy.exitConditions.length) * SPACING.exitCondition
  currentY = Math.max(entryMaxY, exitMaxY) + 40

  // ============================================
  // 7. Action Nodes - BUY / SELL
  // ============================================

  const buyNodeId = 'action-buy'
  const sellNodeId = 'action-sell'

  // 根据是否有对应的条件来决定 Action 节点的位置
  const buyNodeX = hasEntryConditions ? COLUMN_X.left + 50 : COLUMN_X.center - 180
  const sellNodeX = hasExitConditions ? COLUMN_X.right + 50 : COLUMN_X.center + 80

  nodes.push({
    id: buyNodeId,
    type: 'action',
    position: { x: buyNodeX, y: currentY },
    data: { action: 'buy', description: 'Triggered when conditions above are met' },
  })

  nodes.push({
    id: sellNodeId,
    type: 'action',
    position: { x: sellNodeX, y: currentY },
    data: { action: 'sell', description: 'Triggered when conditions above are met' },
  })

  // ============================================
  // 连接逻辑 - 入场条件 → BUY
  // ============================================

  const longEntryConditions = strategy.entryConditions.filter((c) => c.direction === 'long')
  const shortEntryConditions = strategy.entryConditions.filter((c) => c.direction === 'short')

  // 连接 long 入场条件到 BUY
  longEntryConditions.forEach((cond) => {
    edges.push({
      id: `edge-${cond.id}-buy`,
      source: cond.id,
      target: buyNodeId,
      type: 'smoothstep',
      style: { stroke: '#00DE73', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
    })
  })

  // 连接 short 入场条件到 SELL
  shortEntryConditions.forEach((cond) => {
    edges.push({
      id: `edge-${cond.id}-sell`,
      source: cond.id,
      target: sellNodeId,
      type: 'smoothstep',
      style: { stroke: '#FF375B', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
    })
  })

  // ============================================
  // Fallback 连接 - 当没有明确的入场条件时
  // ============================================

  const hasBuyConnection = edges.some((e) => e.target === buyNodeId)
  const hasBuyInNoPosition = strategy.decisionLogic.noPosition.some(
    (branch) => branch.action === 'BUY' || branch.action.includes('BUY') || branch.action === 'OPEN',
  )

  // 如果没有边连接到 BUY 节点，直接从 decision 连接
  if (!hasBuyConnection && hasBuyInNoPosition) {
    edges.push({
      id: 'edge-decision-buy-direct',
      source: decisionNodeId,
      target: buyNodeId,
      type: 'smoothstep',
      label: 'Entry Signal',
      labelStyle: { fill: '#00DE73', fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: '#121315', fillOpacity: 0.9 },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
      style: { stroke: '#00DE73', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#00DE73' },
    })
  }

  const hasSellConnectionFromEntry = edges.some((e) => e.target === sellNodeId && e.source.startsWith('entry-'))
  const hasSellInNoPosition = strategy.decisionLogic.noPosition.some(
    (branch) => branch.action === 'SELL' || branch.action.includes('SELL'),
  )

  // 如果没有从入场条件连接到 SELL 节点，直接从 decision 连接
  if (!hasSellConnectionFromEntry && hasSellInNoPosition) {
    edges.push({
      id: 'edge-decision-sell-direct',
      source: decisionNodeId,
      target: sellNodeId,
      type: 'smoothstep',
      label: 'Entry Signal',
      labelStyle: { fill: '#FF375B', fontSize: 11, fontWeight: 600 },
      labelBgStyle: { fill: '#121315', fillOpacity: 0.9 },
      labelBgPadding: [4, 6] as [number, number],
      labelBgBorderRadius: 4,
      style: { stroke: '#FF375B', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
    })
  }

  // ============================================
  // 连接逻辑 - 退出条件 → SELL
  // ============================================

  strategy.exitConditions.forEach((cond) => {
    // TP、SL、direction=long 或 both 的退出条件都连接到 SELL
    if (
      cond.triggerType === 'take_profit' ||
      cond.triggerType === 'stop_loss' ||
      cond.direction === 'long' ||
      cond.direction === 'both'
    ) {
      edges.push({
        id: `edge-${cond.id}-sell`,
        source: cond.id,
        target: sellNodeId,
        type: 'smoothstep',
        style: { stroke: '#FF375B', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#FF375B' },
      })
    }
    // reversal 类型可能连接到 BUY（平空开多）
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

  currentY += 100

  // ============================================
  // 8. Risk Management Node - 风控参数总览
  // ============================================

  const riskNodeId = 'risk'
  nodes.push({
    id: riskNodeId,
    type: 'risk',
    position: { x: COLUMN_X.center - 100, y: currentY },
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

  // 连接 BUY 和 SELL 到 Risk Management
  edges.push({
    id: 'edge-buy-risk',
    source: buyNodeId,
    target: riskNodeId,
    type: 'smoothstep',
    style: { stroke: '#FFA940', strokeWidth: 1, strokeDasharray: '4,4' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FFA940', width: 12, height: 12 },
  })

  edges.push({
    id: 'edge-sell-risk',
    source: sellNodeId,
    target: riskNodeId,
    type: 'smoothstep',
    style: { stroke: '#FFA940', strokeWidth: 1, strokeDasharray: '4,4' },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FFA940', width: 12, height: 12 },
  })

  return { nodes, edges }
}

// ============================================
// Main Component
// ============================================

interface Props {
  code?: string
  className?: string
  visible?: boolean
  /**
   * 策略配置数据（优先使用，比解析代码更准确）
   * 通过 useCreateStrategyDetail 获取: strategyDetail.strategy_config
   */
  strategyConfig?: StrategyConfig
  /**
   * 策略名称（优先使用，来自 strategyDetail.name）
   */
  strategyName?: string
}

// 内部组件
function StrategyFlowInner({ strategy }: { strategy: ParsedStrategy }) {
  const theme = useTheme()

  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = generateFlowElements(strategy, theme)
    return { initialNodes: nodes, initialEdges: edges }
  }, [strategy, theme])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const proOptions = { hideAttribution: true }

  // 设置初始视口为 (0, 0) zoom 0.6，然后让 fitView 自动调整
  const defaultViewport = { x: 0, y: 0, zoom: 0.55 }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      defaultViewport={defaultViewport}
      minZoom={0.3}
      maxZoom={1.5}
      proOptions={proOptions}
      nodesDraggable={true}
      nodesConnectable={false}
      elementsSelectable={true}
      panOnDrag={true}
      zoomOnScroll={true}
      fitView
      fitViewOptions={{
        padding: 0.1,
        minZoom: 0.3,
        maxZoom: 0.7,
      }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={theme.black700} />
    </ReactFlow>
  )
}

function StrategyCodeVisualizer({ className, strategyConfig, strategyName }: Props) {
  // 直接使用 strategyConfig（有 external_code 就一定有 strategy_config）
  const strategy = useMemo(() => {
    if (strategyConfig) {
      return strategyConfigToVisualization(strategyConfig, strategyName)
    }
    return null
  }, [strategyConfig, strategyName])

  if (!strategy) return null

  return (
    <FlowWrapper className={className}>
      <ReactFlowProvider>
        <StrategyFlowInner strategy={strategy} />
      </ReactFlowProvider>
    </FlowWrapper>
  )
}

export default memo(StrategyCodeVisualizer)
