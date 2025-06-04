import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

const DataListWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  width: 100%;
  gap: 4px;
  flex-wrap: wrap;
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && !$isMobileBackTestPage && css`
    flex-direction: column;
    gap: 0;
    padding: ${vm(12)};
    border-radius: ${vm(16)};
    background-color: ${({ theme }) => theme.bgL1};
  `}
`

const ItemWrapper = styled.div<{ $isMobileBackTestPage?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  width: calc((100% - 8px) / 3);
  height: 58px;
  padding: 8px 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgT20};
  .title {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px; 
    color: ${({ theme }) => theme.textL3};
  }
  .value {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
  }
  ${({ theme, $isMobileBackTestPage }) => theme.isMobile && !$isMobileBackTestPage && css`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: ${vm(24)};
    padding: 0;
    background-color: transparent;
    .title {
      font-size: 0.12rem;
      line-height: 0.18rem;
    }
    .value {
      font-size: 0.12rem;
      line-height: 0.18rem;
    }
  `}
`

export default function DataList({
  isMobileBackTestPage
}: {
  isMobileBackTestPage?: boolean
}) {
  const itemList = useMemo(() => {
    return [
      {
        key: 'initialEquity',
        title: <Trans>Initial equity</Trans>,
        value: '10000'
      },
      {
        key: 'Max drawdown',
        title: <Trans>Max drawdown</Trans>,
        value: '10000'
      },
      {
        key: 'PnL',
        title: <Trans>PnL</Trans>,
        value: '10000'
      },
      {
        key: 'Total trades',
        title: <Trans>Total trades</Trans>,
        value: '10000'
      },
      {
        key: 'Wins',  
        title: <Trans>Wins</Trans>,
        value: '10000'
      },
      {
        key: 'Sharp ratio',
        title: <Trans>Sharp ratio</Trans>,
        value: '10000'
      }
    ]
  }, [])
  return <DataListWrapper $isMobileBackTestPage={isMobileBackTestPage}>
    {itemList.map((item) => {
      const { key, title, value } = item
      return (
        <ItemWrapper key={key}>
          <span className="title">{title}</span>
          <span className="value">{value}</span>
        </ItemWrapper>
      )
    })}
  </DataListWrapper>
}
