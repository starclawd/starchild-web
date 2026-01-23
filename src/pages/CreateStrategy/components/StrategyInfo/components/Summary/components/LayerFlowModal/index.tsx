import { memo, useMemo, useCallback, useState, useEffect } from 'react'
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
  Controls,
  MiniMap,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import styled, { useTheme } from 'styled-components'
import Modal from 'components/Modal'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import LayerNode, { LayerDataItem, LayerNodeData } from './nodes/LayerNode'

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 90vw;
  height: 80vh;
  background: ${({ theme }) => theme.black900};
  border-radius: 16px;
  overflow: hidden;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: ${({ theme }) => theme.black800};
  border-bottom: 1px solid ${({ theme }) => theme.black700};
`

const ModalTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.black0};

  .icon {
    font-size: 24px;
    color: ${({ theme }) => theme.blue100};
  }
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.black700};
  cursor: pointer;
  transition: all 0.2s;

  .icon {
    font-size: 16px;
    color: ${({ theme }) => theme.black200};
  }

  &:hover {
    background: ${({ theme }) => theme.black600};
    .icon {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const FlowWrapper = styled.div`
  flex: 1;
  width: 100%;

  .react-flow__panel {
    &.react-flow__minimap {
      background: ${({ theme }) => theme.black800};
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.black700};
    }

    &.react-flow__controls {
      button {
        background: ${({ theme }) => theme.black800};
        border: 1px solid ${({ theme }) => theme.black700};
        color: ${({ theme }) => theme.black100};

        &:hover {
          background: ${({ theme }) => theme.black700};
        }

        svg {
          fill: currentColor;
        }
      }
    }
  }
`

const ModalFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  background: ${({ theme }) => theme.black800};
  border-top: 1px solid ${({ theme }) => theme.black700};
`

const FooterButton = styled.button<{ $variant: 'primary' | 'secondary' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant, theme }) =>
    $variant === 'primary'
      ? `
    background: ${theme.green100};
    color: #000;
  `
      : `
    background: ${theme.black700};
    color: ${theme.black100};
  `}

  .icon {
    font-size: 16px;
  }

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`

// 注册节点类型
const nodeTypes = {
  layer: LayerNode,
}

// Layer 类型定义
type LayerType = 'data' | 'signal' | 'capital' | 'risk' | 'execution'

// 解析 JSON 字符串为 LayerDataItem 数组
function parseLayerData(jsonStr: string): LayerDataItem[] {
  try {
    const data = JSON.parse(jsonStr)
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      }))
    }
    return []
  } catch {
    return []
  }
}

// 将 LayerDataItem 数组转换回 JSON 对象
function layerDataToJson(items: LayerDataItem[]): Record<string, string | object> {
  const result: Record<string, string | object> = {}
  items.forEach((item) => {
    try {
      result[item.key] = JSON.parse(item.value)
    } catch {
      result[item.key] = item.value
    }
  })
  return result
}

interface LayerFlowModalProps {
  isOpen: boolean
  onClose: () => void
  dataLayerString: string
  signalLayerString: string
  capitalLayerString: string
  riskLayerString: string
  executionLayerString: string
  onSave?: (layers: {
    data_layer: Record<string, string | object>
    signal_layer: Record<string, string | object>
    capital_layer: Record<string, string | object>
    risk_layer: Record<string, string | object>
    execution_layer: Record<string, string | object>
  }) => void
}

// 内部 Flow 组件
function LayerFlowInner({
  dataLayerString,
  signalLayerString,
  capitalLayerString,
  riskLayerString,
  executionLayerString,
  onSave,
  onClose,
}: Omit<LayerFlowModalProps, 'isOpen'>) {
  const theme = useTheme()

  // Layer 数据状态
  const [layerData, setLayerData] = useState<Record<LayerType, LayerDataItem[]>>({
    data: parseLayerData(dataLayerString),
    signal: parseLayerData(signalLayerString),
    capital: parseLayerData(capitalLayerString),
    risk: parseLayerData(riskLayerString),
    execution: parseLayerData(executionLayerString),
  })

  // 当 props 变化时更新数据
  useEffect(() => {
    setLayerData({
      data: parseLayerData(dataLayerString),
      signal: parseLayerData(signalLayerString),
      capital: parseLayerData(capitalLayerString),
      risk: parseLayerData(riskLayerString),
      execution: parseLayerData(executionLayerString),
    })
  }, [dataLayerString, signalLayerString, capitalLayerString, riskLayerString, executionLayerString])

  // 添加数据项
  const handleAddItem = useCallback((layerType: string, key: string, value: string) => {
    setLayerData((prev) => ({
      ...prev,
      [layerType as LayerType]: [...prev[layerType as LayerType], { key, value }],
    }))
  }, [])

  // 编辑数据项
  const handleEditItem = useCallback((layerType: string, index: number, key: string, value: string) => {
    setLayerData((prev) => ({
      ...prev,
      [layerType as LayerType]: prev[layerType as LayerType].map((item, i) => (i === index ? { key, value } : item)),
    }))
  }, [])

  // 删除数据项
  const handleDeleteItem = useCallback((layerType: string, index: number) => {
    setLayerData((prev) => ({
      ...prev,
      [layerType as LayerType]: prev[layerType as LayerType].filter((_, i) => i !== index),
    }))
  }, [])

  // 保存数据
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave({
        data_layer: layerDataToJson(layerData.data),
        signal_layer: layerDataToJson(layerData.signal),
        capital_layer: layerDataToJson(layerData.capital),
        risk_layer: layerDataToJson(layerData.risk),
        execution_layer: layerDataToJson(layerData.execution),
      })
    }
    onClose()
  }, [layerData, onSave, onClose])

  // 生成节点和边
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node<LayerNodeData>[] = []
    const edges: Edge[] = []

    // 节点布局配置 - 水平排列
    const SPACING = {
      x: 380, // 节点水平间距
      startX: 50, // 起始 X 位置
      y: 100, // 节点 Y 位置
    }

    const layerTypes: LayerType[] = ['data', 'signal', 'capital', 'risk', 'execution']

    layerTypes.forEach((layerType, index) => {
      const nodeData: LayerNodeData = {
        layerType,
        items: layerData[layerType],
        onAddItem: handleAddItem,
        onEditItem: handleEditItem,
        onDeleteItem: handleDeleteItem,
      }

      nodes.push({
        id: `layer-${layerType}`,
        type: 'layer',
        position: { x: SPACING.startX + index * SPACING.x, y: SPACING.y },
        data: nodeData,
      })

      // 添加边（连接相邻节点）
      if (index > 0) {
        const prevLayerType = layerTypes[index - 1]
        edges.push({
          id: `edge-${prevLayerType}-${layerType}`,
          source: `layer-${prevLayerType}`,
          target: `layer-${layerType}`,
          type: 'smoothstep',
          animated: true,
          style: { stroke: theme.blue100, strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: theme.blue100 },
        })
      }
    })

    return { initialNodes: nodes, initialEdges: edges }
  }, [layerData, handleAddItem, handleEditItem, handleDeleteItem, theme])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  // 当 layerData 变化时更新节点数据
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        const layerType = node.id.replace('layer-', '') as LayerType
        return {
          ...node,
          data: {
            ...node.data,
            items: layerData[layerType],
          },
        }
      }),
    )
  }, [layerData, setNodes])

  const proOptions = { hideAttribution: true }
  const defaultViewport = { x: 0, y: 0, zoom: 0.8 }

  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>
          <IconBase className='icon icon-chart-5' />
          <Trans>Strategy Layer Flow</Trans>
        </ModalTitle>
        <CloseButton onClick={onClose}>
          <IconBase className='icon icon-close' />
        </CloseButton>
      </ModalHeader>

      <FlowWrapper>
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
            padding: 0.2,
            minZoom: 0.5,
            maxZoom: 1,
          }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={theme.black700} />
          <Controls />
          <MiniMap
            nodeColor={(node) => {
              const layerType = (node.data as unknown as LayerNodeData)?.layerType || 'data'
              const colors: Record<string, string> = {
                data: '#00A9DE',
                signal: '#A87FFF',
                capital: '#00DE73',
                risk: '#FF375B',
                execution: '#FFA940',
              }
              return colors[layerType] || '#00A9DE'
            }}
            maskColor='rgba(0, 0, 0, 0.8)'
          />
        </ReactFlow>
      </FlowWrapper>

      <ModalFooter>
        <FooterButton $variant='secondary' onClick={onClose}>
          <Trans>Cancel</Trans>
        </FooterButton>
        <FooterButton $variant='primary' onClick={handleSave}>
          <IconBase className='icon icon-check' />
          <Trans>Save Changes</Trans>
        </FooterButton>
      </ModalFooter>
    </ModalContent>
  )
}

export default memo(function LayerFlowModal({
  isOpen,
  onClose,
  dataLayerString,
  signalLayerString,
  capitalLayerString,
  riskLayerString,
  executionLayerString,
  onSave,
}: LayerFlowModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onClose} hideClose cancelOverflow zIndex={250}>
      <ReactFlowProvider>
        <LayerFlowInner
          onClose={onClose}
          dataLayerString={dataLayerString}
          signalLayerString={signalLayerString}
          capitalLayerString={capitalLayerString}
          riskLayerString={riskLayerString}
          executionLayerString={executionLayerString}
          onSave={onSave}
        />
      </ReactFlowProvider>
    </Modal>
  )
})
