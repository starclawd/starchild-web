import { memo, useState, useRef, useEffect } from 'react'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useCurrentKolInfo } from 'store/agenthub/hooks'
import AgentTableListPage from '../../components/AgentTableList'
import { IconBase } from 'components/Icons'
import { Trans } from '@lingui/react/macro'
import { css, styled } from 'styled-components'
import { BaseButton } from 'components/Button'
import { vm } from 'pages/helper'
import Avatar from 'components/Avatar'
import { useIsMobile } from 'store/application/hooks'

interface KolAgentListProps {
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

const KolInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: ${vm(24)};
      gap: ${vm(16)};
    `}
`

const KolAvatar = styled.div`
  flex-shrink: 0;
`

const KolContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      gap: ${vm(12)};
    `}
`

const KolName = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(20)};
      line-height: ${vm(28)};
    `}
`

const KolDescription = styled.p<{ $isExpanded: boolean }>`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme, $isExpanded }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
      display: -webkit-box;
      -webkit-line-clamp: ${$isExpanded ? 'unset' : '2'};
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    `}
`

const ShowMoreButton = styled(BaseButton)`
  width: fit-content;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.blue100};
  padding: 0;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;

  .icon-chat-expand {
    font-size: 12px;
    transition: transform 0.2s ease;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      line-height: ${vm(20)};
      gap: ${vm(4)};
      margin-top: ${vm(4)};
      align-self: center;

      .icon-chat-expand {
        font-size: ${vm(12)};
      }
    `}
`

export default memo(function KolAgentList({ initialTag, filterType }: KolAgentListProps) {
  const [currentKolInfo, setCurrentKolInfo] = useCurrentKolInfo()
  const isMobile = useIsMobile()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const handleBack = () => {
    setCurrentKolInfo(null)
  }

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  // 检查文本是否超过2行
  useEffect(() => {
    if (isMobile && descriptionRef.current && currentKolInfo?.description) {
      const element = descriptionRef.current
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight)
      const height = element.scrollHeight
      const maxHeight = lineHeight * 2

      setShouldShowMoreButton(height > maxHeight)
    } else {
      setShouldShowMoreButton(false)
    }
  }, [isMobile, currentKolInfo?.description])

  return (
    <AgentListWrapper>
      <BackButton onClick={handleBack}>
        <IconBase className='icon-chat-back' />
        {!isMobile && <Trans>{filterType}</Trans>}
      </BackButton>

      {currentKolInfo && (
        <KolInfoWrapper>
          <KolAvatar>
            <Avatar name={currentKolInfo.name} avatar={currentKolInfo.avatar} size={isMobile ? 60 : 80} />
          </KolAvatar>
          <KolContent>
            <KolName>{currentKolInfo.name}</KolName>
            {currentKolInfo.description && (
              <>
                <KolDescription ref={descriptionRef} $isExpanded={isDescriptionExpanded}>
                  {currentKolInfo.description}
                </KolDescription>
                {isMobile && shouldShowMoreButton && (
                  <ShowMoreButton onClick={toggleDescription}>
                    <Trans>{isDescriptionExpanded ? 'Show less' : 'Show more'}</Trans>
                    <IconBase
                      className='icon-chat-expand'
                      style={{
                        transform: isDescriptionExpanded ? 'rotate(-90deg)' : 'rotate(90deg)',
                      }}
                    />
                  </ShowMoreButton>
                )}
              </>
            )}
          </KolContent>
        </KolInfoWrapper>
      )}

      <AgentTableListPage initialTag={initialTag} filterType={filterType} />
    </AgentListWrapper>
  )
})
