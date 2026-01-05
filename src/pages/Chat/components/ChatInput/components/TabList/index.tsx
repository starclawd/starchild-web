import { Trans } from '@lingui/react/macro'
import MoveTabList from 'components/MoveTabList'
import { vm } from 'pages/helper'
import { useCallback, useMemo, useState } from 'react'
import { useChatTabIndex } from 'store/chat/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'
import { css } from 'styled-components'

const TabListWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-top: ${vm(20)};
    `}
`

export default function TabList() {
  const theme = useTheme()
  const [chatTabIndex, setChatTabIndex] = useChatTabIndex()
  const changeTabIndex = useCallback(
    (index: number) => {
      return () => {
        setChatTabIndex(index)
      }
    },
    [setChatTabIndex],
  )
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Research</Trans>,
        clickCallback: changeTabIndex(0),
      },
      {
        key: 1,
        text: <Trans>Create strategies</Trans>,
        clickCallback: changeTabIndex(1),
      },
    ]
  }, [changeTabIndex])
  return (
    <TabListWrapper>
      <MoveTabList activeIndicatorBackground={theme.black500} tabKey={chatTabIndex} tabList={tabList} />
    </TabListWrapper>
  )
}
