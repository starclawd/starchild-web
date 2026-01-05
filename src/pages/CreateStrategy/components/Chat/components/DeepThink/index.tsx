import { memo, useCallback, useEffect, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { ChatResponseContentDataType } from 'store/createstrategy/createstrategy'
import { useTheme } from 'store/themecache/hooks'
import { useCloseStream } from 'store/createstrategy/hooks/useStream'
import ThinkingProgress from 'pages/Chat/components/ThinkingProgress'
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
  const [isLoadingChatStream, setIsLoadingChatStream] = useIsLoadingChatStream()
  const [, setIsRenderingData] = useIsRenderingData()
  const [chatResponseContentList, setChatResponseContentList] = useChatResponseContentList()
  const resetTempChatContentData = useResetTempChatContentData()
  const { thinkingContent } = chatContentData
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
          loadingText={thinkingContent || <Trans>Thinking...</Trans>}
          showDisconnectButton={isLoadingChatStream}
          disconnectChat={disconnectChat}
        />
      </DeepThinkContent>
    </DeepThinkWrapper>
  )
})
