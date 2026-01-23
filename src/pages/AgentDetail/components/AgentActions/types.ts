import { AgentDetailDataType } from 'store/agentdetail/agentdetail'

// 操作类型定义
export enum ActionType {
  EDIT = 'edit',
  PAUSE = 'pause',
  DELETE = 'delete',
  SUBSCRIBE = 'subscribe',
  SHARE = 'share',
  SHARE_LINK = 'share_link',
  SHARE_IMAGE = 'share_image',
}

// 展示模式
export type DisplayMode = 'dropdown' | 'toolbar'

// 操作配置
export interface ActionConfig {
  type: ActionType
  icon: string
  label: React.ReactNode
  color?: string
  onClick: () => void | Promise<void>
  visible?: boolean
  disabled?: boolean
  loading?: boolean
}

// 组件属性
export interface AgentActionsProps {
  data: AgentDetailDataType
  mode?: DisplayMode
  actions?: ActionType[]
  onEdit?: () => void
  onPause?: () => void
  onDelete?: () => void
  onSubscribe?: () => void
  onShare?: () => void
  onShareLink?: () => void
  onClose?: () => void // 用于 dropdown 模式关闭菜单
  className?: string
}
