import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const MoveTabListWrapper = styled(BorderAllSide1PxBox)<{ $forceWebStyle?: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 44px;
  padding: 4px;
  gap: 8px;
  position: relative;
  ${({ theme, $forceWebStyle }) => theme.isMobile && !$forceWebStyle && css`
    height: ${vm(44)};
    padding: ${vm(4)};
    gap: ${vm(8)};
  `}
`

const ActiveIndicator = styled.div<{ $translateX: string, $tabCount: number, $forceWebStyle?: boolean }>`
  position: absolute;
  top: 3px;
  left: 4px;
  height: 36px;
  border-radius: 40px;
  background: ${({ theme }) => theme.brand6};
  width: ${({ $tabCount }) => $tabCount === 3 ? 'calc(33.33% - 8px)' : 'calc(50% - 4px)'};
  transform: translateX(${({ $translateX }) => $translateX});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  ${({ theme, $forceWebStyle }) => theme.isMobile && !$forceWebStyle && css`
    top: ${vm(3)};
    left: ${vm(4)};
    height: ${vm(36)};
  `}
`

const TabItem = styled.div<{ $isActive: boolean, $tabCount: number, $forceWebStyle?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $tabCount }) => $tabCount === 3 ? 'calc(33.33% - 5.33px)' : 'calc(50% - 4px)'};
  height: 36px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 40px;
  color: ${({ theme }) => theme.textL1};
  background: transparent;
  position: relative;
  z-index: 1;
  ${({ theme, $forceWebStyle }) => theme.isMobile && !$forceWebStyle
  ? css`
    font-size: 0.16rem;
    line-height: 0.22rem;
  `
  : css`
    cursor: pointer;
  `}
`

export default function MoveTabList({
  tabIndex,
  tabList,
  forceWebStyle = false,
}: {
  tabIndex: number
  tabList: {
    key: number
    text: React.ReactNode
    clickCallback: () => void
  }[]
  forceWebStyle?: boolean
}) {
  const theme = useTheme()
  // 计算背景指示器的位置和宽度
  const { translateX } = useMemo(() => {
    const tabCount = tabList.length
    // 计算 translateX - 需要考虑之前所有项目的宽度和gap
    let translateDistance = ''
    if (tabCount === 3) {
      translateDistance = `calc(${100 * tabIndex}% + ${4 * tabIndex}px)` // 每个项目的百分比宽度
    } else {
      translateDistance = `calc(${100 * tabIndex}%)` // 每个项目的百分比宽度
    }
    
    return {
      translateX: translateDistance,
    }
  }, [tabIndex, tabList])

  return <MoveTabListWrapper
    className="tab-list-wrapper"
    $borderRadius={22}
    $borderColor={theme.bgT30}
    $forceWebStyle={forceWebStyle}
  >
    <ActiveIndicator
      $translateX={translateX}
      $tabCount={tabList.length}
      $forceWebStyle={forceWebStyle}
    />
    {tabList.map((item) => {
      const { key, text, clickCallback } = item
      return <TabItem
        key={key}
        className="move-tab-item"
        $forceWebStyle={forceWebStyle}
        $tabCount={tabList.length}
        $isActive={tabIndex === key}
        onClick={clickCallback}
      >
        {text}
      </TabItem>
    })}
  </MoveTabListWrapper>
}
