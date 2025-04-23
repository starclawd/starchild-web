import copy from 'copy-to-clipboard'
import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { Dispatch, memo, SetStateAction, useCallback, useMemo, useState } from 'react'
import { useAiResponseContentList, useDeleteContent, useDislikeContent, useGetAiBotChatContents, useLikeContent, useSendAiContent } from 'store/tradeai/hooks'
import { ROLE_TYPE, TempAiContentDataType } from 'store/tradeai/tradeai.d'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper';
import DislikeModal from './components/DislikeModal';
import { ApplicationModal } from 'store/application/application.d';
import { useDislikeModalToggle, useModalOpen } from 'store/application/hooks';
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { Trans } from '@lingui/react/macro'

const FeedbackWrapper = styled.div`
  position: absolute;
  left: 0;
  display: none;
  gap: 0;
  align-items: flex-start;
  flex-direction: column;
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
  ${({ theme }) => theme.isMobile && css`
    position: relative;
    bottom: 0;
    width: 100%;
    display: flex;
    align-items: flex-end;
  `}
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
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const IconWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  color: ${({ theme }) => theme.textL1};
  .icon-chat-like-fill {
    color: ${({ theme }) => theme.jade10};
  }
  .icon-chat-dislike-fill {
    color: ${({ theme }) => theme.ruby50};
  }
  ${({ theme }) => theme.isMobile && css`
    min-width: ${vm(32)};
    height: ${vm(32)};
    gap: ${vm(4)};
    padding: ${vm(7)};
    i {
      font-size: 0.18rem;
      color: ${theme.textL2};
    }
    span {
      font-size: .12rem;
      font-weight: 400;
      line-height: .18rem;
      color: ${theme.ruby50};
    }
  `}
`

const Feedback = memo(function Feedback({
  data,
}: {
  data: TempAiContentDataType
}) {
  const theme = useTheme()
  const sendAiContent = useSendAiContent()
  const { id, content, feedback } = data
  const [currentAiThreadId] = useCurrentAiThreadId()
  const triggerDeleteContent = useDeleteContent()
  const triggerLikeContent = useLikeContent()
  const toggleDislikeModal = useDislikeModalToggle()
  const dislikeModalOpen = useModalOpen(ApplicationModal.DISLIKE_MODAL)
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isRefreshLoading, setIsRefreshLoading] = useState(false)
  const [isInputDislikeContentLoading, setIsInputDislikeContentLoading] = useState(false)
  const [aiResponseContentList] = useAiResponseContentList()
  const isGoodFeedback = useMemo(() => feedback === 'good', [feedback])
  const isBadFeedback = useMemo(() => feedback === 'bad', [feedback])
  const copyContent = useCallback(() => {
    copy(content)
  }, [content])
  const likeContent = useCallback(async () => {
    if (isLikeLoading || isGoodFeedback || isInputDislikeContentLoading || isRefreshLoading) return
    try {
      setIsLikeLoading(true)
      await triggerLikeContent(id)
      await triggerGetAiBotChatContents(currentAiThreadId)
      setIsLikeLoading(false)
    } catch (error) {
      setIsLikeLoading(false)
    }
  }, [id, isLikeLoading, currentAiThreadId, isGoodFeedback, isInputDislikeContentLoading, isRefreshLoading, triggerLikeContent, triggerGetAiBotChatContents])
  const dislikeContent = useCallback(() => {
    if (isBadFeedback) return
    toggleDislikeModal()
  }, [isBadFeedback, toggleDislikeModal])
  const refreshContent = useCallback(async () => {
    if (isRefreshLoading || isInputDislikeContentLoading || isLikeLoading) return
    setIsRefreshLoading(true)
    await triggerDeleteContent(id)
    const currentIndex = aiResponseContentList.findIndex(item => item.id === id && item.role === ROLE_TYPE.ASSISTANT)
    const nextAiResponseContentList = aiResponseContentList.filter(item => item.id !== id)
    if (currentIndex > 0) {
      const prevContent = aiResponseContentList[currentIndex - 1].content
      await sendAiContent({
        value: prevContent,
        nextAiResponseContentList,
      })
    }
    setIsRefreshLoading(false)
  }, [id, isRefreshLoading, aiResponseContentList, isInputDislikeContentLoading, isLikeLoading, triggerDeleteContent, sendAiContent])
  return (
    <FeedbackWrapper className="feedback-wrapper">
      <OperatorContent>
        <LeftWrapper>
          {/* <IconWrapper
            $borderRadius={16}
            $borderColor={theme.bgT30}
          >
            <IconBase onClick={likeContent} className="icon-chat-share"/>
          </IconWrapper> */}
          <IconWrapper
            $borderRadius={16}
            $borderColor={theme.bgT30}
          >
            <IconBase onClick={copyContent} className="icon-chat-copy"/>
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
          <IconWrapper
            $borderRadius={16}
            $borderColor={theme.bgT30}
            onClick={refreshContent}
          >
            <IconBase className="icon-chat-refresh"/>
          </IconWrapper>
        </LeftWrapper>
      </OperatorContent>
      {dislikeModalOpen && <DislikeModal />}
    </FeedbackWrapper>
  )
})

export default Feedback
