import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import NoData from 'components/NoData'
import { ANI_DURATION } from 'constants/index'
import { useCallback, useEffect, useState } from 'react'
import { useChatRecommendationList, useGetChatRecommendations, useSendAiContent } from 'store/chat/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const RecommendationsWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
`

const TitleWrapper = styled.div<{ $isLoading: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 32px;
  span:first-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 0 8px;
    gap: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    border-radius: 32px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.textL3};
    .icon-chat-refresh {
      font-size: 18px;
    }
    ${({ theme }) =>
      theme.isMobile
        ? css``
        : css`
            cursor: pointer;
            &:hover {
              color: ${({ theme }) => theme.textL1};
              background-color: ${({ theme }) => theme.bgT20};
            }
          `}
  }

  ${({ $isLoading }) =>
    $isLoading &&
    css`
      span:last-child {
        cursor: not-allowed;
        .icon-chat-refresh {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      }
    `}
`

const RecommendationsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 8px;
`

const RecommendationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  gap: 6px;
  padding: 8px;
  border-radius: 8px;
  transition: all ${ANI_DURATION}s;
  .icon-think {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  .icon-chat-back {
    transition: all ${ANI_DURATION}s;
    opacity: 0;
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
    transform: rotate(180deg);
  }
  span {
    flex-grow: 1;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: left;
    color: ${({ theme }) => theme.textL3};
  }
  &:hover {
    .icon-chat-back {
      opacity: 1;
    }
    background-color: ${({ theme }) => theme.bgT20};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css``
      : css`
          cursor: pointer;
        `}
`

export default function Recommendations() {
  const sendAiContent = useSendAiContent()
  const [isLoading, setIsLoading] = useState(false)
  const triggerGetChatRecommendations = useGetChatRecommendations()
  const [chatRecommendationList] = useChatRecommendationList()
  const theme = useTheme()
  const showAnotherSet = useCallback(async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await triggerGetChatRecommendations()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, triggerGetChatRecommendations])
  useEffect(() => {
    triggerGetChatRecommendations()
  }, [triggerGetChatRecommendations])
  return (
    <RecommendationsWrapper $borderColor={theme.bgT20} $borderRadius={12}>
      <TitleWrapper $isLoading={isLoading}>
        <span>
          <Trans>Daily recommendations</Trans>
        </span>
        <span onClick={showAnotherSet}>
          <IconBase className='icon-chat-refresh' />
          <Trans>Show another set</Trans>
        </span>
      </TitleWrapper>
      <RecommendationsListWrapper>
        {chatRecommendationList.length > 0 ? (
          chatRecommendationList.map((recommendation) => (
            <RecommendationItem
              onClick={() => sendAiContent({ value: recommendation.display_text })}
              key={recommendation.id}
            >
              <IconBase className='icon-think' />
              <span>{recommendation.display_text}</span>
              <IconBase className='icon-chat-back' />
            </RecommendationItem>
          ))
        ) : (
          <NoData />
        )}
      </RecommendationsListWrapper>
    </RecommendationsWrapper>
  )
}
