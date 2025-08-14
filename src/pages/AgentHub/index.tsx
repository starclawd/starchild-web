import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useEffect, useRef, useState } from 'react'
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
import { useIsMobile } from 'store/application/hooks'
import AgentTopNavigationBar from './components/AgentTopNavigationBar'
import { i18n } from '@lingui/core'
import { t } from '@lingui/core/macro'

const AgentHubContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: calc(100% - ${vm(44)});
    `}
`

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0;
    `}
`

const MarketPlaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0;
    `}
`

const MarketPlaceHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      margin-bottom: 0;
      padding: 0 ${vm(16)};
    `}
`

const Title = styled.h1`
  font-size: 36px;
  line-height: 44px;
  font-weight: 500;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: center;
  text-transform: capitalize;
`

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

interface AgentHubProps {
  showSearchBar?: boolean
}

export default memo(function AgentHub({ showSearchBar = true }: AgentHubProps) {
  const agentHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [agentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [searchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
  const [isLoading] = useIsLoadingMarketplace()
  const getAgentMarketplaceList = useGetAgentMarketplaceInfoList()
  const getSearchedAgentMarketplaceList = useGetSearchedAgentMarketplaceInfoList()
  const [searchString, setSearchString] = useMarketplaceSearchString()
  const isInitializedRef = useRef(false)
  const isMobile = useIsMobile()

  const currentAgentList = showSearchBar && searchString ? searchedAgentMarketplaceInfoList : agentMarketplaceInfoList

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
      const scrollContainer = agentHubWrapperRef.current
      if (scrollContainer) {
        const element = scrollContainer.querySelector(`[id="${sectionId}"]`)
        console.log('element', element)
        if (element) {
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const offset = isMobile ? (showSearchBar ? 90 : 40) : 130
          const targetTop = scrollContainer.scrollTop + elementRect.top - containerRect.top - offset

          scrollContainer.scrollTo({
            top: targetTop,
            behavior: 'smooth',
          })
        }
      }
    },
    [agentHubWrapperRef, isMobile, showSearchBar],
  )

  const handleRunAgent = useCallback(() => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }, [])

  return (
    <AgentHubContainer>
      <AgentTopNavigationBar />
      <AgentHubWrapper ref={agentHubWrapperRef as any} className='scroll-style'>
        <MarketPlaceWrapper>
          {!isMobile && (
            <MarketPlaceHeader>
              <Title>
                <Trans>Agent Marketplace</Trans>
              </Title>
            </MarketPlaceHeader>
          )}
          <StickySearchHeader
            showSearchBar={showSearchBar}
            onSearchChange={setSearchString}
            searchString={searchString}
          >
            <ButtonGroup
              items={AGENT_CATEGORIES.map((category) => ({
                id: category.id,
                label: t(category.titleKey),
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
                  showViewMore={isMobile ? !showSearchBar : !searchString}
                  maxAgents={showSearchBar && searchString ? undefined : category.maxDisplayCountOnMarketPlace}
                  customAgents={currentAgentList.filter((agent) => agent.types.some((type) => type === category.id))}
                  isLoading={isLoading}
                  // runAgentCard={runAgentCard}
                  skeletonType={skeletonType}
                />
              )
            })}
          </SectionsWrapper>
        </MarketPlaceWrapper>
      </AgentHubWrapper>
    </AgentHubContainer>
  )
})
