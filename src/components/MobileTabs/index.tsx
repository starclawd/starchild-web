/**
 * MobileTabs移动端标签页组件
 * 提供两种样式的标签页切换功能
 * 支持自动滚动定位和触摸事件
 */
import styled, { css, IStyledComponent } from "styled-components"
import { memo, ReactNode, useCallback, useEffect } from "react"
import { MOBILE_TABS_TYPE } from "store/application/application.d"
import { useIsMobile } from "store/application/hooks"
import usePrevious from "hooks/usePrevious"
import { PixelAllSide } from "styles/theme"

/**
 * 标签页数据接口
 */
interface TabsDataType {
  value: any               // 标签值
  text: ReactNode         // 标签显示内容
  clickCallback: any      // 点击回调函数
}

/**
 * 带边框的标签页容器样式组件
 * 继承自PixelAllSide，提供圆角边框样式
 */
const MobileTabsWrapper1 = styled(PixelAllSide).attrs(({ theme }) => ({
  color: theme.line1,
  borderRadius: '24px',
}))<{ show?: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 4px;
  margin-top: 8px;
  flex-shrink: 0;
`

/**
 * 背景色标签页容器样式组件
 * 提供纯背景色的标签页样式
 */
const MobileTabsWrapper2 = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 4px;
  border-radius: 12px;
  flex-shrink: 0;
  background-color: ${({ theme }) => theme.bg3};
`

/**
 * 标签项样式组件
 * 支持激活状态样式切换和自适应宽度
 */
const TabItem = styled.div<{ isActive: boolean; length: number }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ length }) => `calc(100% / ${length})`};
  height: 100%;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  border-radius: 8px;
  z-index: 1;
  color: ${({ isActive, theme }) => isActive ? theme.text1 : theme.text3};
  ${({ isActive, theme }) =>
    isActive &&
    css`
      background-color: ${theme.bg8};
    `
  }
`

/**
 * MobileTabs组件属性接口
 */
interface MobileTabsProps {
  type?: MOBILE_TABS_TYPE    // 标签页样式类型
  value: any                 // 当前选中的标签值
  tabList: TabsDataType[]    // 标签数据列表
}

/**
 * MobileTabs组件
 * 提供移动端标签页切换功能
 * 支持两种样式类型和自动滚动定位
 */
export default memo(function MobileTabs({
  type = MOBILE_TABS_TYPE.COMMON,
  value,
  tabList,
}: MobileTabsProps) {
  const isMobile = useIsMobile()
  const preValue = usePrevious(value)

  // 处理标签点击事件
  const callback = useCallback((data: TabsDataType) => {
    return () => {
      data.clickCallback(data)
    }
  }, [])
  // 根据类型选择容器组件
  const WrapperComponent = (type === MOBILE_TABS_TYPE.BORDER ? MobileTabsWrapper1 : MobileTabsWrapper2) as IStyledComponent<any, any>

  // 处理标签切换时的滚动定位
  useEffect(() => {
    if (preValue !== value && preValue !== undefined) {
      if (isMobile) {
        const tabItemList = document.querySelectorAll(`.mobile-tabs-item`)
        const target = tabItemList[value]
        target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      }
    }
  }, [preValue, isMobile, value])

  return (
    <WrapperComponent className="mobile-tabs-wrapper">
      {tabList.map((data: TabsDataType) => {
        const isActive = data.value === value
        const propsData = !isMobile ? {
          onClick: callback(data)
        } : {
          onTouchStart: callback(data)
        }
        return <TabItem
          {...propsData}
          key={data.value}
          isActive={isActive}
          length={tabList.length}
          className={`mobile-tabs-item ${isActive ? 'active' : ''}`}
        >
          {data.text}
        </TabItem>
      })}
    </WrapperComponent>
  )
})
