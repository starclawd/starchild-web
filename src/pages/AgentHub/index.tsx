import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback } from 'react'
import { vm } from 'pages/helper'
import SearchBar from './components/SearchBar'
import CategoryTabs from './components/CategoryTabs'
import AgentCreatorSection from './components/AgentCreatorSection'
import PlaceholderSection from './components/PlaceholderSection'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { t } from '@lingui/core/macro'

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
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(24)};
    padding: ${vm(24)} 0;
  `}
`

const MarketPlaceHeader = styled.div`
  display: flex;
  flex-direction: column;
  
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
  text-align: center;
  
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

export default memo(function AgentHub() {
  const agentHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  const categories = [
    { id: 'indicator-hub', title: t`Indicator hub`, description: t`Track key metrics. Stay ahead of the trend`, hasCustomComponent: false },
    { id: 'strategy-hub', title: t`Strategy lab`, description: t`Build, test, and refine your trading edge`, hasCustomComponent: false },
    { id: 'signal-scanner', title: t`Signal scanner`, description: t`Scan the market. Spot real-time opportunities`, hasCustomComponent: true },
    { id: 'kol-radar', title: t`KOL radar`, description: t`Follow top voices. Act on expert insights`, hasCustomComponent: false },
    { id: 'auto-briefing', title: t`Auto briefing`, description: t`Your daily market intel. Fully automated`, hasCustomComponent: false },
    { id: 'market-pulse', title: t`Market pulse`, description: t`Live sentiment. Real-time momentum`, hasCustomComponent: false },
    { id: 'token-deep-dive', title: t`Token deep dive`, description: t`Uncover the fundamentals behind the tokens`, hasCustomComponent: false },
  ]

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
    <AgentHubWrapper ref={agentHubWrapperRef as any} className="scroll-style">
      <Header>
        <h1>
          <Trans>Agent Hub</Trans>
        </h1>
      </Header>
      <Content>
        <MarketPlaceWrapper>
          <MarketPlaceHeader>
            <Title><Trans>Agent marketplace</Trans></Title>
            <SearchBar onChange={() => {
              // TODO: 搜索
            }} />
            <CategoryTabs categories={categories} onTabClick={handleTabClick} />
          </MarketPlaceHeader>

          <SectionsWrapper>
            {categories.map((category) => (
              category.hasCustomComponent ? (
                <AgentCreatorSection key={category.id} category={category} />
              ) : (
                <PlaceholderSection
                  key={category.id}
                  id={category.id}
                  title={category.title}
                  description={category.description}
                />
              )
            ))}
          </SectionsWrapper>
        </MarketPlaceWrapper>
      </Content>
    </AgentHubWrapper>
  )
}) 