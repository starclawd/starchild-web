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
  useChatFeedback,
  useSendAiContent,
} from 'store/chat/hooks'
import { ROLE_TYPE, TempAiContentDataType } from 'store/chat/chat.d'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import DislikeModal from './components/DislikeModal'
import { useTheme } from 'store/themecache/hooks'
import { useUserInfo } from 'store/login/hooks'
import TestChatImg from '../TestChatImg'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { isLocalEnv } from 'utils/url'
import useCopyContent from 'hooks/useCopyContent'
import { Trans } from '@lingui/react/macro'
import FaviconList from './components/FaviconList'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'

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

const RightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const IconWrapper = styled.div<{ $isBadFeedback?: boolean; $isGoodFeedback?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.black100};
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
    color: ${({ theme }) => theme.black100};
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
  &.icon-wrapper-sources {
    gap: 6px;
  }
  &.get-k-chart {
    background-color: ${({ theme }) => theme.brand100};
  }
  ${({ theme, $isGoodFeedback, $isBadFeedback }) =>
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
            background-color: ${({ theme }) => theme.black600};
          }
          &.icon-wrapper-sources {
            gap: ${vm(6)};
          }
        `
      : css`
          cursor: pointer;
          ${!$isGoodFeedback && !$isBadFeedback
            ? css`
                &:not(.get-k-chart):hover {
                  background-color: ${({ theme }) => theme.black600};
                }
              `
            : css`
                cursor: not-allowed;
              `}
        `}
  ${({ theme, $isBadFeedback }) =>
    $isBadFeedback &&
    css`
      gap: 4px;
      border: 1px solid ${theme.black600};
      border-radius: 32px;
      i {
        color: ${theme.red100};
      }
      span {
        color: ${theme.red100};
      }
      ${theme.isMobile &&
      css`
        gap: ${vm(4)};
        border-radius: ${vm(32)};
      `}
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
  const toast = useToast()
  const sendAiContent = useSendAiContent()
  const { id, feedback, content } = data
  const { testChartImg } = useParsedQueryString()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteContent = useDeleteContent()
  const triggerChatFeedback = useChatFeedback()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [, setIsShowDeepThinkSources] = useIsShowDeepThinkSources()
  const [isShowDislikeModal, setIsShowDislikeModal] = useState(false)
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isRefreshLoading, setIsRefreshLoading] = useState(false)
  const [, setCurrentAiContentDeepThinkData] = useCurrentAiContentDeepThinkData()
  const [isInputDislikeContentLoading, setIsInputDislikeContentLoading] = useState(false)
  const [aiResponseContentList] = useAiResponseContentList()
  const isGoodFeedback = useMemo(() => feedback?.feedback_type === 'like', [feedback])
  const isBadFeedback = useMemo(() => feedback?.feedback_type === 'dislike', [feedback])
  const { copyFromElement } = useCopyContent({ mode: 'element' })
  const disliseReasonMap = useMemo(() => {
    const dislikeReason = feedback?.extra_data?.dislike_reason
    const data = {
      Inaccurate: <Trans>Inaccurate</Trans>,
      Offensive: <Trans>Offensive</Trans>,
      Useless: <Trans>Useless</Trans>,
    }
    return data[dislikeReason as keyof typeof data] || <Trans>Other</Trans>
  }, [feedback])
  const copyContent = useCallback(() => {
    if (responseContentRef?.current) {
      copyFromElement(responseContentRef.current)
    }
  }, [copyFromElement, responseContentRef])
  const likeContent = useCallback(async () => {
    if (isLikeLoading || isGoodFeedback || isInputDislikeContentLoading || isRefreshLoading) return
    try {
      setIsLikeLoading(true)
      await triggerChatFeedback({
        chatId: currentAiThreadId,
        messageId: id,
        feedbackType: 'like',
        dislikeReason: '',
        originalMessage: content,
      })
      await triggerGetAiBotChatContents({
        threadId: currentAiThreadId,
      })
      setIsLikeLoading(false)
      toast({
        title: <Trans>Feedback Received</Trans>,
        description: (
          <Trans>
            Thank you for your feedback. We've received your submission and will use it to improve our service.
          </Trans>
        ),
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-feedback',
        iconTheme: theme.black0,
      })
    } catch (error) {
      setIsLikeLoading(false)
    }
  }, [
    id,
    content,
    isLikeLoading,
    currentAiThreadId,
    isGoodFeedback,
    isInputDislikeContentLoading,
    isRefreshLoading,
    theme.black0,
    toast,
    triggerChatFeedback,
    triggerGetAiBotChatContents,
  ])
  const dislikeContent = useCallback(() => {
    if (isBadFeedback) return
    setIsShowDislikeModal(true)
  }, [isBadFeedback])
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
            $borderColor={theme.black600}
          >
            <IconBase onClick={likeContent} className="icon-chat-share"/>
          </IconWrapper> */}
          {/* <IconWrapper className='get-k-chart' onClick={getKChart}>
            <IconBase className='icon-backtest' />
            <Trans>Get K-Chart</Trans>
          </IconWrapper> */}
          <IconWrapper onClick={copyContent}>
            <IconBase className='icon-copy' />
          </IconWrapper>
          {!isBadFeedback && (
            <IconWrapper $isGoodFeedback={isGoodFeedback}>
              {isLikeLoading ? (
                <Pending />
              ) : (
                <IconBase
                  onClick={likeContent}
                  className={!isGoodFeedback ? 'icon-chat-like' : 'icon-chat-like-fill'}
                />
              )}
            </IconWrapper>
          )}
          {!isGoodFeedback && (
            <IconWrapper $isBadFeedback={isBadFeedback} onClick={dislikeContent}>
              <IconBase className={!isBadFeedback ? 'icon-chat-dislike' : 'icon-chat-dislike-fill'} />
              {isBadFeedback && <span>{disliseReasonMap}</span>}
            </IconWrapper>
          )}
          {data.sourceListDetails.length > 0 && (
            <IconWrapper className='icon-wrapper-sources' onClick={showDeepThink}>
              <FaviconList sourceList={data.sourceListDetails} maxCount={3} />
              <Trans>Sources</Trans>
            </IconWrapper>
          )}
          {testChartImg && isLocalEnv && <TestChatImg data={data} />}
        </LeftWrapper>
        <RightWrapper>
          <IconWrapper onClick={refreshContent}>
            <IconBase className='icon-chat-refresh' />
          </IconWrapper>
        </RightWrapper>
      </OperatorContent>
      {isShowDislikeModal && (
        <DislikeModal
          data={data}
          isShowDislikeModal={isShowDislikeModal}
          setIsShowDislikeModal={setIsShowDislikeModal}
        />
      )}
    </FeedbackWrapper>
  )
})

export default Feedback
