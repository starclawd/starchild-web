import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import PlaceholderSection from '../components/PlaceholderSection'
import { MARKET_PULSE, AGENT_HUB_TYPE } from 'constants/agentHub'

const MarketPulseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    padding: ${vm(16)};
  `}
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    margin-bottom: ${vm(16)};
  `}

  h1 {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    color: ${({ theme }) => theme.textL1};
    margin: 0;

    ${({ theme }) =>
      theme.isMobile &&
      `
      font-size: ${vm(20)};
    `}
  }
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(16)};
  `}
`

export default memo(function MarketPulse() {
  const marketPulseWrapperRef = useScrollbarClass<HTMLDivElement>()

  return (
    <MarketPulseWrapper ref={marketPulseWrapperRef as any} className='scroll-style'>
      <Header>
        <h1>
          <Trans>{MARKET_PULSE.titleKey}</Trans>
        </h1>
      </Header>
      <Content>
        <PlaceholderSection
          id={`${AGENT_HUB_TYPE.MARKET_PULSE}-main`}
          title={<Trans>{MARKET_PULSE.titleKey}</Trans>}
          description={<Trans>{MARKET_PULSE.descriptionKey}</Trans>}
        />
      </Content>
    </MarketPulseWrapper>
  )
})
