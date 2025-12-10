import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { IconBase } from 'components/Icons'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { ANI_DURATION } from 'constants/index'
import { t } from '@lingui/core/macro'

const ChatInputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  padding: 10px 20px 20px;
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
  border-radius: 24px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(12)};
      border-radius: ${vm(24)} ${vm(24)} 0 0;
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

const InputWrapper = styled.div<{ $isMultiline: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ $isMultiline }) => ($isMultiline ? '1fr' : '1fr auto')};
  grid-template-rows: ${({ $isMultiline }) => ($isMultiline ? 'auto auto' : 'auto')};
  align-items: ${({ $isMultiline }) => ($isMultiline ? 'stretch' : 'center')};
  min-height: 40px;
  width: 100%;
  padding: 0 8px;
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

  ${({ theme, $isMultiline }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(8)};
      gap: ${vm(8)};
      textarea {
        color: ${theme.textL2};
        min-width: ${$isMultiline ? '100%' : vm(200)};
      }
    `}
`

const Handle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  gap: 10px;
  z-index: 2;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(10)};
      height: ${vm(40)};
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

export default memo(function ChatInput() {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [isFocus, setIsFocus] = useState(false)
  const [isMultiline, setIsMultiline] = useState(false)
  const isLoadingData = false
  const onFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false)
    }, 200)
  }, [setIsFocus])

  useEffect(() => {
    return () => {
      setIsFocus(false)
    }
  }, [setIsFocus])
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

  useEffect(() => {
    checkMultiline()
  }, [checkMultiline])

  return (
    <ChatInputWrapper
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <ChatInputContentWrapper $value={value}>
        <ClickWrapper onClick={handleWrapperClick}></ClickWrapper>
        <InputWrapper $isMultiline={isMultiline}>
          <InputArea
            autoFocus={false}
            value={value}
            ref={inputRef as any}
            setValue={setValue}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={isLoadingData}
            placeholder={t`Ask me anything about crypto...`}
            enterConfirmCallback={() => {}}
          />
          <SendButton $borderRadius={22} $hideBorder={true} $value={!!value} onClick={() => {}}>
            <IconBase className='icon-chat-back' />
          </SendButton>
        </InputWrapper>
      </ChatInputContentWrapper>
    </ChatInputWrapper>
  )
})
