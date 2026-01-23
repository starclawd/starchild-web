/**
 * Input 组件类型定义
 */
import { CSSProperties, KeyboardEventHandler, ChangeEventHandler, FocusEventHandler } from 'react'

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
export interface InputProps {
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
