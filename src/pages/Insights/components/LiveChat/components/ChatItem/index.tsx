import styled, { css } from 'styled-components'
import { ROLE_TYPE } from 'store/chat/chat.d'
import { memo, useState } from 'react'
import { Content } from 'pages/Chat/styles'
import { LiveChatDataType } from 'store/insights/insights'
import { vm } from 'pages/helper'
import Markdown from 'components/Markdown'
import logo from 'assets/png/logo.png'
import { Trans } from '@lingui/react/macro'

const ChatItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  gap: 40px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(40)};
    `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};
  img {
    width: 18px;
    height: 18px;
  }
`

const UserContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`

const UserContent = styled.div`
  display: flex;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  width: fit-content;
  word-break: break-word;
  align-self: flex-end;
  max-width: 80%;
  padding: 16px;
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
      line-height: 0.22rem;
    `}
`

const AssistantContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`

const AssistantContent = styled.div<{ $isExpanded: boolean }>`
  display: flex;
  padding: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 26px;
  gap: 28px;
  width: fit-content;
  padding: 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.textL2};
  background: ${({ theme }) => theme.bgT30};
  word-break: break-word;
  cursor: pointer;

  .markdown-wrapper {
    ${({ $isExpanded }) =>
      !$isExpanded &&
      css`
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;

        /* 确保子元素也遵循单行限制 */
        * {
          display: inline;
          margin: 0;
          padding: 0;
        }

        p,
        ul,
        ol,
        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          display: inline;
        }
      `}
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

export default memo(function ChatItem({ data }: { data: LiveChatDataType }) {
  const { user_id, user_name, user_query, agent_response, user_avatar } = data
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <ChatItemWrapper>
      <UserContentWrapper>
        <Title>
          <img src={user_avatar} alt='user' />
          {user_name}
        </Title>
        <UserContent role={ROLE_TYPE.USER}>
          <Content role={ROLE_TYPE.USER}>{user_query}</Content>
        </UserContent>
      </UserContentWrapper>
      <AssistantContentWrapper>
        <Title>
          <img src={logo} alt='logo' />
          <span>
            <Trans>Starchild</Trans>
          </span>
        </Title>
        <AssistantContent role={ROLE_TYPE.ASSISTANT} $isExpanded={isExpanded} onClick={handleToggleExpand}>
          <Content role={ROLE_TYPE.ASSISTANT}>
            <Markdown>{agent_response}</Markdown>
          </Content>
        </AssistantContent>
      </AssistantContentWrapper>
    </ChatItemWrapper>
  )
})
