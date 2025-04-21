import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAiResponseContentList, useAnalyzeContentList, useCurrentRenderingId, useIsAnalyzeContent, useIsRenderFinalAnswerContent, useIsRenderObservationContent, useIsRenderThoughtContent, useTempAiContentData } from 'store/tradeai/hooks'
import AssistantIcon from '../AssistantIcon'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { LOADING_STATUS } from 'store/tradeai/tradeai'

const ContentItem = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 4px;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(4)};
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex-grow: 1;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(12)};
    padding: ${vm(8)};
    border-radius: ${vm(16)};
    background: ${theme.bgL2};
  `}
`

const LoadingBarWrapper = styled.div<{ $loadingPercent: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 14px;
  .loading-progress {
    display: flex;
    align-items: center;
    transition: width ${ANI_DURATION}s;
    width: ${({ $loadingPercent }) => $loadingPercent}%;
    height: 100%;
    will-change: width; // 提示浏览器width属性会变化,优化性能
  }
  ${({ theme, $loadingPercent }) => theme.isMobile && css`
    height: ${vm(14)};
    padding: ${vm(4)};
    border-radius: ${vm(16)};
    background-color: ${theme.bgL0};
    .loading-progress {
      height: 100%;
      width: ${$loadingPercent}%;
      border-radius: ${vm(4)};
      background: linear-gradient(90deg, #FFF 0%, #2FF582 100%);
    }
  `}
`

const AnalyzeContent = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
   gap: ${vm(8)};
  `}
`

const AnalyzeItem = styled.div<{ $loadingStatus: LOADING_STATUS }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ theme, $loadingStatus }) => theme.isMobile && css`
    > span {
      display: flex;
      align-items: center;
      gap: ${vm(4)};
      .icon-chat-process {
        font-size: 0.14rem;
        color: ${theme.textL4};
      }
      span {
        font-size: 0.11rem;
        font-weight: 500;
        line-height: 0.16rem;
        color: ${theme.textL4};
      }
      ${$loadingStatus === LOADING_STATUS.LOADING
        && css`
          .icon-chat-process {
            font-size: 0.24rem;
            color: ${theme.jade10};
          }
          span {
            font-size: 0.16rem;
            font-weight: 500;
            line-height: 0.24rem;
            background: linear-gradient(90deg, #FFF 0%, #2FF582 100%);
            background-size: 200% 100%;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: gradientFlow 1s linear infinite;
          }
          @keyframes gradientFlow {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
        `
      }
    }
    .icon-chat-complete {
      font-size: 0.14rem;
      color: ${theme.jade10};
    }
  `}
`

export default memo(function LoadingBar({ 
  isPlaceAi,
  contentInnerRef, 
  shouldAutoScroll 
}: { 
  isPlaceAi?: boolean,
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
  const [isAnalyzeContent] = useIsAnalyzeContent()
  const [analyzeContentList] = useAnalyzeContentList()
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
    <AssistantIcon />
    <Content>
      <LoadingBarWrapper $loadingPercent={loadingPercent}>
        <span className="loading-progress"></span>
      </LoadingBarWrapper>
      <AnalyzeContent>
          {
            analyzeContentList.map((data, index) => {
              const { content, loadingStatus } = data
              return <AnalyzeItem $loadingStatus={loadingStatus} key={index}>
                <span>
                  <IconBase className="icon-chat-process" />
                  <span>{content}</span>
                </span>
                {loadingStatus === LOADING_STATUS.SUCCESS && <IconBase className="icon-chat-complete" />}
              </AnalyzeItem>
          })
        }
      </AnalyzeContent>
    </Content>
  </ContentItem>
})