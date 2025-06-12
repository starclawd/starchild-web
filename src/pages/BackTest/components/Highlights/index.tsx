import { Trans } from '@lingui/react/macro'
import Markdown from 'components/Markdown'
import MemoizedHighlight from 'components/MemoizedHighlight'
import MoveTabList from 'components/MoveTabList'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useMemo, useState } from 'react'
import { useBacktestData } from 'store/backtest/hooks'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const HighlightsContent = styled(BorderAllSide1PxBox)<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  gap: 12px;
  padding: 16px;
  border-radius: 24px;
  width: 360px;
  background-color: ${({ theme }) => theme.bgL1};
  .move-tab-item {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && css`
    display: none;
    @media screen and (orientation:landscape) {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      align-items: flex-start;
      width: 215px;
      height: 100%;
      gap: 12px;
      padding: 12px;
      border-radius: 24px;
      background-color: ${({ theme }) => theme.bgL1};
    }
    .markdown-wrapper {
      ${theme.isMobile
      && ($isMobileBackTestPage ? css`
        font-size: 12px;
        font-weight: 400;
        line-height: 22px;
      ` : css`
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
      `)}
    }
  `}
`

const Content = styled.div<{ $tabIndex: number }>`
  width: 100%;
  height: calc(100% - 36px);
  .markdown-wrapper {
    width: 100%;
  }
  code {
    font-size: 14px !important;
  }
  ${({ $tabIndex }) => $tabIndex === 0 && css`
    overflow-x: hidden;
  `}
`

export default function Highlights({
  isMobileBackTestPage
}: {
  isMobileBackTestPage?: boolean
}) {
  const theme = useTheme()
  const contentRef = useScrollbarClass()
  const [{ requirement, code }] = useBacktestData()
  const [tabIndex, setTabIndex] = useState(0)
  const changeTabIndex = useCallback((index: number) => {
    return () => {
      setTabIndex(index)
    }
  }, [setTabIndex])
  const tabList = useMemo(() => {
    return [
      {
        key: 0,
        text: <Trans>Highlights</Trans>,
        clickCallback: changeTabIndex(0)
      },
      {
        key: 1,
        text: <Trans>Code</Trans>,
        clickCallback: changeTabIndex(1)
      },
    ]
  }, [changeTabIndex])
  return <HighlightsContent
    className="highlights-content"
    $borderRadius={24}
    $borderColor={theme.bgT30}
    $isMobileBackTestPage={isMobileBackTestPage}
  >
    <MoveTabList
      forceWebStyle={true}
      tabIndex={tabIndex}
      tabList={tabList}
    />
    <Content $tabIndex={tabIndex} ref={contentRef as any} className="scroll-style">
      {tabIndex === 0
      ? <Markdown>
        {requirement}
      </Markdown>
      : <MemoizedHighlight className="python">{code}</MemoizedHighlight>}
    </Content>
  </HighlightsContent>
}
