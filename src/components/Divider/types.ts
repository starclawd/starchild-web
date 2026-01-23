/**
 * Divider 组件类型定义
 */

export interface DividerProps {
  /** 分隔线高度，默认 1px。垂直模式下为宽度 */
  height?: string | number
  /** 水平方向内边距，默认 0 */
  paddingHorizontal?: string | number
  /** 垂直方向内边距，默认 0 */
  paddingVertical?: string | number
  /** 分隔线颜色，默认 theme.black800 */
  color?: string
  /** 自定义类名 */
  className?: string
  /** 是否为垂直分隔线，默认 false */
  vertical?: boolean
  /** 垂直模式下的长度，默认 16px */
  length?: string | number
}
