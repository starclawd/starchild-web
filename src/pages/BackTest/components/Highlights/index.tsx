import { Trans } from '@lingui/react/macro'
import Markdown from 'components/Markdown'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
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

const Title = styled.div`
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  `}
`

const Content = styled.div`
  width: 100%;
  height: calc(100% - 36px);
  overflow-x: hidden;
  .markdown-wrapper {
    width: 100%;
  }
`

export default function Highlights({
  isMobileBackTestPage
}: {
  isMobileBackTestPage?: boolean
}) {
  const theme = useTheme()
  const contentRef = useScrollbarClass()
  const [{ requirement }] = useBacktestData()

  return <HighlightsContent
    $borderRadius={24}
    $borderColor={theme.bgT30}
    $isMobileBackTestPage={isMobileBackTestPage}
  >
    <Title><Trans>Highlights</Trans></Title>
    <Content ref={contentRef as any} className="scroll-style">
      <Markdown>
        {requirement}
      </Markdown>
    </Content>
  </HighlightsContent>
}
