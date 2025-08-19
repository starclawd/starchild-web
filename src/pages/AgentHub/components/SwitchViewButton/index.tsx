import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { AgentHubViewMode } from 'store/agenthubcache/agenthubcache'
import { useAgentHubViewMode } from 'store/agenthubcache/hooks'
import { IconButton } from 'components/Button'
import { useTheme } from 'store/themecache/hooks'

const SwitchViewContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

interface SwitchViewButtonProps {
  className?: string
}

export default memo(function SwitchViewButton({ className }: SwitchViewButtonProps) {
  const [viewMode, setViewMode] = useAgentHubViewMode()

  const handleViewModeClick = useCallback(() => {
    setViewMode(viewMode === AgentHubViewMode.CARD ? AgentHubViewMode.LIST : AgentHubViewMode.CARD)
  }, [viewMode, setViewMode])

  return (
    <SwitchViewContainer className={className}>
      <IconButton
        icon={viewMode === AgentHubViewMode.CARD ? 'icon-discover-agents' : 'icon-all-token'}
        onClick={handleViewModeClick}
      />
    </SwitchViewContainer>
  )
})
