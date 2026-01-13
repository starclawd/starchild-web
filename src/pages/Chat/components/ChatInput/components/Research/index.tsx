import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useInputValue, useIsAiContentEmpty, useIsFocus, useIsLoadingData, useSendAiContent } from 'store/chat/hooks'
import { IconBase } from 'components/Icons'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { useIsMobile } from 'store/application/hooks'
import { t } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import ModeSelect from '../ModeSelect'

const ChatInputOutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      position: sticky;
      bottom: 0;
      width: 100%;
    `}
`

const ChatInputContentWrapper = styled.div<{ $value: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.black600};
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(12px);
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

const InputWrapper = styled.div<{ $isMultiline: boolean; $isEmpty: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ $isMultiline }) => ($isMultiline ? '1fr' : '1fr auto')};
  grid-template-rows: ${({ $isMultiline }) => ($isMultiline ? 'auto auto' : 'auto')};
  align-items: ${({ $isMultiline }) => ($isMultiline ? 'stretch' : 'center')};
  min-height: 40px;
  width: 100%;
  padding: ${({ $isEmpty }) => ($isEmpty ? '8px' : '0 8px')};
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

  ${({ theme, $isMultiline, $isEmpty }) =>
    theme.isMobile
      ? css`
          padding: 0 ${vm(8)};
          gap: ${vm(8)};
          textarea {
            color: ${theme.black100};
            min-width: ${$isMultiline ? '100%' : vm(200)};
          }
        `
      : css`
          gap: ${$isEmpty ? 40 : 8}px;
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

const Operator = styled.div<{ $isEmpty: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${({ $isEmpty }) =>
    $isEmpty &&
    css`
      width: 100%;
    `}
`

export default memo(function Research() {
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendAiContent = useSendAiContent()
  const [isFocus, setIsFocus] = useIsFocus()
  const inputContentWrapperRef = useRef<HTMLDivElement>(null)
  const [isLoadingData] = useIsLoadingData()
  const [value, setValue] = useInputValue()
  const [isMultiline, setIsMultiline] = useState(true)
  const isEmpty = useIsAiContentEmpty()
  const isMobile = useIsMobile()
  const onFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false)
    }, 200)
  }, [setIsFocus])
  const requestStream = useCallback(async () => {
    if (!value || isLoadingData) {
      return
    }
    sendAiContent({
      value,
    })
  }, [value, sendAiContent, isLoadingData])
  useEffect(() => {
    return () => {
      setValue('')
      setIsFocus(false)
    }
  }, [setIsFocus, setValue])
  const handleWrapperClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  // // 检测是否多行
  // const checkMultiline = useCallback(() => {
  //   if (inputRef.current) {
  //     const textarea = inputRef.current
  //     const inputOneLineHeight = 24
  //     const isMulti = textarea.scrollHeight > inputOneLineHeight
  //     // 如果内容为空，重置为单行模式
  //     if (!value && !isEmpty) {
  //       setIsMultiline(false)
  //     }
  //     // 如果检测到多行条件且当前不是多行状态，设置为多行
  //     else if ((isMulti && !isMultiline) || isEmpty) {
  //       setIsMultiline(true)
  //     }
  //     // 如果已经是多行状态，保持多行状态（不会因为条件不满足而重置）
  //   }
  // }, [value, isMultiline, isEmpty])

  // useEffect(() => {
  //   checkMultiline()
  // }, [checkMultiline])

  return (
    <ChatInputOutWrapper id='chatInputOutWrapper'>
      <ChatInputContentWrapper $value={value} ref={inputContentWrapperRef as any}>
        <ClickWrapper onClick={handleWrapperClick}></ClickWrapper>
        <InputWrapper $isMultiline={isMultiline} $isEmpty={isEmpty}>
          <InputArea
            autoFocus={false}
            value={value}
            ref={inputRef as any}
            setValue={setValue}
            onFocus={onFocus}
            onBlur={onBlur}
            disabled={isLoadingData}
            placeholder={t`Ask me anything about trading...`}
            enterConfirmCallback={requestStream}
          />
          <Operator $isEmpty={isEmpty && !isMobile}>
            {isEmpty && !isMobile && <ModeSelect />}
            <SendButton $disabled={!value?.trim()} onClick={requestStream}>
              <IconBase className='icon-arrow' />
            </SendButton>
          </Operator>
        </InputWrapper>
      </ChatInputContentWrapper>
    </ChatInputOutWrapper>
  )
})
