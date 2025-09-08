import { memo, RefObject, useState } from 'react'
import { IconButton } from 'components/Button'
import Tooltip from 'components/Tooltip'
import Popover from 'components/Popover'
import AgentShare from 'components/AgentShare'
import SubscribeButton from 'pages/AgentHub/components/AgentCardList/components/SubscribeButton'
import ShareActionDropdown from './ShareActionDropdown'
import { ActionType, ActionConfig } from '../types'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useIsSelfAgent, useIsAgentSubscribed } from 'store/agenthub/hooks'
import { ToolbarWrapper } from '../styles'
import { renderLabel } from '../translations'

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

  return (
    <ToolbarWrapper className={className}>
      {actionConfigs.map((config) => {
        // SHARE类型使用Popover，其他类型使用Tooltip
        if (config.type === ActionType.SHARE) {
          return (
            <Popover
              key={config.type}
              content={
                <ShareActionDropdown
                  shareActionConfigs={shareActionConfigs}
                  onItemClick={() => setShowSharePopover(false)}
                  className={className}
                />
              }
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
