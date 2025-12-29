import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ANI_DURATION } from 'constants/index'
import { t } from '@lingui/core/macro'
import { ButtonBorder } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { useSendChatUserContent } from 'store/createstrategy/hooks/useStream'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useCurrentRouter, usePromptModalToggle } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { isMatchCurrentRouter } from 'utils'
import { useChatValue } from 'store/createstrategy/hooks/useChatContent'
import { useResetAllState } from 'store/createstrategy/hooks/useResetAllState'
import { useChatTabIndex } from 'store/chat/hooks'

const ChatInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding: 8px;
`

const ChatInputContentWrapper = styled.div<{ $value: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 20px;
  padding: 12px;
  background: ${({ theme }) => theme.black700};
  backdrop-filter: blur(8px);
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(12)};
      #waveform {
        width: ${vm(164)};
        height: ${vm(24)};
      }
    `}
`

const ClickWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const InputWrapper = styled.div<{ $isChatPage: boolean; $isMultiline: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ $isMultiline }) => ($isMultiline ? '1fr' : '1fr auto')};
  grid-template-rows: ${({ $isMultiline }) => ($isMultiline ? 'auto auto' : 'auto')};
  align-items: ${({ $isMultiline }) => ($isMultiline ? 'stretch' : 'center')};
  min-height: 40px;
  width: 100%;
  padding: ${({ $isChatPage }) => ($isChatPage ? '8px 8px 0' : '0 8px')};
  gap: 8px;
  flex-grow: 1;
  flex-shrink: 1;
  z-index: 2;

  textarea {
    grid-column: 1;
    grid-row: 1;
    min-width: ${({ $isMultiline }) => ($isMultiline ? '100%' : '200px')};
  }

  /* 单行模式下SendButton在第二列 */
  ${({ $isMultiline }) =>
    !$isMultiline &&
    css`
      > div:last-child {
        grid-column: 2;
        grid-row: 1;
      }
    `}

  /* 多行模式下SendButton在第二行右对齐 */
  ${({ $isMultiline }) =>
    $isMultiline &&
    css`
      > div:last-child {
        grid-column: 1;
        grid-row: 2;
        justify-self: end;
        align-self: start !important;
      }
    `}

  ${({ theme, $isMultiline, $isChatPage }) =>
    theme.isMobile
      ? css`
          padding: 0 ${vm(8)};
          gap: ${$isChatPage ? vm(20) : vm(8)};
          textarea {
            color: ${theme.textL2};
            min-width: ${$isMultiline ? '100%' : vm(200)};
          }
        `
      : css`
          gap: ${$isChatPage ? 20 : 8}px;
        `}
`

const ChatFileButton = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: transparent;
  .icon-chat-upload {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
      .icon-chat-upload {
        font-size: ${vm(18)};
      }
    `}
`

const Operator = styled.div<{ $isChatPage: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ $isChatPage }) =>
    $isChatPage &&
    css`
      width: 100%;
    `}
`

const ButtonPrompt = styled(ButtonBorder)`
  gap: 6px;
  width: fit-content;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  border-color: ${({ theme }) => theme.text10};
  border-radius: 0;
  color: ${({ theme }) => theme.textL3};
  .icon-prompt {
    transition: color ${ANI_DURATION}s;
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  &:hover {
    opacity: 1;
    color: ${({ theme }) => theme.textL1};
    border-color: ${({ theme }) => theme.text20};
    .icon-prompt {
      color: ${({ theme }) => theme.textL1};
    }
  }
`

const SendButton = styled(ChatFileButton)<{ $value: boolean }>`
  background-color: ${({ theme }) => theme.brand200};
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  flex-shrink: 0;
  align-self: flex-end;
  .icon-chat-back {
    font-size: 20px;
    transform: rotate(90deg);
    color: ${({ theme }) => theme.textL1};
    transition: all ${ANI_DURATION}s;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-chat-back {
        font-size: ${vm(20)};
      }
    `}
  ${({ $value }) =>
    !$value &&
    css`
      background-color: ${({ theme }) => theme.text10};
      .icon-chat-back {
        color: ${({ theme }) => theme.textL3};
      }
    `}
`

export default memo(function ChatInput({ isChatPage = false }: { isChatPage?: boolean }) {
  const [, setChatTabIndex] = useChatTabIndex()
  const [value, setValue] = useChatValue()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isMultiline, setIsMultiline] = useState(false)
  const [isLoadingChatStream] = useIsLoadingChatStream()
  const [currentRouter, setCurrentRouter] = useCurrentRouter()
  const resetAllState = useResetAllState()
  const togglePromptModal = usePromptModalToggle()
  const sendChatUserContent = useSendChatUserContent()
  const handleWrapperClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // 检测是否多行
  const checkMultiline = useCallback(() => {
    if (inputRef.current) {
      const textarea = inputRef.current
      const inputOneLineHeight = 24
      const isMulti = textarea.scrollHeight > inputOneLineHeight

      // 如果内容为空，重置为单行模式
      if (!value) {
        setIsMultiline(false)
      }
      // 如果检测到多行条件且当前不是多行状态，设置为多行
      else if (isMulti && !isMultiline) {
        setIsMultiline(true)
      }
      // 如果已经是多行状态，保持多行状态（不会因为条件不满足而重置）
    }
  }, [value, isMultiline])

  const requestStream = useCallback(async () => {
    if (!value || isLoadingChatStream) {
      return
    }
    if (!isMatchCurrentRouter(currentRouter, ROUTER.CREATE_STRATEGY)) {
      resetAllState()
    }
    setTimeout(() => {
      sendChatUserContent({
        value,
      })
      if (!isMatchCurrentRouter(currentRouter, ROUTER.CREATE_STRATEGY)) {
        setCurrentRouter(ROUTER.CREATE_STRATEGY)
      }
    }, 0)
  }, [value, isLoadingChatStream, currentRouter, resetAllState, sendChatUserContent, setCurrentRouter])

  useEffect(() => {
    checkMultiline()
  }, [checkMultiline])

  return (
    <ChatInputWrapper
      className='chat-input-wrapper'
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <ChatInputContentWrapper $value={value}>
        <ClickWrapper onClick={handleWrapperClick}></ClickWrapper>
        <InputWrapper $isChatPage={isChatPage} $isMultiline={isMultiline || isChatPage}>
          <InputArea
            autoFocus={false}
            value={value}
            ref={inputRef as any}
            setValue={setValue}
            disabled={isLoadingChatStream}
            placeholder={isChatPage ? t`Express your strategy in natural language.` : t`Ask me anything about crypto`}
            enterConfirmCallback={requestStream}
          />
          <Operator $isChatPage={isChatPage}>
            {isChatPage && (
              <ButtonPrompt onClick={() => setChatTabIndex(0)}>
                <Trans>Research</Trans>
              </ButtonPrompt>
            )}
            <SendButton $borderRadius={0} $hideBorder={true} $value={!!value} onClick={requestStream}>
              <IconBase className='icon-chat-back' />
            </SendButton>
          </Operator>
        </InputWrapper>
      </ChatInputContentWrapper>
    </ChatInputWrapper>
  )
})
