/**
 * Tabs标签页组件
 * 提供多种标签页样式和交互效果
 * 支持移动端和PC端自适应
 */
import { ANI_DURATION } from 'constants/index'
import { useActiveLocale } from 'hooks/useActiveLocale'
import usePrevious from 'hooks/usePrevious'
import { ReactNode, memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useIsMobile } from 'store/application/hooks'
import styled, { css } from 'styled-components'

/**
 * 标签页数据类型接口
 */
interface TabsDataType {
  value: any                // 标签值
  text: ReactNode          // 标签文本内容
  clickCallback: any       // 点击回调函数
  id?: string             // 可选的标签ID
}

/**
 * 标签页类型枚举
 * 支持多种展示样式
 */
export enum TABS_TYPE {
  COMMON_TAB,              // 普通标签
  LINE_TAB,               // 线条标签
  BORDER_TAB,             // 边框标签
  FLAT_TAB,               // 扁平标签
  FULL_LINE_TAB,          // 全线条标签
  MOBILE_NAV_TAB,         // 移动端导航标签
  BG_TAB,                 // 背景标签
}


/**
 * 标签页外层容器样式组件
 * 处理不同类型标签页的布局和样式
 */
const TabsWrapper = styled.div<{ type: TABS_TYPE }>`
  position: relative;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  ${({ type, theme }) =>
    type === TABS_TYPE.LINE_TAB
      && css` 
        padding: ${theme.isMobile ? '0' : '4px 0'}; 
      `
  }
  ${({ theme, type }) =>
    theme.isMobile && type === TABS_TYPE.COMMON_TAB &&
    css`
      overflow-x: auto;
      overflow-y: hidden;
    `
  }
  ${({ theme, type }) =>
    theme.isMobile && type === TABS_TYPE.MOBILE_NAV_TAB &&
    css`
      overflow-x: auto;
      overflow-y: hidden;
      flex-shrink: 1;
    `
  }
  ${({ theme, type }) =>
    theme.isMobile && type === TABS_TYPE.FLAT_TAB &&
    css`
      overflow-x: auto;
      overflow-y: hidden;
      flex-shrink: 1;
      margin-right: 8px;
    `
  }
`

/**
 * 标签项样式组件
 * 处理标签项的布局、样式和交互效果
 */
const TabItem = styled.div<{ $isActive: boolean, type: TABS_TYPE }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 16px;
  min-width: 32px;
  height: 32px;
  font-weight: 800;
  font-size: 14px;
  line-height: 18px;
  transform: translateZ(0);
  ${({ theme }) =>
    !theme.isMobile &&
    css`
      transition: all ${ANI_DURATION}s;
    `
  }
  ${({ type, $isActive, theme }) =>
    type === TABS_TYPE.COMMON_TAB
      && ($isActive
        ? css`
          align-items: flex-end;
          height: 40px;
          min-width: unset;
          padding-bottom: 4px;
          font-size: 20px;
          line-height: 26px;
          font-weight: 800;
        ` : css`
          min-width: unset;
          align-items: flex-end;
          font-size: 16px;
          line-height: 20px;
          font-weight: 800;
          height: 40px;
          padding-bottom: 6px;
        `)
  }
  ${({ type }) =>
    type === TABS_TYPE.BORDER_TAB
      && css`  
      `
  }
  ${({ type, $isActive, theme }) =>
    type === TABS_TYPE.BG_TAB
      && css`
        height: 44px;
        padding: 0 24px;
        border-radius: 12px;
        font-size: 18px;
        font-weight: 800;
        line-height: 24px; 
      `
  }
  ${({ type, $isActive, theme }) =>
    type === TABS_TYPE.MOBILE_NAV_TAB && theme.isMobile &&
      css`
        margin-right: 6px;
        padding: 7px 14px;
        border-radius: 20px;
      `
  }
`

/**
 * 标签项文本样式组件
 * 处理文本和图标的布局
 */
export const TabItemText = styled.div<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 800;
    line-height: 16px;
  }
`

/**
 * 线条样式组件
 * 用于LINE_TAB类型的底部指示线
 */
const Line = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.isMobile ? '-6px' : '1px'};
  width: 32px;
  height: 3px;
  border-radius: 9px;
  transition: transform ${ANI_DURATION}s;
`

/**
 * 全线条样式组件
 * 用于FULL_LINE_TAB类型的底部指示线
 */
const FullLine = styled.div`
  position: absolute;
  bottom: 0;
  height: 4px;
  border-radius: 9px;
  transition: transform ${ANI_DURATION}s;
`

/**
 * Tabs组件
 * 提供可定制的标签页功能
 * 支持多种样式类型和交互效果
 */
export default memo(function Tabs({
  id,                           // 组件ID
  type,                         // 标签页类型
  value,                        // 当前选中值
  tabList,                      // 标签列表数据
  forceUpdate,                  // 强制更新函数
  classNameSuffix,             // 类名后缀
  disabledScrollIntoView = false,  // 是否禁用自动滚动
}: {
  id?: string
  classNameSuffix: string
  type: TABS_TYPE
  value: any
  forceUpdate?: any
  disabledScrollIntoView?: boolean
  tabList: TabsDataType[]
}) {
  const isMobile = useIsMobile()
  const local = useActiveLocale()
  const preValue = usePrevious(value)
  const [fullLineWidth, setFullLineWidth] = useState(0)
  const [localState, setLocalState] = useState(local)
  const [domMounted, setDomMounted] = useState(false)
  const [translateLeft, setTranslateLeft] = useState(0)

  const changeTab = useCallback((tab: TabsDataType, clickCallback: any) => {
    return (e: any) => {
      clickCallback && clickCallback(tab)
    }
  }, [])

  const index = useMemo(() => {
    return tabList.findIndex((tab) => tab.value === value)
  }, [value, tabList])

  useEffect(() => {
    setTimeout(() => {
      setDomMounted(true)
    }, 1500)
  }, [])

  useEffect(() => {
    if (preValue !== value && preValue !== undefined) {
      if (isMobile && !disabledScrollIntoView) {
        const tabItemList = document.querySelectorAll(`.tabs-tab-item-${classNameSuffix}`)
        const target = tabItemList[value]
        target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
    }
  }, [preValue, isMobile, value, classNameSuffix, disabledScrollIntoView])

  useEffect(() => {
    if (domMounted && localState) {
      const tabItemList = document.querySelectorAll(`.tabs-tab-item-${classNameSuffix}`)
      const currentItemEl = tabItemList[index] as HTMLDivElement
      const width = currentItemEl?.offsetWidth
      const offsetLeft = currentItemEl?.offsetLeft
      if (type === TABS_TYPE.LINE_TAB) {
        const translateLeft = offsetLeft + (width - 32) / 2
        setTranslateLeft(translateLeft)
      } else if (type === TABS_TYPE.FULL_LINE_TAB) {
        const translateLeft = offsetLeft
        setFullLineWidth(width)
        setTranslateLeft(translateLeft)
      }
    }
  }, [type, index, domMounted, localState, forceUpdate, classNameSuffix])

  useEffect(() => {
    if (local) {
      setTimeout(() => {
        setLocalState(local)
      }, 1000)
    }
  }, [local])

  const idProps = id ? { id } : {}
  return (
    <TabsWrapper {...idProps} type={type} className="tabs-wrapper">
      {tabList.map((tab) => {
        const { text, clickCallback, id } = tab
        const isActive = value === tab.value
        const idProps = id ? {
          id,
        } : {}
        return <TabItem
          {...idProps}
          type={type}
          key={tab.value}
          className={`tabs-tab-item tabs-tab-item-${classNameSuffix} ${isActive ? 'active' : ''}`}
          $isActive={isActive}
          onClick={changeTab(tab, clickCallback)}
        >
          {text}
        </TabItem>
      })}
      {type === TABS_TYPE.LINE_TAB && <Line className="tabs-line" style={{ transform: `translateX(${translateLeft}px)` }} />}
      {type === TABS_TYPE.FULL_LINE_TAB && <FullLine className="tabs-line" style={{ width: `${fullLineWidth}px`, transform: `translateX(${translateLeft}px)` }} />}
    </TabsWrapper>
  )
})
