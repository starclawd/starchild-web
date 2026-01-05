import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import { ROUTER } from 'pages/router'
import { useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useIsMenuNoAgentOpen } from 'store/myagentcache/hooks'
import styled, { css } from 'styled-components'

const MenuNoAgentWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.black800};
  margin-top: 12px;
  .icon-chat-close {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 18px;
    color: ${({ theme }) => theme.black500};
    cursor: pointer;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-top: ${vm(4)};
      gap: ${vm(8)};
      padding: ${vm(12)};
      border-radius: ${vm(12)};
      .icon-chat-close {
        font-size: 0.18rem;
        top: ${vm(12)};
        right: ${vm(12)};
        cursor: default;
      }
    `}
`

const Title = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.brand50};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

const Description = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  opacity: 0.8;
  color: ${({ theme }) => theme.brand50};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
    `}
`

const ButtonChat = styled(ButtonCommon)`
  width: fit-content;
  height: 28px;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  padding: 0 12px;
  border-radius: 6px;
  color: ${({ theme }) => theme.black200};
  background-color: ${({ theme }) => theme.black800};
  .icon-chat-back {
    font-size: 14px;
    transform: rotate(180deg);
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(12)};
      height: ${vm(28)};
      gap: ${vm(4)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      .icon-chat-back {
        font-size: 0.14rem;
      }
    `}
`

export default function MenuNoAgent() {
  const [, setCurrentRouter] = useCurrentRouter()
  const [isMenuNoAgentOpen, updateIsMenuNoAgentOpen] = useIsMenuNoAgentOpen()
  const goChatPage = useCallback(() => {
    setCurrentRouter(ROUTER.CHAT)
  }, [setCurrentRouter])
  const closeMenuNoAgent = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      updateIsMenuNoAgentOpen(false)
    },
    [updateIsMenuNoAgentOpen],
  )
  if (!isMenuNoAgentOpen) return null
  return (
    <MenuNoAgentWrapper>
      <IconBase onClick={closeMenuNoAgent} className='icon-chat-close' />
      <Title>
        <Trans>Did you know?</Trans>
      </Title>
      <Description>
        <Trans>
          You can describe tasks in the chat, and Starchild will automatically create them for you — including time,
          trigger, and details.
        </Trans>
      </Description>
      <ButtonChat onClick={goChatPage}>
        <Trans>Try it in chat</Trans>
        <IconBase className='icon-chat-back' />
      </ButtonChat>
    </MenuNoAgentWrapper>
  )
}
