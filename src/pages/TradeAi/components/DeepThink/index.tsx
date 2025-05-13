import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTempAiContentData } from 'store/tradeai/hooks'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { gradientFlow } from 'styles/animationStyled'
const DeepThinkWrapper = styled.div`
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

const AnalyzeItem = styled.div<{ $isLast: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span {
    display: flex;
    align-items: center;
    gap: 4px;
    .icon-chat-process,
    .icon-chat-agent-planing,
    .icon-chat-analyze-agent,
    .icon-chat-thinking {
      font-size: 14px;
      color: ${({ theme }) => theme.textL4};
    }
    span {
      font-size: 11px;
      font-weight: 500;
      line-height: 16px;
      color: ${({ theme }) => theme.textL4};
    }
    ${({ $isLast }) => $isLast
      && css`
        .icon-chat-process,
        .icon-chat-agent-planing,
        .icon-chat-analyze-agent,
        .icon-chat-thinking {
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
  ${({ theme, $isLast }) => theme.isMobile && css`
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
      ${$isLast
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

export default memo(function DeepThink({ 
  contentInnerRef, 
  shouldAutoScroll 
}: {
  contentInnerRef?: React.RefObject<HTMLDivElement>, 
  shouldAutoScroll?: boolean 
}) {
  const [loadingPercent, setLoadingPercent] = useState(0)
  const loadingPercentRef = useRef(loadingPercent)
  const targetPercentRef = useRef(0)
  const animationInProgressRef = useRef(false)
  const prevThoughtListLengthRef = useRef(0)
  const { thoughtContentList } = useTempAiContentData()
  const loadRemainPercent = 0.5
  const iconList = useMemo(() => {
    return ['icon-chat-process', 'icon-chat-agent-planing', 'icon-chat-analyze-agent', 'icon-chat-thinking']
  }, [])

    // 进度动画函数
    const animateLoading = useCallback(() => {
      animationInProgressRef.current = true;
      
      const startTime = Date.now();
      const duration = 5000; // 5秒完成loadRemainPercent的加载
      const startPercent = loadingPercentRef.current;
      const targetPercent = targetPercentRef.current;
      
      const updateProgress = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 计算当前应该显示的进度
        const currentPercent = startPercent + (targetPercent - startPercent) * progress;
        setLoadingPercent(currentPercent);
        
        if (progress < 1) {
          // 动画未完成，继续
          requestAnimationFrame(updateProgress);
        } else {
          // 当前动画完成
          animationInProgressRef.current = false;
          
          // 检查是否需要启动下一段动画（如果已经达到了目标但还没有达到100%）
          if (targetPercent < 100) {
            // 再加载剩余进度的60%
            const remainingPercent = 100 - targetPercent;
            const newProgressToAdd = remainingPercent * loadRemainPercent;
            targetPercentRef.current = targetPercent + newProgressToAdd;
            
            // 启动下一段动画
            animateLoading();
          }
        }
      };
      
      requestAnimationFrame(updateProgress);
    }, [])

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

  // 监听thoughtContentList变化，计算新的目标进度
  useEffect(() => {
    const currentLength = thoughtContentList.length;
    if (currentLength > prevThoughtListLengthRef.current) {
      // 计算剩余未加载进度的60%
      const remainingPercent = 100 - loadingPercentRef.current;
      const newProgressToAdd = remainingPercent * loadRemainPercent;
      
      // 设置新的目标进度
      targetPercentRef.current = loadingPercentRef.current + newProgressToAdd;
      
      // 更新前一次列表长度
      prevThoughtListLengthRef.current = currentLength;
      
      // 如果没有正在进行的动画，启动新的动画
      if (!animationInProgressRef.current) {
        animateLoading();
      }
    }
  }, [thoughtContentList, animateLoading]);

  // 组件挂载后自动开始第一段动画
  useEffect(() => {
    // 初始设置为加载60%
    targetPercentRef.current = 20;
    animateLoading();
    
    return () => {
      animationInProgressRef.current = false;
    };
  }, [animateLoading]);

  return <DeepThinkWrapper>
    <Content>
      <LoadingBarWrapper>
        <span style={{ width: `${loadingPercent}%` }} className="loading-progress"></span>
      </LoadingBarWrapper>
      <AnalyzeContent>
          {
            thoughtContentList.map((data, index) => {
              const { content } = data
              const isLast = index === thoughtContentList.length - 1
              return <AnalyzeItem $isLast={isLast} key={index}>
                <span>
                  <IconBase className={iconList[index % 4]} />
                  <span>{content}</span>
                </span>
                {!isLast && <IconBase className="icon-chat-complete" />}
              </AnalyzeItem>
          })
        }
      </AnalyzeContent>
    </Content>
  </DeepThinkWrapper>
})