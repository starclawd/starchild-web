import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import NoData from 'components/NoData'
import Pending from 'components/Pending'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { ROUTER } from 'pages/router'
import { useCallback, useEffect, useState } from 'react'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { useChatRecommendationList, useGetChatRecommendations, useSendAiContent } from 'store/chat/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const RecommendationOutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 28px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(28)};
    `}
`
const RecommendationsWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
    `}
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
        ? css`
            span:first-child {
              font-size: 0.14rem;
              line-height: 0.2rem;
            }
            span:last-child {
              .icon-chat-refresh {
                font-size: 0.18rem;
              }
            }
          `
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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 0;
    `}
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
      ? css`
          gap: ${vm(6)};
          padding: ${vm(8)};
          border-radius: ${vm(8)};
          .icon-think {
            font-size: 0.18rem;
          }
          .icon-chat-back {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.13rem;
            line-height: 0.2rem;
          }
          &:hover {
      `
      : css`
          cursor: pointer;
        `}
`

const MoreUseCases = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  letter-spacing: 0.42px;
  background: linear-gradient(270deg, #59b0fe 0%, #26fefe 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  cursor: pointer;
  .icon-chat-back {
    font-size: 18px;
    transform: rotate(180deg);
    background: linear-gradient(270deg, #59b0fe 0%, #26fefe 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  &:hover {
    opacity: 0.7;
  }
  transition: all ${ANI_DURATION}s;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
      .icon-chat-back {
        font-size: 0.18rem;
      }
    `}
`

export default function Recommendations() {
  const sendAiContent = useSendAiContent()
  const isMobile = useIsMobile()
  const [, setCurrentRouter] = useCurrentRouter()
  const [isInitLoading, setIsInitLoading] = useState(true)
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
  const initLoading = useCallback(async () => {
    try {
      setIsInitLoading(true)
      await triggerGetChatRecommendations()
    } catch (error) {
      console.error(error)
    } finally {
      setIsInitLoading(false)
    }
  }, [triggerGetChatRecommendations])
  const goUseCasesPage = useCallback(() => {
    setCurrentRouter(ROUTER.USE_CASES)
  }, [setCurrentRouter])
  useEffect(() => {
    initLoading()
  }, [initLoading])
  return (
    <RecommendationOutWrapper>
      <RecommendationsWrapper id='recommendationsWrapper' $borderColor={theme.bgT20} $borderRadius={12}>
        <TitleWrapper $isLoading={isLoading}>
          <span>
            <Trans>Daily recommendations</Trans>
          </span>
          <span onClick={showAnotherSet}>
            <IconBase className='icon-chat-refresh' />
            {!isMobile && <Trans>Refresh</Trans>}
          </span>
        </TitleWrapper>
        <RecommendationsListWrapper>
          {chatRecommendationList.length > 0 ? (
            chatRecommendationList.map((recommendation) => (
              <RecommendationItem
                onClick={() => sendAiContent({ value: recommendation.full_text })}
                key={recommendation.id}
              >
                <IconBase className='icon-think' />
                <span>{recommendation.full_text}</span>
                <IconBase className='icon-chat-back' />
              </RecommendationItem>
            ))
          ) : isInitLoading ? (
            <Pending isFetching />
          ) : (
            <NoData />
          )}
        </RecommendationsListWrapper>
      </RecommendationsWrapper>
      <MoreUseCases onClick={goUseCasesPage}>
        <span>
          <Trans>More use cases</Trans>
        </span>
        <IconBase className='icon-chat-back' />
      </MoreUseCases>
    </RecommendationOutWrapper>
  )
}
