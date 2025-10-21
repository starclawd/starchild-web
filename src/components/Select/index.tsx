/**
 * Select下拉选择组件
 * 基于Popper实现的自定义下拉选择组件
 * 提供以下功能:
 * 1. 支持点击和悬浮两种触发方式
 * 2. 支持搜索过滤
 * 3. 支持自定义样式和布局
 * 4. 支持Portal传送门渲染
 * 5. 支持自定义头部样式
 * 6. 支持展开/收起动画
 */

import { Options, Placement } from '@popperjs/core'
import Portal from 'components/Portal'
import {
  Fragment,
  ReactNode,
  useCallback,
  useMemo,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  memo,
  ChangeEvent,
} from 'react'
import { usePopper } from 'react-popper'
import { IconBase } from 'components/Icons'
import Input, { InputType } from 'components/Input'
import { useOnClickOutside } from 'hooks/useOnClickOutside'
import usePrevious from 'hooks/usePrevious'
import { nanoid } from '@reduxjs/toolkit'
import {
  SelectWrapper,
  PopoverContainer,
  PopoverList,
  PopoverItem,
  ReferenceElement,
  SelectBorderWrapper,
  InputWrapper,
} from './styles.ts'
import { CommonFun } from 'types/global'
import NoData from 'components/NoData'
import { t } from '@lingui/core/macro'
import { useIsMobile } from 'store/application/hooks'
import { ANI_DURATION } from 'constants/index'
import { CSSProperties } from 'styled-components'

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
export interface PopoverProps {
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
  borderWrapperBg?: string // 选择器边框背景色
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
}

export default memo(function Select({
  value,
  dataList,
  disabled = false,
  triggerMethod = TriggerMethod.HOVER,
  children,
  hideExpand = false,
  placement = 'auto',
  usePortal = false,
  widthElement,
  rootStyle = {},
  rootClass,
  popStyle = {},
  popClass,
  iconExpandStyle = {},
  useSearch,
  popListClass,
  alignPopWidth = false,
  popListStyle = {},
  popItemStyle = {},
  popItemHoverBg = '',
  activeIconColor = '',
  hideScrollbar = false,
  borderWrapperBg = '',
  popItemTextStyle = {},
  customize,
  customizeNode,
  offsetLeft = 0,
  offsetTop = 2,
  outShow = false,
  onShow,
  outSetShow,
  toggleShowCallback,
  onHide,
  useOutShow = false,
  forceHide = false,
  disableDisappearAni = false,
}: PopoverProps) {
  /* hooks调用 */
  const isMobile = useIsMobile()
  const [begainToHide, setBegainToHide] = useState(false)
  const wrapper = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>(null)
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(null)
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null)
  const [show, setShow] = useState(false)
  const [elementWidth, setElementWidth] = useState(0)
  const [selectWrapperWidth, setSelectWrapperWidth] = useState(0)

  /* 计算显示状态 */
  const isShow = useMemo(() => {
    return useOutShow ? outShow : show
  }, [useOutShow, outShow, show])
  const preIsShow = usePrevious(isShow)

  /* 切换显示状态 */
  const changeShow = useCallback(
    (status: boolean) => {
      if (disabled) return
      if (useOutShow) {
        outSetShow && outSetShow(status)
      } else {
        setShow(status)
      }
    },
    [disabled, outSetShow, useOutShow],
  )

  /* 延迟消失处理 */
  const delayDisappear = useCallback(() => {
    setBegainToHide(true)
    timeoutRef.current && clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current && clearTimeout(timeoutRef.current)
      setBegainToHide(false)
      changeShow(false)
    }, ANI_DURATION)
  }, [changeShow])

  /* 点击外部处理 */
  useOnClickOutside([wrapper.current, popperElement], () => {
    if (isShow) {
      delayDisappear()
    }
  })

  /* 搜索相关状态和处理 */
  const [searchValue, setSearchValue] = useState('')

  /* Popper配置项 */
  const options = useMemo(
    (): Options => ({
      placement,
      strategy: 'fixed',
      modifiers: [
        { name: 'offset', options: { offset: [offsetLeft, offsetTop] } },
        { name: 'preventOverflow', options: { padding: 8 } },
      ],
    }),
    [placement, offsetLeft, offsetTop],
  )

  const { styles, attributes } = usePopper(referenceElement, popperElement, options)

  /* 触发方式相关属性 */
  const propsData = useMemo(() => {
    if (triggerMethod === TriggerMethod.CLICK) {
      return {
        onClick: (e: React.MouseEvent<HTMLDivElement>) => {
          if (usePortal) {
            e.stopPropagation()
          }
          if (useSearch && isShow) {
            return
          }
          if (isShow) {
            setBegainToHide(true)
            delayDisappear()
          } else {
            changeShow(true)
          }
        },
      }
    } else {
      return {
        onMouseOver: () => {
          changeShow(true)
        },
        onMouseLeave: () => {
          setBegainToHide(true)
          delayDisappear()
        },
      }
    }
  }, [usePortal, triggerMethod, isShow, useSearch, delayDisappear, changeShow])

  /* 弹出框属性 */
  const popProps = useMemo(() => {
    if (usePortal) {
      const style = {
        ...styles.popper,
        ...popStyle,
      }
      if (widthElement) {
        style.width = `${elementWidth}px`
      } else if (alignPopWidth && selectWrapperWidth > 0) {
        style.width = `${selectWrapperWidth}px`
      }
      return {
        style,
        ...attributes.popper,
      }
    } else {
      const style = { ...popStyle }
      if (alignPopWidth && selectWrapperWidth > 0) {
        style.width = `${selectWrapperWidth}px`
      }
      return { style }
    }
  }, [styles, attributes, popStyle, usePortal, widthElement, elementWidth, alignPopWidth, selectWrapperWidth])

  /* 搜索处理 */
  const searchItem = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }, [])

  /* 清除搜索 */
  const onSearchDelete = useCallback(() => {
    setSearchValue('')
  }, [])

  /* 过滤数据列表 */
  const filterDataList = useMemo(() => {
    if (!useSearch) {
      return dataList
    }
    return dataList
      ? dataList.filter((data) => {
          if (String(data.value).toLowerCase().includes(searchValue.toLowerCase())) {
            return true
          } else if (data.searchKey && String(data.searchKey).toLowerCase().includes(searchValue.toLowerCase())) {
            return true
          } else {
            return false
          }
        })
      : []
  }, [dataList, searchValue, useSearch])

  /* 选项点击处理 */
  const popItemClickCallback = useCallback(
    (data: DataType) => {
      return () => {
        const { value, clickCallback } = data
        if (useSearch) {
          setSearchValue('')
        }
        delayDisappear()
        setTimeout(() => {
          clickCallback(value)
        }, 0)
      }
    },
    [useSearch, delayDisappear],
  )

  /* 显示状态变化处理 */
  useEffect(() => {
    toggleShowCallback?.(isShow)
  }, [isShow, toggleShowCallback])

  /* 显示回调处理 */
  useEffect(() => {
    if (!preIsShow && isShow) {
      onShow?.()
    }
  }, [preIsShow, isShow, onShow])

  /* 隐藏回调处理 */
  useEffect(() => {
    if (preIsShow && !isShow) {
      onHide?.()
    }
  }, [preIsShow, isShow, onHide])

  // 获取指定元素宽度
  useEffect(() => {
    if (!widthElement || !usePortal) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 优先使用 borderBoxSize，如果不支持则回退到 offsetWidth
        if (entry.borderBoxSize && entry.borderBoxSize[0]) {
          setElementWidth(entry.borderBoxSize[0].inlineSize)
        } else {
          setElementWidth(widthElement.offsetWidth)
        }
      }
    })

    // 立即获取一次初始宽度
    setElementWidth(widthElement.offsetWidth)
    resizeObserver.observe(widthElement)
    return () => {
      resizeObserver.disconnect()
    }
  }, [widthElement, usePortal])

  // 获取 SelectWrapper 元素宽度（当 alignPopWidth 为 true 时）
  useEffect(() => {
    if (!alignPopWidth || !wrapper.current) return

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // 优先使用 borderBoxSize，如果不支持则回退到 offsetWidth
        if (entry.borderBoxSize && entry.borderBoxSize[0]) {
          setSelectWrapperWidth(entry.borderBoxSize[0].inlineSize)
        } else {
          setSelectWrapperWidth(wrapper.current!.offsetWidth)
        }
      }
    })

    // 立即获取一次初始宽度
    setSelectWrapperWidth(wrapper.current.offsetWidth)
    resizeObserver.observe(wrapper.current)
    return () => {
      resizeObserver.disconnect()
    }
  }, [alignPopWidth])

  const Wrapper = usePortal ? Portal : Fragment

  return (
    <SelectWrapper
      {...propsData}
      tabIndex={0}
      disabled={disabled}
      ref={wrapper as any}
      style={rootStyle || {}}
      className={`select-wrapper ${rootClass || ''} ${isShow && !begainToHide ? 'show' : ''}`}
    >
      {/* 选择器参考元素 */}
      <ReferenceElement
        $show={isShow}
        $begainToHide={begainToHide}
        onClick={() => {
          if (useSearch) {
            changeShow(!isShow)
          }
        }}
        className='select-value-wrapper'
        ref={setReferenceElement as any}
      >
        <SelectBorderWrapper className='select-border-wrapper' $borderWrapperBg={borderWrapperBg}>
          {children}
          {!hideExpand && <IconBase style={{ ...iconExpandStyle }} className='icon-chat-expand' />}
        </SelectBorderWrapper>
      </ReferenceElement>

      {/* 弹出内容包装器 */}
      <Wrapper>
        {isShow && !forceHide && (
          <PopoverContainer
            $usePortal={usePortal}
            $begainToHide={begainToHide}
            $disableDisappearAni={disableDisappearAni}
            className={`select-pop-contrainer ${popClass || ''} ${attributes.popper?.['data-popper-placement'] ?? ''}`}
            ref={setPopperElement as any}
            onClick={(e) => {
              if (usePortal) {
                e.stopPropagation()
              }
            }}
            {...popProps}
          >
            {/* 搜索输入框 */}
            {useSearch && (
              <InputWrapper className='select-input-wrapper'>
                <Input
                  inputValue={searchValue}
                  inputType={InputType.SEARCH}
                  placeholder={t`Search`}
                  onChange={searchItem}
                  onResetValue={onSearchDelete}
                />
              </InputWrapper>
            )}

            {/* 选项列表 */}
            {customize ? (
              customizeNode
            ) : (
              <PopoverList
                $hideScrollbar={hideScrollbar}
                style={popListStyle}
                className={`popover-list scroll-style ${popListClass}`}
              >
                {/* 空状态显示 */}
                {filterDataList?.length === 0 && <NoData />}
                {/* 选项列表渲染 */}
                {filterDataList &&
                  filterDataList.map((data) => {
                    const { text, customerItem, customerItemCom } = data
                    const isActive = !!data.isActive
                    const key = data.key || text
                    if (customerItem) {
                      return (
                        <span key={(key as string) || nanoid()} onClick={popItemClickCallback(data)}>
                          {customerItemCom}
                        </span>
                      )
                    }
                    return (
                      <PopoverItem
                        key={(key as string) || nanoid()}
                        className='popover-item'
                        $isActive={isActive}
                        $popItemHoverBg={popItemHoverBg}
                        $activeIconColor={activeIconColor}
                        style={popItemStyle}
                        onClick={popItemClickCallback(data)}
                      >
                        <span style={popItemTextStyle} className='select-text'>
                          {text}
                        </span>
                        {isActive && <IconBase className='icon-chat-complete' />}
                      </PopoverItem>
                    )
                  })}
              </PopoverList>
            )}
          </PopoverContainer>
        )}
      </Wrapper>
    </SelectWrapper>
  )
})
