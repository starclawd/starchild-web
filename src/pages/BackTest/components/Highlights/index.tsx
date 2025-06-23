import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Markdown from 'components/Markdown'
import MemoizedHighlight from 'components/MemoizedHighlight'
import MoveTabList from 'components/MoveTabList'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useMemo, useState } from 'react'
import { BacktestData } from 'store/backtest/backtest'
import { useTheme } from 'store/themecache/hooks'
import { useIsShowDeepThink } from 'store/tradeai/hooks'
import styled, { css } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const HighlightsContent = styled(BorderAllSide1PxBox)<{ $isMobileBackTestPage?: boolean, $isMobileChatPage?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
  gap: 12px;
  padding: 16px;
  border-radius: 24px;
  width: 35%;
  background-color: ${({ theme }) => theme.bgL1};
  .move-tab-item {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }
  ${({ theme, $isMobileBackTestPage, $isMobileChatPage }) => theme.isMobile && css`
    display: none;
    ${!$isMobileChatPage && css`
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
    `}
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
  ${({ $isMobileChatPage }) => $isMobileChatPage && css`
    display: flex !important;
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: none;
  `}
`

const TabWrapper = styled.div<{ $isWebChatPage?: boolean, $isMobileChatPage?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  ${({ $isWebChatPage }) => $isWebChatPage && css`
    .tab-list-wrapper {
      width: 240px;
    }
    .icon-chat-close {
      font-size: 28px;
      color: ${({ theme }) => theme.textL4};
      cursor: pointer;
    }
  `}
  ${({ $isMobileChatPage }) => $isMobileChatPage && css`
    .move-tab-item {
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.22rem;
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
  isWebChatPage,
  isMobileBackTestPage,
  isMobileChatPage,
  backtestData
}: {
  isWebChatPage?: boolean
  isMobileBackTestPage?: boolean
  isMobileChatPage?: boolean
  backtestData?: BacktestData
}) {
  const theme = useTheme()
  const contentRef = useScrollbarClass()
  const { requirement, code } = backtestData || {
    requirement: '',
    code: ''
  }
  const [tabIndex, setTabIndex] = useState(0)
  const [, setIsShowDeepThink] = useIsShowDeepThink()
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
    $isMobileChatPage={isMobileChatPage}
  >
    <TabWrapper $isWebChatPage={isWebChatPage} $isMobileChatPage={isMobileChatPage}>
      <MoveTabList
        forceWebStyle={!isMobileChatPage}
        tabIndex={tabIndex}
        tabList={tabList}
      />
      {isWebChatPage && <IconBase onClick={() => setIsShowDeepThink(false)} className="icon-chat-close" />}
    </TabWrapper>
    <Content $tabIndex={tabIndex} ref={contentRef as any} className="scroll-style">
      {tabIndex === 0
      ? <Markdown>
        {requirement}
      </Markdown>
      : <MemoizedHighlight className="python">{code}</MemoizedHighlight>}
    </Content>
  </HighlightsContent>
}
