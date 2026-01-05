import { memo } from 'react'
import { AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import { useCurrentTokenInfo } from 'store/agenthub/hooks'
import AgentTableListPage from '../../components/AgentTableList'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react'
import { css, styled } from 'styled-components'
import { vm } from 'pages/helper'
import { BaseButton } from 'components/Button'
import TokenCard from 'pages/AgentHub/components/AgentCardList/components/TokenCard'
import { useIsMobile, useCurrentRouter } from 'store/application/hooks'
import { formatNumber, formatPercent } from 'utils/format'
import AvatarComponent from 'components/Avatar'
import TitleDescriptionWithAvatar from 'pages/AgentHub/components/TitleDescriptionWithAvatar'
import AgentTopNavigationBar from 'pages/AgentHub/components/AgentTopNavigationBar'
import { ROUTER } from 'pages/router'

interface TokenAgentListProps {
  initialTag: string
  filterType: AGENT_HUB_TYPE
}

const AgentHubContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const AgentListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  height: 100%;
  overflow: hidden;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0;
      gap: ${vm(0)};
      padding: 0 ${vm(12)};
    `}
`

const TokenCardWrapper = styled.div`
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      max-width: 100%;
      gap: ${vm(0)};
    `}
`

const BackButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: fit-content;
  padding: 0 8px;
  gap: 4px;
  height: 32px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.black200};
  .icon-chat-back {
    font-size: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      display: flex;
      align-items: center;
      flex-shrink: 0;
      height: ${vm(44)};
      margin-top: 0;
      margin-bottom: ${vm(12)};
      color: ${({ theme }) => theme.black100};
      .icon-chat-back {
        font-size: 0.24rem;
      }
    `}
`

const MobileTokenInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vm(16)};
  padding: ${vm(8)};
  align-items: center;
`

const MobileTokenContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${vm(16)};
`

const MobileTokenCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vm(4)};
  flex: 1;
  padding: ${vm(4)};
  background: ${({ theme }) => theme.bgT20};
  border-radius: ${vm(8)};
  align-items: center;
`

const MobileTokenSymbol = styled.h3`
  font-size: 0.16rem;
  line-height: 0.24rem;
  font-weight: 600;
  color: ${({ theme }) => theme.black0};
  margin: 0;
  text-align: center;
`

const MobileTokenName = styled.p`
  font-size: 0.14rem;
  line-height: 0.2rem;
  color: ${({ theme }) => theme.black200};
  margin: 0;
  text-align: center;
`

const MobilePriceCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vm(4)};
  flex: 1;
  padding: ${vm(4)};
  background: ${({ theme }) => theme.bgT20};
  border-radius: ${vm(8)};
  align-items: center;
`

const MobilePrice = styled.span`
  font-size: 0.16rem;
  line-height: 0.24rem;
  font-weight: 400;
  color: ${({ theme }) => theme.black0};
  text-align: center;
`

const MobilePriceChange = styled.span<{ $isPositive: boolean }>`
  font-size: 0.14rem;
  line-height: 0.2rem;
  font-weight: 400;
  color: ${({ theme, $isPositive }) => ($isPositive ? theme.jade10 : theme.ruby50)};
  text-align: center;
`

export default memo(function TokenAgentList({ initialTag, filterType }: TokenAgentListProps) {
  const [currentTokenInfo, setCurrentTokenInfo] = useCurrentTokenInfo()
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()

  const handleBack = () => {
    setCurrentRouter(ROUTER.AGENT_HUB + '#token-deep-dive')
    setCurrentTokenInfo(null)
  }

  return (
    <AgentHubContainer>
      <AgentTopNavigationBar />
      <AgentListWrapper>
        <BackButton onClick={handleBack}>
          <IconBase className='icon-chat-back' />
          {!isMobile && <Trans id={TOKEN_DEEP_DIVE.titleKey.id} />}
        </BackButton>
        {/* token info */}
        <TokenCardWrapper>
          {currentTokenInfo && !isMobile && <TokenCard tokenInfo={currentTokenInfo} enableClick={false} />}
          {currentTokenInfo && currentTokenInfo.price && isMobile && (
            <MobileTokenInfo>
              {currentTokenInfo.logoUrl && (
                <AvatarComponent size={60} avatar={currentTokenInfo.logoUrl} name={currentTokenInfo.symbol} />
              )}
              <MobileTokenContent>
                <MobileTokenCard>
                  <MobileTokenSymbol>{currentTokenInfo.symbol.toUpperCase()}</MobileTokenSymbol>
                  {currentTokenInfo.fullName && <MobileTokenName>{currentTokenInfo.fullName}</MobileTokenName>}
                </MobileTokenCard>
                <MobilePriceCard>
                  {currentTokenInfo.price && <MobilePrice>{formatNumber(currentTokenInfo.price)}</MobilePrice>}
                  {currentTokenInfo.pricePerChange && (
                    <MobilePriceChange $isPositive={currentTokenInfo.pricePerChange > 0}>
                      {currentTokenInfo.pricePerChange > 0 ? '+' : ''}
                      {formatPercent({ value: currentTokenInfo.pricePerChange / 100, precision: 2 })}
                    </MobilePriceChange>
                  )}
                </MobilePriceCard>
              </MobileTokenContent>
            </MobileTokenInfo>
          )}
          {currentTokenInfo && !currentTokenInfo.price && isMobile && (
            <TitleDescriptionWithAvatar
              avatarName={currentTokenInfo.fullName}
              avatar={currentTokenInfo.logoUrl || ''}
              title={currentTokenInfo.fullName}
              description={currentTokenInfo.description || ''}
            />
          )}
        </TokenCardWrapper>
        <AgentTableListPage initialTag={initialTag} filterType={filterType} />
      </AgentListWrapper>
    </AgentHubContainer>
  )
})
