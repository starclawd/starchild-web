import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { Dispatch, memo, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { gradientFlow } from 'styles/animationStyled'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ParamFun } from 'types/global'

const ThinkingProgressWrapper = styled.div`
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
    color: ${({ theme }) => theme.brand100};
  }
  span {
    max-width: 600px;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    background: linear-gradient(90deg, #fff 0%, #f84600 100%);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientFlow} 1s linear infinite;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
    min-width: 0;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
      .icon-chat-thinking {
        font-size: 0.24rem;
      }
      span {
        max-width: ${vm(300)};
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
      }
    `}
`

const LoadingBarWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 100%;
  height: 14px;
  padding: 4px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bgL0};
  .loading-progress {
    height: 100%;
    will-change: width;
    background: linear-gradient(90deg, #fff 0%, #f84600 100%);
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

const DisconnectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.black800};
  transition: all ${ANI_DURATION}s;
  span {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: ${({ theme }) => theme.brand100};
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: ${vm(24)};
          height: ${vm(24)};
          border-radius: ${vm(12)};
          span {
            width: ${vm(8)};
            height: ${vm(8)};
            border-radius: ${vm(2)};
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            border-color: ${({ theme }) => theme.black500};
            background: ${({ theme }) => theme.black800};
          }
        `}
`

export default memo(function ThinkingProgress({
  loadingText,
  intervalDuration = 120000,
  showDisconnectButton = false,
  disconnectChat,
  loadingPercentProp,
  setLoadingPercentProp,
}: {
  loadingText: React.ReactNode
  intervalDuration?: number
  showDisconnectButton?: boolean
  disconnectChat?: () => void
  loadingPercentProp?: number
  setLoadingPercentProp?: ParamFun<number>
}) {
  const theme = useTheme()
  let [loadingPercent, setLoadingPercent] = useState(0)
  if (loadingPercentProp !== undefined && setLoadingPercentProp !== undefined) {
    loadingPercent = loadingPercentProp
    setLoadingPercent = setLoadingPercentProp as Dispatch<SetStateAction<number>>
  }
  // 进度动画函数
  const animateLoading = useCallback(() => {
    const startTime = Date.now()

    const updateProgress = () => {
      const now = Date.now()
      const elapsed = now - startTime

      // 计算当前是第几个周期
      const currentCycle = Math.floor(elapsed / intervalDuration)
      // 当前周期内的进度 (0-1)
      const cycleProgress = (elapsed % intervalDuration) / intervalDuration

      // 计算当前进度百分比
      let currentPercent = 0

      // 每个周期走剩余的60%
      for (let i = 0; i <= currentCycle; i++) {
        const remaining = 100 - currentPercent
        if (i === currentCycle) {
          // 当前周期：根据cycleProgress计算部分进度
          currentPercent += remaining * 0.6 * cycleProgress
        } else {
          // 已完成的周期：直接加上60%的剩余
          currentPercent += remaining * 0.6
        }
      }

      // 确保不超过99%（永远不到100%）
      currentPercent = Math.min(currentPercent, 99)
      setLoadingPercent(currentPercent)

      // 继续动画直到外部停止
      requestAnimationFrame(updateProgress)
    }

    requestAnimationFrame(updateProgress)
  }, [intervalDuration, setLoadingPercent])
  useEffect(() => {
    animateLoading()
  }, [animateLoading])
  return (
    <ThinkingProgressWrapper className='thinking-progress-wrapper'>
      <AnalyzeContent>
        <AnalyzeItem>
          <IconBase className='icon-chat-thinking' />
          <span>{loadingText}</span>
        </AnalyzeItem>
        {showDisconnectButton && (
          <DisconnectButton onClick={disconnectChat}>
            <span></span>
          </DisconnectButton>
        )}
      </AnalyzeContent>
      <LoadingBarWrapper>
        <span style={{ width: `${loadingPercent}%` }} className='loading-progress'></span>
      </LoadingBarWrapper>
    </ThinkingProgressWrapper>
  )
})
