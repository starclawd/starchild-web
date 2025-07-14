import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useState, useEffect } from 'react'
import { vm } from 'pages/helper'
import SearchBar from './components/SearchBar'
import CategoryTabs from './components/CategoryTabs'
import PlaceholderSection from './components/PlaceholderSection'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE } from 'constants/agentHub'
import { AgentCategory } from 'store/agenthub/agenthub'
import SignalScannerSection from './SignalScanner/components/SignalScannerSection'
import IndicatorHubSection from './IndicatorHub/components/IndicatorHubSection'
import StrategyHubSection from './StrategyHub/components/StrategyHubSection'
import { useAgentThreadInfoListAgents, useIsLoading, useGetAgentThreadInfoList } from 'store/agenthub/hooks'
import AutoBriefingSection from './AutoBriefing/components/AutoBriefingSection'
import { debounce } from 'utils/common'
import MarketPulseSection from './MarketPulse/components/MarketPulseSection'
import KolRadarSection from './KolRadar/components/KolRadarSection'

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.textL1};
    margin: 0;
  }
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
  font-size: 48px;
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

  const [agentThreadInfoListAgents] = useAgentThreadInfoListAgents()
  const [isLoading] = useIsLoading()
  const getAgentThreadInfoList = useGetAgentThreadInfoList()

  useEffect(() => {
    getAgentThreadInfoList({ page: 1, pageSize: 20 })
  }, [getAgentThreadInfoList])

  // 创建 debounced 搜索函数
  const debouncedSearch = useMemo(
    () =>
      debounce((filterString: string) => {
        getAgentThreadInfoList({ page: 1, pageSize: 20, filterString })
      }, 500),
    [getAgentThreadInfoList],
  )

  const handleTabClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      debouncedSearch(value)
    },
    [debouncedSearch],
  )

  return (
    <AgentHubWrapper ref={agentHubWrapperRef as any} className='scroll-style'>
      <Header>
        <h1>
          <Trans>Agent Hub</Trans>
        </h1>
      </Header>
      <Content>
        <MarketPlaceWrapper>
          <MarketPlaceHeader>
            <Title>
              <Trans>Agent marketplace</Trans>
            </Title>
            <SearchBar onChange={handleSearchChange} />
            <CategoryTabs categories={AGENT_CATEGORIES} onTabClick={handleTabClick} />
          </MarketPlaceHeader>

          <SectionsWrapper>
            {AGENT_CATEGORIES.map((category: AgentCategory) => {
              if (category.id === AGENT_HUB_TYPE.SIGNAL_SCANNER) {
                return (
                  <SignalScannerSection
                    key={category.id}
                    category={category}
                    showViewMore={true}
                    maxAgents={category.maxDisplayCountOnMarketPlace}
                    customAgents={agentThreadInfoListAgents.filter((agent) => agent.type === category.id)}
                    isLoading={isLoading}
                  />
                )
              }

              if (category.id === AGENT_HUB_TYPE.INDICATOR) {
                return (
                  <IndicatorHubSection
                    key={category.id}
                    category={category}
                    showViewMore={true}
                    maxAgents={category.maxDisplayCountOnMarketPlace}
                    customAgents={agentThreadInfoListAgents.filter((agent) => agent.type === category.id)}
                    isLoading={isLoading}
                  />
                )
              }

              if (category.id === AGENT_HUB_TYPE.STRATEGY) {
                return (
                  <StrategyHubSection
                    key={category.id}
                    category={category}
                    showViewMore={true}
                    maxAgents={category.maxDisplayCountOnMarketPlace}
                    customAgents={agentThreadInfoListAgents.filter((agent) => agent.type === category.id)}
                    isLoading={isLoading}
                  />
                )
              }

              if (category.id === AGENT_HUB_TYPE.AUTO_BRIEFING) {
                return (
                  <AutoBriefingSection
                    key={category.id}
                    category={category}
                    showViewMore={true}
                    maxAgents={category.maxDisplayCountOnMarketPlace}
                    customAgents={agentThreadInfoListAgents.filter((agent) => agent.type === category.id)}
                    isLoading={isLoading}
                  />
                )
              }

              if (category.id === AGENT_HUB_TYPE.MARKET_PULSE) {
                return (
                  <MarketPulseSection
                    key={category.id}
                    category={category}
                    showViewMore={true}
                    maxAgents={category.maxDisplayCountOnMarketPlace}
                    customAgents={agentThreadInfoListAgents.filter((agent) => agent.type === category.id)}
                    isLoading={isLoading}
                  />
                )
              }

              if (category.id === AGENT_HUB_TYPE.KOL_RADAR) {
                return (
                  <KolRadarSection
                    key={category.id}
                    category={category}
                    showViewMore={true}
                    maxAgents={category.maxDisplayCountOnMarketPlace}
                    customAgents={agentThreadInfoListAgents.filter((agent) => agent.type === category.id)}
                    isLoading={isLoading}
                  />
                )
              }

              return (
                <PlaceholderSection
                  key={category.id}
                  id={category.id}
                  title={<Trans>{category.titleKey}</Trans>}
                  description={<Trans>{category.descriptionKey}</Trans>}
                />
              )
            })}
          </SectionsWrapper>
        </MarketPlaceWrapper>
      </Content>
    </AgentHubWrapper>
  )
})
