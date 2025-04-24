import { Trans } from '@lingui/react/macro'
import BottomSheet from 'components/BottomSheet'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'
import styled, { css } from 'styled-components'
import AllToken from '../AllToken'
import { useCallback } from 'react'
import TokenItem from '../TokenItem'
import { useTokenList } from 'store/insights/hooks'

const Title = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  ${({ theme }) => theme.isMobile && css`
    width: 100%;
    height: ${vm(44)};
    padding: ${vm(0)} ${vm(20)};
    font-size: .20rem;
    font-weight: 500;
    line-height: .28rem;
    color: ${theme.textL1};
  `}
`

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding: ${vm(12)} ${vm(12)} ${vm(20)};
  `}
`

export default function TokenSwitch({
  isShowTokenSwitch,
  currentInsightToken,
  closeTokenSwitch,
  setCurrentInsightToken
}: {
  isShowTokenSwitch: boolean
  closeTokenSwitch: () => void
  currentInsightToken: string
  setCurrentInsightToken: (token: string) => void
}) {
  const theme = useTheme()
  const tokenList = useTokenList()
  const changeToken = useCallback((symbol: string) => {
    setCurrentInsightToken(symbol)
  }, [setCurrentInsightToken])
  return <BottomSheet
    showFromBottom
    rootStyle={{
      height: `calc(100vh - ${vm(68)})`,
      backgroundColor: theme.bgL1
    }}
    isOpen={isShowTokenSwitch} 
    onClose={closeTokenSwitch}
  >
    <Title><Trans>Watchlist</Trans></Title>
    <TokenList>
      <AllToken
        isActive={currentInsightToken === ''}
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
    </TokenList>
  </BottomSheet>
}
