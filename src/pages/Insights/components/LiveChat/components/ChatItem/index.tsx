import styled, { css } from 'styled-components'
import { ROLE_TYPE } from 'store/chat/chat.d'
import { memo, useState } from 'react'
import { Content } from 'pages/Chat/styles'
import { LiveChatDataType } from 'store/insights/insights'
import { vm } from 'pages/helper'
import Markdown from 'components/Markdown'
import logo from 'assets/png/logo.png'
import avatar from 'assets/livechat/avatar.png'
import avatar1 from 'assets/livechat/avatar-1.png'
import avatar2 from 'assets/livechat/avatar-2.png'
import avatar3 from 'assets/livechat/avatar-3.png'
import avatar4 from 'assets/livechat/avatar-4.png'
import avatar5 from 'assets/livechat/avatar-5.png'
import avatar6 from 'assets/livechat/avatar-6.png'
import avatar7 from 'assets/livechat/avatar-7.png'
import avatar8 from 'assets/livechat/avatar-8.png'
import avatar9 from 'assets/livechat/avatar-9.png'
import avatar10 from 'assets/livechat/avatar-10.png'
import avatar11 from 'assets/livechat/avatar-11.png'
import avatar12 from 'assets/livechat/avatar-12.png'
import avatar13 from 'assets/livechat/avatar-13.png'
import avatar14 from 'assets/livechat/avatar-14.png'
import avatar15 from 'assets/livechat/avatar-15.png'
import avatar16 from 'assets/livechat/avatar-16.png'
import avatar17 from 'assets/livechat/avatar-17.png'
import avatar18 from 'assets/livechat/avatar-18.png'
import avatar19 from 'assets/livechat/avatar-19.png'
import { Trans } from '@lingui/react/macro'

const avatarList = [
  avatar,
  avatar1,
  avatar2,
  avatar3,
  avatar4,
  avatar5,
  avatar6,
  avatar7,
  avatar8,
  avatar9,
  avatar10,
  avatar11,
  avatar12,
  avatar13,
  avatar14,
  avatar15,
  avatar16,
  avatar17,
  avatar18,
  avatar19,
]

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
  width: 100%;
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
  const { user_id, user_name, user_query, agent_response } = data
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <ChatItemWrapper>
      <UserContentWrapper>
        <Title>
          <img src={avatarList[Number(user_id) % avatarList.length]} alt='user' />
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
