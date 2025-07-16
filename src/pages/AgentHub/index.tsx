import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useEffect } from 'react'
import { vm } from 'pages/helper'
import ButtonGroup from './components/ButtonGroup'
import StickySearchHeader from 'pages/AgentHub/components/StickySearchHeader'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import { AgentCategory } from 'store/agenthub/agenthub'
import AgentCardSection from './components/AgentCardSection'
import {
  useSearchString,
  useAgentMarketplaceThreadInfoList,
  useIsLoadingMarketplace,
  useGetAgentMarketplaceThreadInfoList,
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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;
`

const MarketPlaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
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

  const [agentMarketplaceThreadInfoList] = useAgentMarketplaceThreadInfoList()
  const [isLoading] = useIsLoadingMarketplace()
  const getAgentMarketplaceList = useGetAgentMarketplaceThreadInfoList()
  const [searchString, setSearchString] = useSearchString()

  useEffect(() => {
    getAgentMarketplaceList()
  }, [getAgentMarketplaceList])

  // 创建 debounced 搜索函数
  const debouncedSearch = useMemo(
    () =>
      debounce((filterString: string) => {
        getAgentMarketplaceList()
      }, 500),
    [getAgentMarketplaceList],
  )

  const handleButtonGroupClick = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId)
      const scrollContainer = agentHubWrapperRef.current
      if (element && scrollContainer) {
        const containerRect = scrollContainer.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const targetTop = scrollContainer.scrollTop + elementRect.top - containerRect.top - 200

        scrollContainer.scrollTo({
          top: targetTop,
          behavior: 'smooth',
        })
      }
    },
    [agentHubWrapperRef],
  )

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchString(value)
      debouncedSearch(value)
    },
    [debouncedSearch, setSearchString],
  )

  const handleRunAgent = useCallback(() => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }, [])

  return (
    <AgentHubWrapper ref={agentHubWrapperRef as any} className='scroll-style'>
      <Content>
        <MarketPlaceWrapper>
          <MarketPlaceHeader>
            <Title>
              <Trans>Agent marketplace</Trans>
            </Title>
          </MarketPlaceHeader>

          <StickySearchHeader onSearchChange={handleSearchChange} searchString={searchString}>
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
                  customAgents={agentMarketplaceThreadInfoList.filter((agent) => agent.type === category.id)}
                  isLoading={isLoading}
                  // runAgentCard={runAgentCard}
                  skeletonType={skeletonType}
                />
              )
            })}
          </SectionsWrapper>
        </MarketPlaceWrapper>
      </Content>
    </AgentHubWrapper>
  )
})
