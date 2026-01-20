import { memo, useState, useCallback, useRef, useEffect } from 'react'
import { Handle, Position, NodeProps } from '@xyflow/react'
import styled from 'styled-components'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'

// Layer 颜色配置
const LAYER_COLORS: Record<string, { primary: string; bg: string; gradient: string }> = {
  data: {
    primary: '#00A9DE',
    bg: 'rgba(0, 169, 222, 0.15)',
    gradient: 'linear-gradient(135deg, #004F6E 0%, #002838 100%)',
  },
  signal: {
    primary: '#A87FFF',
    bg: 'rgba(168, 127, 255, 0.15)',
    gradient: 'linear-gradient(135deg, #4F20A0 0%, #2A1060 100%)',
  },
  capital: {
    primary: '#00DE73',
    bg: 'rgba(0, 222, 115, 0.15)',
    gradient: 'linear-gradient(135deg, #00763B 0%, #003820 100%)',
  },
  risk: {
    primary: '#FF375B',
    bg: 'rgba(255, 55, 91, 0.15)',
    gradient: 'linear-gradient(135deg, #A21E39 0%, #501020 100%)',
  },
  execution: {
    primary: '#FFA940',
    bg: 'rgba(255, 169, 64, 0.15)',
    gradient: 'linear-gradient(135deg, #BD4D00 0%, #5E2600 100%)',
  },
}

const NodeWrapper = styled.div<{ $layerType: string }>`
  display: flex;
  flex-direction: column;
  width: 320px;
  min-height: 100px;
  border-radius: 16px;
  background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.gradient || LAYER_COLORS.data.gradient};
  border: 2px solid ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || LAYER_COLORS.data.primary};
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
`

const NodeHeader = styled.div<{ $layerType: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.bg || LAYER_COLORS.data.bg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const IconWrapper = styled.div<{ $layerType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || LAYER_COLORS.data.primary};

  .icon {
    font-size: 16px;
    color: #000;
  }
`

const Title = styled.span<{ $layerType: string }>`
  font-size: 16px;
  font-weight: 700;
  color: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || LAYER_COLORS.data.primary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const AddButton = styled.button<{ $layerType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || LAYER_COLORS.data.primary};
  cursor: pointer;
  transition: all 0.2s;

  .icon {
    font-size: 14px;
    color: #000;
  }

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`

const NodeContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`

const DataItem = styled.div<{ $layerType: string; $isEditing: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ $isEditing }) => ($isEditing ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.3)')};
  border: 1px solid ${({ $isEditing, $layerType }) => ($isEditing ? LAYER_COLORS[$layerType]?.primary : 'transparent')};
`

const DataContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
  min-width: 0;
`

const DataKey = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const DataValue = styled.span`
  font-size: 13px;
  color: #fff;
  word-break: break-word;
  line-height: 1.4;
`

// 数组值容器
const ArrayValueContainer = styled.div<{ $layerType: string }>`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  padding: 8px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 3px solid ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || '#00A9DE'};
`

// 数组项索引标签
const ArrayItemIndex = styled.span<{ $layerType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 4px;
  background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || '#00A9DE'}20;
  color: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || '#00A9DE'};
  font-size: 10px;
  font-weight: 600;
  margin-right: 8px;
  flex-shrink: 0;
`

// 数组项
const ArrayItem = styled.div<{ $layerType: string; $isEditing?: boolean }>`
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border-radius: 4px;
  background: ${({ $isEditing }) => ($isEditing ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};
`

const ArrayItemValue = styled.span`
  flex: 1;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-word;
  line-height: 1.4;
`

const ArrayItemInput = styled.input.attrs({ className: 'nodrag nowheel' })`
  flex: 1;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.3);
  color: #fff;
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.4);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`

const ArrayItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  margin-left: 6px;
`

const SmallActionButton = styled.button<{ $type: 'edit' | 'delete' | 'save' | 'cancel' | 'add' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.15s;

  .icon {
    font-size: 12px;
    color: ${({ $type }) => {
      switch ($type) {
        case 'edit':
          return '#A87FFF'
        case 'delete':
          return '#FF375B'
        case 'save':
          return '#00DE73'
        case 'cancel':
          return 'rgba(255, 255, 255, 0.5)'
        case 'add':
          return '#00A9DE'
        default:
          return '#fff'
      }
    }};
  }

  &:hover {
    background: ${({ $type }) => {
      switch ($type) {
        case 'edit':
          return 'rgba(168, 127, 255, 0.2)'
        case 'delete':
          return 'rgba(255, 55, 91, 0.2)'
        case 'save':
          return 'rgba(0, 222, 115, 0.2)'
        case 'cancel':
          return 'rgba(255, 255, 255, 0.1)'
        case 'add':
          return 'rgba(0, 169, 222, 0.2)'
        default:
          return 'rgba(255, 255, 255, 0.1)'
      }
    }};
  }
`

const AddArrayItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin-top: 2px;
`

const AddArrayButton = styled.button<{ $layerType: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: none;
  background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || '#00A9DE'}20;
  color: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || '#00A9DE'};
  cursor: pointer;
  transition: all 0.15s;

  .icon {
    font-size: 12px;
  }

  &:hover {
    background: ${({ $layerType }) => LAYER_COLORS[$layerType]?.primary || '#00A9DE'}30;
  }
`

// 类型标签
const TypeBadge = styled.span<{ $type: 'array' | 'object' | 'string' }>`
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  margin-left: 6px;
  background: ${({ $type }) => {
    switch ($type) {
      case 'array':
        return 'rgba(0, 169, 222, 0.2)'
      case 'object':
        return 'rgba(168, 127, 255, 0.2)'
      default:
        return 'rgba(255, 255, 255, 0.1)'
    }
  }};
  color: ${({ $type }) => {
    switch ($type) {
      case 'array':
        return '#00A9DE'
      case 'object':
        return '#A87FFF'
      default:
        return 'rgba(255, 255, 255, 0.5)'
    }
  }};
`

const DataInput = styled.textarea.attrs({ className: 'nodrag nowheel' })`
  flex-shrink: 0;
  flex-grow: 1;
  width: 100%;
  padding: 6px 8px;
  border-radius: 4px;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 13px;
  outline: none;
  resize: none;
  min-height: 28px;
  overflow: hidden;
  font-family: inherit;
  line-height: 1.4;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`

const DataActions = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: 8px;
`

const ActionButton = styled.button<{ $type: 'edit' | 'delete' | 'save' | 'cancel' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: none;
  background: ${({ $type }) => {
    switch ($type) {
      case 'edit':
        return 'rgba(168, 127, 255, 0.3)'
      case 'delete':
        return 'rgba(255, 55, 91, 0.3)'
      case 'save':
        return 'rgba(0, 222, 115, 0.3)'
      case 'cancel':
        return 'rgba(255, 255, 255, 0.1)'
      default:
        return 'rgba(255, 255, 255, 0.1)'
    }
  }};
  cursor: pointer;
  transition: all 0.2s;

  .icon {
    font-size: 12px;
    color: ${({ $type }) => {
      switch ($type) {
        case 'edit':
          return '#A87FFF'
        case 'delete':
          return '#FF375B'
        case 'save':
          return '#00DE73'
        case 'cancel':
          return '#fff'
        default:
          return '#fff'
      }
    }};
  }

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  text-align: center;
`

const AddItemForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
`

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FormInput = styled.input.attrs({ className: 'nodrag nowheel' })`
  flex: 1;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-size: 13px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`

const FormButton = styled.button<{ $variant: 'primary' | 'secondary'; $layerType: string }>`
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  ${({ $variant, $layerType }) =>
    $variant === 'primary'
      ? `
    background: ${LAYER_COLORS[$layerType]?.primary || LAYER_COLORS.data.primary};
    color: #000;
  `
      : `
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  `}

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`

// 图标映射
const LAYER_ICONS: Record<string, string> = {
  data: 'icon-data-layer',
  signal: 'icon-signal-layer',
  capital: 'icon-capital-layer',
  risk: 'icon-risk-layer',
  execution: 'icon-execution-layer',
}

// 标题映射
const LAYER_TITLES: Record<string, string> = {
  data: 'Data',
  signal: 'Signal',
  capital: 'Capital',
  risk: 'Risk',
  execution: 'Execution',
}

export interface LayerDataItem {
  key: string
  value: string
}

export interface LayerNodeData extends Record<string, unknown> {
  layerType: 'data' | 'signal' | 'capital' | 'risk' | 'execution'
  items: LayerDataItem[]
  onAddItem?: (layerType: string, key: string, value: string) => void
  onEditItem?: (layerType: string, index: number, key: string, value: string) => void
  onDeleteItem?: (layerType: string, index: number) => void
}

function LayerNode({ data }: NodeProps) {
  const nodeData = data as unknown as LayerNodeData
  const { layerType, items, onAddItem, onEditItem, onDeleteItem } = nodeData

  // 添加状态
  const [isAdding, setIsAdding] = useState(false)
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  // 编辑状态
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editKey, setEditKey] = useState('')
  const [editValue, setEditValue] = useState('')

  // 数组项编辑状态
  const [editingArrayItemKey, setEditingArrayItemKey] = useState<string | null>(null) // 格式: "itemIndex-arrayIndex"
  const [editArrayItemValue, setEditArrayItemValue] = useState('')
  const [addingArrayItemKey, setAddingArrayItemKey] = useState<number | null>(null) // 正在添加数组项的 item index
  const [newArrayItemValue, setNewArrayItemValue] = useState('')

  // textarea refs
  const editKeyRef = useRef<HTMLTextAreaElement>(null)
  const editValueRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整 textarea 高度
  const adjustTextareaHeight = useCallback((textarea: HTMLTextAreaElement | null) => {
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [])

  // 当编辑值变化时自动调整高度
  useEffect(() => {
    if (editingIndex !== null) {
      // 使用 requestAnimationFrame 确保 DOM 已更新
      requestAnimationFrame(() => {
        adjustTextareaHeight(editKeyRef.current)
        adjustTextareaHeight(editValueRef.current)
      })
    }
  }, [editKey, editValue, editingIndex, adjustTextareaHeight])

  // 添加新项
  const handleAdd = useCallback(() => {
    if (newKey.trim() && newValue.trim() && onAddItem) {
      onAddItem(layerType, newKey.trim(), newValue.trim())
      setNewKey('')
      setNewValue('')
      setIsAdding(false)
    }
  }, [layerType, newKey, newValue, onAddItem])

  // 开始编辑
  const handleStartEdit = useCallback(
    (index: number) => {
      setEditingIndex(index)
      setEditKey(items[index].key)
      setEditValue(items[index].value)
    },
    [items],
  )

  // 保存编辑
  const handleSaveEdit = useCallback(() => {
    if (editKey.trim() && editValue.trim() && editingIndex !== null && onEditItem) {
      onEditItem(layerType, editingIndex, editKey.trim(), editValue.trim())
      setEditingIndex(null)
      setEditKey('')
      setEditValue('')
    }
  }, [layerType, editingIndex, editKey, editValue, onEditItem])

  // 取消编辑
  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null)
    setEditKey('')
    setEditValue('')
  }, [])

  // 删除项
  const handleDelete = useCallback(
    (index: number) => {
      if (onDeleteItem) {
        onDeleteItem(layerType, index)
      }
    },
    [layerType, onDeleteItem],
  )

  // 阻止事件冒泡，防止拖动光标时触发节点拖拽
  const stopPropagation = useCallback((e: React.MouseEvent | React.PointerEvent) => {
    e.stopPropagation()
  }, [])

  // 尝试解析数组（支持多种格式）
  const tryParseArray = useCallback((value: string): { isArray: boolean; items: string[] } => {
    const trimmed = value.trim()

    // 1. 首先尝试标准 JSON 解析
    try {
      const parsed = JSON.parse(trimmed)
      if (Array.isArray(parsed)) {
        return {
          isArray: true,
          items: parsed.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))),
        }
      }
      return { isArray: false, items: [] }
    } catch {
      // JSON 解析失败，继续尝试其他格式
    }

    // 2. 检查是否看起来像数组 [...]
    if (!trimmed.startsWith('[') || !trimmed.endsWith(']')) {
      return { isArray: false, items: [] }
    }

    // 3. 尝试将单引号替换为双引号后解析
    try {
      // 将单引号替换为双引号（简单处理，不处理嵌套引号的复杂情况）
      const withDoubleQuotes = trimmed.replace(/'/g, '"')
      const parsed = JSON.parse(withDoubleQuotes)
      if (Array.isArray(parsed)) {
        return {
          isArray: true,
          items: parsed.map((item) => (typeof item === 'object' ? JSON.stringify(item) : String(item))),
        }
      }
    } catch {
      // 继续尝试
    }

    // 4. 手动解析简单数组格式 [a, b, c] 或 [1, 2, 3]
    try {
      const content = trimmed.slice(1, -1).trim()
      if (!content) {
        return { isArray: true, items: [] } // 空数组
      }

      // 简单分割（不处理嵌套数组或对象的复杂情况）
      const items = content.split(',').map((item) => {
        let cleaned = item.trim()
        // 去除首尾的引号
        if ((cleaned.startsWith('"') && cleaned.endsWith('"')) || (cleaned.startsWith("'") && cleaned.endsWith("'"))) {
          cleaned = cleaned.slice(1, -1)
        }
        return cleaned
      })

      // 验证是否有有效的项
      if (items.length > 0 && items.some((item) => item.length > 0)) {
        return { isArray: true, items: items.filter((item) => item.length > 0) }
      }
    } catch {
      // 解析失败
    }

    return { isArray: false, items: [] }
  }, [])

  // 判断值是否是数组
  const isArrayValue = useCallback(
    (value: string): boolean => {
      return tryParseArray(value).isArray
    },
    [tryParseArray],
  )

  // 获取值的类型
  const getValueType = useCallback(
    (value: string): 'array' | 'object' | 'string' => {
      if (tryParseArray(value).isArray) return 'array'
      try {
        const parsed = JSON.parse(value)
        if (typeof parsed === 'object' && parsed !== null) return 'object'
        return 'string'
      } catch {
        return 'string'
      }
    },
    [tryParseArray],
  )

  // 解析数组值
  const parseArrayValue = useCallback(
    (value: string): string[] => {
      return tryParseArray(value).items
    },
    [tryParseArray],
  )

  // 开始编辑数组项
  const handleStartEditArrayItem = useCallback((itemIndex: number, arrayIndex: number, value: string) => {
    setEditingArrayItemKey(`${itemIndex}-${arrayIndex}`)
    setEditArrayItemValue(value)
  }, [])

  // 保存数组项编辑
  const handleSaveArrayItemEdit = useCallback(
    (itemIndex: number, arrayIndex: number) => {
      if (!editArrayItemValue.trim() || !onEditItem) return

      const item = items[itemIndex]
      const arrayValues = parseArrayValue(item.value)
      arrayValues[arrayIndex] = editArrayItemValue.trim()

      // 将数组转换回 JSON 字符串
      const newValue = JSON.stringify(arrayValues)
      onEditItem(layerType, itemIndex, item.key, newValue)

      setEditingArrayItemKey(null)
      setEditArrayItemValue('')
    },
    [editArrayItemValue, items, layerType, onEditItem, parseArrayValue],
  )

  // 取消数组项编辑
  const handleCancelArrayItemEdit = useCallback(() => {
    setEditingArrayItemKey(null)
    setEditArrayItemValue('')
  }, [])

  // 删除数组项
  const handleDeleteArrayItem = useCallback(
    (itemIndex: number, arrayIndex: number) => {
      if (!onEditItem) return

      const item = items[itemIndex]
      const arrayValues = parseArrayValue(item.value)
      arrayValues.splice(arrayIndex, 1)

      // 将数组转换回 JSON 字符串
      const newValue = JSON.stringify(arrayValues)
      onEditItem(layerType, itemIndex, item.key, newValue)
    },
    [items, layerType, onEditItem, parseArrayValue],
  )

  // 开始添加数组项
  const handleStartAddArrayItem = useCallback((itemIndex: number) => {
    setAddingArrayItemKey(itemIndex)
    setNewArrayItemValue('')
  }, [])

  // 添加数组项
  const handleAddArrayItem = useCallback(
    (itemIndex: number) => {
      if (!newArrayItemValue.trim() || !onEditItem) return

      const item = items[itemIndex]
      const arrayValues = parseArrayValue(item.value)
      arrayValues.push(newArrayItemValue.trim())

      // 将数组转换回 JSON 字符串
      const newValue = JSON.stringify(arrayValues)
      onEditItem(layerType, itemIndex, item.key, newValue)

      setAddingArrayItemKey(null)
      setNewArrayItemValue('')
    },
    [newArrayItemValue, items, layerType, onEditItem, parseArrayValue],
  )

  // 取消添加数组项
  const handleCancelAddArrayItem = useCallback(() => {
    setAddingArrayItemKey(null)
    setNewArrayItemValue('')
  }, [])

  return (
    <NodeWrapper $layerType={layerType}>
      <Handle
        type='target'
        position={Position.Top}
        style={{
          background: LAYER_COLORS[layerType]?.primary,
          width: 10,
          height: 10,
          border: '2px solid #121315',
        }}
      />

      <NodeHeader $layerType={layerType}>
        <HeaderLeft>
          <IconWrapper $layerType={layerType}>
            <IconBase className={`icon ${LAYER_ICONS[layerType]}`} />
          </IconWrapper>
          <Title $layerType={layerType}>{LAYER_TITLES[layerType]}</Title>
        </HeaderLeft>
        <AddButton $layerType={layerType} onClick={() => setIsAdding(true)}>
          <IconBase className='icon icon-menu-chat' />
        </AddButton>
      </NodeHeader>

      <NodeContent>
        {isAdding && (
          <AddItemForm>
            <FormRow>
              <FormInput
                placeholder='Key'
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                onMouseDown={stopPropagation}
                onPointerDown={stopPropagation}
              />
            </FormRow>
            <FormRow>
              <FormInput
                placeholder='Value'
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onMouseDown={stopPropagation}
                onPointerDown={stopPropagation}
              />
            </FormRow>
            <FormActions>
              <FormButton $variant='secondary' $layerType={layerType} onClick={() => setIsAdding(false)}>
                <Trans>Cancel</Trans>
              </FormButton>
              <FormButton $variant='primary' $layerType={layerType} onClick={handleAdd}>
                <Trans>Add</Trans>
              </FormButton>
            </FormActions>
          </AddItemForm>
        )}

        {items.length === 0 && !isAdding ? (
          <EmptyState>
            <Trans>No data yet</Trans>
            <br />
            <Trans>Click + to add</Trans>
          </EmptyState>
        ) : (
          items.map((item, index) => (
            <DataItem key={index} $layerType={layerType} $isEditing={editingIndex === index}>
              <DataContent>
                {editingIndex === index ? (
                  <>
                    <DataInput
                      ref={editKeyRef}
                      value={editKey}
                      onChange={(e) => {
                        setEditKey(e.target.value)
                        adjustTextareaHeight(e.target)
                      }}
                      onMouseDown={stopPropagation}
                      onPointerDown={stopPropagation}
                      placeholder='Key'
                      rows={1}
                    />
                    <DataInput
                      ref={editValueRef}
                      value={editValue}
                      onChange={(e) => {
                        setEditValue(e.target.value)
                        adjustTextareaHeight(e.target)
                      }}
                      onMouseDown={stopPropagation}
                      onPointerDown={stopPropagation}
                      placeholder='Value'
                      rows={1}
                    />
                  </>
                ) : (
                  <>
                    <DataKey>
                      {item.key}
                      {getValueType(item.value) !== 'string' && (
                        <TypeBadge $type={getValueType(item.value)}>{getValueType(item.value)}</TypeBadge>
                      )}
                    </DataKey>
                    {isArrayValue(item.value) ? (
                      <>
                        {parseArrayValue(item.value).length > 0 && (
                          <ArrayValueContainer $layerType={layerType}>
                            {parseArrayValue(item.value).map((arrayItem, arrayIndex) => {
                              const editKey = `${index}-${arrayIndex}`
                              const isEditingThis = editingArrayItemKey === editKey
                              return (
                                <ArrayItem key={arrayIndex} $layerType={layerType} $isEditing={isEditingThis}>
                                  <ArrayItemIndex $layerType={layerType}>{arrayIndex}</ArrayItemIndex>
                                  {isEditingThis ? (
                                    <ArrayItemInput
                                      value={editArrayItemValue}
                                      onChange={(e) => setEditArrayItemValue(e.target.value)}
                                      onMouseDown={stopPropagation}
                                      onPointerDown={stopPropagation}
                                      autoFocus
                                    />
                                  ) : (
                                    <ArrayItemValue>{arrayItem}</ArrayItemValue>
                                  )}
                                  <ArrayItemActions>
                                    {isEditingThis ? (
                                      <>
                                        <SmallActionButton
                                          $type='save'
                                          onClick={() => handleSaveArrayItemEdit(index, arrayIndex)}
                                        >
                                          <IconBase className='icon icon-complete' />
                                        </SmallActionButton>
                                        <SmallActionButton $type='cancel' onClick={handleCancelArrayItemEdit}>
                                          <IconBase className='icon icon-close' />
                                        </SmallActionButton>
                                      </>
                                    ) : (
                                      <>
                                        <SmallActionButton
                                          $type='edit'
                                          onClick={() => handleStartEditArrayItem(index, arrayIndex, arrayItem)}
                                        >
                                          <IconBase className='icon icon-edit' />
                                        </SmallActionButton>
                                        <SmallActionButton
                                          $type='delete'
                                          onClick={() => handleDeleteArrayItem(index, arrayIndex)}
                                        >
                                          <IconBase className='icon icon-delete' />
                                        </SmallActionButton>
                                      </>
                                    )}
                                  </ArrayItemActions>
                                </ArrayItem>
                              )
                            })}
                          </ArrayValueContainer>
                        )}
                        {addingArrayItemKey === index ? (
                          <AddArrayItemRow>
                            <ArrayItemInput
                              value={newArrayItemValue}
                              onChange={(e) => setNewArrayItemValue(e.target.value)}
                              onMouseDown={stopPropagation}
                              onPointerDown={stopPropagation}
                              placeholder='New item...'
                              autoFocus
                            />
                            <SmallActionButton $type='save' onClick={() => handleAddArrayItem(index)}>
                              <IconBase className='icon icon-complete' />
                            </SmallActionButton>
                            <SmallActionButton $type='cancel' onClick={handleCancelAddArrayItem}>
                              <IconBase className='icon icon-close' />
                            </SmallActionButton>
                          </AddArrayItemRow>
                        ) : (
                          <AddArrayButton $layerType={layerType} onClick={() => handleStartAddArrayItem(index)}>
                            <IconBase className='icon icon-menu-chat' />
                          </AddArrayButton>
                        )}
                      </>
                    ) : (
                      <DataValue>{item.value}</DataValue>
                    )}
                  </>
                )}
              </DataContent>
              <DataActions>
                {editingIndex === index ? (
                  <>
                    <ActionButton $type='save' onClick={handleSaveEdit}>
                      <IconBase className='icon icon-complete' />
                    </ActionButton>
                    <ActionButton $type='cancel' onClick={handleCancelEdit}>
                      <IconBase className='icon icon-close' />
                    </ActionButton>
                  </>
                ) : (
                  <>
                    <ActionButton $type='edit' onClick={() => handleStartEdit(index)}>
                      <IconBase className='icon icon-edit' />
                    </ActionButton>
                    <ActionButton $type='delete' onClick={() => handleDelete(index)}>
                      <IconBase className='icon icon-delete' />
                    </ActionButton>
                  </>
                )}
              </DataActions>
            </DataItem>
          ))
        )}
      </NodeContent>

      <Handle
        type='source'
        position={Position.Bottom}
        style={{
          background: LAYER_COLORS[layerType]?.primary,
          width: 10,
          height: 10,
          border: '2px solid #121315',
        }}
      />
    </NodeWrapper>
  )
}

export default memo(LayerNode)
