import { memo, useCallback, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { AgentCategory } from 'store/agenthub/agenthub'
import MobileAgentHubHeader from '../MobileAgentHubHeader'
import AgentHubPage from 'pages/AgentHub/components/AgentHubPage'
import BottomSheet from 'components/BottomSheet'

interface MobileAgentHubCategoryPageProps {
  category: AgentCategory
  filterType: AGENT_HUB_TYPE
  filterTag?: string
  skeletonType?: 'default' | 'with-image'
}

export default memo(function MobileAgentHubCategoryPage({
  category,
  filterType,
  filterTag,
  skeletonType = 'default',
}: MobileAgentHubCategoryPageProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSearchClick = useCallback(() => {
    setIsOpen(true)
  }, [])

  return (
    <>
      <MobileAgentHubHeader title={<Trans>{category.titleKey}</Trans>} onSearchClick={handleSearchClick} />
      <AgentHubPage
        category={category}
        filterType={filterType}
        filterTag={filterTag}
        skeletonType={skeletonType}
        showSearchBar={false}
      />
      <BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} hideDragHandle={false}>
        <AgentHubPage
          category={category}
          filterType={filterType}
          filterTag={filterTag}
          skeletonType={skeletonType}
          showSearchBar={true}
        />
      </BottomSheet>
    </>
  )
})
