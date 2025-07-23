import { memo } from 'react'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useCurrentKolInfo } from 'store/agenthub/hooks'
import AgentTableListPage from '../../components/AgentTableList'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { css, styled } from 'styled-components'
import { BaseButton } from 'components/Button'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import TitleDescriptionWithAvatar from 'pages/AgentHub/components/TitleDescriptionWithAvatar'
import AgentTopNavigationBar from 'pages/AgentHub/components/AgentTopNavigationBar'

interface KolAgentListProps {
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
  color: ${({ theme }) => theme.textL3};
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
      color: ${({ theme }) => theme.textL2};
      .icon-chat-back {
        font-size: 0.24rem;
      }
    `}
`

export default memo(function KolAgentList({ initialTag, filterType }: KolAgentListProps) {
  const [currentKolInfo, setCurrentKolInfo] = useCurrentKolInfo()
  const isMobile = useIsMobile()

  const handleBack = () => {
    setCurrentKolInfo(null)
  }

  return (
    <AgentHubContainer>
      <AgentTopNavigationBar />
      <AgentListWrapper>
        <BackButton onClick={handleBack}>
          <IconBase className='icon-chat-back' />
          {!isMobile && <Trans>{filterType}</Trans>}
        </BackButton>

        {currentKolInfo && (
          <TitleDescriptionWithAvatar
            avatarName={currentKolInfo.name}
            avatar={currentKolInfo.avatar || ''}
            title={currentKolInfo.name}
            description={currentKolInfo.description || ''}
          />
        )}

        <AgentTableListPage initialTag={initialTag} filterType={filterType} />
      </AgentListWrapper>
    </AgentHubContainer>
  )
})
