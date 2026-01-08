import styled, { css } from 'styled-components'
import { memo, useCallback, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { t } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import { useSendChatUserContent } from 'store/createstrategy/hooks/useStream'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import { useConnectWalletModalToggle, useCurrentRouter, useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { isMatchCurrentRouter } from 'utils'
import { useChatValue } from 'store/createstrategy/hooks/useChatContent'
import { useResetAllState } from 'store/createstrategy/hooks/useResetAllState'
// import ModeSelect from 'pages/Chat/components/ChatInput/components/ModeSelect'
import { Trans } from '@lingui/react/macro'
import { useIsLogin } from 'store/login/hooks'

const ChatInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding: 20px;
`

const ChatInputContentWrapper = styled.div<{ $value: string; $isChatPage: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 20px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.black600};
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(12px);
  z-index: 2;
  ${({ $isChatPage }) =>
    !$isChatPage &&
    css`
      border-radius: 8px;
      border: none;
      padding: 20px;
    `}
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

const LoginToView = styled.div`
  position: absolute;
  top: -12px;
  left: 20px;
  display: flex;
  gap: 8px;
  width: calc(100% - 40px);
  height: 64px;
  padding: 8px 20px 0;
  z-index: 1;
  border-radius: 12px;
  backdrop-filter: blur(12px);
  background-color: ${({ theme }) => theme.black600};
  cursor: pointer;
  span:first-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black100};
  }
  span:last-child {
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.brand100};
  }
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
  padding: ${({ $isChatPage }) => ($isChatPage ? '8px' : '0')};
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
            color: ${theme.black100};
            min-width: ${$isMultiline ? '100%' : vm(200)};
          }
        `
      : css`
          gap: ${$isChatPage ? 40 : 8}px;
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

const SendButton = styled(ButtonCommon)`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  align-self: flex-end;
  .icon-arrow {
    font-size: 24px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .icon-arrow {
        font-size: ${vm(24)};
      }
    `}
`

export default memo(function ChatInput({ isChatPage = false }: { isChatPage?: boolean }) {
  const isLogin = useIsLogin()
  const [value, setValue] = useChatValue()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isMultiline, setIsMultiline] = useState(true)
  const [isLoadingChatStream] = useIsLoadingChatStream()
  const currentRouter = useCurrentRouter()
  const setCurrentRouter = useSetCurrentRouter()
  const resetAllState = useResetAllState()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const sendChatUserContent = useSendChatUserContent()
  const handleWrapperClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // 检测是否多行
  // const checkMultiline = useCallback(() => {
  //   if (inputRef.current) {
  //     const textarea = inputRef.current
  //     const inputOneLineHeight = 24
  //     const isMulti = textarea.scrollHeight > inputOneLineHeight

  //     // 如果内容为空，重置为单行模式
  //     if (!value) {
  //       setIsMultiline(false)
  //     }
  //     // 如果检测到多行条件且当前不是多行状态，设置为多行
  //     else if (isMulti && !isMultiline) {
  //       setIsMultiline(true)
  //     }
  //     // 如果已经是多行状态，保持多行状态（不会因为条件不满足而重置）
  //   }
  // }, [value, isMultiline])

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

  const handleLogin = useCallback(() => {
    toggleConnectWalletModal()
  }, [toggleConnectWalletModal])

  // useEffect(() => {
  //   checkMultiline()
  // }, [checkMultiline])

  return (
    <ChatInputWrapper
      className='chat-input-wrapper'
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      {!isLogin && !isChatPage && (
        <LoginToView onClick={handleLogin}>
          <span>
            <Trans>Log in to view AI responses</Trans>
          </span>
          <span>
            <Trans>Log in</Trans>
          </span>
        </LoginToView>
      )}
      <ChatInputContentWrapper $isChatPage={isChatPage} $value={value}>
        <ClickWrapper onClick={handleWrapperClick}></ClickWrapper>
        <InputWrapper $isChatPage={isChatPage} $isMultiline={isMultiline}>
          <InputArea
            autoFocus={false}
            value={value}
            ref={inputRef as any}
            setValue={setValue}
            disabled={isLoadingChatStream}
            placeholder={
              isChatPage
                ? t`Turn your idea into live strategy. e.g., Buy ETH when RSI < 30 on 15m chart.`
                : t`Refine logic, check paper trade, or launch to earn...`
            }
            enterConfirmCallback={requestStream}
          />
          <Operator $isChatPage={isChatPage}>
            {/* {isChatPage && <ModeSelect />} */}
            <div></div>
            <SendButton $disabled={!value?.trim()} onClick={requestStream}>
              <IconBase className='icon-arrow' />
            </SendButton>
          </Operator>
        </InputWrapper>
      </ChatInputContentWrapper>
    </ChatInputWrapper>
  )
})
