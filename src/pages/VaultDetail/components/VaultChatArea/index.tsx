import { memo } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'

const ChatAreaContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)} ${vm(20)};
    `}
`

const ChatTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(16)};
  `}
`

const ChatStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.textL3};
  font-size: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
      font-size: ${vm(12)};
    `}
`

const StatusDot = styled.div`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(6)};
      height: ${vm(6)};
    `}
`

const ChatContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(32)} ${vm(20)};
    `}
`

const PlaceholderIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.black600};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(48)};
      height: ${vm(48)};
      margin-bottom: ${vm(16)};
    `}
`

const PlaceholderTitle = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(18)};
      margin-bottom: ${vm(8)};
    `}
`

const PlaceholderDescription = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textL3};
  line-height: 1.5;
  max-width: 280px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(14)};
      max-width: ${vm(240)};
    `}
`

const ChatFooter = styled.div`
  padding: 16px 20px;
  border-top: 1px solid ${({ theme }) => theme.lineDark8};
  background: ${({ theme }) => theme.black800};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)} ${vm(20)};
    `}
`

const PlaceholderInput = styled.div`
  width: 100%;
  height: 40px;
  background: ${({ theme }) => theme.black600};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 6px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: ${({ theme }) => theme.textL4};
  font-size: 14px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      padding: 0 ${vm(12)};
      font-size: ${vm(14)};
    `}
`

const VaultChatArea = memo(() => {
  return (
    <ChatAreaContainer>
      <ChatHeader>
        <ChatTitle><Trans>Strategy Chat</Trans></ChatTitle>
        <ChatStatus>
          <StatusDot />
          <Trans>Offline</Trans>
        </ChatStatus>
      </ChatHeader>

      <ChatContent>
        <PlaceholderIcon>
          <IconBase className='icon-chat' />
        </PlaceholderIcon>
        <PlaceholderTitle>
          <Trans>Chat with Strategy</Trans>
        </PlaceholderTitle>
        <PlaceholderDescription>
          <Trans>
            Ask questions about this vault's strategy, performance, 
            and get real-time insights from the AI assistant.
          </Trans>
        </PlaceholderDescription>
      </ChatContent>

      <ChatFooter>
        <PlaceholderInput>
          <Trans>Type your message here...</Trans>
        </PlaceholderInput>
      </ChatFooter>
    </ChatAreaContainer>
  )
})

VaultChatArea.displayName = 'VaultChatArea'

export default VaultChatArea
