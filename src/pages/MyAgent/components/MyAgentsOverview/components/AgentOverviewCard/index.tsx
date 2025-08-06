import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import dayjs from 'dayjs'
import Avatar from 'components/Avatar'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { useTimezone } from 'store/timezonecache/hooks'
import { vm } from 'pages/helper'

interface AgentOverviewCardProps {
  data: AgentDetailDataType
}

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 16px;
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 12px ${({ theme }) => theme.bgL0}40;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      margin-bottom: ${vm(16)};
      border-radius: ${vm(16)};
    `}
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(16)};
    `}
`

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(4)};
    `}
`

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
    `}
`

const TriggerTime = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 20px;
  color: ${({ theme }) => theme.textL1};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  .icon-chat-share {
    font-size: 16px;
    color: ${({ theme }) => theme.textL1};
  }

  &:hover {
    background: ${({ theme }) => theme.bgL2};
    border-color: ${({ theme }) => theme.brand6};
    color: ${({ theme }) => theme.brand6};

    .icon-chat-share {
      color: ${({ theme }) => theme.brand6};
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(16)};
      border-radius: ${vm(20)};
      font-size: ${vm(14)};
      gap: ${vm(6)};

      .icon-chat-share {
        font-size: ${vm(16)};
      }
    `}
`

const TitleSection = styled.div`
  padding: 12px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;
  margin-bottom: 16px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      border-radius: ${vm(12)};
      margin-bottom: ${vm(16)};
    `}
`

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  line-height: 1.5;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(16)};
    `}
`

const MessageContent = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  line-height: 1.6;
  word-break: break-word;

  /* Markdown styles */
  .markdown-wrapper {
    width: 100%;

    p {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    a {
      color: ${({ theme }) => theme.brand6};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    ul,
    ol {
      margin: 12px 0;
      padding-left: 24px;
    }

    li {
      margin-bottom: 8px;
    }

    pre {
      background: ${({ theme }) => theme.bgL2};
      padding: 12px;
      border-radius: 8px;
      overflow-x: auto;
      margin: 12px 0;
    }

    code {
      background: ${({ theme }) => theme.bgL2};
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};

      .markdown-wrapper {
        p {
          margin-bottom: ${vm(12)};
        }

        ul,
        ol {
          margin: ${vm(12)} 0;
          padding-left: ${vm(24)};
        }

        li {
          margin-bottom: ${vm(8)};
        }

        pre {
          padding: ${vm(12)};
          border-radius: ${vm(8)};
          margin: ${vm(12)} 0;
        }

        code {
          padding: ${vm(2)} ${vm(6)};
          border-radius: ${vm(4)};
          font-size: ${vm(13)};
        }
      }
    `}
`

const EmptyMessage = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL3};
  text-align: center;
  padding: 24px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      padding: ${vm(24)};
    `}
`

function AgentOverviewCard({ data }: AgentOverviewCardProps) {
  const [timezone] = useTimezone()

  // Get first trigger history item
  console.log('data', data)
  const firstTriggerHistory = data.trigger_history?.[0]
  const triggerTime = firstTriggerHistory?.trigger_time
  const message = firstTriggerHistory?.message || firstTriggerHistory?.error

  // Format trigger time
  const formatTriggerTime = useCallback(
    (timestamp: number) => {
      if (!timestamp) return ''
      return dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')
    },
    [timezone],
  )

  // Handle share button click
  const handleShare = useCallback(() => {
    // TODO: Implement share functionality
    console.log('Share clicked for agent:', data.task_id)
  }, [data.task_id])

  return (
    <CardWrapper>
      {/* Header with user info and share button */}
      <CardHeader>
        <UserInfo>
          <Avatar size={40} name={data.user_name || 'Unknown'} avatar={data.user_avatar} />
          <UserDetails>
            <UserName>{data.user_name || 'Unknown User'}</UserName>
            {triggerTime && <TriggerTime>{formatTriggerTime(triggerTime)}</TriggerTime>}
          </UserDetails>
        </UserInfo>

        <ShareButton onClick={handleShare}>
          <IconBase className='icon-chat-share' />
          <Trans>Share</Trans>
        </ShareButton>
      </CardHeader>

      {/* Title section */}
      <TitleSection>
        <Title>{data.title || 'Untitled Agent'}</Title>
      </TitleSection>

      {/* Message content */}
      {message ? (
        <MessageContent>
          <Markdown>{message}</Markdown>
        </MessageContent>
      ) : (
        <EmptyMessage>
          <Trans>No messages yet</Trans>
        </EmptyMessage>
      )}
    </CardWrapper>
  )
}

export default memo(AgentOverviewCard)
