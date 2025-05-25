import styled, { css } from 'styled-components'
import { useAiResponseContentList, useGetAiBotChatContents, useIsAnalyzeContent, useIsShowDefaultUi, useTempAiContentData, useThreadsList } from 'store/tradeai/hooks'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import DefalutUi from '../DefalutUi'
import { useCurrentAiThreadId } from 'store/tradeaicache/hooks'
import usePrevious from 'hooks/usePrevious'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import ContentItemCom from '../ContentItem'
import { vm } from 'pages/helper'
import DeepThink from '../DeepThink'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import DefaultTasks from '../DefaultTasks'
import { useIsFromTaskPage } from 'store/setting/hooks'
import TaskItem from 'pages/Tasks/components/TaskItem'
import { useTheme } from 'store/themecache/hooks'
import { useIsMobile } from 'store/application/hooks'

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


const ContentInner = styled.div<{ $isShowDefaultUi: boolean }>`
  position: relative;
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

const TaskWrapper = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 10;
  height: fit-content;
  margin-bottom: 4px;
  padding-bottom: 4px;
  background-color: ${({ theme }) => theme.bgL0};
  ${({ theme }) => theme.isMobile && css`
    margin-bottom: ${vm(4)};
    padding-bottom: ${vm(4)};
  `}
`

export default memo(function AiContent() {
  const isLogout = useIsLogout()
  const isMobile = useIsMobile()
  const isShowDefaultUi = useIsShowDefaultUi()
  const [{ evmAddress }] = useUserInfo()
  const contentInnerRef = useScrollbarClass<HTMLDivElement>()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const preCurrentAiThreadId = usePrevious(currentAiThreadId)
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const tempAiContentData = useTempAiContentData()
  const [isAnalyzeContent] = useIsAnalyzeContent()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [isFromTaskPage] = useIsFromTaskPage()
  const [scrollHeight, setScrollHeight] = useState(0) // 初始高度

  const handleScroll = useCallback(() => {
    if (!contentInnerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentInnerRef.current
    // 如果用户向上滚动超过20px，则停止自动滚动
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10
    setShouldAutoScroll(isAtBottom)
    setScrollHeight(scrollTop)
  }, [contentInnerRef])

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
  }, [contentInnerRef, handleScroll])

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
    <ContentInner id="aiContentInnerEl" $isShowDefaultUi={isShowDefaultUi} ref={contentInnerRef as any} className="scroll-style">
      {/* <TaskWrapper>
        <TaskItem 
          isChatPage 
          scrollHeight={scrollHeight}
          data={{
            id: '1',
            isActive: true,
            title: 'Task 1',
            description: 'Description 1',
            time: '10:00'
          }} 
        />
      </TaskWrapper> */}
      {aiResponseContentList.length === 0 && !tempAiContentData.id && isFromTaskPage && <DefaultTasks />}
      {aiResponseContentList.map((data) => <ContentItemCom key={`${data.id || data.timestamp}-${data.role}`} data={data} />)}
      {(tempAiContentData.id && !isAnalyzeContent) ? [tempAiContentData].map((data) => <ContentItemCom key={`${data.id}-${data.role}`} data={data} />) : null}
      {isAnalyzeContent && <DeepThink aiContentData={tempAiContentData} isTempAiContent={true} />}
      {isShowDefaultUi && <DefalutUi />}
    </ContentInner>
  </AiContentWrapper>
})
