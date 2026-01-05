import { Dispatch, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useIsSelfAgent, useIsAgentSubscribed } from 'store/agenthub/hooks'
import { useCreateAgentModalToggle } from 'store/application/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useTheme } from 'styled-components'
import { ActionType, ActionConfig } from '../types'
import { useShareActions } from './useShareActions'

export interface UseActionHandlersProps {
  data: AgentDetailDataType
  actions?: ActionType[]
  mode?: 'dropdown' | 'toolbar'
  onEdit?: () => void
  onPause?: () => void
  onDelete?: () => void
  onSubscribe?: () => void
  onShare?: () => void
  onShareLink?: () => void
  onClose?: () => void
}

export interface UseActionHandlersReturn {
  actionConfigs: ActionConfig[]
  shareActionConfigs: ActionConfig[]
  shareUrl: string
  shareDomRef: React.RefObject<HTMLDivElement | null>
  isCopyLoading: boolean
  isSubscribeLoading: boolean
  handleEdit: () => void
  handlePause: () => void
  handleDelete: () => void
  handleSubscribe: () => Promise<void>
  handleShare: () => void
  handleShareLink: () => void
}

export function useActionHandlers({
  data,
  actions = [ActionType.EDIT, ActionType.PAUSE, ActionType.DELETE, ActionType.SUBSCRIBE, ActionType.SHARE],
  mode = 'dropdown',
  onEdit,
  onPause,
  onDelete,
  onSubscribe,
  onShare,
  onShareLink,
  onClose,
}: UseActionHandlersProps): UseActionHandlersReturn {
  const theme = useTheme()
  const toast = useToast()
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)

  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const isSelfAgent = useIsSelfAgent(data.id)
  const isSubscribed = useIsAgentSubscribed(data.id)

  // 使用分享相关的 hook
  const { shareUrl, shareDomRef, isCopyLoading, handleShare, handleShareLink, shareActionConfigs } = useShareActions({
    data,
    onShare,
    onShareLink,
    onClose,
  })

  const agentNotFound = useCallback(() => {
    toast({
      title: 'Error',
      description: 'Agent not found',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-chat-close',
      iconTheme: theme.ruby50,
    })
  }, [toast, theme])

  // 默认操作处理
  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit()
    } else {
      toggleCreateAgentModal()
    }
    onClose?.()
  }, [onEdit, toggleCreateAgentModal, onClose])

  const handlePause = useCallback(() => {
    if (data.id === 0) {
      agentNotFound()
      return
    }
    if (onPause) {
      onPause()
    }
    onClose?.()
  }, [data.id, onPause, onClose, agentNotFound])

  const handleDelete = useCallback(() => {
    if (data.id === 0) {
      agentNotFound()
      return
    }
    if (onDelete) {
      onDelete()
    }
    onClose?.()
  }, [data.id, onDelete, onClose, agentNotFound])

  const handleSubscribe = useCallback(async () => {
    if (data.id === 0) {
      agentNotFound()
      return
    }
    setIsSubscribeLoading(true)
    if (onSubscribe) {
      await onSubscribe()
    }
    setIsSubscribeLoading(false)
    onClose?.()
  }, [data.id, onSubscribe, onClose, agentNotFound])

  // 构建操作配置
  const actionConfigs: ActionConfig[] = useMemo(() => {
    const configs: ActionConfig[] = []

    if (actions.includes(ActionType.EDIT) && isSelfAgent) {
      configs.push({
        type: ActionType.EDIT,
        icon: 'icon-chat-new',
        label: 'Edit',
        onClick: handleEdit,
        visible: true,
      })
    }

    if (actions.includes(ActionType.PAUSE) && isSubscribed) {
      configs.push({
        type: ActionType.PAUSE,
        icon: 'icon-chat-stop-play',
        label: mode === 'dropdown' ? 'Pause' : 'Suspend',
        onClick: handlePause,
        visible: true,
      })
    }

    // Delete 逻辑：只有在 actions 包含 DELETE 且是自己的 agent 时才显示
    if (actions.includes(ActionType.DELETE) && isSelfAgent) {
      configs.push({
        type: ActionType.DELETE,
        icon: 'icon-delete',
        label: 'Delete',
        color: mode === 'dropdown' ? theme.red100 : theme.ruby50,
        onClick: handleDelete,
        visible: true,
      })
    }

    // Subscribe 逻辑：只有在 actions 包含 SUBSCRIBE 且不是自己的 agent 时才显示
    if (actions.includes(ActionType.SUBSCRIBE) && !isSelfAgent) {
      if (mode === 'dropdown') {
        configs.push({
          type: ActionType.SUBSCRIBE,
          icon: 'icon-chat-noti-enable',
          label: isSubscribed ? 'Unsubscribe' : 'Subscribe',
          onClick: handleSubscribe,
          visible: true,
          loading: isSubscribeLoading,
        })
      }
      // toolbar 模式下的 subscribe 通过专用的 SubscribeButton 组件处理
    }

    if (actions.includes(ActionType.SHARE)) {
      const shareAction = {
        type: ActionType.SHARE,
        icon: 'icon-chat-share',
        label: 'Share',
        onClick: handleShareLink,
        visible: true,
        loading: isCopyLoading,
      }
      if (mode !== 'dropdown') {
        configs.push(shareAction)
      } else {
        configs.unshift(...shareActionConfigs)
      }
    }

    return configs.filter((config) => config.visible)
  }, [
    actions,
    isSelfAgent,
    mode,
    theme,
    handleEdit,
    handlePause,
    handleDelete,
    handleSubscribe,
    handleShareLink,
    isSubscribed,
    isCopyLoading,
    isSubscribeLoading,
    shareActionConfigs,
  ])

  return {
    actionConfigs,
    shareActionConfigs,
    shareUrl,
    shareDomRef,
    isCopyLoading,
    isSubscribeLoading,
    handleEdit,
    handlePause,
    handleDelete,
    handleSubscribe,
    handleShare,
    handleShareLink,
  }
}
