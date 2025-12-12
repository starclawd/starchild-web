import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import Table from 'components/Table'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTimezone } from 'store/timezonecache/hooks'
import { useIsMobile } from 'store/application/hooks'
import { BacktestDataType } from 'store/agentdetail/agentdetail'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'

const BuySellTableWrapper = styled.div`
  display: flex;
  .header-container {
    height: 40px;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.bgT20};
    th {
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        text-align: left;
        padding-right: 12px;
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

export default function BuySellTable({ backtestData }: { backtestData: BacktestDataType }) {
  const isMobile = useIsMobile()
  const [pageIndex, setPageIndex] = useState(1)
  const [timezone] = useTimezone()
  const { details } = backtestData
  const columns = useMemo(
    () => [
      {
        key: 'Time',
        title: <Trans>Time</Trans>,
        render: (record: any) => {
          const time = record.timestamp
          return dayjs.tz(time * 1000, timezone).format('YYYY-MM-DD HH:mm')
        },
        ...(isMobile && { width: '140px' }),
      },
      {
        key: 'Direction',
        title: <Trans>Direction</Trans>,
        render: (record: any) => {
          return <SideWrapper $isBuy={record.side === 'buy'}>{record.side}</SideWrapper>
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
    [isMobile, timezone],
  )
  const detailsList = useMemo(() => {
    if (!Array.isArray(details)) return []
    return [...details]
      .sort((a, b) => Number(b?.timestamp) - Number(a?.timestamp))
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
