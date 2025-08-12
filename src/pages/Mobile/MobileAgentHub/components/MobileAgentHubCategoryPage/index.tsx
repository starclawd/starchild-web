import { memo, useCallback, useState } from 'react'
import { Trans } from '@lingui/react'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { AgentCategory } from 'store/agenthub/agenthub'
import MobileAgentHubHeader from '../MobileAgentHubHeader'
import AgentHubPage from 'pages/AgentHub/components/AgentHubPage'
import BottomSheet from 'components/BottomSheet'
import { vm } from 'pages/helper'
import { useTheme } from 'styled-components'

interface MobileAgentHubCategoryPageProps {
  category: AgentCategory
  filterType: AGENT_HUB_TYPE
  skeletonType?: 'default' | 'with-image'
}

export default memo(function MobileAgentHubCategoryPage({
  category,
  filterType,
  skeletonType = 'default',
}: MobileAgentHubCategoryPageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()

  const handleSearchClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <>
      <MobileAgentHubHeader title={<Trans id={category.titleKey.id} />} onSearchClick={handleSearchClick} />
      <AgentHubPage category={category} filterType={filterType} skeletonType={skeletonType} showSearchBar={false} />
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        hideDragHandle={true}
        hideClose={false}
        isCloseText={true}
        rootStyle={{ overflowY: 'hidden', height: `calc(100vh - ${vm(44)})`, background: theme.black800 }}
      >
        <AgentHubPage category={category} filterType={filterType} skeletonType={skeletonType} showSearchBar={true} />
      </BottomSheet>
    </>
  )
})
