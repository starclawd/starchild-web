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

interface KolAgentListProps {
  initialTag: string
  filterType: AGENT_HUB_TYPE
}

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
    `}
`

const BackButton = styled(BaseButton)`
  width: fit-content;
  padding: 8px;
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
      color: ${({ theme }) => theme.textL2};
      margin-top: 0;
      padding: ${vm(10)} ${vm(12)};
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
  )
})
