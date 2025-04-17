import styled from 'styled-components'
import { isTradeCommandResponse, useAiResponseContentList, useGetAiBotChatContents, useInputValue, useIsFocus, useIsLoadingData, useIsRenderingData, useTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'
import DefalutUi from '../DefalutUi'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import usePrevious from 'hooks/usePrevious'
import { useIsLogin, useLoginStatus } from 'store/login/hooks'
import ContentItemCom from '../ContentItem'
import LoadingBar from '../LoadingBar'
import { LOGIN_STATUS } from 'store/login/login.d'

const AiContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 这个是 flex 下自动滚动的关键，flex 元素默认的 min-height 是 auto, 需要设置为 0 才能自动滚动 */
  min-height: 0;
  flex: 1;
`

const ContentInner = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
`

export default memo(function AiContent({
  height,
  tradeAiTypeProp
}: {
  height?: number
  tradeAiTypeProp: TRADE_AI_TYPE
}) {
  const [isFocus] = useIsFocus()
  const [value] = useInputValue()
  const isLogin = useIsLogin()
  const [loginStatus] = useLoginStatus()
  const [, setThreadsList] = useThreadsList()
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  const isShowDefaultUi = useMemo(() => {
    return aiResponseContentList.length === 0 && !tempAiContentData.id
  }, [aiResponseContentList.length, tempAiContentData.id])
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

  return <AiContentWrapper className="ai-content-wrapper">
    <ContentInner ref={contentInnerRef as any} className="scroll-style">
      {aiResponseContentList.map((data, index) => <ContentItemCom contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} index={index} lastCommandIndex={lastCommandIndex} tradeAiTypeProp={tradeAiTypeProp} key={`${data.id}-${data.role}`} data={data} />)}
      {tempAiContentData.id ? [tempAiContentData].map((data) => <ContentItemCom contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} isTempAiContent={true} index={aiResponseContentList.length} lastCommandIndex={lastCommandIndex} tradeAiTypeProp={tradeAiTypeProp} key={`${data.id}-${data.role}`} data={data} />) : null}
      {/* loading中，并且不在渲染数据的情况下显示 loadingBar */}
      {isLoading && <LoadingBar tradeAiTypeProp={tradeAiTypeProp} isLoading={isLoading} contentInnerRef={contentInnerRef as any} shouldAutoScroll={shouldAutoScroll} />}
      {isShowDefaultUi && !(isLoading && !isRenderingData) && <DefalutUi />}
    </ContentInner>
  </AiContentWrapper>
})
