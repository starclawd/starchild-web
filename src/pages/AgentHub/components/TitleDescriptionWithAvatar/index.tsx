import { memo, useState, useRef, useEffect } from 'react'
import { Trans } from '@lingui/react/macro'
import { css, styled } from 'styled-components'
import { BaseButton } from 'components/Button'
import { vm } from 'pages/helper'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'

interface TitleDescriptionWithAvatarProps {
  avatarName: string
  avatar: string | undefined
  title: string
  description: string | undefined
}

const InfoWrapper = styled.div`
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
      margin: ${vm(12)} ${vm(12)} ${vm(0)} ${vm(12)};
      padding: ${vm(8)};
      gap: ${vm(16)};
    `}
`

const AvatarWrapper = styled.div`
  flex-shrink: 0;
`

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
      gap: ${vm(4)};
    `}
`

const TitleText = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 26px;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const DescriptionText = styled.p<{ $isExpanded: boolean; $maxHeight?: number }>`
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme, $isExpanded, $maxHeight }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      max-height: ${$isExpanded ? `${vm($maxHeight || 1000)}` : `${vm(40)}`};
      overflow: hidden;
      transition:
        max-height ${ANI_DURATION}s ease-in-out,
        opacity ${ANI_DURATION}s ease-in-out;
    `}

  /* Fallback for non-mobile or when not using height animation */
  ${({ theme, $isExpanded }) =>
    !theme.isMobile &&
    css`
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

  .icon-chat-expand {
    font-size: 12px;
    transition: transform ${ANI_DURATION}s ease-in-out;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      gap: ${vm(4)};
      align-self: center;

      .icon-chat-expand {
        font-size: 0.14rem;
      }
    `}
`

export default memo(function TitleDescriptionWithAvatar({
  avatarName,
  avatar,
  title,
  description,
}: TitleDescriptionWithAvatarProps) {
  const isMobile = useIsMobile()
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [shouldShowMoreButton, setShouldShowMoreButton] = useState(false)
  const [fullHeight, setFullHeight] = useState(0)
  const descriptionRef = useRef<HTMLParagraphElement>(null)

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded)
  }

  // Check if text exceeds 2 lines and calculate full height
  useEffect(() => {
    if (isMobile && descriptionRef.current && description) {
      const element = descriptionRef.current

      // Temporarily remove height restrictions to measure full content
      const originalMaxHeight = element.style.maxHeight
      const originalWebkitLineClamp = element.style.webkitLineClamp

      element.style.maxHeight = 'none'
      element.style.webkitLineClamp = 'unset'

      const fullContentHeight = element.scrollHeight
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight)
      const twoLinesHeight = lineHeight * 2

      // Restore original styles
      element.style.maxHeight = originalMaxHeight
      element.style.webkitLineClamp = originalWebkitLineClamp

      setFullHeight(fullContentHeight)
      setShouldShowMoreButton(fullContentHeight > twoLinesHeight)
    } else {
      setShouldShowMoreButton(false)
      setFullHeight(0)
    }
  }, [isMobile, description])

  return (
    <InfoWrapper>
      <AvatarWrapper>
        <Avatar name={avatarName} avatar={avatar} size={isMobile ? 60 : 80} />
      </AvatarWrapper>
      <ContentWrapper>
        <TitleText>{title}</TitleText>
        {description && (
          <>
            <DescriptionText ref={descriptionRef} $isExpanded={isDescriptionExpanded} $maxHeight={fullHeight}>
              {description}
            </DescriptionText>
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
      </ContentWrapper>
    </InfoWrapper>
  )
})
