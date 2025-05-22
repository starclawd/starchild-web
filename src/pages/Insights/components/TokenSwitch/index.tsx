import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'
import AllToken from '../AllToken'
import { useCallback, useEffect, useState } from 'react'
import TokenItem from '../TokenItem'
import { useGetAllInsights, useIsLoadingInsights, useMarkedReadList, useTokenList } from 'store/insights/hooks'
import { useIsMobile } from 'store/application/hooks'
import Notification from 'pages/Insights/components/Notification'
import NoData from 'components/NoData'
import { useIsLogout } from 'store/login/hooks'
import Pending from 'components/Pending'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'
import { InsightTokenDataType } from 'store/insightscache/insightscache'
import Input, { InputType } from 'components/Input'
import { t } from '@lingui/core/macro'

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
  padding: 0 16px 0 10px;
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

const InputWrapper = styled.div`
  padding: 0 16px 0 0;
  .input-wrapper {
    height: 48px;
  }
`

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 112px);
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    height: calc(100% - ${vm(44)});
    gap: ${vm(8)};
    padding: ${vm(12)} 0 ${vm(20)};
  `}
`

const ScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  flex-grow: 1;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    height: auto;
  `}
`

const NoDataWrapper = styled.div`
  width: 100%;
  height: calc(100% - 64px);
`

export default function TokenSwitch({
  closeTokenSwitch
}: {
  closeTokenSwitch?: () => void
}) {
  const isMobile = useIsMobile()
  const tokenList = useTokenList()
  const isLogOut = useIsLogout()
  const [searchValue, setSearchValue] = useState('')
  const [{ symbol: currentInsightToken }, setCurrentInsightToken] = useCurrentInsightTokenData()
  const [isLoading, setIsLoading] = useIsLoadingInsights()
  const [markedReadList] = useMarkedReadList()
  const getAllInsights = useGetAllInsights()
  const changeToken = useCallback((symbolData: InsightTokenDataType) => {
    setCurrentInsightToken(symbolData)
    closeTokenSwitch?.()
  }, [setCurrentInsightToken, closeTokenSwitch])
  const changeValue = useCallback((e: any) => {
    const value = e.target.value
    setSearchValue(value)
  }, [setSearchValue])

  useEffect(() => {
    if (isLogOut) {
      setIsLoading(false)
    }
  }, [isLogOut, setIsLoading])
    
  useEffect(() => {
    if (markedReadList.length > 0) {
      getAllInsights({ pageIndex: 1 })
    }
  }, [currentInsightToken, markedReadList.length, getAllInsights])
  
  return <TokenSwitchWrapper>
    {isMobile ?
      <Title><Trans>Watchlist</Trans></Title>
      :
      <Title>
        <span><Trans>Explore</Trans></span>
        <Notification />
      </Title>
    }
    {!isMobile && <InputWrapper>
      <Input
        placeholder={t`Search Token`}
        inputType={InputType.SEARCH}
        inputValue={searchValue}
        onChange={changeValue}
        onResetValue={() => setSearchValue('')}
      />
    </InputWrapper>}
    <TokenList>
      <ScrollWrapper className="scroll-style">
        {tokenList.length > 0 && <AllToken
          isActive={!currentInsightToken}
          isSwitchFunc={false}
          clickCallback={() => changeToken({ symbol: '', isBinanceSupport: false })}
        />}
        {tokenList.length > 0
          ? tokenList.map((tokenData) => {
            const { symbol, des, size } = tokenData
            return <TokenItem
              key={symbol}
              symbol={symbol}
              des={des}
              size={size}
              isActive={currentInsightToken === symbol}
              changeToken={() => changeToken(tokenData)}
            />
          })
          : isLoading
            ? <Pending isFetching />
            : <NoDataWrapper>
              <NoData />
            </NoDataWrapper>
        }
      </ScrollWrapper>
    </TokenList>
  </TokenSwitchWrapper>
}
