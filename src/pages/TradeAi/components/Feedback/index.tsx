import { Trans } from '@lingui/react/macro'
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

const FeedbackWrapper = styled.div<{ $isInputDislikeContent: boolean }>`
  position: absolute;
  left: 0;
  display: none;
  gap: 0;
  align-items: flex-start;
  flex-direction: column;
  ${({ $isInputDislikeContent }) => $isInputDislikeContent && css`
    position: unset;
    gap: 10px;
  `}
  .icon-copy {
    cursor: pointer;
    color: ${({ theme }) => theme.text4};
    font-size: 18px;
    transition: all ${ANI_DURATION}s;
    &:hover {
      color: ${({ theme }) => theme.green};
    }
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
    &:hover {
      path {
        fill: ${({ theme }) => theme.green};
      }
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

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  color: ${({ theme }) => theme.textL1};
  border: 1px solid ${({ theme }) => theme.bgT30};
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
    border-radius: ${vm(16)};
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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
`

const ButtonCancel = styled.div`
  min-width: 64px;
  width: fit-content;
  height: 28px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`

const ButtonConfirm = styled.div`
  min-width: 64px;
  width: fit-content;
  height: 28px;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  border-radius: 6px;
  padding: 0 12px;
  &:before, &:after {
    border-radius: 6px;
  }
`

const InputDislikeContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  height: 88px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.line1};
`


const Feedback = memo(function Feedback({
  data,
  isInputDislikeContent,
  setIsInputDislikeContent,
}: {
  data: TempAiContentDataType
  isInputDislikeContent: boolean
  setIsInputDislikeContent: Dispatch<SetStateAction<boolean>>
}) {
  const sendAiContent = useSendAiContent()
  const { id, content, feedback } = data
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [dislikeContentValue, setDislikeContentValue] = useState('')
  const triggerDeleteContent = useDeleteContent()
  const triggerLikeContent = useLikeContent()
  const triggerDislikeContent = useDislikeContent()
  const dislikeModalOpen = useModalOpen(ApplicationModal.DISLIKE_MODAL)
  const toggleDislikeModal = useDislikeModalToggle()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const [isLikeLoading, setIsLikeLoading] = useState(false)
  const [isShowInputDislikeContent, setIsShowInputDislikeContent] = useState(false)
  const [isRefreshLoading, setIsRefreshLoading] = useState(false)
  const [isInputDislikeContentLoading, setIsInputDislikeContentLoading] = useState(false)
  const [aiResponseContentList] = useAiResponseContentList()
  const isGoodFeedback = useMemo(() => feedback === 'good', [feedback])
  const isBadFeedback = useMemo(() => feedback === 'bad', [feedback])
  const copyContent = useCallback(() => {
    copy(content)
  }, [content])
  const likeContent = useCallback(async () => {
    if (isLikeLoading || isGoodFeedback || isInputDislikeContentLoading || isRefreshLoading || isInputDislikeContent) return
    try {
      setIsLikeLoading(true)
      await triggerLikeContent(id)
      await triggerGetAiBotChatContents(currentAiThreadId)
      setIsLikeLoading(false)
    } catch (error) {
      setIsLikeLoading(false)
    }
  }, [id, isLikeLoading, currentAiThreadId, isGoodFeedback, isInputDislikeContent, isInputDislikeContentLoading, isRefreshLoading, triggerLikeContent, triggerGetAiBotChatContents])
  const dislikeContent = useCallback(() => {
    if (isBadFeedback) return
    toggleDislikeModal()
  }, [isBadFeedback, toggleDislikeModal])
  const cancelInputDislikeContent = useCallback(() => {
    setIsShowInputDislikeContent(false)
    setTimeout(() => {
      setIsInputDislikeContent(false)
    }, ANI_DURATION * 1000)
  }, [setIsInputDislikeContent])
  const confirmInputDislikeContent = useCallback(async () => {
    if (!dislikeContentValue || isInputDislikeContentLoading || isLikeLoading || isRefreshLoading) return
    try {
      setIsInputDislikeContentLoading(true)
      await triggerDislikeContent(id, dislikeContentValue)
      await triggerGetAiBotChatContents(currentAiThreadId)
      setIsInputDislikeContentLoading(false)
      cancelInputDislikeContent()
    } catch (error) {
      setIsInputDislikeContentLoading(false)
    }
  }, [id, dislikeContentValue, isInputDislikeContentLoading, isRefreshLoading, isLikeLoading, currentAiThreadId, cancelInputDislikeContent, triggerDislikeContent, triggerGetAiBotChatContents])
  const refreshContent = useCallback(async () => {
    if (isRefreshLoading || isInputDislikeContentLoading || isLikeLoading || isInputDislikeContent) return
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
  }, [id, isRefreshLoading, aiResponseContentList, isInputDislikeContentLoading, isLikeLoading, isInputDislikeContent, triggerDeleteContent, sendAiContent])
  return (
    <FeedbackWrapper $isInputDislikeContent={isInputDislikeContent} className="feedback-wrapper">
      <OperatorContent>
        <LeftWrapper>
          {/* <IconWrapper>
            <IconBase onClick={likeContent} className="icon-chat-share"/>
          </IconWrapper> */}
          <IconWrapper>
            <IconBase onClick={copyContent} className="icon-chat-copy"/>
          </IconWrapper>
          {/* {!isBadFeedback && <IconWrapper>
            <IconBase onClick={likeContent} className={!isGoodFeedback ? 'icon-chat-like' : 'icon-chat-like-fill'}/>
          </IconWrapper>} */}
          {/* {!isGoodFeedback && <IconWrapper onClick={dislikeContent}>
            <IconBase className={!isBadFeedback ? 'icon-chat-dislike' : 'icon-chat-dislike-fill'}/>
            {isBadFeedback && <span><Trans>XXXXXX</Trans></span>}
          </IconWrapper>} */}
          <IconWrapper onClick={refreshContent}>
            <IconBase className="icon-chat-refresh"/>
          </IconWrapper>
        </LeftWrapper>
      </OperatorContent>
      {dislikeModalOpen && <DislikeModal />}
    </FeedbackWrapper>
  )
})

export default Feedback
