import styled from 'styled-components'
import { memo, useCallback } from 'react'
import { vm } from 'pages/helper'
import SearchBar from './SearchBar'
import CategoryTabs from './CategoryTabs'
import AgentCreatorSection from './components/AgentCreatorSection'
import PlaceholderSection from './components/PlaceholderSection'
import { Trans } from '@lingui/react/macro'


const MarketPlaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(24)};
    padding: ${vm(24)} 0;
  `}
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(20)};
    padding: 0 ${vm(16)};
  `}
`

const Title = styled.h1`
  font-size: 48px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(32)};
  `}
`

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(40)};
  `}
`

const sections = [
  { id: 'agent-creator', title: 'Agent creator', hasCustomComponent: true },
  { id: 'backtester', title: 'Backtester', hasCustomComponent: false },
  { id: 'indicator-tools', title: 'Indicator tools', hasCustomComponent: false },
  { id: 'figure-tracker', title: 'Figure tracker', hasCustomComponent: false },
  { id: 'crypto-market-analysis', title: 'Crypto market analysis', hasCustomComponent: false },
  { id: 'push-monitor', title: 'Push monitor', hasCustomComponent: false },
  { id: 'token-info', title: 'Token info', hasCustomComponent: false },
]

export default memo(function AgentMarketPlace() {
  const handleTabClick = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])
  
  return (
    <MarketPlaceWrapper>
      <Header>
        <Title><Trans>Agent marketplace</Trans></Title>
        <SearchBar onChange={() => {
          // TODO: 搜索
        }} />
        <CategoryTabs onTabClick={handleTabClick} />
      </Header>
      
      <SectionsWrapper>
        {sections.map((section) => (
          section.hasCustomComponent ? (
            <AgentCreatorSection key={section.id} id={section.id} />
          ) : (
            <PlaceholderSection 
              key={section.id} 
              id={section.id} 
              title={section.title}
            />
          )
        ))}
      </SectionsWrapper>
    </MarketPlaceWrapper>
  )
}) 