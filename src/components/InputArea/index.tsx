/**
 * 输入框组件
 */
import { ANI_DURATION } from 'constants/index'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { vm } from 'pages/helper'
import { ChangeEvent, FocusEventHandler, useCallback, useEffect, useRef } from 'react'
import { useIsMobile } from 'store/application/hooks'
import styled, { css } from 'styled-components'

const TextArea = styled.textarea`
  position: relative;
  outline: unset;
  resize: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  flex-grow: 1;
  border: none;
  max-height: 240px;
  padding: 0;
  width: 100%;
  z-index: 1;
  height: 24px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.black0};
  background: transparent;
  transition: all ${ANI_DURATION}s;
  &:disabled {
    cursor: not-allowed;
  }
  &::placeholder {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.black300};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
      max-height: ${vm(256)};
      &::placeholder {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
      }
    `}
`

export default function InputArea({
  id,
  rows = 1,
  valueLimit = 3000,
  disabled,
  value,
  placeholder,
  autoFocus = false,
  ref,
  disabledUpdateHeight = false,
  setValue,
  onFocus,
  onBlur,
  enterConfirmCallback,
}: {
  id?: string
  value: string
  setValue: (value: string) => void
  rows?: number
  valueLimit?: number
  disabled?: boolean
  placeholder?: string
  autoFocus?: boolean
  disabledUpdateHeight?: boolean
  ref?: React.RefObject<HTMLTextAreaElement>
  enterConfirmCallback?: () => void
  onFocus?: FocusEventHandler<HTMLTextAreaElement>
  onBlur?: FocusEventHandler<HTMLTextAreaElement>
}) {
  const isMobile = useIsMobile()
  const inputRef = ref || useScrollbarClass<HTMLTextAreaElement>()
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const updateHeight = useCallback(() => {
    if (disabledUpdateHeight) return
    if (inputRef.current) {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.style.height = 'auto'
          inputRef.current.style.height = `${inputRef.current.scrollHeight}px`
        }
      }, 100)
    }
  }, [inputRef, disabledUpdateHeight])
  const changeValue = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      if (value?.length > valueLimit) {
        return
      }
      setValue(value)
      updateHeight()
    },
    [valueLimit, setValue, updateHeight],
  )

  const keyDownCallback = useCallback(
    (e: any) => {
      if (disabledUpdateHeight) return
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !e.nativeEvent.isComposing) {
        if (!isMobile) {
          e.preventDefault()
          enterConfirmCallback?.()
        }
      }
    },
    [isMobile, disabledUpdateHeight, enterConfirmCallback],
  )
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const pastedText = e.clipboardData.getData('text')
      if (pastedText.length + value?.length > valueLimit) {
        e.preventDefault()
        // promptInfo(PromptInfoType.ERROR, <Trans>Content length cannot exceed {valueLimit} characters</Trans>)
        return
      }
    },
    [value?.length, valueLimit],
  )

  useEffect(() => {
    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [updateHeight])

  // 组件挂载后调整高度
  useEffect(() => {
    // 添加一个短暂延迟，确保字体和样式都已加载
    setTimeout(() => {
      updateHeight()
    }, 100)
  }, [value, isMobile, updateHeight])

  return (
    <TextArea
      id={id || ''}
      rows={rows}
      autoFocus={autoFocus}
      disabled={disabled}
      ref={inputRef as any}
      className='input-area scroll-style'
      onKeyDown={keyDownCallback}
      onChange={changeValue}
      onFocus={onFocus}
      onBlur={onBlur}
      onPaste={handlePaste}
      value={value}
      placeholder={placeholder}
    />
  )
}
