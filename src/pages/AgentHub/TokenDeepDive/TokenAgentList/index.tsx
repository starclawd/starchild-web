import { memo } from 'react'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useCurrentTokenInfo } from 'store/agenthub/hooks'
import AgentTableListPage from '../../components/AgentTableList'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { css, styled } from 'styled-components'
import { vm } from 'pages/helper'
import { BaseButton } from 'components/Button'
import TokenCard from 'pages/AgentHub/components/AgentCardList/components/TokenCard'
import { useIsMobile } from 'store/application/hooks'

interface TokenAgentListProps {
  initialTag: string
  filterType: AGENT_HUB_TYPE
}

const AgentListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 20px;
  gap: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0;
      gap: ${vm(0)};
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
  width: fit-content;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-chat-back {
    font-size: 18px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      color: ${({ theme }) => theme.textL2};
      .icon-chat-back {
        font-size: ${vm(24)};
      }
    `}
`

export default memo(function TokenAgentList({ initialTag, filterType }: TokenAgentListProps) {
  const [currentTokenInfo, setCurrentTokenInfo] = useCurrentTokenInfo()
  const isMobile = useIsMobile()

  const handleBack = () => {
    setCurrentTokenInfo(null)
  }

  return (
    <AgentListWrapper>
      <BackButton onClick={handleBack}>
        <IconBase className='icon-chat-back' />
        {!isMobile && <Trans>{filterType}</Trans>}
      </BackButton>
      {/* token info */}
      <TokenCardWrapper>
        {currentTokenInfo && <TokenCard tokenInfo={currentTokenInfo} enableClick={false} />}
      </TokenCardWrapper>
      <AgentTableListPage initialTag={initialTag} filterType={filterType} />
    </AgentListWrapper>
  )
})
