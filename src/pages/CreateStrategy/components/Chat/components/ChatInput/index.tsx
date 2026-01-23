import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { msg } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import { useSendChatUserContent } from 'store/createstrategy/hooks/useStream'
import { useIsLoadingChatStream } from 'store/createstrategy/hooks/useLoadingState'
import { useConnectWalletModalToggle, useCurrentRouter, useSetCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import { isMatchCurrentRouter } from 'utils'
import { useChatValue } from 'store/createstrategy/hooks/useChatContent'
import { useResetAllState } from 'store/createstrategy/hooks/useResetAllState'
// import ModeSelect from 'pages/Chat/components/ChatInput/components/ModeSelect'
import { Trans, useLingui } from '@lingui/react/macro'
import { useIsLogin } from 'store/login/hooks'
import { useCreateStrategyDetail } from 'store/createstrategy/hooks/useCreateStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useUserConfig } from 'store/createstrategy/hooks/useUserConfig'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'

// 打字机效果的 placeholder 数组


// 打字机效果 hook
function useTypewriterPlaceholder(enabled: boolean, userHasInput: boolean) {
   const { t } = useLingui()
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing')
  const charIndexRef = useRef(0)
  const prevUserHasInputRef = useRef(userHasInput)

  const TYPEWRITER_PLACEHOLDERS = useMemo(() => {
    return [
      t(msg`Turn your idea into live strategy. e.g., "I have 1,000 USDC. Grow it safely while I sleep. No degen stuff."`),
      t(msg`Turn your idea into live strategy. e.g., "I need to pay for my vacation next month. Give me a strategy with 20% upside."`),
      t(msg`Turn your idea into live strategy. e.g., "Everything is dumped too hard. It\'s time for a mean reversion bounce."`),
    ]
  }, [t])

  // 当用户从有输入变为无输入时，重置动画
  useEffect(() => {
    if (prevUserHasInputRef.current && !userHasInput && enabled) {
      charIndexRef.current = 0
      setDisplayText('')
      setCurrentIndex(0)
      setPhase('typing')
    }
    prevUserHasInputRef.current = userHasInput
  }, [userHasInput, enabled])

  useEffect(() => {
    // 如果用户有输入，暂停动画
    if (userHasInput) {
      return
    }

    // 如果未启用，返回空
    if (!enabled) {
      setDisplayText('')
      return
    }

    const currentText = TYPEWRITER_PLACEHOLDERS[currentIndex]

    if (phase === 'typing') {
      // 正在打字
      if (charIndexRef.current < currentText.length) {
        const timeout = setTimeout(() => {
          charIndexRef.current += 1
          setDisplayText(currentText.slice(0, charIndexRef.current))
        }, 30) // 打字速度 30ms/字符
        return () => clearTimeout(timeout)
      } else {
        // 打字完成，进入等待阶段
        setPhase('waiting')
      }
    } else if (phase === 'waiting') {
      // 等待 3 秒
      const timeout = setTimeout(() => {
        setPhase('deleting')
      }, 3000)
      return () => clearTimeout(timeout)
    } else if (phase === 'deleting') {
      // 正在删除
      if (charIndexRef.current > 0) {
        const timeout = setTimeout(() => {
          charIndexRef.current -= 1
          setDisplayText(currentText.slice(0, charIndexRef.current))
        }, 15) // 删除速度 15ms/字符
        return () => clearTimeout(timeout)
      } else {
        // 删除完成，切换到下一句
        setCurrentIndex((prev) => (prev + 1) % TYPEWRITER_PLACEHOLDERS.length)
        setPhase('typing')
      }
    }
  }, [enabled, userHasInput, displayText, currentIndex, phase, TYPEWRITER_PLACEHOLDERS])

  return userHasInput ? '' : displayText
}

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
  padding: 20px;
  border-radius: 12px;
  background: ${({ theme }) => theme.black900};
  backdrop-filter: blur(12px);
  z-index: 2;
  ${({ $isChatPage }) =>
    !$isChatPage &&
    css`
      border-radius: 8px;
      background: ${({ theme }) => theme.black800};
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
  gap: 8px;
  flex-grow: 1;
  flex-shrink: 1;
  z-index: 2;

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

// 自定义打字机 placeholder 覆盖层
const TypewriterPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black300};
  pointer-events: none;
  white-space: pre-wrap;
  word-break: break-word;
  z-index: 0;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
    `}
`

const InputAreaWrapper = styled.div`
  position: relative;
  grid-column: 1;
  grid-row: 1;
  width: 100%;
`

const Operator = styled.div<{ $isChatPage: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const SendButton = styled(ButtonCommon)<{ $disabled: boolean }>`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  align-self: flex-end;
  .icon-send {
    font-size: 20px;
  }
  ${({ $disabled }) =>
    $disabled &&
    css`
      color: ${({ theme }) => theme.black200};
      background: ${({ theme }) => theme.black700};
    `}
`

export default memo(function ChatInput({ isChatPage = false }: { isChatPage?: boolean }) {
  const { t } = useLingui()
  const theme = useTheme()
  const toast = useToast()
  const isLogin = useIsLogin()
  const { userConfig } = useUserConfig()
  const [value, setValue] = useChatValue()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isMultiline, setIsMultiline] = useState(true)
  const [isLoadingChatStream] = useIsLoadingChatStream()
  const currentRouter = useCurrentRouter()
  const setCurrentRouter = useSetCurrentRouter()
  const resetAllState = useResetAllState()
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const sendChatUserContent = useSendChatUserContent()
  const { strategyId } = useParsedQueryString()
  const { strategyDetail } = useCreateStrategyDetail({ strategyId: strategyId || '' })
  const { strategy_config } = strategyDetail || {
    strategy_config: null,
  }
  const { strategy_limit, strategy_count, can_create_more } = userConfig || {
    strategy_limit: 1,
    strategy_count: 0,
    can_create_more: false,
  }
  const inputDisabled = useMemo(() => {
    return !!strategy_config && !isLogin
  }, [strategy_config, isLogin])

  // 打字机效果 placeholder
  const userHasInput = !!value?.trim()
  const typewriterPlaceholder = useTypewriterPlaceholder(isChatPage, userHasInput)

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
    if (!can_create_more && !strategyId) {
      toast({
        title: t(msg`Create strategy failed`),
        description: t(msg`Slot limit reached (${strategy_count}/${strategy_limit})! Boost your current strategy's APR to unlock more slots.`),
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-create-strategy',
        iconTheme: theme.black0,
      })
      return
    }
    if (!isMatchCurrentRouter(currentRouter, ROUTER.CREATE_STRATEGY)) {
      resetAllState()
    }
    setTimeout(() => {
      if (!isMatchCurrentRouter(currentRouter, ROUTER.CREATE_STRATEGY)) {
        setCurrentRouter(ROUTER.CREATE_STRATEGY)
      }
      sendChatUserContent({
        value,
      })
    }, 0)
  }, [
    value,
    strategyId,
    isLoadingChatStream,
    currentRouter,
    can_create_more,
    strategy_count,
    strategy_limit,
    theme.black0,
    toast,
    resetAllState,
    sendChatUserContent,
    setCurrentRouter,
    t,
  ])

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
        <InputWrapper onClick={handleWrapperClick} $isChatPage={isChatPage} $isMultiline={isMultiline}>
          <InputAreaWrapper>
            {isChatPage && !userHasInput && typewriterPlaceholder && (
              <TypewriterPlaceholder>{typewriterPlaceholder}</TypewriterPlaceholder>
            )}
            <InputArea
              autoFocus={false}
              value={value}
              ref={inputRef as any}
              setValue={setValue}
              disabled={isLoadingChatStream || inputDisabled}
              placeholder={isChatPage ? '' : t(msg`Refine logic, check paper trade, or launch to earn...`)}
              enterConfirmCallback={requestStream}
            />
          </InputAreaWrapper>
          <Operator $isChatPage={isChatPage}>
            <SendButton $disabled={!value?.trim() || inputDisabled} onClick={requestStream}>
              <IconBase className='icon-send' />
            </SendButton>
          </Operator>
        </InputWrapper>
      </ChatInputContentWrapper>
    </ChatInputWrapper>
  )
})
