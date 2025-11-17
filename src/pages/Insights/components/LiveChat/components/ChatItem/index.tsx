import dayjs from 'dayjs'
import styled, { css } from 'styled-components'
import { ROLE_TYPE } from 'store/chat/chat.d'
import { memo, useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { LiveChatDataType } from 'store/insights/insights'
import { vm } from 'pages/helper'
import Markdown from 'components/Markdown'
import logo from 'assets/png/logo.png'
import { Trans } from '@lingui/react/macro'
import { useTimezone } from 'store/timezonecache/hooks'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useCurrentLiveChatData, useIsExpandedLiveChat } from 'store/insights/hooks/useLiveChatHooks'

const ChatItemWrapper = styled.div<{ $isChatDetail?: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 24px;
  ${({ $isChatDetail }) =>
    $isChatDetail &&
    css`
      gap: 20px;
    `}
  ${({ theme, $isChatDetail }) =>
    theme.isMobile &&
    css`
      gap: ${$isChatDetail ? vm(20) : vm(24)};
    `}
`

const CurrentTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 18px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(18)};
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};
  img {
    width: 24px;
    height: 24px;
    border-radius: 6px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      img {
        width: ${vm(24)};
        height: ${vm(24)};
        border-radius: ${vm(6)};
      }
    `}
`

const UserContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const UserContentOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 30px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding-left: ${vm(30)};
    `}
`

const UserContent = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  width: fit-content;
  word-break: break-word;
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT30};
  ${({ theme, role }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
      border-radius: ${vm(8)};
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.26rem;
      padding: ${vm(12)} ${vm(16)};
      border-radius: ${vm(12)};
    `}
`

const AssistantContentWrapper = styled.div<{ $isChatDetail?: boolean; $showViewMore: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  ${({ $isChatDetail, $showViewMore, theme }) =>
    !$isChatDetail &&
    $showViewMore &&
    !theme.isMobile &&
    css`
      cursor: pointer;
      &:hover {
        .view-more-button {
          opacity: 0.7;
        }
      }
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const AssistantContent = styled.div<{ $isChatDetail?: boolean }>`
  display: flex;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  gap: 24px;
  width: fit-content;
  padding-left: 30px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textL2};
  word-break: break-word;
  ${({ $isChatDetail }) =>
    !$isChatDetail &&
    css`
      .markdown-wrapper {
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
        overflow: hidden;
        white-space: normal;
      }
    `}
  ${({ $isChatDetail }) =>
    $isChatDetail &&
    css`
      gap: ${vm(20)};
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(24)};
      padding-left: ${vm(30)};
      border-radius: ${vm(12)};
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.26rem;
    `}
`

const ViewMoreButton = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  padding-left: 30px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.brand100};
  transition: all ${ANI_DURATION}s;
  .icon-chat-expand {
    margin-top: 2px;
    font-size: 14px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(2)};
      padding-left: ${vm(30)};
      font-size: 0.12rem;
      font-weight: 500;
      line-height: 0.18rem;
      .icon-chat-expand {
        margin-top: ${vm(2)};
        font-size: 0.14rem;
      }
    `}
`

export default memo(function ChatItem({ data, isChatDetail }: { data: LiveChatDataType; isChatDetail?: boolean }) {
  const { user_name, user_query, agent_response, user_avatar, created_at } = data
  const [timezone] = useTimezone()
  const contentRef = useRef<HTMLDivElement>(null)
  const [showViewMore, setShowViewMore] = useState(false)
  const [isExpandedLiveChat, setIsExpandedLiveChat] = useIsExpandedLiveChat()
  const [currentLiveChatData, changeCurrentLiveChatData] = useCurrentLiveChatData()

  const formatTime = useMemo(() => {
    const messageTime = dayjs.tz(created_at, timezone)
    const now = dayjs.tz(undefined, timezone)

    // 如果是今天，只显示时分
    if (messageTime.isSame(now, 'day')) {
      return messageTime.format('HH:mm')
    }

    // 如果是今年，显示月、日、时分
    if (messageTime.isSame(now, 'year')) {
      return messageTime.format('MM-DD HH:mm')
    }

    // 如果不是今年，显示年、月、日、时分
    return messageTime.format('YYYY-MM-DD HH:mm')
  }, [created_at, timezone])

  const handleClickViewMore = useCallback(() => {
    if (currentLiveChatData?.msg_id === data.msg_id && isExpandedLiveChat) {
      setIsExpandedLiveChat(false)
      changeCurrentLiveChatData(null)
      return
    }
    setIsExpandedLiveChat(true)
    changeCurrentLiveChatData(data)
  }, [data, currentLiveChatData, isExpandedLiveChat, setIsExpandedLiveChat, changeCurrentLiveChatData])

  useEffect(() => {
    if (contentRef.current) {
      const element = contentRef.current.querySelector('.markdown-wrapper')
      if (element) {
        // 检查内容是否超过 5 行
        const isOverflowing = element.scrollHeight > element.clientHeight
        setShowViewMore(isOverflowing)
      }
    }
  }, [agent_response])

  return (
    <ChatItemWrapper $isChatDetail={isChatDetail}>
      {!isChatDetail && <CurrentTime>{formatTime}</CurrentTime>}
      <UserContentWrapper>
        <Title>
          <img src={user_avatar} alt='user' />
          {user_name}
        </Title>
        <UserContentOuterWrapper>
          <UserContent role={ROLE_TYPE.USER}>{user_query}</UserContent>
        </UserContentOuterWrapper>
      </UserContentWrapper>
      <AssistantContentWrapper $isChatDetail={isChatDetail} $showViewMore={showViewMore} onClick={handleClickViewMore}>
        <Title>
          <img src={logo} alt='logo' />
          <span>
            <Trans>Starchild</Trans>
          </span>
        </Title>
        <AssistantContent $isChatDetail={isChatDetail} role={ROLE_TYPE.ASSISTANT} ref={contentRef}>
          <Markdown>{agent_response}</Markdown>
        </AssistantContent>
        {showViewMore && !isChatDetail && (
          <ViewMoreButton className='view-more-button'>
            <span>
              <Trans>View More</Trans>
            </span>
            <IconBase className='icon-chat-expand' />
          </ViewMoreButton>
        )}
      </AssistantContentWrapper>
    </ChatItemWrapper>
  )
})
