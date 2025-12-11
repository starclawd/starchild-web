import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { ChatResponseContentDataType } from 'store/createstrategy/createstrategy'
import { useTheme } from 'store/themecache/hooks'
import { useCloseStream } from 'store/createstrategy/hooks/useStream'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
import ThinkList from 'pages/Chat/components/DeepThink/components/ThinkList'
import Sources from 'pages/Chat/components/DeepThink/components/Sources'
import { useIsLoadingChatStream, useIsRenderingData } from 'store/createstrategy/hooks/useLoadingState'
import { useChatResponseContentList, useResetTempChatContentData } from 'store/createstrategy/hooks/useChatContent'
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
  border-left: 1px solid ${({ theme }) => theme.bgT30};
`

const Right = styled.div`
  flex: 1;
`

export default memo(function DeepThink({
  contentInnerRef,
  shouldAutoScroll,
  chatContentData,
}: {
  contentInnerRef?: React.RefObject<HTMLDivElement>
  shouldAutoScroll?: boolean
  chatContentData: ChatResponseContentDataType
}) {
  const theme = useTheme()
  const closeStream = useCloseStream()
  const [tabIndex, setTabIndex] = useState(0)
  const [isLoadingChatStream, setIsLoadingChatStream] = useIsLoadingChatStream()
  const [, setIsRenderingData] = useIsRenderingData()
  const [chatResponseContentList, setChatResponseContentList] = useChatResponseContentList()
  const resetTempChatContentData = useResetTempChatContentData()
  const { thoughtContentList, sourceListDetails } = chatContentData
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
    setIsLoadingChatStream(false)
    window.strategyAbortController?.abort()
    setIsRenderingData(false)
    closeStream()
    resetTempChatContentData()
    setChatResponseContentList(chatResponseContentList.slice(0, chatResponseContentList.length - 1))
  }, [
    chatResponseContentList,
    closeStream,
    setIsLoadingChatStream,
    setIsRenderingData,
    setChatResponseContentList,
    resetTempChatContentData,
  ])

  useEffect(() => {
    if (contentInnerRef?.current && shouldAutoScroll) {
      requestAnimationFrame(() => {
        contentInnerRef.current?.scrollTo(0, contentInnerRef.current.scrollHeight)
      })
    }
  }, [contentInnerRef, shouldAutoScroll])

  return (
    <DeepThinkWrapper>
      <DeepThinkContent $borderColor={theme.bgT30} $borderRadius={16}>
        <ThinkingProgress
          intervalDuration={15000}
          loadingText={lastThoughtContent?.tool_name || <Trans>Thinking...</Trans>}
          showDisconnectButton={isLoadingChatStream}
          disconnectChat={disconnectChat}
        />
      </DeepThinkContent>
      <TabWrapper>
        <MoveTabList moveType={MoveType.LINE} tabIndex={tabIndex} tabList={tabList} />
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
