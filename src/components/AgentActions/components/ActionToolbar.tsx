import { memo, RefObject, useState } from 'react'
import { IconButton } from 'components/Button'
import { IconBase } from 'components/Icons'
import Tooltip from 'components/Tooltip'
import Popover from 'components/Popover'
import AgentShare from 'components/AgentShare'
import SubscribeButton from 'pages/AgentHub/components/AgentCardList/components/SubscribeButton'
import { ActionType, ActionConfig } from '../types'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useIsSelfAgent, useIsAgentSubscribed } from 'store/agenthub/hooks'
import { ToolbarWrapper, DropdownItem, IconWrapper, DropdownWrapper } from '../styles'
import { renderLabel } from '../translations'
import styled from 'styled-components'

interface ActionToolbarProps {
  data: AgentDetailDataType
  actions: ActionType[]
  actionConfigs: ActionConfig[]
  shareActionConfigs: ActionConfig[]
  shareUrl: string
  shareDomRef: RefObject<HTMLDivElement | null>
  isSubscribeLoading: boolean
  handleSubscribe: () => Promise<void>
  className?: string
}

function ActionToolbar({
  data,
  actions,
  actionConfigs,
  shareActionConfigs,
  shareUrl,
  shareDomRef,
  isSubscribeLoading,
  handleSubscribe,
  className,
}: ActionToolbarProps) {
  const isSelfAgent = useIsSelfAgent(data.id)
  const isSubscribed = useIsAgentSubscribed(data.id)
  const [showSharePopover, setShowSharePopover] = useState(false)

  // Popover菜单内容
  const sharePopoverContent = (
    <DropdownWrapper className={className}>
      {shareActionConfigs.map((config) => (
        <DropdownItem
          key={config.type}
          onClick={() => {
            config.onClick()
            setShowSharePopover(false)
          }}
        >
          <IconWrapper>
            <IconBase className={config.icon} />
          </IconWrapper>
          <span>{typeof config.label === 'string' ? renderLabel(config.label) : config.label}</span>
        </DropdownItem>
      ))}
    </DropdownWrapper>
  )

  return (
    <ToolbarWrapper className={className}>
      {actionConfigs.map((config) => {
        // SHARE类型使用Popover，其他类型使用Tooltip
        if (config.type === ActionType.SHARE) {
          return (
            <Popover
              key={config.type}
              content={sharePopoverContent}
              show={showSharePopover}
              placement='bottom'
              onMouseEnter={() => setShowSharePopover(true)}
              onMouseLeave={() => setShowSharePopover(false)}
              onClickOutside={() => setShowSharePopover(false)}
            >
              <IconButton icon={config.icon} color={config.color} onClick={config.onClick} pending={config.loading} />
            </Popover>
          )
        }

        return (
          <Tooltip
            key={config.type}
            content={typeof config.label === 'string' ? renderLabel(config.label) : config.label}
          >
            <IconButton icon={config.icon} color={config.color} onClick={config.onClick} pending={config.loading} />
          </Tooltip>
        )
      })}

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

export default memo(ActionToolbar)
