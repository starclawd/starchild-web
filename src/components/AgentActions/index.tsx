import { memo } from 'react'
import { ActionDropdown, ActionToolbar } from './components'
import { useActionHandlers } from './hooks'
import { AgentActionsProps, ActionType, ActionConfig, DisplayMode } from './types'

// Re-export types for backward compatibility
export type { ActionType, ActionConfig, DisplayMode }
export type { AgentActionsProps }

function AgentActions({
  data,
  mode = 'dropdown',
  actions = [ActionType.EDIT, ActionType.PAUSE, ActionType.DELETE, ActionType.SUBSCRIBE, ActionType.SHARE],
  onEdit,
  onPause,
  onDelete,
  onSubscribe,
  onShare,
  onShareLink,
  onClose,
  className,
}: AgentActionsProps) {
  const { actionConfigs, shareActionConfigs, shareUrl, shareDomRef, isSubscribeLoading, handleSubscribe } =
    useActionHandlers({
      data,
      actions,
      mode,
      onEdit,
      onPause,
      onDelete,
      onSubscribe,
      onShare,
      onShareLink,
      onClose,
    })

  // Dropdown 模式渲染
  if (mode === 'dropdown') {
    return (
      <ActionDropdown
        data={data}
        actions={actions}
        actionConfigs={actionConfigs}
        shareUrl={shareUrl}
        shareDomRef={shareDomRef}
        className={className}
      />
    )
  }

  // Toolbar 模式渲染
  return (
    <ActionToolbar
      data={data}
      actions={actions}
      actionConfigs={actionConfigs}
      shareActionConfigs={shareActionConfigs}
      shareUrl={shareUrl}
      shareDomRef={shareDomRef}
      isSubscribeLoading={isSubscribeLoading}
      handleSubscribe={handleSubscribe}
      className={className}
    />
  )
}

export default memo(AgentActions)
