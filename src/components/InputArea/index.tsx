/**
 * 输入框组件
 */
import { ANI_DURATION } from "constants/index"
import { vm } from "pages/helper"
import { useCallback, useRef } from "react"
import styled, { css } from "styled-components"

const TextArea = styled.textarea`
  position: relative;
  top: 2px;
  outline: unset;
  resize: none;
  font-weight: 600;
  font-size: 14px;
  line-height: 20px;
  height: 24px;
  flex-grow: 1;
  border: none;
  max-height: 236px;
  width: 100%;
  z-index: 1;
  transition: all ${ANI_DURATION}s;
  &:disabled {
    cursor: not-allowed;
  }
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(24)};
    font-size: 0.16rem;
    font-weight: 500;
    line-height: 0.24rem;
    max-height: ${vm(236)};
    color: ${({ theme }) => theme.textL1};
    background: transparent;
  `}
`

export default function InputArea({
  rows = 1,
  valueLimit = 300,
  disabled,
  value,
  placeholder,
  setValue,
  onFocus,
  onBlur,
  enterConfirmCallback,
}: {
  value: string
  setValue: (value: string) => void
  rows?: number
  valueLimit?: number
  disabled?: boolean
  placeholder?: string
  enterConfirmCallback?: () => void
  onFocus?: () => void
  onBlur?: () => void
}) {
  const inputRef = useRef(null)
  const changeValue = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    if (value.length > valueLimit) {
      return
    }
    setValue(value)
    e.target.style.height = 'auto'
    e.target.style.height = `${e.target.scrollHeight}px`
  }, [valueLimit, setValue])
  const keyDownCallback = useCallback((e: any) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !e.nativeEvent.isComposing) {
      e.preventDefault()
      enterConfirmCallback?.()
    }
  }, [enterConfirmCallback])
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text')
    if (pastedText.length + value.length > valueLimit) {
      e.preventDefault()
      // promptInfo(PromptInfoType.ERROR, <Trans>Content length cannot exceed {valueLimit} characters</Trans>)
      return
    }
  }, [value.length, valueLimit])
  return (
    <TextArea
      rows={rows}
      disabled={disabled}
      ref={inputRef as any}
      className="input-area scroll-style"
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