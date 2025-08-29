import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { memo, RefObject, useCallback, useMemo, useState } from 'react'
import {
  useAiResponseContentList,
  useCurrentAiContentDeepThinkData,
  useDeleteContent,
  useGetAiBotChatContents,
  useIsShowDeepThink,
  useIsShowDeepThinkSources,
  useLikeContent,
  useSendAiContent,
} from 'store/chat/hooks'
import { ROLE_TYPE, TempAiContentDataType } from 'store/chat/chat.d'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import DislikeModal from './components/DislikeModal'
import { ApplicationModal } from 'store/application/application.d'
import { useDislikeModalToggle, useModalOpen } from 'store/application/hooks'
import { useTheme } from 'store/themecache/hooks'
import { useUserInfo } from 'store/login/hooks'
import TestChatImg from '../TestChatImg'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { isLocalEnv } from 'utils/url'
import useCopyContent from 'hooks/useCopyContent'
import { Trans } from '@lingui/react/macro'

const FeedbackWrapper = styled.div`
  position: relative;
  bottom: 0;
  width: 100%;
  align-items: flex-end;
  .icon-copy {
    cursor: pointer;
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
  }
  .transition-wrapper {
    width: 100%;
  }
  .icon-ai-like,
  .icon-ai-dislike,
  .icon-ai-refresh {
    cursor: pointer;
    path {
      transition: all ${ANI_DURATION}s;
    }
  }
`

const OperatorContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

const LeftWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL2};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  min-width: 32px;
  height: 32px;
  padding: 0 7px;
  border-radius: 44px;
  transition: all ${ANI_DURATION}s;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.ruby50};
  }
  .icon-chat-like-fill {
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-dislike-fill {
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          min-width: ${vm(32)};
          height: ${vm(32)};
          padding: 0 ${vm(7)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          border-radius: ${vm(44)};
          i {
            font-size: 0.18rem;
          }
          span {
            font-size: 0.12rem;
            font-weight: 400;
            line-height: 0.18rem;
          }
          &:active {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `}
`

const Feedback = memo(function Feedback({
  data,
  responseContentRef,
}: {
  data: TempAiContentDataType
  responseContentRef?: RefObject<HTMLDivElement>
}) {
  const theme = useTheme()
  const sendAiContent = useSendAiContent()
  const { id, feedback } = data
  const [{ telegramUserId }] = useUserInfo()
  const { testChartImg } = useParsedQueryString()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteContent = useDeleteContent()
  const triggerLikeContent = useLikeContent()
  const toggleDislikeModal = useDislikeModalToggle()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [, setIsShowDeepThinkSources] = useIsShowDeepThinkSources()
  const dislikeModalOpen = useModalOpen(ApplicationModal.DISLIKE_MODAL)
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isRefreshLoading, setIsRefreshLoading] = useState(false)
  const [, setCurrentAiContentDeepThinkData] = useCurrentAiContentDeepThinkData()
  const [isInputDislikeContentLoading, setIsInputDislikeContentLoading] = useState(false)
  const [aiResponseContentList] = useAiResponseContentList()
  const isGoodFeedback = useMemo(() => feedback === 'good', [feedback])
  const isBadFeedback = useMemo(() => feedback === 'bad', [feedback])
  const { copyFromElement } = useCopyContent({ mode: 'element' })
  const copyContent = useCallback(() => {
    if (responseContentRef?.current) {
      copyFromElement(responseContentRef.current)
    }
  }, [copyFromElement, responseContentRef])
  const likeContent = useCallback(async () => {
    if (isLikeLoading || isGoodFeedback || isInputDislikeContentLoading || isRefreshLoading) return
    try {
      setIsLikeLoading(true)
      await triggerLikeContent(id)
      await triggerGetAiBotChatContents({
        threadId: currentAiThreadId,
        telegramUserId,
      })
      setIsLikeLoading(false)
    } catch (error) {
      setIsLikeLoading(false)
    }
  }, [
    id,
    telegramUserId,
    isLikeLoading,
    currentAiThreadId,
    isGoodFeedback,
    isInputDislikeContentLoading,
    isRefreshLoading,
    triggerLikeContent,
    triggerGetAiBotChatContents,
  ])
  const dislikeContent = useCallback(() => {
    if (isBadFeedback) return
    toggleDislikeModal()
  }, [isBadFeedback, toggleDislikeModal])
  const refreshContent = useCallback(async () => {
    if (isRefreshLoading || isInputDislikeContentLoading || isLikeLoading) return
    setIsRefreshLoading(true)
    const data = await triggerDeleteContent(id)
    if ((data as any).isSuccess) {
      const currentIndex = aiResponseContentList.findIndex(
        (item) => item.id === id && item.role === ROLE_TYPE.ASSISTANT,
      )
      if (currentIndex > 0) {
        const nextAiResponseContentList = aiResponseContentList.filter(
          (item, index) => item.id !== id && index !== currentIndex - 1,
        )
        const prevContent = aiResponseContentList[currentIndex - 1].content
        await sendAiContent({
          value: prevContent,
          nextAiResponseContentList,
        })
      }
      setIsRefreshLoading(false)
    }
  }, [
    id,
    isRefreshLoading,
    aiResponseContentList,
    isInputDislikeContentLoading,
    isLikeLoading,
    triggerDeleteContent,
    sendAiContent,
  ])
  const showDeepThink = useCallback(() => {
    setIsShowDeepThinkSources(true)
    setCurrentAiContentDeepThinkData(data)
    setIsShowDeepThink(true)
  }, [data, setCurrentAiContentDeepThinkData, setIsShowDeepThink, setIsShowDeepThinkSources])
  return (
    <FeedbackWrapper className='feedback-wrapper'>
      <OperatorContent>
        <LeftWrapper>
          {/* <IconWrapper
            $borderRadius={16}
            $borderColor={theme.bgT30}
          >
            <IconBase onClick={likeContent} className="icon-chat-share"/>
          </IconWrapper> */}
          <IconWrapper onClick={copyContent}>
            <IconBase className='icon-chat-copy' />
          </IconWrapper>
          {/* {!isBadFeedback && <IconWrapper
            $borderRadius={16}
            $borderColor={theme.bgT30}
          >
            <IconBase onClick={likeContent} className={!isGoodFeedback ? 'icon-chat-like' : 'icon-chat-like-fill'}/>
          </IconWrapper>} */}
          {/* {!isGoodFeedback && <IconWrapper
            $borderRadius={16} 
            $borderColor={theme.bgT30}
            onClick={dislikeContent}
          >
            <IconBase className={!isBadFeedback ? 'icon-chat-dislike' : 'icon-chat-dislike-fill'}/>
            {isBadFeedback && <span><Trans>XXXXXX</Trans></span>}
          </IconWrapper>} */}
          <IconWrapper onClick={refreshContent}>
            <IconBase className='icon-chat-refresh' />
          </IconWrapper>
          <IconWrapper onClick={showDeepThink}>
            <Trans>Sources</Trans>
          </IconWrapper>

          {testChartImg && isLocalEnv && <TestChatImg data={data} />}
        </LeftWrapper>
      </OperatorContent>
      {dislikeModalOpen && <DislikeModal />}
    </FeedbackWrapper>
  )
})

export default Feedback
