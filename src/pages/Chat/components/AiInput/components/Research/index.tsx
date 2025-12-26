import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useChatTabIndex,
  useCloseStream,
  useFileList,
  useInputValue,
  useIsAiContentEmpty,
  useIsFocus,
  useIsLoadingData,
  useIsRenderingData,
  useSendAiContent,
} from 'store/chat/hooks'
import { IconBase } from 'components/Icons'
import { useTheme } from 'store/themecache/hooks'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { useIsLogin } from 'store/login/hooks'
import { t } from '@lingui/core/macro'
import { ButtonBorder } from 'components/Button'

const AiInputWrapper = styled.div<{ $isFromMyAgent: boolean; $isEmpty: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 12px;
  gap: 20px;
  ${({ theme, $isEmpty }) =>
    theme.isMobile
      ? css`
          gap: ${vm(20)};
          padding: 0;
        `
      : css`
          ${$isEmpty &&
          css`
            min-height: 222px;
          `}
        `}
  ${({ $isFromMyAgent }) =>
    $isFromMyAgent &&
    css`
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    `}
  ${({ $isEmpty, theme }) =>
    $isEmpty &&
    theme.isMobile &&
    css`
      height: calc(100% - ${vm(44)});
      justify-content: space-between;
    `}
`

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'PowerGrotesk';
  font-size: 84px;
  font-style: normal;
  font-weight: 200;
  line-height: 1;
  text-transform: uppercase;
  color: ${({ theme }) => theme.white};
`

const AiInputInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(12)};
    `}
`

const AiInputOutWrapper = styled.div`
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

const AiInputContentWrapper = styled.div<{ $value: string }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 12px;
  background: ${({ theme }) => theme.black700};
  backdrop-filter: blur(8px);
  border-radius: 12px;
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

const RecordingWrapper = styled.div`
  position: relative;
  align-items: center;
  width: 100%;
  height: 60px;
  z-index: 2;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(60)};
      padding: ${vm(8)};
      padding-left: ${vm(16)};
      gap: ${vm(20)};
      .voice-img {
        width: ${vm(44)};
        height: ${vm(44)};
      }
      .result-voice-img {
        width: ${vm(164)};
        height: ${vm(32)};
      }
      span {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${({ theme }) => theme.jade10};
      }
    `}
`

const InputWrapper = styled.div<{ $isMultiline: boolean; $isEmpty: boolean }>`
  position: relative;
  display: grid;
  grid-template-columns: ${({ $isMultiline }) => ($isMultiline ? '1fr' : '1fr auto')};
  grid-template-rows: ${({ $isMultiline }) => ($isMultiline ? 'auto auto' : 'auto')};
  align-items: ${({ $isMultiline }) => ($isMultiline ? 'stretch' : 'center')};
  min-height: 40px;
  width: 100%;
  padding: ${({ $isEmpty }) => ($isEmpty ? '8px 8px 0' : '0 8px')};
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
            color: ${theme.textL2};
            min-width: ${$isMultiline ? '100%' : vm(200)};
          }
        `
      : css`
          gap: ${$isEmpty ? 20 : 8}px;
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

const ButtonCreate = styled(ButtonBorder)`
  gap: 6px;
  width: fit-content;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  border-color: ${({ theme }) => theme.text10};
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
  const [, setChatTabIndex] = useChatTabIndex()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const sendAiContent = useSendAiContent()
  const [isFocus, setIsFocus] = useIsFocus()
  const inputContentWrapperRef = useRef<HTMLDivElement>(null)
  const [isLoadingData] = useIsLoadingData()
  const [value, setValue] = useInputValue()
  const [isMultiline, setIsMultiline] = useState(false)
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

  // 检测是否多行
  const checkMultiline = useCallback(() => {
    if (inputRef.current) {
      const textarea = inputRef.current
      const inputOneLineHeight = 24
      const isMulti = textarea.scrollHeight > inputOneLineHeight
      // 如果内容为空，重置为单行模式
      if (!value && !isEmpty) {
        setIsMultiline(false)
      }
      // 如果检测到多行条件且当前不是多行状态，设置为多行
      else if ((isMulti && !isMultiline) || isEmpty) {
        setIsMultiline(true)
      }
      // 如果已经是多行状态，保持多行状态（不会因为条件不满足而重置）
    }
  }, [value, isMultiline, isEmpty])

  useEffect(() => {
    checkMultiline()
  }, [checkMultiline])

  return (
    <AiInputOutWrapper id='aiInputOutWrapper'>
      <AiInputContentWrapper $value={value} ref={inputContentWrapperRef as any}>
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
            {isEmpty && !isMobile && (
              <ButtonCreate onClick={() => setChatTabIndex(1)}>
                <Trans>Create Strategy</Trans>
              </ButtonCreate>
            )}
            <SendButton $borderRadius={22} $hideBorder={true} $value={!!value} onClick={requestStream}>
              <IconBase className='icon-chat-back' />
            </SendButton>
          </Operator>
        </InputWrapper>
      </AiInputContentWrapper>
    </AiInputOutWrapper>
  )
})
