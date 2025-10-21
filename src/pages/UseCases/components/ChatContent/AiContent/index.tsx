import styled, { css } from 'styled-components'
import {
  useAiResponseContentList,
  useIsAnalyzeContent,
  useTempAiContentData,
} from 'store/usecases/hooks/useChatContentHooks'
import { ROLE_TYPE } from 'store/chat/chat.d'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
// import DefalutUi from '../DefalutUi'
import { useIsLogout } from 'store/login/hooks'
import ContentItemCom from '../ContentItem'
import { vm } from 'pages/helper'
import DeepThink from '../DeepThink'

const AiContentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  /* 这个是 flex 下自动滚动的关键，flex 元素默认的 min-height 是 auto, 需要设置为 0 才能自动滚动 */
  min-height: 0;
  flex: 1;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: 100%;
          padding: ${vm(20)} 0 0;
        `
      : css``}
`

const ContentInner = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 0;
  flex-grow: 1;
  padding: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      overflow: auto;
      padding: ${vm(20)} ${vm(12)} 0;
    `}
`

const AiScrollContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  min-height: 0;
  flex: 1;
`

export default memo(function AiContent() {
  const isLogout = useIsLogout()
  const contentInnerRef = useRef<HTMLDivElement>(null)
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const tempAiContentData = useTempAiContentData()
  const [isAnalyzeContent] = useIsAnalyzeContent()
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)
  const [prevContentLength, setPrevContentLength] = useState(0) // 记录之前的内容长度
  const [isInitializing, setIsInitializing] = useState(false) // 是否处于初始化阶段
  const [isUserScrolling, setIsUserScrolling] = useState(false) // 用户是否正在主动滚动

  const handleScroll = useCallback(() => {
    if (!contentInnerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = contentInnerRef.current
    // 计算距离底部的距离
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    // 如果用户向上滚动超过20px，则停止自动滚动
    const isAtBottom = distanceFromBottom < 10
    setShouldAutoScroll(isAtBottom)
  }, [contentInnerRef])

  const scrollToBottom = useCallback(
    (forceScroll = false, useSmooth = false) => {
      if ((contentInnerRef.current && shouldAutoScroll) || forceScroll) {
        requestAnimationFrame(() => {
          contentInnerRef.current?.scrollTo({
            top: contentInnerRef.current.scrollHeight,
            behavior: useSmooth ? 'smooth' : 'auto',
          })
        })
      }
    },
    [contentInnerRef, shouldAutoScroll],
  )

  // 使用 ResizeObserver 监听内容高度变化
  useEffect(() => {
    const contentInner = contentInnerRef.current
    if (!contentInner) return

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(() => {
        // 只有在shouldAutoScroll为true且用户没有正在滚动时才滚动
        if (shouldAutoScroll && !isUserScrolling) {
          if (isInitializing) {
            // 初始化阶段使用强制直接滚动
            scrollToBottom(true, false)
          } else {
            // 正常情况下的滚动
            scrollToBottom()
          }
        }
      })
    })

    resizeObserver.observe(contentInner)

    return () => {
      resizeObserver.disconnect()
    }
  }, [contentInnerRef, shouldAutoScroll, scrollToBottom, isInitializing, isUserScrolling])

  // 监听图片加载事件，确保图片加载完成后滚动到底部
  useEffect(() => {
    const contentInner = contentInnerRef.current
    if (!contentInner || !isInitializing) return

    const handleImageLoad = () => {
      if (isInitializing && shouldAutoScroll && !isUserScrolling) {
        // 只有在初始化阶段、用户没有向上滚动且用户没有正在主动滚动时才自动滚动到底部
        setTimeout(() => {
          scrollToBottom(true, false)
        }, 50) // 稍微延迟一下确保DOM更新完成
      }
    }

    const handleImageError = () => {
      if (isInitializing && shouldAutoScroll && !isUserScrolling) {
        // 即使图片加载失败也要滚动，但要检查用户状态
        setTimeout(() => {
          scrollToBottom(true, false)
        }, 50)
      }
    }

    // 监听所有图片的加载事件
    const images = contentInner.querySelectorAll('img')
    images.forEach((img) => {
      img.addEventListener('load', handleImageLoad)
      img.addEventListener('error', handleImageError)
      // 如果图片已经加载完成，立即处理
      if (img.complete) {
        handleImageLoad()
      }
    })

    // 使用 MutationObserver 监听新添加的图片
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            // 检查新添加的节点是否是图片或包含图片
            const newImages =
              element.tagName === 'IMG' ? [element as HTMLImageElement] : Array.from(element.querySelectorAll('img'))
            newImages.forEach((img) => {
              img.addEventListener('load', handleImageLoad)
              img.addEventListener('error', handleImageError)
              if (img.complete) {
                handleImageLoad()
              }
            })
          }
        })
      })
    })

    mutationObserver.observe(contentInner, {
      childList: true,
      subtree: true,
    })

    return () => {
      images.forEach((img) => {
        img.removeEventListener('load', handleImageLoad)
        img.removeEventListener('error', handleImageError)
      })
      mutationObserver.disconnect()
    }
  }, [contentInnerRef, isInitializing, scrollToBottom, shouldAutoScroll, isUserScrolling])

  useEffect(() => {
    const contentInner = contentInnerRef.current
    if (contentInner) {
      let scrollTimeout: NodeJS.Timeout

      const handleScrollStart = () => {
        setIsUserScrolling(true)
        clearTimeout(scrollTimeout)
      }

      const handleScrollEnd = () => {
        // 滚动结束后短暂延迟再重置用户滚动状态
        scrollTimeout = setTimeout(() => {
          setIsUserScrolling(false)
        }, 150)
      }

      const handleScrollWithDetection = (e: Event) => {
        handleScrollStart()
        handleScroll()
        handleScrollEnd()
      }

      contentInner.addEventListener('scroll', handleScrollWithDetection)
      return () => {
        contentInner.removeEventListener('scroll', handleScrollWithDetection)
        clearTimeout(scrollTimeout)
      }
    }
    return
  }, [contentInnerRef, handleScroll])

  useEffect(() => {
    if (aiResponseContentList || tempAiContentData) {
      // 检测是否是新发送的用户消息
      const isNewUserMessage =
        aiResponseContentList.length > prevContentLength &&
        aiResponseContentList.length > 0 &&
        aiResponseContentList[aiResponseContentList.length - 1]?.role === ROLE_TYPE.USER

      // 发送新消息时使用强制平滑滚动，其他情况使用直接滚动
      scrollToBottom(isNewUserMessage, isNewUserMessage)

      // 更新之前的内容长度
      setPrevContentLength(aiResponseContentList.length)

      // 如果是初始化阶段且内容已加载，延迟结束初始化状态以确保图片有时间加载
      if (isInitializing && aiResponseContentList.length > 0) {
        setTimeout(() => {
          setIsInitializing(false)
        }, 5000) // 给图片5秒加载时间
      }
    }
  }, [tempAiContentData, aiResponseContentList, scrollToBottom, prevContentLength, isInitializing])

  useEffect(() => {
    if (isLogout) {
      setAiResponseContentList([])
      setPrevContentLength(0) // 重置内容长度
      setIsInitializing(false) // 重置初始化状态
      setIsUserScrolling(false) // 重置用户滚动状态
    }
  }, [isLogout, setAiResponseContentList])

  return (
    <AiContentWrapper className='ai-content-wrapper'>
      <ContentInner ref={contentInnerRef as any} className='scroll-style'>
        <AiScrollContent id='aiScrollContent'>
          {aiResponseContentList.map((data) => (
            <ContentItemCom key={`${data.id || data.timestamp}-${data.role}`} data={data} />
          ))}
          {tempAiContentData.id && !isAnalyzeContent
            ? [tempAiContentData].map((data) => <ContentItemCom key={`${data.id}-${data.role}`} data={data} />)
            : null}
          {isAnalyzeContent && (
            <DeepThink isAnalyzeContent={true} aiContentData={tempAiContentData} isTempAiContent={true} />
          )}
        </AiScrollContent>
      </ContentInner>
    </AiContentWrapper>
  )
})
