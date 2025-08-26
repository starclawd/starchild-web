import { memo, useCallback, useMemo, useState, RefObject, useRef } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconButton } from 'components/Button'
import { IconBase } from 'components/Icons'
import Tooltip from 'components/Tooltip'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useIsSelfAgent, useIsAgentSubscribed } from 'store/agenthub/hooks'
import { useCreateAgentModalToggle } from 'store/application/hooks'
import AgentShare, { useCopyImgAndText } from 'components/AgentShare'
import SubscribeButton from 'pages/AgentHub/components/AgentCardList/components/SubscribeButton'

// 操作类型定义
export enum ActionType {
  EDIT = 'edit',
  PAUSE = 'pause',
  DELETE = 'delete',
  SUBSCRIBE = 'subscribe',
  SHARE = 'share',
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
  onClose?: () => void // 用于 dropdown 模式关闭菜单
  className?: string
}

// Dropdown 模式的样式 - 只包含操作列表内容
const DropdownWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 160px;
  padding: 4px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black700};
  box-shadow: 0px 4px 4px 0px ${({ theme }) => theme.systemShadow};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(160)};
      padding: ${vm(4)};
      border-radius: ${vm(12)};
    `}
`

const DropdownItem = styled.div<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 8px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL1};

  i {
    font-size: 18px;
    color: ${({ theme, $color }) => $color || theme.textL3};
  }

  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme, $color }) => $color || theme.textL2};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          height: ${vm(36)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
          gap: ${vm(6)};
          i {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.14rem;
            font-weight: 400;
            line-height: 0.2rem;
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT20};
          }
        `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  font-size: 18px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(24)};
      height: ${vm(24)};
      font-size: 0.18rem;
    `}
`

// Toolbar 模式的样式
const ToolbarWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: sticky;
      bottom: 0;
      z-index: 5;
      justify-content: space-between;
      background-color: ${({ theme }) => theme.bgL0};
      padding: ${vm(8)} ${vm(20)};
      gap: ${vm(8)};
    `}
`

function AgentActions({
  data,
  mode = 'dropdown',
  actions = [ActionType.EDIT, ActionType.PAUSE, ActionType.DELETE, ActionType.SUBSCRIBE, ActionType.SHARE],
  onEdit,
  onPause,
  onDelete,
  onSubscribe,
  onShare,
  onClose,
  className,
}: AgentActionsProps) {
  const theme = useTheme()
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false)

  const toggleCreateAgentModal = useCreateAgentModalToggle()
  const isSelfAgent = useIsSelfAgent(data.id)
  const isSubscribed = useIsAgentSubscribed(data.id)
  const shareDomRef = useRef<HTMLDivElement>(null)
  const copyImgAndText = useCopyImgAndText()

  // 分享URL
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/agentdetail?agentId=${data.id}`
  }, [data.id])

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
    if (onPause) {
      onPause()
    }
    onClose?.()
  }, [onPause, onClose])

  const handleDelete = useCallback(() => {
    if (onDelete) {
      onDelete()
    }
    onClose?.()
  }, [onDelete, onClose])

  const handleSubscribe = useCallback(async () => {
    setIsSubscribeLoading(true)
    if (onSubscribe) {
      await onSubscribe()
    }
    setIsSubscribeLoading(false)
    onClose?.()
  }, [onSubscribe, onClose])

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare()
    } else {
      copyImgAndText({
        shareUrl,
        shareDomRef: shareDomRef as RefObject<HTMLDivElement>,
        setIsCopyLoading,
      })
    }
    onClose?.()
  }, [onShare, copyImgAndText, shareUrl, shareDomRef, onClose])

  // 构建操作配置
  const actionConfigs: ActionConfig[] = useMemo(() => {
    const configs: ActionConfig[] = []

    if (actions.includes(ActionType.EDIT)) {
      configs.push({
        type: ActionType.EDIT,
        icon: 'icon-chat-new',
        label: <Trans>Edit</Trans>,
        onClick: handleEdit,
        visible: true,
      })
    }

    if (actions.includes(ActionType.PAUSE)) {
      configs.push({
        type: ActionType.PAUSE,
        icon: 'icon-chat-stop-play',
        label: mode === 'dropdown' ? <Trans>Pause</Trans> : <Trans>Suspend</Trans>,
        onClick: handlePause,
        visible: true,
      })
    }

    // Delete 逻辑：只有在 actions 包含 DELETE 且是自己的 agent 时才显示
    if (actions.includes(ActionType.DELETE) && isSelfAgent) {
      configs.push({
        type: ActionType.DELETE,
        icon: 'icon-chat-rubbish',
        label: <Trans>Delete</Trans>,
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
          label: isSubscribed ? <Trans>Unsubscribe</Trans> : <Trans>Subscribe</Trans>,
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
        label: <Trans>Share</Trans>,
        onClick: handleShare,
        visible: true,
        loading: isCopyLoading,
      }
      if (mode !== 'dropdown') {
        configs.push(shareAction)
      } else {
        configs.unshift(shareAction)
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
    handleShare,
    isSubscribed,
    isCopyLoading,
    isSubscribeLoading,
  ])

  // Dropdown 模式渲染 - 只渲染操作列表内容
  if (mode === 'dropdown') {
    return (
      <DropdownWrapper className={className}>
        {actionConfigs.map((config) => (
          <DropdownItem key={config.type} $color={config.color} onClick={config.onClick}>
            <IconWrapper>
              <IconBase className={config.icon} />
            </IconWrapper>
            <span>{config.label}</span>
          </DropdownItem>
        ))}
        {actions.includes(ActionType.SHARE) && (
          <AgentShare shareUrl={shareUrl} ref={shareDomRef} agentDetailData={data} />
        )}
      </DropdownWrapper>
    )
  }

  // Toolbar 模式渲染
  return (
    <ToolbarWrapper className={className}>
      {actionConfigs.map((config) => (
        <Tooltip key={config.type} content={config.label}>
          <IconButton icon={config.icon} color={config.color} onClick={config.onClick} pending={config.loading} />
        </Tooltip>
      ))}

      {actions.includes(ActionType.SUBSCRIBE) && !isSelfAgent && (
        <SubscribeButton
          isSubscribed={isSubscribed}
          onClick={handleSubscribe}
          size='medium'
          pending={isSubscribeLoading}
          width='fit-content'
        />
      )}

      {actions.includes(ActionType.SHARE) && (
        <AgentShare shareUrl={shareUrl} ref={shareDomRef} agentDetailData={data} />
      )}
    </ToolbarWrapper>
  )
}

export default memo(AgentActions)
