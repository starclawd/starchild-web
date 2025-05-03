import styled, { css } from 'styled-components'
import { useAddNewThread, useAiResponseContentList, useGetAiBotChatContents, useIsAnalyzeContent, useIsShowDefaultUi, useTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import DefalutUi from '../DefalutUi'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import usePrevious from 'hooks/usePrevious'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import ContentItemCom from '../ContentItem'
import LoadingBar from '../LoadingBar'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'

const AiContentWrapper = styled.div<{ $isShowDefaultUi: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 这个是 flex 下自动滚动的关键，flex 元素默认的 min-height 是 auto, 需要设置为 0 才能自动滚动 */
  min-height: 0;
  flex: 1;
  ${({ theme, $isShowDefaultUi }) => theme.isMobile
  ? css`
    padding: ${vm(8)} 0 0;
    ${!$isShowDefaultUi && css`
      padding: ${vm(8)} ${vm(12)} 0;
    `}
  ` : css`
    ${$isShowDefaultUi && css`
      flex: 0;
      min-height: unset;
    `}
  `}
`

const NewThread = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 68px;
  padding: 0 12px;
`

const NewWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  gap: 8px;
  padding: 0 18px;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  cursor: pointer;
  color: ${({ theme }) => theme.textL1};
  border: 1px solid ${({ theme }) => theme.bgT30};
  border-radius: 44px;
  .icon-chat-new {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`


const ContentInner = styled.div<{ $isShowDefaultUi: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  flex-grow: 1;
  ${({ theme, $isShowDefaultUi }) => theme.isMobile
  ? css`
    overflow: auto;
  `
  : css`
    ${$isShowDefaultUi && css`
      overflow: hidden !important;
    `}
  `}
`

export default memo(function AiContent() {
  const isMobile = useIsMobile()
  const isLogout = useIsLogout()
  const isShowDefaultUi = useIsShowDefaultUi()
  const addNewThread = useAddNewThread()
  const [{ evmAddress }] = useUserInfo()
  const contentInnerRef = useRef<HTMLDivElement>(null)
  const [currentAiThreadId] = useCurrentAiThreadId()
  const preCurrentAiThreadId = usePrevious(currentAiThreadId)
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const tempAiContentData = useTempAiContentData()
  const [isAnalyzeContent] = useIsAnalyzeContent()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const handleScroll = useCallback(() => {
    if (!contentInnerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentInnerRef.current
    // 如果用户向上滚动超过20px，则停止自动滚动
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10
    setShouldAutoScroll(isAtBottom)
  }, [])

  const scrollToBottom = useCallback(() => {
    if (contentInnerRef.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        contentInnerRef.current?.scrollTo(0, contentInnerRef.current.scrollHeight)
      })
    }
  }, [contentInnerRef, shouldAutoScroll])

  useEffect(() => {
    const contentInner = contentInnerRef.current
    if (contentInner) {
      contentInner.addEventListener('scroll', handleScroll)
      return () => contentInner.removeEventListener('scroll', handleScroll)
    }
    return
  }, [handleScroll])

  useEffect(() => {
    if (aiResponseContentList || tempAiContentData) {
      scrollToBottom()
    }
  }, [tempAiContentData, aiResponseContentList, scrollToBottom])

  useEffect(() => {
    if (currentAiThreadId && evmAddress) {
      triggerGetAiBotChatContents({
        threadId: currentAiThreadId,
        evmAddress,
      })
    }
  }, [currentAiThreadId, triggerGetAiBotChatContents, evmAddress])

  useEffect(() => {
    if (!currentAiThreadId && preCurrentAiThreadId) {
      setAiResponseContentList([])
    }
  }, [currentAiThreadId, preCurrentAiThreadId, setAiResponseContentList])

  useEffect(() => {
    if (isLogout) {
      setAiResponseContentList([])
    }
  }, [isLogout, setAiResponseContentList])
  return <AiContentWrapper $isShowDefaultUi={isShowDefaultUi} className="ai-content-wrapper">
    {!isMobile && !isShowDefaultUi && <NewThread>
      <span></span>
      <NewWrapper onClick={addNewThread}>
        <IconBase className="icon-chat-new" />
        <span>New</span>
      </NewWrapper>
    </NewThread>}
    <ContentInner id="aiContentInnerEl" $isShowDefaultUi={isShowDefaultUi} ref={contentInnerRef as any} className="scroll-style">
      {aiResponseContentList.map((data) => <ContentItemCom key={`${data.id || data.timestamp}-${data.role}`} data={data} />)}
      {(tempAiContentData.id && !isAnalyzeContent) ? [tempAiContentData].map((data) => <ContentItemCom key={`${data.id}-${data.role}`} data={data} />) : null}
      {/* loading中，并且不在渲染数据的情况下显示 loadingBar */}
      {isAnalyzeContent && <LoadingBar contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} />}
      {isShowDefaultUi && <DefalutUi />}
    </ContentInner>
  </AiContentWrapper>
})
