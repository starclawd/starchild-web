import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { gradientFlow } from 'styles/animationStyled'
import { TempAiContentDataType } from 'store/tradeai/tradeai'
import { TYPING_ANIMATION_DURATION } from 'constants/index'
import { useTaskDetail } from 'store/backtest/hooks'
const DeepThinkWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 20px;
  width: 800px;
  height: fit-content;
  padding: 16px;
  border-radius: 24px;
  background: ${({ theme }) => theme.bgL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(8)};
      border-radius: ${vm(16)};
    `}
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const LoadingBarWrapper = styled.div`
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
    will-change: width;
    background: linear-gradient(90deg, #fff 0%, #2ff582 100%);
    border-radius: 4px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
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
  align-items: center;
  justify-content: space-between;
`

const AnalyzeItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-chat-thinking {
    font-size: 24px;
    color: ${({ theme }) => theme.jade10};
  }
  span {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    background: linear-gradient(90deg, #fff 0%, #2ff582 100%);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientFlow} 1s linear infinite;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      .icon-chat-thinking {
        font-size: 0.24rem;
      }
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
      }
    `}
`

export default memo(function DeepThink({ setIsThinking }: { setIsThinking: (isThinking: boolean) => void }) {
  const [loadingPercent, setLoadingPercent] = useState(0)
  const animationInProgressRef = useRef(false)
  const [taskDetail] = useTaskDetail()
  const { generation_msg } = taskDetail

  // 进度动画函数
  const animateLoading = useCallback(() => {
    if (animationInProgressRef.current) return

    animationInProgressRef.current = true
    const startTime = Date.now()
    const duration = TYPING_ANIMATION_DURATION // 5秒完成整个进度条

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 从0%到100%的线性进度
      const currentPercent = progress * 100
      setLoadingPercent(currentPercent)

      if (progress < 1) {
        // 动画未完成，继续
        requestAnimationFrame(updateProgress)
      } else {
        // 动画完成，设置thinking状态为false
        animationInProgressRef.current = false
        setIsThinking(false)
      }
    }

    requestAnimationFrame(updateProgress)
  }, [setIsThinking])

  // 组件挂载后自动开始动画
  useEffect(() => {
    animateLoading()
    return () => {
      animationInProgressRef.current = false
    }
  }, [animateLoading])

  return (
    <DeepThinkWrapper>
      <TopContent>
        <AnalyzeContent>
          <AnalyzeItem>
            <IconBase className='icon-chat-thinking' />
            <span>test</span>
          </AnalyzeItem>
        </AnalyzeContent>
        <LoadingBarWrapper>
          <span style={{ width: `${loadingPercent}%` }} className='loading-progress'></span>
        </LoadingBarWrapper>
      </TopContent>
    </DeepThinkWrapper>
  )
})
