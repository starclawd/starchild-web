/**
 * 通用输入框组件
 * 支持普通文本输入、搜索输入、日期时间输入等多种模式
 * 可配置右侧内容、选择器、错误提示等功能
 */
import { useIsMobile } from 'store/application/hooks'
import styled, { css, CSSProperties } from 'styled-components'
import {
  useCallback,
  useEffect,
  useRef,
  KeyboardEventHandler,
  memo,
  useMemo,
  ChangeEventHandler,
  FocusEventHandler,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
  ChangeEvent,
} from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import { IconBase } from 'components/Icons'

/**
 * 输入框类型枚举
 */
export enum InputType {
  SEARCH = 'SEARCH', // 搜索输入
  TEXT = 'TEXT', // 文本输入
}

/**
 * 输入框组件属性接口
 */
interface PorpsType {
  type?: string // 输入类型
  inputType?: InputType // 输入类型
  inputStyle?: CSSProperties // 输入框样式
  placeholder?: string // 占位文本
  rootStyle?: CSSProperties // 根元素样式
  inputClass?: string // 输入框类名
  disabled?: boolean // 是否禁用
  showError?: boolean // 是否显示错误
  scrollIntoView?: boolean // 是否滚动到视图
  autoFocus?: boolean // 是否自动聚焦
  inputValue?: string | number // 输入值
  inputMode?: 'text' | 'search' | 'email' | 'tel' | 'url' | 'none' | 'numeric' | 'decimal' // 输入模式
  clearError?: () => void
  onKeyUp?: KeyboardEventHandler<HTMLInputElement> // 键盘抬起事件
  onBlur?: FocusEventHandler<HTMLInputElement> // 失焦事件
  onChange?: ChangeEventHandler<HTMLInputElement> // 值改变事件
  onFocus?: FocusEventHandler<HTMLInputElement> // 聚焦事件
  onResetValue?: () => void
}

const InputWrapper = styled(BorderAllSide1PxBox)`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  flex-shrink: 0;
  .icon-search {
    position: absolute;
    left: 16px;
    top: calc(50% - 8px);
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  .icon-chat-close {
    position: absolute;
    right: 12px;
    top: calc(50% - 8px);
    font-size: 18px;
    color: ${({ theme }) => theme.textL4};
    cursor: pointer;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(44)};
    `}
`

const BaseInput = styled.input<{ $isSearch: boolean }>`
  width: 100%;
  height: 100%;
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  background-color: transparent;
  &::placeholder {
    color: ${({ theme }) => theme.textL4};
  }
  ${({ $isSearch }) =>
    $isSearch &&
    css`
      padding-left: 42px;
      padding-right: 30px;
    `}
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(20)};
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.2rem;
    `}
`

/**
 * Input组件
 * 通用输入框组件,支持多种输入模式和交互功能
 */
export default memo(function Input({
  type = 'text',
  inputClass,
  rootStyle,
  inputType = InputType.TEXT,
  inputStyle,
  inputValue,
  showError,
  disabled = false,
  onBlur,
  onFocus,
  onChange,
  onKeyUp,
  onResetValue,
  placeholder,
  autoFocus,
  clearError,
  inputMode = 'decimal',
  scrollIntoView = false,
}: PorpsType) {
  const isMobile = useIsMobile()
  const theme = useTheme()
  const inputWrapperRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLElement>(null)

  const isSearch = useMemo(() => {
    return inputType === InputType.SEARCH
  }, [inputType])

  /**
   * 输入框失焦处理
   */
  const onBlurFn = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      clearError && clearError()
      onBlur && onBlur(e)
    },
    [onBlur, clearError],
  )

  /**
   * 输入框点击处理
   */
  const onClickFn = useCallback((e: MouseEvent<HTMLInputElement>) => {
    ;(e.target as HTMLInputElement).focus()
  }, [])

  /**
   * 键盘抬起处理
   */
  const onKeyUpFn = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      onKeyUp && onKeyUp(e)
    },
    [onKeyUp],
  )

  /**
   * 输入框聚焦处理
   */
  const onFocusFn = useCallback(
    (e: FocusEvent<HTMLInputElement>) => {
      if (isMobile && scrollIntoView) {
        setTimeout(() => {
          e.target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
        }, 200)
      }
      onFocus && onFocus(e)
    },
    [isMobile, scrollIntoView, onFocus],
  )

  /**
   * 输入值改变处理
   */
  const onChangeFn = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      clearError && clearError()
      onChange && onChange(e)
    },
    [clearError, onChange],
  )

  /**
   * 错误状态下自动聚焦处理
   */
  useEffect(() => {
    if (showError) {
      const inputEl = inputRef.current
      inputEl && inputEl.focus()
    }
  }, [showError])
  const inputProps = isMobile
    ? {
        onClick: onClickFn,
      }
    : {
        onKeyUp: onKeyUpFn,
        onClick: onClickFn,
        onMouseDown: (e: MouseEvent<HTMLInputElement>) => e.stopPropagation(),
      }
  return (
    <InputWrapper
      style={rootStyle}
      ref={inputWrapperRef as any}
      className='input-wrapper'
      $borderRadius={24}
      $borderColor={theme.bgT30}
    >
      {isSearch && <IconBase className='icon-search' />}
      {isSearch && inputValue && <IconBase className='icon-chat-close' onClick={onResetValue} />}
      <BaseInput
        type={type}
        tabIndex={1}
        {...inputProps}
        inputMode={inputMode}
        autoFocus={autoFocus}
        placeholder={placeholder}
        ref={inputRef as any}
        disabled={disabled}
        onChange={onChangeFn}
        onFocus={onFocusFn}
        onBlur={onBlurFn}
        value={inputValue}
        style={{ ...inputStyle }}
        className={inputClass}
        $isSearch={isSearch}
      />
    </InputWrapper>
  )
})
