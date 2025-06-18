import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Input, { InputType } from 'components/Input'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { useCallback, useMemo, useState } from 'react'
import { useGetTokenImg } from 'store/application/hooks'
import { useInsightsList } from 'store/insights/hooks'
import { useCurrentInsightTokenData } from 'store/insightscache/hooks'
import styled, { css } from 'styled-components'

const InsightsTokenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
  gap: 20px;
  .input-wrapper {
    height: 40px;
    border-radius: 8px;
    input {
      padding-left: 26px;
    }
    .icon-search {
      left: 8px;
      top: calc(50% - 7px);
      font-size: 14px;
      color: ${({ theme }) => theme.textL2};
    }
  }
`

const AllToken = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  cursor: pointer;
  span:first-child {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px; 
    color: ${({ theme }) => theme.textL2};
    .icon-all-token {
      font-size: 18px;
      color: ${({ theme }) => theme.textL2};
    }
  }
`

const UnReadCount = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  width: fit-content;
  height: 14px;
  font-size: 10px;
  font-weight: 500;
  line-height: 14px;
  border-radius: 44px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  color: rgba(0, 169, 222, 1);
`

const WatchList = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  overflow: hidden;
`

const Title = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  margin-right: 0 !important;
  padding-right: 0 !important;
`

const TokenItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  cursor: pointer;
  span:first-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    img {
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }
  ${({ $isActive }) => $isActive && css`
    
  `}
`

export default function InsightsToken() {
  const tokenList = useMemo(() => {
    return [
      {
        symbol: 'BTC',
        des: 'Bitcoin',
        size: 100,
        isBinanceSupport: true,
      },
    ]
  }, [])
  const listRef = useScrollbarClass<HTMLDivElement>()
  const getTokenImg = useGetTokenImg()
  const [insightsList] = useInsightsList()
  const [searchValue, setSearchValue] = useState('')
  const [{ symbol: currentInsightToken }, setCurrentInsightToken] = useCurrentInsightTokenData()
  const unReadCount = insightsList.filter(insight => !insight.isRead).length
  const changeSearchValue = useCallback((e: any) => {
    setSearchValue(e.target.value)
  }, [])
  const changeTokenData = useCallback((tokenData: any) => {
    return () => {
      setCurrentInsightToken(tokenData)
    }
  }, [setCurrentInsightToken])
  return <InsightsTokenWrapper>
    <Input
      inputValue={searchValue}
      onChange={changeSearchValue}
      inputType={InputType.SEARCH}
      placeholder={t`Search Token`}
    />
    <AllToken onClick={changeTokenData({ symbol: '', isBinanceSupport: false })}>
      <span>
        <IconBase className="icon-all-token" />
        <Trans>All tokens</Trans>
      </span>
      <UnReadCount>{unReadCount}</UnReadCount>
    </AllToken>
    <WatchList>
      <Title>
        <Trans>Watchlist</Trans>
      </Title>
      <List ref={listRef} className="scroll-style">
        {
          tokenList.map((tokenData, index) => {
            const { symbol, size } = tokenData
            const isActive = currentInsightToken === symbol
            return <TokenItem
              key={index}
              $isActive={isActive}
              onClick={changeTokenData(tokenData)}
            >
              <span>
                <img src={getTokenImg(symbol)} alt="" />
                <span>{symbol}</span>
              </span>
              <UnReadCount>{size}</UnReadCount>
            </TokenItem>
          })
        }
      </List>
    </WatchList>
  </InsightsTokenWrapper>
}
