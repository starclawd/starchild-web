import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useCallback, useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const MoveTabListWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 4px;
  gap: 8px;
  position: relative;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(44)};
    padding: ${vm(4)};
    gap: ${vm(8)};
  `}
`

const ActiveIndicator = styled.div<{ $translateX: string, $width: string, $isBackTest?: boolean }>`
  position: absolute;
  top: 3px;
  left: 4px;
  height: 36px;
  border-radius: 40px;
  background: ${({ theme }) => theme.brand6};
  width: ${({ $width }) => $width};
  transform: translateX(${({ $translateX }) => $translateX});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 0;
  ${({ theme }) => theme.isMobile && css`
    top: ${vm(3)};
    left: ${vm(4)};
    height: ${vm(36)};
  `}
`

const TabItem = styled.div<{ $isActive: boolean, $isBackTest?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $isBackTest }) => $isBackTest ? 'calc(33.33% - 5.33px)' : 'calc(50% - 4px)'};
  height: 36px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 40px;
  color: ${({ theme }) => theme.textL1};
  background: transparent;
  position: relative;
  z-index: 1;
  ${({ theme, $isBackTest }) => theme.isMobile
  ? css`
    font-size: 0.16rem;
    line-height: 0.22rem;
  `
  : css`
    cursor: pointer;
    ${$isBackTest && css`
      font-size: 14px;
      font-weight: 400;
      line-height: 20px; 
    `}
  `}
`

export default function MoveTabList({
  tabIndex,
  isBackTest,
  tabList,
}: {
  tabIndex: number
  isBackTest?: boolean
  tabList: {
    key: number
    text: React.ReactNode
    clickCallback: () => void
  }[]
}) {
  const theme = useTheme()
  // 计算背景指示器的位置和宽度
  const { translateX, indicatorWidth } = useMemo(() => {
    const tabCount = tabList.length
    // 计算每个 tab item 的实际宽度
    const actualItemWidth = tabCount === 3 ? 'calc(33.33% - 5.33px)' : 'calc(50% - 4px)'
    
    // 计算 translateX - 需要考虑之前所有项目的宽度和gap
    let translateDistance = ''
    if (tabCount === 3) {
      translateDistance = `calc(${100 * tabIndex}% + ${4 * tabIndex}px)` // 每个项目的百分比宽度
    } else {
      translateDistance = `calc(${100 * tabIndex}%)` // 每个项目的百分比宽度
    }
    
    return {
      translateX: translateDistance,
      indicatorWidth: actualItemWidth
    }
  }, [tabIndex, tabList])

  return <MoveTabListWrapper
    className="tab-list-wrapper"
    $borderRadius={22}
    $borderColor={theme.bgT30}
  >
    <ActiveIndicator
      $translateX={translateX}
      $width={indicatorWidth}
      $isBackTest={isBackTest}
    />
    {tabList.map((item, index) => {
      const { key, text, clickCallback } = item
      return <TabItem
        key={key}
        $isBackTest={isBackTest}
        $isActive={tabIndex === key}
        onClick={clickCallback}
      >
        {text}
      </TabItem>
    })}
  </MoveTabListWrapper>
}
