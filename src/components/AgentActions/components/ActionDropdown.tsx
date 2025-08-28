import { memo, RefObject } from 'react'
import { IconBase } from 'components/Icons'
import AgentShare from 'components/AgentShare'
import { ActionType, ActionConfig } from '../types'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { DropdownWrapper, DropdownItem, IconWrapper } from '../styles'
import { renderLabel } from '../translations'

interface ActionDropdownProps {
  data: AgentDetailDataType
  actions: ActionType[]
  actionConfigs: ActionConfig[]
  shareUrl: string
  shareDomRef: RefObject<HTMLDivElement | null>
  className?: string
}

function ActionDropdown({ data, actions, actionConfigs, shareUrl, shareDomRef, className }: ActionDropdownProps) {
  return (
    <DropdownWrapper className={className}>
      {actionConfigs.map((config) => (
        <DropdownItem key={config.type} $color={config.color} onClick={config.onClick}>
          <IconWrapper>
            <IconBase className={config.icon} />
          </IconWrapper>
          <span>{typeof config.label === 'string' ? renderLabel(config.label) : config.label}</span>
        </DropdownItem>
      ))}
      {actions.includes(ActionType.SHARE) && (
        <AgentShare shareUrl={shareUrl} ref={shareDomRef} agentDetailData={data} />
      )}
    </DropdownWrapper>
  )
}

export default memo(ActionDropdown)
