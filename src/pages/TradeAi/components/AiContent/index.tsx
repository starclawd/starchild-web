import styled, { css } from 'styled-components'
import { isTradeCommandResponse, useAiResponseContentList, useGetAiBotChatContents, useInputValue, useIsAnalyzeContent, useIsFocus, useIsLoadingData, useIsRenderingData, useTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import DefalutUi from '../DefalutUi'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import usePrevious from 'hooks/usePrevious'
import { useIsLogin, useLoginStatus } from 'store/login/hooks'
import ContentItemCom from '../ContentItem'
import LoadingBar from '../LoadingBar'
import { LOGIN_STATUS } from 'store/login/login.d'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'

const AiContentWrapper = styled.div<{ $isShowDefaultUi: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 这个是 flex 下自动滚动的关键，flex 元素默认的 min-height 是 auto, 需要设置为 0 才能自动滚动 */
  min-height: 0;
  flex: 1;
  ${({ theme, $isShowDefaultUi }) => theme.isMobile && css`
    padding: ${vm(8)} 0 0;
    ${!$isShowDefaultUi && css`
      padding: ${vm(8)} ${vm(12)} 0;
    `}
  `}
`

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  ${({ theme }) => theme.isMobile && css`
    overflow: auto;
  `}
`

export default memo(function AiContent() {
  const [isFocus] = useIsFocus()
  const [value] = useInputValue()
  const isLogin = useIsLogin()
  const isMobile = useIsMobile()
  const [loginStatus] = useLoginStatus()
  const [threadList, setThreadsList] = useThreadsList()
  const [, setCurrentAiThreadId] = useCurrentAiThreadId()
  const preIsLogin = usePrevious(isLogin)
  const contentInnerRef = useRef<HTMLDivElement>(null)
  const [currentAiThreadId] = useCurrentAiThreadId()
  const preCurrentAiThreadId = usePrevious(currentAiThreadId)
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const tempAiContentData = useTempAiContentData()
  const [isRenderingData] = useIsRenderingData()
  const [isLoading] = useIsLoadingData()
  const [isAnalyzeContent] = useIsAnalyzeContent()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const isShowDefaultUi = useMemo(() => {
    return aiResponseContentList.length === 0 && !tempAiContentData.id && threadList.length === 0 && !(isLoading && !isRenderingData)
  }, [aiResponseContentList.length, tempAiContentData.id, threadList.length, isLoading, isRenderingData])
  const lastCommandIndex = useMemo(() => {
    return aiResponseContentList.findLastIndex((data) => {
      const { content } = data
      return isTradeCommandResponse(content)
    })
  }, [aiResponseContentList])

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
    if (currentAiThreadId) {
      triggerGetAiBotChatContents(currentAiThreadId)
    }
  }, [currentAiThreadId, triggerGetAiBotChatContents])

  useEffect(() => {
    if (!currentAiThreadId && preCurrentAiThreadId) {
      setAiResponseContentList([])
    }
  }, [currentAiThreadId, preCurrentAiThreadId, setAiResponseContentList])
  
  useEffect(() => {
    if (preIsLogin && !isLogin) {
      setThreadsList([])
      setCurrentAiThreadId('')
    }
  }, [preIsLogin, isLogin, setThreadsList, setCurrentAiThreadId])
  useEffect(() => {
    if (loginStatus === LOGIN_STATUS.NO_LOGIN && aiResponseContentList.length === 0 && !tempAiContentData.id) {
      setCurrentAiThreadId('')
    }
  }, [loginStatus, aiResponseContentList, tempAiContentData, setCurrentAiThreadId])

  return <AiContentWrapper $isShowDefaultUi={isShowDefaultUi} className="ai-content-wrapper">
    <ContentInner ref={contentInnerRef as any} className={isMobile ? '' : 'scroll-style'}>
      {aiResponseContentList.map((data) => <ContentItemCom contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} key={`${data.id}-${data.role}`} data={data} />)}
      {tempAiContentData.id ? [tempAiContentData].map((data) => <ContentItemCom contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} isTempAiContent={true} key={`${data.id}-${data.role}`} data={data} />) : null}
      {/* loading中，并且不在渲染数据的情况下显示 loadingBar */}
      {isAnalyzeContent && <LoadingBar contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} />}
      {isShowDefaultUi && <DefalutUi />}
    </ContentInner>
  </AiContentWrapper>
})
