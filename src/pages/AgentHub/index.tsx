import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useEffect, useRef } from 'react'
import { vm } from 'pages/helper'
import ButtonGroup from './components/ButtonGroup'
import StickySearchHeader from 'pages/AgentHub/components/StickySearchHeader'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import { AgentCategory } from 'store/agenthub/agenthub'
import AgentCardSection from './components/AgentCardSection'
import {
  useMarketplaceSearchString,
  useAgentMarketplaceInfoList,
  useSearchedAgentMarketplaceInfoList,
  useIsLoadingMarketplace,
  useGetAgentMarketplaceInfoList,
  useGetSearchedAgentMarketplaceInfoList,
} from 'store/agenthub/hooks'
import { debounce } from 'utils/common'
import IndicatorRunAgentCard from './IndicatorHub/components/IndicatorRunAgentCard'
import RunAgentCard from './SignalScanner/components/RunAgentCard'

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 20px;
`

const MarketPlaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(24)};
      padding: ${vm(24)} 0;
    `}
`

const MarketPlaceHeader = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: 0 ${vm(16)};
    `}
`

const Title = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(32)};
    `}
`

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(40)};
    `}
`

export default memo(function AgentHub() {
  const agentHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [agentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [searchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
  const [isLoading] = useIsLoadingMarketplace()
  const getAgentMarketplaceList = useGetAgentMarketplaceInfoList()
  const getSearchedAgentMarketplaceList = useGetSearchedAgentMarketplaceInfoList()
  const [searchString, setSearchString] = useMarketplaceSearchString()
  const isInitializedRef = useRef(false)

  const currentAgentList = searchString ? searchedAgentMarketplaceInfoList : agentMarketplaceInfoList

  const loadData = useCallback(
    (filterString: string) => {
      if (filterString) {
        getSearchedAgentMarketplaceList()
      } else {
        getAgentMarketplaceList()
      }
    },
    [getAgentMarketplaceList, getSearchedAgentMarketplaceList],
  )

  // 搜索防抖处理
  const debouncedSearch = useMemo(() => debounce(loadData, 500), [loadData])

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
      debouncedSearch(searchString)
    }
  }, [searchString, debouncedSearch])

  const handleButtonGroupClick = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId)
      const scrollContainer = agentHubWrapperRef.current
      if (element && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const targetTop = scrollContainer.scrollTop + elementRect.top - containerRect.top - 120

        scrollContainer.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        })
      }
    },
    [agentHubWrapperRef],
  )

  const handleRunAgent = useCallback(() => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }, [])

  return (
    <AgentHubWrapper ref={agentHubWrapperRef as any} className='scroll-style'>
      <MarketPlaceWrapper>
        <MarketPlaceHeader>
          <Title>
            <Trans>Agent marketplace</Trans>
          </Title>
        </MarketPlaceHeader>

        <StickySearchHeader onSearchChange={setSearchString} searchString={searchString}>
          <ButtonGroup
            items={AGENT_CATEGORIES.map((category) => ({
              id: category.id,
              label: category.titleKey,
              value: category.id,
            }))}
            onItemClick={handleButtonGroupClick}
          />
        </StickySearchHeader>

        <SectionsWrapper>
          {AGENT_CATEGORIES.map((category: AgentCategory) => {
            // // 获取特定的runAgentCard组件
            // let runAgentCard = undefined
            // if (category.id === AGENT_HUB_TYPE.SIGNAL_SCANNER) {
            //   runAgentCard = <RunAgentCard onRunAgent={handleRunAgent} />
            // } else if (category.id === AGENT_HUB_TYPE.INDICATOR) {
            //   runAgentCard = <IndicatorRunAgentCard onRunAgent={handleRunAgent} />
            // }

            // 获取skeleton类型
            const skeletonType = category.id === AGENT_HUB_TYPE.INDICATOR ? 'with-image' : 'default'

            return (
              <AgentCardSection
                key={category.id}
                category={category}
                isSectionMode={true}
                showViewMore={!searchString}
                maxAgents={category.maxDisplayCountOnMarketPlace}
                customAgents={currentAgentList.filter((agent) => agent.type === category.id)}
                isLoading={isLoading}
                // runAgentCard={runAgentCard}
                skeletonType={skeletonType}
              />
            )
          })}
        </SectionsWrapper>
      </MarketPlaceWrapper>
    </AgentHubWrapper>
  )
})
