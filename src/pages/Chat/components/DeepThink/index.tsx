import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import {
  useAiResponseContentList,
  useCloseStream,
  useCurrentAiContentDeepThinkData,
  useIsLoadingData,
  useIsRenderingData,
  useIsShowDeepThink,
  useIsShowDeepThinkSources,
  useResetTempAiContentData,
} from 'store/chat/hooks'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'
import { useTheme } from 'store/themecache/hooks'
import { Trans } from '@lingui/react/macro'
import ThinkList from './components/ThinkList'
import Sources from './components/Sources'
import { TempAiContentDataType } from 'store/chat/chat'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import ThinkingProgress from '../ThinkingProgress'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ANI_DURATION } from 'constants/index'
const DeepThinkWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 40px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding-bottom: ${vm(40)};
    `}
`
const DeepThinkContent = styled(BorderAllSide1PxBox)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 16px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const DeepThinkComplete = styled(DeepThinkContent)<{ $isShowDeepThink: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transition: all ${ANI_DURATION}s;
  > span:first-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.black0};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: ${({ theme }) => theme.black200};
    span:first-child {
      font-size: 16px;
      font-weight: 500;
      line-height: 24px;
      margin-right: 6px;
      color: ${({ theme }) => theme.brand100};
    }
    span:nth-child(2) {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      margin-right: 8px;
      color: ${({ theme }) => theme.black200};
    }
    .icon-chat-expand {
      font-size: 18px;
      color: ${({ theme }) => theme.black200};
    }
  }
  ${({ $isShowDeepThink }) =>
    $isShowDeepThink &&
    css`
      background-color: ${({ theme }) => theme.black800};
    `}
  ${({ theme }) =>
    theme.isMobile
      ? css`
          > span:first-child {
            font-size: 0.13rem;
            line-height: 0.2rem;
          }
          > span:last-child {
            span:first-child {
              font-size: 0.13rem;
              line-height: 0.2rem;
            }
            span:nth-child(2) {
              font-size: 0.13rem;
              line-height: 0.22rem;
            }
            .icon-chat-expand {
              font-size: 0.18rem;
            }
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            border-color: ${({ theme }) => theme.black300};
          }
        `}
`

const TabWrapper = styled.div`
  width: 100%;
  .tab-list-wrapper {
    width: 181px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .tab-list-wrapper {
        width: ${vm(170)};
        .move-tab-item {
          font-size: 0.14rem;
          line-height: 0.2rem;
        }
      }
    `}
`

const TabContent = styled.div`
  display: flex;
  flex-direction: row;
`

const Left = styled.div`
  flex-shrink: 0;
  width: 0;
  height: auto;
  margin: 0 12px;
  border-left: 1px solid ${({ theme }) => theme.black800};
`

const Right = styled.div`
  flex: 1;
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
  const [, setIsShowDeepThinkSources] = useIsShowDeepThinkSources()
  const [isShowDeepThink, setIsShowDeepThink] = useIsShowDeepThink()
  const [isLoadingData, setIsLoadingData] = useIsLoadingData()
  const [, setIsRenderingData] = useIsRenderingData()
  const [loadingPercent, setLoadingPercent] = useState(0)
  const [aiResponseContentList, setAiResponseContentList] = useAiResponseContentList()
  const [currentAiContentDeepThinkData, setCurrentAiContentDeepThinkData] = useCurrentAiContentDeepThinkData()
  const resetTempAiContentData = useResetTempAiContentData()
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
    resetTempAiContentData()
    setAiResponseContentList(aiResponseContentList.slice(0, aiResponseContentList.length - 1))
  }, [
    closeStream,
    setIsLoadingData,
    setIsRenderingData,
    setAiResponseContentList,
    aiResponseContentList,
    resetTempAiContentData,
  ])

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
    setIsShowDeepThinkSources(false)
    setCurrentAiContentDeepThinkData(aiContentData)
    setIsShowDeepThink(true)
  }, [
    setIsShowDeepThink,
    setCurrentAiContentDeepThinkData,
    aiContentData,
    currentAiContentDeepThinkData,
    isShowDeepThink,
    setIsShowDeepThinkSources,
  ])

  if (!isTempAiContent && !isAnalyzeContent) {
    return (
      <DeepThinkComplete
        $isShowDeepThink={isShowDeepThink}
        $borderColor={theme.black600}
        $borderRadius={16}
        onClick={changeShowDeepThink}
      >
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
      </DeepThinkComplete>
    )
  }

  return (
    <DeepThinkWrapper>
      <DeepThinkContent $borderColor={theme.black600} $borderRadius={16}>
        <ThinkingProgress
          intervalDuration={15000}
          loadingText={lastThoughtContent?.tool_name || <Trans>Thinking...</Trans>}
          showDisconnectButton={isLoadingData}
          disconnectChat={disconnectChat}
        />
      </DeepThinkContent>
      <TabWrapper>
        <MoveTabList moveType={MoveType.LINE} tabKey={tabIndex} tabList={tabList} />
      </TabWrapper>
      <TabContent>
        <Left />
        <Right>
          {tabIndex === 0 && <ThinkList thoughtList={thoughtContentList} />}
          {tabIndex === 1 && <Sources sourceList={sourceListDetails} />}
        </Right>
      </TabContent>
    </DeepThinkWrapper>
  )
})
