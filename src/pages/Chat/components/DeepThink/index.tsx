import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  useCloseStream,
  useCurrentAiContentDeepThinkData,
  useIsLoadingData,
  useIsRenderingData,
  useIsShowDeepThink,
} from 'store/chat/hooks'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useTheme } from 'store/themecache/hooks'
import { Trans } from '@lingui/react/macro'
import ThinkList from './components/ThinkList'
import Sources from './components/Sources'
import { TempAiContentDataType } from 'store/chat/chat'
import MoveTabList from 'components/MoveTabList'
import ThinkingProgress from '../ThinkingProgress'
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
  ${({ theme }) =>
    theme.isMobile &&
    css`
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
  ${({ theme }) =>
    theme.isMobile
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
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

export default memo(function DeepThink({
  contentInnerRef,
  shouldAutoScroll,
  isTempAiContent = false,
  aiContentData,
  isAnalyzeContent = false,
}: {
  contentInnerRef?: React.RefObject<HTMLDivElement>
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
  const changeTabIndex = useCallback(
    (index: number) => {
      return () => {
        setTabIndex(index)
      }
    },
    [setTabIndex],
  )

  const tabList = useMemo(() => {
    const sourceListLength = sourceListDetails.length
    return [
      {
        key: 0,
        text: <Trans>Activity</Trans>,
        clickCallback: changeTabIndex(0),
      },
      {
        key: 1,
        text: <Trans>{sourceListLength} sources</Trans>,
        clickCallback: changeTabIndex(1),
      },
    ]
  }, [sourceListDetails.length, changeTabIndex])

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

  const changeShowDeepThink = useCallback(() => {
    if (currentAiContentDeepThinkData?.id === aiContentData.id && isShowDeepThink) {
      setIsShowDeepThink(false)
      return
    }
    setCurrentAiContentDeepThinkData(aiContentData)
    setIsShowDeepThink(true)
  }, [
    setIsShowDeepThink,
    setCurrentAiContentDeepThinkData,
    aiContentData,
    currentAiContentDeepThinkData,
    isShowDeepThink,
  ])

  if (!isTempAiContent && !isAnalyzeContent) {
    return (
      <DeepThinkWrapper1 onClick={changeShowDeepThink}>
        <span>
          <Trans>Show thinking process</Trans>
        </span>
        <span>
          <span style={{ display: sourceListDetails.length > 0 ? 'flex' : 'none' }}>{sourceListDetails.length}</span>
          <span style={{ display: sourceListDetails.length > 0 ? 'flex' : 'none' }}>
            <Trans>sources</Trans>
          </span>
          <IconBase className='icon-chat-expand' />
        </span>
      </DeepThinkWrapper1>
    )
  }

  return (
    <DeepThinkWrapper>
      <TopContent>
        <ThinkingProgress
          intervalDuration={15000}
          loadingText={lastThoughtContent?.tool_name}
          showDisconnectButton={isLoadingData}
          disconnectChat={disconnectChat}
        />
      </TopContent>
      <MoveTabList tabIndex={tabIndex} tabList={tabList} />
      {tabIndex === 0 && (
        <ThinkList thoughtList={isTempAiContent ? thoughtContentList.slice(-1) : thoughtContentList} />
      )}
      {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
    </DeepThinkWrapper>
  )
})
