/**
 * Select 组件类型定义
 */
import { ReactNode, Dispatch, SetStateAction, CSSProperties } from 'react'
import { Placement } from '@popperjs/core'
import { CommonFun } from 'types/global'

/**
 * 触发方式枚举
 */
export enum TriggerMethod {
  CLICK, // 点击触发
  HOVER, // 悬浮触发
}

/**
 * 下拉选项数据类型接口
 */
export interface DataType {
  text: ReactNode // 选项文本
  key?: string // 选项唯一标识
  value: any // 选项值
  searchKey?: string // 搜索关键字
  showArrow?: boolean // 是否显示箭头
  isActive?: boolean // 是否激活
  info?: ReactNode // 提示信息
  itemTooltipPlacement?: any // 提示框位置
  customerItem?: boolean // 是否自定义选项
  customerItemCom?: ReactNode // 自定义选项组件
  clickCallback: CommonFun<any> // 点击回调
  [extraPrama: string]: any // 额外参数
}

/**
 * Select组件属性接口
 */
export interface SelectProps {
  value: any // 当前选中值
  alignPopWidth?: boolean // 是否对齐弹出框宽度
  disabled?: boolean // 是否禁用
  useSearch?: boolean // 是否使用搜索
  forceHide?: boolean // 是否强制隐藏
  placement?: Placement // 弹出位置
  children?: ReactNode // 子元素
  dataList?: DataType[] // 选项列表
  triggerMethod?: TriggerMethod // 触发方式
  usePortal?: boolean // 是否使用Portal
  widthElement?: HTMLElement // 指定宽度参考元素
  hideExpand?: boolean // 是否隐藏展开图标
  rootStyle?: CSSProperties // 根元素样式
  rootClass?: string // 根元素类名
  popStyle?: CSSProperties // 弹出框样式
  popClass?: string // 弹出框类名
  popListClass?: string // 选项列表类名
  popListStyle?: CSSProperties // 选项列表样式
  popItemStyle?: CSSProperties // 选项样式
  popItemTextStyle?: CSSProperties // 选项文本样式
  popItemHoverBg?: string // 选项悬浮背景色
  activeIconColor?: string // 选中图标颜色
  hideScrollbar?: boolean // 是否隐藏滚动条
  iconExpandStyle?: CSSProperties // 展开图标样式
  disableDisappearAni?: boolean // 是否禁用消失动画
  offsetLeft?: number // 左偏移
  offsetTop?: number // 顶部偏移
  customize?: boolean // 是否自定义
  customizeNode?: ReactNode // 自定义节点
  outShow?: boolean // 外部显示状态
  outSetShow?: Dispatch<SetStateAction<boolean>> | CommonFun<any> // 外部设置显示状态
  onShow?: CommonFun<any> // 显示回调
  onHide?: CommonFun<any> // 隐藏回调
  toggleShowCallback?: Dispatch<SetStateAction<boolean>> | CommonFun<any> // 切换显示回调
  useOutShow?: boolean // 是否使用外部显示状态
  useCircleSuccessIcon?: boolean // 是否使用圆形成功图标
}
