import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { ROLE_TYPE } from 'store/tradeai/tradeai.d'
import { useAiResponseContentList, useCurrentRenderingId, useIsRenderFinalAnswerContent, useIsRenderObservationContent, useIsRenderThoughtContent, useTempAiContentData } from 'store/tradeai/hooks'
import AssistantIcon from '../AssistantIcon'
import { Trans } from '@lingui/react/macro'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const ContentItem = styled.div`
  position: relative;
  display: flex;
  padding: 0;
  gap: 10px;
  width: 100%;
  > img {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
  .loading-bar-placeholder {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
  }
`

const Content = styled.div<{ $isPlaceAi?: boolean }>`
  display: flex;
  align-items: center;
  width: fit-content;
  flex-grow: 1;
  ${({ role, $isPlaceAi }) =>
    role === ROLE_TYPE.ASSISTANT &&
    css`
      padding-top: ${$isPlaceAi ? 0 : 6}px;
    `
  }
`

const LoadingBarWrapper = styled.div<{ $loadingPercent: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 24px;
  background-color: ${({ theme }) => theme.bg10};
  .loading-text {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: ${({ theme }) => theme.text4};
  }
  .loading-progress {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: ${({ $loadingPercent }) => $loadingPercent}%;
    height: 100%;
    padding-right: 10px;
    transition: width 0.2s ease-out; // 修改过渡时间为0.2s,添加ease-out缓动函数使动画更平滑
    background: ${({ theme }) => theme.darkMode ? 
      'linear-gradient(90deg, rgba(241,250,247,0.1) 0%, rgba(228,248,237,0.1) 100%)' :
      'linear-gradient(90deg, #F1FAF7 0%, #E4F8ED 100%)'};
    will-change: width; // 提示浏览器width属性会变化,优化性能
  }
`
export default memo(function LoadingBar({ 
  isPlaceAi, 
  isLoading,
  contentInnerRef, 
  shouldAutoScroll 
}: { 
  isPlaceAi?: boolean, 
  isLoading?: boolean,
  contentInnerRef?: React.RefObject<HTMLDivElement>, 
  shouldAutoScroll?: boolean 
}) {
  const [shouldRenderLoadingBar, setShouldRenderLoadingBar] = useState(true)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const loadingPercentRef = useRef(loadingPercent)
  const [aiResponseContentList] = useAiResponseContentList()
  const [currentRenderingId] = useCurrentRenderingId()
  const tempAiContentData = useTempAiContentData()
  const [isRenderFinalAnswerContent] = useIsRenderFinalAnswerContent()
  const [isRenderThoughtContent] = useIsRenderThoughtContent()
  const [isRenderObservationContent] = useIsRenderObservationContent()
  // 已渲染部分数据，等待的时候显示的 loadingBar不要头像
  const hasRenderedPartData = useMemo(() => {
    return !!currentRenderingId && (aiResponseContentList.some((data) => data.id === currentRenderingId) || tempAiContentData.id === currentRenderingId)
  }, [aiResponseContentList, currentRenderingId, tempAiContentData.id])
  useEffect(() => {
    if (contentInnerRef?.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        contentInnerRef.current?.scrollTo(0, contentInnerRef.current.scrollHeight)
      })
    }
  }, [contentInnerRef, shouldAutoScroll])
  useEffect(() => {
    loadingPercentRef.current = loadingPercent
  }, [loadingPercent])
  useEffect(() => {
    let animationFrameId: number
    let lastUpdateTime = Date.now()
    const startTime = Date.now()

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - lastUpdateTime
      const totalElapsed = now - startTime

      // 每100ms更新一次
      if (elapsed >= 100) {
        setLoadingPercent(prev => {
          let target: number = 0
          // 增加步长,20秒内完成
          let step: number = 1 

          if (!isRenderThoughtContent) {
            target = 20
          } else if (isRenderFinalAnswerContent) {
            target = 100
            step = 10
            setTimeout(() => {
              setShouldRenderLoadingBar(false)
            }, 200)
          } else if (isRenderObservationContent) {
            if (loadingPercentRef.current <= 50) {
              target = 60
              step = 2
            } else if (loadingPercentRef.current > 50 && loadingPercentRef.current < 90) {
              target = 90
              step = 1
            } else {
              target = 99
              step = 0.2
            }
          } else if (isRenderThoughtContent) {
            if (loadingPercentRef.current >= 50) {
              target = 99
              step = 0.5
            } else if (loadingPercentRef.current < 50 && loadingPercentRef.current >= 20) {
              target = 50
              step = 1
            } else if (loadingPercentRef.current < 20) {
              target = 30
              step = 2
            }
          }

          // 如果超过20秒,直接到目标值
          if (totalElapsed > 20000) {
            return target
          }

          if (prev >= target) {
            return prev
          }
          return Math.min(prev + step, target)
        })
        lastUpdateTime = now
      }

      animationFrameId = requestAnimationFrame(updateProgress)
    }

    animationFrameId = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isRenderFinalAnswerContent, isRenderThoughtContent, isRenderObservationContent])
  if (!shouldRenderLoadingBar) return null
  return <ContentItem>
    {
      hasRenderedPartData ? <span className="loading-bar-placeholder"></span> : !isPlaceAi &&<AssistantIcon />
    }
    <Content $isPlaceAi={isPlaceAi}>
      <LoadingBarWrapper $loadingPercent={loadingPercent}>
        <span className="loading-progress"></span>
        <span className="loading-text"><Trans>Loading</Trans>...{Math.floor(loadingPercent)}%</span>
      </LoadingBarWrapper>
    </Content>
  </ContentItem>
})