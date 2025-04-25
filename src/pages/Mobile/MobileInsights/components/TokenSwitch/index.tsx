import { Trans } from '@lingui/react/macro'
import BottomSheet from 'components/BottomSheet'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import AllToken from '../AllToken'
import { useCallback } from 'react'
import TokenItem from '../TokenItem'
import { useTokenList } from 'store/insights/hooks'
import { useIsMobile } from 'store/application/hooks'
import Notification from 'pages/Insights/components/Notification'

const TokenSwitchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  ${({ theme }) => theme.isMobile
  ? css`
    height: calc(100% - ${vm(31)});
    gap: 0;
    padding: 0 ${vm(12)};
  `
  : css`
    cursor: pointer;
  `}
`

const Title = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  justify-content: space-between;
  height: 44px;
  padding: 0 8px 0 11px;
  > span:first-child {
    font-size: 26px;
    font-style: normal;
    font-weight: 500;
    line-height: 34px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: ${vm(44)};
    padding: 0;
    font-size: .20rem;
    font-weight: 500;
    line-height: .28rem;
    color: ${theme.textL1};
  `}
`

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 56px);
  gap: 8px;
  padding: 0 4px 0 0;
  ${({ theme }) => theme.isMobile && css`
    height: calc(100% - ${vm(44)});
    gap: ${vm(8)};
    padding: ${vm(12)} 0 ${vm(20)};
  `}
`

const ScrollWrapper = styled.div`
  height: 100%;
  padding: 0 12px 0 0;
  overflow: auto;
  ${({ theme }) => theme.isMobile && css`
    height: auto;
    padding: 0;
  `}
`

export default function TokenSwitch({
  currentInsightToken,
  setCurrentInsightToken
}: {
  currentInsightToken: string
  setCurrentInsightToken: (token: string) => void
}) {
  const isMobile = useIsMobile()
  const tokenList = useTokenList()
  const changeToken = useCallback((symbol: string) => {
    setCurrentInsightToken(symbol)
  }, [setCurrentInsightToken])
  return <TokenSwitchWrapper>
    {isMobile ?
      <Title><Trans>Watchlist</Trans></Title>
      :
      <Title>
        <span><Trans>Explore</Trans></span>
        <Notification />
      </Title>
    }
    <TokenList>
      <ScrollWrapper className={isMobile ? '' : 'scroll-style'}>
        <AllToken
          isActive={!currentInsightToken}
          isSwitchFunc={false}
          clickCallback={() => changeToken('')}
        />
        {
          tokenList.map((tokenData) => {
            const { symbol, des } = tokenData
            return <TokenItem
              key={symbol}
              symbol={symbol}
              des={des}
              isActive={currentInsightToken === symbol}
              changeToken={() => changeToken(symbol)}
            />
          })
        }
      </ScrollWrapper>
    </TokenList>
  </TokenSwitchWrapper>
}
