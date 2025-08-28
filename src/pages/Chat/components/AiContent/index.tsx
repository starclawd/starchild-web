import styled, { css } from 'styled-components'
import {
  useAiResponseContentList,
  useGetAiBotChatContents,
  useIsAnalyzeContent,
  useTempAiContentData,
  useThreadsList,
} from 'store/chat/hooks'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
// import DefalutUi from '../DefalutUi'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import usePrevious from 'hooks/usePrevious'
import { useIsLogout, useUserInfo } from 'store/login/hooks'
import ContentItemCom from '../ContentItem'
import { vm } from 'pages/helper'
import DeepThink from '../DeepThink'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
// import DefaultTasks from '../DefaultTasks'
import { useIsMobile } from 'store/application/hooks'
import { IconBase } from 'components/Icons'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { ANI_DURATION } from 'constants/index'

const AiContentWrapper = styled.div<{ $isEmpty: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 这个是 flex 下自动滚动的关键，flex 元素默认的 min-height 是 auto, 需要设置为 0 才能自动滚动 */
  min-height: 0;
  flex: 1;
  ${({ theme, $isEmpty }) =>
    theme.isMobile
      ? css`
          padding: ${vm(8)} ${vm(12)} 0;
        `
      : css`
          ${$isEmpty &&
          css`
            flex: 0;
            min-height: unset;
          `}
        `}
`

const ContentInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  flex-grow: 1;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      overflow: auto;
    `}
`

const ScrollDownArrow = styled(BorderAllSide1PxBox)<{ $show: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  background-color: ${({ theme }) => theme.black900};
  transition: all ${ANI_DURATION}s;
  .icon-chat-back {
    font-size: 18px;
    color: ${({ theme }) => theme.textDark54};
    transform: rotate(-90deg);
  }
  ${({ theme }) =>
    theme.isMobile
      ? css``
      : css`
          cursor: pointer;
        `}
`

export default memo(function AiContent() {
  const isLogout = useIsLogout()
  const isMobile = useIsMobile()
  const theme = useTheme()
  const [{ telegramUserId }] = useUserInfo()
  const contentInnerRef = useScrollbarClass<HTMLDivElement>()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const preCurrentAiThreadId = usePrevious(currentAiThreadId)
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const tempAiContentData = useTempAiContentData()
  const [isAnalyzeContent] = useIsAnalyzeContent()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [scrollHeight, setScrollHeight] = useState(0) // 初始高度
  const [showScrollDownArrow, setShowScrollDownArrow] = useState(false) // 控制滚动箭头显示

  const handleScroll = useCallback(() => {
    if (!contentInnerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentInnerRef.current
    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    // 如果用户向上滚动超过20px，则停止自动滚动
    const isAtBottom = distanceFromBottom < 10
    setShouldAutoScroll(isAtBottom)
    setScrollHeight(scrollTop)
    // 当距离底部大于20px时显示滚动箭头
    setShowScrollDownArrow(distanceFromBottom > 20)
  }, [contentInnerRef])

  const scrollToBottom = useCallback(
    (forceScroll = false) => {
      if ((contentInnerRef.current && shouldAutoScroll) || forceScroll) {
        requestAnimationFrame(() => {
          contentInnerRef.current?.scrollTo({
            top: contentInnerRef.current.scrollHeight,
            behavior: 'smooth',
          })
        })
      }
    },
    [contentInnerRef, shouldAutoScroll],
  )

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
    if (currentAiThreadId && telegramUserId) {
      triggerGetAiBotChatContents({
        threadId: currentAiThreadId,
        telegramUserId,
      })
    }
  }, [currentAiThreadId, triggerGetAiBotChatContents, telegramUserId])

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
  return (
    <AiContentWrapper
      className='ai-content-wrapper'
      $isEmpty={aiResponseContentList.length === 0 && !tempAiContentData.id}
    >
      <ContentInner id='aiContentInnerEl' ref={contentInnerRef as any} className='scroll-style'>
        {aiResponseContentList.map((data) => (
          <ContentItemCom key={`${data.id || data.timestamp}-${data.role}`} data={data} />
        ))}
        {tempAiContentData.id && !isAnalyzeContent
          ? [tempAiContentData].map((data) => <ContentItemCom key={`${data.id}-${data.role}`} data={data} />)
          : null}
        {isAnalyzeContent && (
          <DeepThink isAnalyzeContent={true} aiContentData={tempAiContentData} isTempAiContent={true} />
        )}
      </ContentInner>
      <ScrollDownArrow
        onClick={() => scrollToBottom(true)}
        $borderColor={theme.black600}
        $borderRadius='50%'
        $show={showScrollDownArrow}
      >
        <IconBase className='icon-chat-back' />
      </ScrollDownArrow>
    </AiContentWrapper>
  )
})
