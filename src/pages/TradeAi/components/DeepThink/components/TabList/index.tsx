import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useCallback, useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const TabListWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 44px;
  padding: 4px;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(44)};
    padding: ${vm(4)};
    gap: ${vm(8)};
  `}
`

const TabItem = styled.div<{ $isActive: boolean, $isBackTest?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 36px;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
  border-radius: 40px;
  color: ${({ theme }) => theme.textL1};
  background: ${({ theme,$isActive }) => $isActive ? theme.brand6 : 'transparent'};
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

export default function TabList({
  tabIndex,
  isBackTest,
  setTabIndex,
  sourceListDetailsLength,
}: {
  tabIndex: number
  isBackTest?: boolean
  setTabIndex: (index: number) => void
  sourceListDetailsLength: number
}) {
  const theme = useTheme()
  const changeTabIndex = useCallback((index: number) => {
    return () => {
      setTabIndex(index)
    }
  }, [setTabIndex])
  const tabList = useMemo(() => {
    if (isBackTest) {
      return [
        {
          key: 2,
          text: <Trans>Highlights</Trans>,
          clickCallback: changeTabIndex(2)
        },
        {
          key: 0,
          text: <Trans>Activity</Trans>,
          clickCallback: changeTabIndex(0)
        },
        {
          key: 1,
          text: <Trans>{sourceListDetailsLength} sources</Trans>,
          clickCallback: changeTabIndex(1)
        },
      ]
    }
    return [
      {
        key: 0,
        text: <Trans>Activity</Trans>,
        clickCallback: changeTabIndex(0)
      },
      {
        key: 1,
        text: <Trans>{sourceListDetailsLength} sources</Trans>,
        clickCallback: changeTabIndex(1)
      },
    ]
  }, [isBackTest, sourceListDetailsLength, changeTabIndex])
  return <TabListWrapper
    className="tab-list-wrapper"
    $borderRadius={22}
    $borderColor={theme.bgT30}
  >
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
  </TabListWrapper>
}
