import { memo, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAnalyzeContentList } from 'store/tradeai/hooks'
import AssistantIcon from '../AssistantIcon'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import { LOADING_STATUS } from 'store/tradeai/tradeai'
import { gradientFlow } from 'styles/animationStyled'
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
  gap: 12px;
  padding: 16px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgL2};
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(12)};
    padding: ${vm(8)};
    border-radius: ${vm(16)};
  `}
`

const LoadingBarWrapper = styled.div<{ $loadingPercent: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 14px;
  padding: 4px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgL0};
  .loading-progress {
    height: 100%;
    transition: width ${ANI_DURATION}s;
    width: ${({ $loadingPercent }) => $loadingPercent}%;
    will-change: width;
    background: linear-gradient(90deg, #FFF 0%, #2FF582 100%);
    border-radius: 4px;
  }
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(14)};
    padding: ${vm(4)};
    border-radius: ${vm(16)};
    .loading-progress {
      border-radius: ${vm(4)};
    }
  `}
`

const AnalyzeContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
   gap: ${vm(8)};
  `}
`

const AnalyzeItem = styled.div<{ $loadingStatus: LOADING_STATUS }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span {
    display: flex;
    align-items: center;
    gap: 4px;
    .icon-chat-process {
      font-size: 14px;
      color: ${({ theme }) => theme.textL4};
    }
    span {
      font-size: 11px;
      font-weight: 500;
      line-height: 16px;
      color: ${({ theme }) => theme.textL4};
    }
    ${({ $loadingStatus }) => $loadingStatus === LOADING_STATUS.LOADING
      && css`
        .icon-chat-process {
          font-size: 24px;
          color: ${({ theme }) => theme.jade10};
        }
        span {
          font-size: 16px;
          font-weight: 500;
          line-height: 24px;
          background: linear-gradient(90deg, #FFF 0%, #2FF582 100%);
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ${gradientFlow} 1s linear infinite;
        }
        
      `
    }
  }
  .icon-chat-complete {
    font-size: 14px;
    color: ${({ theme }) => theme.jade10};
  }
  ${({ theme, $loadingStatus }) => theme.isMobile && css`
    > span {
      gap: ${vm(4)};
      .icon-chat-process {
        font-size: 0.14rem;
      }
      span {
        font-size: 0.11rem;
        font-weight: 500;
        line-height: 0.16rem;
      }
      ${$loadingStatus === LOADING_STATUS.LOADING
        && css`
          .icon-chat-process {
            font-size: 0.24rem;
          }
          span {
            font-size: 0.16rem;
            font-weight: 500;
            line-height: 0.24rem;
          }
        `
      }
    }
    .icon-chat-complete {
      font-size: 0.14rem;
    }
  `}
`

export default memo(function LoadingBar({ 
  contentInnerRef, 
  shouldAutoScroll 
}: {
  contentInnerRef?: React.RefObject<HTMLDivElement>, 
  shouldAutoScroll?: boolean 
}) {
  const [shouldRenderLoadingBar, setShouldRenderLoadingBar] = useState(true)
  const [loadingPercent, setLoadingPercent] = useState(0)
  const loadingPercentRef = useRef(loadingPercent)
  const [analyzeContentList] = useAnalyzeContentList()

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
          const target: number = 20
          // 增加步长,20秒内完成
          const step: number = 1 
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
  }, [])
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