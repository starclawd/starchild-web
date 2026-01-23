import styled from 'styled-components'
import { memo, useCallback, useEffect, useRef } from 'react'
import { vm } from 'pages/helper'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE, AgentCategory } from 'store/agenthub/agenthub.d'
import AgentCardSection from '../AgentCardSection'
import { useCurrentAgentList } from 'store/agenthub/hooks/useDataSource'
import { useMarketplaceSearchString } from 'store/agenthub/hooks/useSearch'
import {
  useIsLoadingMarketplace,
  useGetAgentMarketplaceInfoList,
  useGetSearchedAgentMarketplaceInfoList,
} from 'store/agenthub/hooks/useMarketplace'
import { useIsMobile } from 'store/application/hooks'

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;

  ${({ theme }) =>
    theme.isMobile &&
    `
      gap: ${vm(20)};
    `}
`

interface AgentMarketplaceCardOverviewProps {
  showSearchBar?: boolean
}

export default memo(function AgentMarketplaceCardOverview({ showSearchBar = true }: AgentMarketplaceCardOverviewProps) {
  const [currentAgentList] = useCurrentAgentList(showSearchBar)
  const [isLoading] = useIsLoadingMarketplace()
  const getAgentMarketplaceList = useGetAgentMarketplaceInfoList()
  const getSearchedAgentMarketplaceList = useGetSearchedAgentMarketplaceInfoList()
  const [searchString] = useMarketplaceSearchString()
  const isInitializedRef = useRef(false)
  const isMobile = useIsMobile()

  const loadData = useCallback(
    (filterString: string) => {
      if (filterString) {
        getSearchedAgentMarketplaceList(filterString)
      } else {
        getAgentMarketplaceList()
      }
    },
    [getAgentMarketplaceList, getSearchedAgentMarketplaceList],
  )

  // 初始化
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      loadData(searchString)
    }
  }, [loadData, searchString])

  // 处理搜索字符串变化
  useEffect(() => {
    if (isInitializedRef.current) {
      loadData(searchString)
    }
  }, [searchString, loadData])

  return (
    <SectionsWrapper>
      {AGENT_CATEGORIES.map((category: AgentCategory) => {
        // 获取skeleton类型
        const skeletonType = [AGENT_HUB_TYPE.INDICATOR, AGENT_HUB_TYPE.STRATEGY].includes(category.id as AGENT_HUB_TYPE)
          ? 'with-image'
          : 'default'

        return (
          <AgentCardSection
            key={category.id}
            category={category}
            isSectionMode={true}
            showViewMore={isMobile ? !showSearchBar : !searchString}
            maxAgents={showSearchBar && searchString ? undefined : category.maxDisplayCountOnMarketPlace}
            customAgents={currentAgentList.filter((agent) => agent.types.some((type) => type === category.id))}
            isLoading={isLoading}
            skeletonType={skeletonType}
          />
        )
      })}
    </SectionsWrapper>
  )
})
