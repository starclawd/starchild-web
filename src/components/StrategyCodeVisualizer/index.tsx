import { memo, useMemo, useCallback, useRef, useEffect } from 'react'
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
import { vm } from 'pages/helper'

// Custom Node Components
import DataSourceNode from './nodes/DataSourceNode'
import IndicatorNode from './nodes/IndicatorNode'
import ConditionNode from './nodes/ConditionNode'
import ActionNode from './nodes/ActionNode'
import HeaderNode from './nodes/HeaderNode'
import RiskNode from './nodes/RiskNode'

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
}

// ============================================
// Flow Generation
// ============================================

function generateFlowElements(strategy: ParsedStrategy): { nodes: Node[]; edges: Edge[] } {
  const theme = useTheme()
  const nodes: Node[] = []
  const edges: Edge[] = []

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
    },
  })

  currentY += 120

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
  const indStartY = currentY
  strategy.indicators.forEach((ind, i) => {
    nodes.push({
      id: ind.id,
      type: 'indicator',
      position: { x: COLUMN_X.center, y: indStartY + i * 80 },
      data: { name: ind.name, params: ind.params },
    })

    // Connect to first data source
    if (strategy.dataSources.length > 0) {
      edges.push({
        id: `edge-ds-${ind.id}`,
        source: strategy.dataSources[0].id,
        target: ind.id,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#00A9DE', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#00A9DE' },
      })
    }
  })

  // Calculate max Y from data sources and indicators
  const dsMaxY = dsStartY + strategy.dataSources.length * 90
  const indMaxY = indStartY + strategy.indicators.length * 80
  currentY = Math.max(dsMaxY, indMaxY) + 40

  // 4. Process Node (Center)
  const processNodeId = 'process-analyze'
  nodes.push({
    id: processNodeId,
    type: 'action',
    position: { x: COLUMN_X.center, y: currentY },
    data: { action: 'process', description: 'Analyze Conditions' },
  })

  // Connect indicators to process
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

  currentY += 100

  // 5. Decision Node
  const decisionNodeId = 'decision'
  nodes.push({
    id: decisionNodeId,
    type: 'action',
    position: { x: COLUMN_X.center, y: currentY },
    data: { action: 'decision', description: 'Check Position' },
  })

  edges.push({
    id: 'edge-process-decision',
    source: processNodeId,
    target: decisionNodeId,
    type: 'smoothstep',
    style: { stroke: '#FFA940', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#FFA940' },
  })

  currentY += 100

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
function StrategyFlowInner({ strategy, visible }: { strategy: ParsedStrategy; visible: boolean }) {
  const theme = useTheme()
  const reactFlowInstance = useRef<any>(null)

  const { initialNodes, initialEdges } = useMemo(() => {
    const { nodes, edges } = generateFlowElements(strategy)
    return { initialNodes: nodes, initialEdges: edges }
  }, [strategy])

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const proOptions = { hideAttribution: true }

  // 保存 ReactFlow 实例
  const handleInit = useCallback((instance: any) => {
    reactFlowInstance.current = instance
  }, [])

  // 当组件变为可见时，调用 fitView
  useEffect(() => {
    if (visible && reactFlowInstance.current) {
      // 延迟执行确保容器尺寸正确
      setTimeout(() => {
        reactFlowInstance.current?.fitView({
          padding: 0.1,
          duration: 200,
          maxZoom: 1,
          minZoom: 0.4,
        })
      }, 50)
    }
  }, [visible])

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      onInit={handleInit}
      minZoom={0.2}
      maxZoom={2}
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
        <StrategyFlowInner strategy={strategy} visible={visible} />
      </ReactFlowProvider>
    </FlowWrapper>
  )
}

export default memo(StrategyCodeVisualizer)
