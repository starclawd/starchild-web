import { memo, RefObject } from 'react'
import { IconButton } from 'components/Button'
import Tooltip from 'components/Tooltip'
import AgentShare from 'components/AgentShare'
import SubscribeButton from 'pages/AgentHub/components/AgentCardList/components/SubscribeButton'
import { ActionType, ActionConfig } from '../types'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useIsSelfAgent, useIsAgentSubscribed } from 'store/agenthub/hooks'
import { ToolbarWrapper } from '../styles'
import { renderLabel } from '../translations'

interface ActionToolbarProps {
  data: AgentDetailDataType
  actions: ActionType[]
  actionConfigs: ActionConfig[]
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
  shareUrl,
  shareDomRef,
  isSubscribeLoading,
  handleSubscribe,
  className,
}: ActionToolbarProps) {
  const isSelfAgent = useIsSelfAgent(data.id)
  const isSubscribed = useIsAgentSubscribed(data.id)

  return (
    <ToolbarWrapper className={className}>
      {actionConfigs.map((config) => (
        <Tooltip
          key={config.type}
          content={typeof config.label === 'string' ? renderLabel(config.label) : config.label}
        >
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

export default memo(ActionToolbar)
