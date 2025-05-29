import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { useCloseStream, useCurrentAiContentDeepThinkData, useIsAnalyzeContent, useIsLoadingData, useIsRenderingData, useIsShowDeepThink } from 'store/tradeai/hooks'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { gradientFlow } from 'styles/animationStyled'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { Trans } from '@lingui/react/macro'
import ThinkList from './components/ThinkList'
import Sources from './components/Sources'
import TabList from './components/TabList'
import { TempAiContentDataType } from 'store/tradeai/tradeai'
const DeepThinkWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 0;
  gap: 20px;
  width: 100%;
  padding: 16px;
  border-radius: 24px;
  background: ${({ theme }) => theme.bgL1};
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(20)};
    padding: ${vm(8)};
    border-radius: ${vm(16)};
  `}
`

const DeepThinkWrapper1 = styled(DeepThinkWrapper)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px; 
    color: ${({ theme }) => theme.textL1};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: ${({ theme }) => theme.textL3};
    span:first-child {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      margin-right: 6px;
      color: ${({ theme }) => theme.jade10};
    }
    span:nth-child(2) {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      margin-right: 8px;
      color: ${({ theme }) => theme.textL3};
    }
    .icon-chat-expand {
      font-size: 18px;
      color: ${({ theme }) => theme.textL3};
    }
  }
  ${({ theme }) => theme.isMobile
  ? css`
    > span:first-child {
      font-size: 0.16rem;
      line-height: 0.24rem;
    }
    > span:last-child {
      span:first-child {
        font-size: 0.16rem;
        line-height: 0.24rem;
      }
      span:nth-child(2) {
        font-size: 0.16rem;
        line-height: 0.22rem;
      }
      .icon-chat-expand {
        font-size: 0.18rem;
      }
    }
  `
  : css`
    cursor: pointer;
  `}
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  ${({ theme }) => theme.isMobile && css`
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
    background: linear-gradient(90deg, #FFF 0%, #2FF582 100%);
    background-size: 200% 100%;
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: ${gradientFlow} 1s linear infinite;
  }
  ${({ theme }) => theme.isMobile && css`
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

const DisconnectButton = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  span {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: ${({ theme }) => theme.jade10};
  }
  ${({ theme }) => theme.isMobile
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
  `}
`

const BottomContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px; 
  color: ${({ theme }) => theme.textL2};
  a {
    color: ${({ theme }) => theme.brand6};
    &:hover {
      color: ${({ theme }) => theme.brand6};
    }
  }
  color: ${({ theme }) => theme.textL1};
  .icon-chat-tell-more {
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    font-size: 0.14rem;
    line-height: 0.20rem;
    .icon-chat-tell-more {
      font-size: 0.18rem;
    }
  `}
`

export default memo(function DeepThink({ 
  contentInnerRef, 
  shouldAutoScroll,
  isTempAiContent = false,
  aiContentData,
  isAnalyzeContent = false
}: {
  contentInnerRef?: React.RefObject<HTMLDivElement>, 
  shouldAutoScroll?: boolean 
  isTempAiContent?: boolean
  aiContentData: TempAiContentDataType
  isAnalyzeContent?: boolean
}) {
  const theme = useTheme()
  const loadRemainPercent = 0.5
  const closeStream = useCloseStream()
  const [tabIndex, setTabIndex] = useState(0)
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isLoadingData, setIsLoadingData] = useIsLoadingData()
  const [, setIsRenderingData] = useIsRenderingData()
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [currentAiContentDeepThinkData, setCurrentAiContentDeepThinkData] = useCurrentAiContentDeepThinkData()
  const loadingPercentRef = useRef(loadingPercent)
  const targetPercentRef = useRef(0)
  const animationInProgressRef = useRef(false)
  const prevThoughtListLengthRef = useRef(0)
  const { thoughtContentList, sourceListDetails } = aiContentData
  const lastThoughtContent = useMemo(() => {
    return thoughtContentList[thoughtContentList.length - 1]
  }, [thoughtContentList])
  // 进度动画函数
  const animateLoading = useCallback(() => {
    if (!isTempAiContent) return
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
  }, [isTempAiContent])

  const disconnectChat = useCallback(() => {
    setIsLoadingData(false)
    window.abortController?.abort()
    setIsRenderingData(false)
    closeStream()
  }, [closeStream, setIsLoadingData, setIsRenderingData])

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

  const changeShowDeepThink = useCallback(() => {
    if (currentAiContentDeepThinkData?.id === aiContentData.id && isShowDeepThink) {
      setIsShowDeepThink(false)
      return
    }
    setCurrentAiContentDeepThinkData(aiContentData)
    setIsShowDeepThink(true)
  }, [setIsShowDeepThink, setCurrentAiContentDeepThinkData, aiContentData, currentAiContentDeepThinkData, isShowDeepThink])

  if (!isTempAiContent && !isAnalyzeContent) {
    return <DeepThinkWrapper1 onClick={changeShowDeepThink}>
      <span><Trans>Show thinking process</Trans></span>
      <span>
        <span style={{ display: sourceListDetails.length > 0 ? 'flex' : 'none' }}>{sourceListDetails.length}</span>
        <span style={{ display: sourceListDetails.length > 0 ? 'flex' : 'none' }}><Trans>sources</Trans></span>
        <IconBase className="icon-chat-expand" />
      </span>
    </DeepThinkWrapper1>
  }

  return <DeepThinkWrapper>
    <TopContent>
      <AnalyzeContent>
        <AnalyzeItem>
          <IconBase className="icon-chat-thinking" />
          <span>{lastThoughtContent?.tool_name}</span>
        </AnalyzeItem>
        {isLoadingData && <DisconnectButton
          $borderRadius={12}
          $borderColor={theme.bgT30}
          onClick={disconnectChat}
        >
          <span></span>
        </DisconnectButton>}
      </AnalyzeContent>
      <LoadingBarWrapper>
        <span style={{ width: `${loadingPercent}%` }} className="loading-progress"></span>
      </LoadingBarWrapper>
    </TopContent>
    <TabList
      tabIndex={tabIndex}
      setTabIndex={setTabIndex}
      sourceListDetailsLength={sourceListDetails.length}
    />
    {tabIndex === 0 && <ThinkList thoughtList={isTempAiContent ? thoughtContentList.slice(-1) : thoughtContentList} />}
    {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
  </DeepThinkWrapper>
})