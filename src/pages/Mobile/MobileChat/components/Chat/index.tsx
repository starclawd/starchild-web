import styled, { css } from 'styled-components'
import FileDrag from 'pages/Chat/components/FileDrag'
import { memo, useRef, useState } from 'react'
import AiThreadsList from 'pages/Chat/components/AiThreadsList'
import { vm } from 'pages/helper'
import MobileHeader from 'pages/Mobile/components/MobileHeader'
import { Trans } from '@lingui/react/macro'

const ChatWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  z-index: 1000;
  z-index: 1000;
  padding: 0 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: relative;
      width: 100%;
      height: 100%;
      padding: 0;
      border-radius: 12px;
      overflow: hidden;
    `}
`

const InnerContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: 0;
      .file-drag-wrapper {
        border-radius: 0;
      }
    `}
`

const ThreadListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - ${vm(60)});
  flex-grow: 1;
  border-radius: 16px;
`

export default memo(function Chat() {
  const [isShowThreadList, setIsShowThreadList] = useState(false)
  const chatWrapperRef = useRef<HTMLDivElement>(null)
  return (
    <ChatWrapper id='chatWrapperEl' className='chat-warpper' ref={chatWrapperRef as any}>
      <InnerContent>
        <MobileHeader title={<Trans>Chat</Trans>} />
        {isShowThreadList ? (
          <ThreadListWrapper>
            <AiThreadsList closeHistory={() => setIsShowThreadList(false)} />
          </ThreadListWrapper>
        ) : (
          <FileDrag />
        )}
      </InnerContent>
    </ChatWrapper>
  )
})
