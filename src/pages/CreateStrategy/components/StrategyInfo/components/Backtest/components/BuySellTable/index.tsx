import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import Table from 'components/Table'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'
import { useIsMobile } from 'store/application/hooks'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { StrategyBacktestDataType, SymbolDataType } from 'store/createstrategy/createstrategy'

const BuySellTableWrapper = styled.div`
  display: flex;
  .header-container {
    height: 40px;
    th {
      &:first-child {
        padding-left: 12px;
        border-top-left-radius: 8px;
        border-bottom-left-radius: 8px;
      }
      &:last-child {
        text-align: left;
        padding-right: 12px;
        border-top-right-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
  .table-scroll-container {
    /* padding: 0 12px; */
    .table-row {
      height: 40px;
      border-bottom: 1px solid ${({ theme }) => theme.lineDark6};
      td {
        &:first-child {
          padding-left: 12px;
        }
        &:last-child {
          text-align: left;
          padding-right: 12px;
        }
      }
    }
    .table-cell {
      padding-bottom: 0;
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .table-scroll-container {
        .table-row {
          height: 32px;
        }
      }
    `}
`

const SideWrapper = styled.div<{ $isBuy: boolean }>`
  color: ${({ $isBuy, theme }) => ($isBuy ? theme.jade10 : theme.ruby40)};
  text-transform: capitalize;
`

export default function BuySellTable({
  currentSymbolData,
  strategyBacktestData,
}: {
  currentSymbolData: SymbolDataType
  strategyBacktestData: StrategyBacktestDataType
}) {
  const isMobile = useIsMobile()
  const [pageIndex, setPageIndex] = useState(1)
  const [timezone] = useTimezone()
  const directionMap: any = useMemo(() => {
    return {
      close_short: <Trans>Buy</Trans>,
      short: <Trans>Sell</Trans>,
    }
  }, [])
  const details = useMemo(() => {
    const { symbol } = currentSymbolData
    return strategyBacktestData?.result?.details?.filter((item) => item.symbol === symbol) || []
  }, [strategyBacktestData?.result?.details, currentSymbolData])
  const columns = useMemo(
    () => [
      {
        key: 'Time',
        title: <Trans>Time</Trans>,
        render: (record: any) => {
          const time = record.datetime
          return dayjs.tz(time, timezone).format('YYYY-MM-DD HH:mm')
        },
        ...(isMobile && { width: '140px' }),
      },
      {
        key: 'Direction',
        title: <Trans>Direction</Trans>,
        render: (record: any) => {
          return <SideWrapper $isBuy={record.side === 'close_short'}>{directionMap[record.side]}</SideWrapper>
        },
        ...(isMobile && { width: '60px' }),
      },
      {
        key: 'Price',
        title: <Trans>Price</Trans>,
        render: (record: any) => {
          return formatNumber(Number(record.price))
        },
      },
      {
        key: 'Qty',
        title: <Trans>Qty</Trans>,
        render: (record: any) => {
          return formatNumber(Number(toFix(record.quantity, 4)))
        },
      },
    ],
    [isMobile, timezone, directionMap],
  )
  const detailsList = useMemo(() => {
    if (!Array.isArray(details)) return []
    return [...details]
      .sort((a: any, b: any) => Number(new Date(b.datetime).getTime()) - Number(new Date(a.datetime).getTime()))
      .slice((pageIndex - 1) * 10, pageIndex * 10)
  }, [details, pageIndex])
  const onPageChange = (page: number) => {
    setPageIndex(page)
  }
  return (
    <BuySellTableWrapper>
      <Table
        showPagination
        showPageSizeSelector={false}
        pageIndex={pageIndex}
        totalSize={detailsList.length}
        pageSize={10}
        data={detailsList}
        columns={columns}
        emptyText=''
        headerBodyGap={0}
        onPageChange={onPageChange}
      />
    </BuySellTableWrapper>
  )
}
