import { memo } from 'react'
import { IconBase } from 'components/Icons'
import { ActionConfig } from '../types'
import { DropdownItem, IconWrapper, DropdownWrapper } from '../styles'
import { renderLabel } from '../translations'

interface ShareActionDropdownProps {
  shareActionConfigs: ActionConfig[]
  onItemClick: () => void
  className?: string
}

function ShareActionDropdown({ shareActionConfigs, onItemClick, className }: ShareActionDropdownProps) {
  return (
    <DropdownWrapper className={className}>
      {shareActionConfigs.map((config) => (
        <DropdownItem
          key={config.type}
          onClick={(e) => {
            e.stopPropagation()
            config.onClick()
            onItemClick()
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
}

export default memo(ShareActionDropdown)
