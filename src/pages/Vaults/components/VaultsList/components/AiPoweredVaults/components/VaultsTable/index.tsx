import { memo, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { AllStrategiesOverview } from 'store/vaults/vaults'
import Table, { ColumnDef } from 'components/Table'
import { formatNumber, formatPercent } from 'utils/format'
import { toFix } from 'utils/calc'

interface VaultsTableProps {
  allStrategies: AllStrategiesOverview[]
  onRowClick?: (vaultId: string) => void
}

const StyledTable = styled(Table)`
  .header-container {
    display: flex;
    align-items: center;
    height: 40px;
    background: ${({ theme }) => theme.black700};
    border-radius: 4px;

    th {
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }

  .table-row {
    cursor: pointer;
    height: 70px;
    border-bottom: 1px solid ${({ theme }) => theme.lineDark8};

    td {
      &:first-child {
        padding-left: 12px;
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }
` as typeof Table

const StrategyNameCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const StrategyName = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
`

const StrategyBuilder = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
  img {
    width: 18px;
    height: 18px;
  }
`

const InitalEquity = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  span:first-child {
    color: ${({ theme }) => theme.textL4};
  }
  span:last-child {
    color: ${({ theme }) => theme.textL2};
  }
`

const AgeValue = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

const PnlValue = styled.div<{ $isProfit: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  span:first-child {
    color: ${({ theme, $isProfit }) => ($isProfit ? theme.green100 : theme.red100)};
  }
  span:last-child {
    color: ${({ theme, $isProfit }) => ($isProfit ? theme.green300 : theme.red300)};
  }
`

const MaxDrawdown = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 153.846% */
  letter-spacing: 0.39px;
  color: ${({ theme }) => theme.red100};
`

const SharpRatioValue = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 153.846% */
  letter-spacing: 0.39px;
  color: ${({ theme }) => theme.textL2};
`

const VaultsTable = memo<VaultsTableProps>(({ allStrategies, onRowClick }) => {
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const columns: ColumnDef<AllStrategiesOverview>[] = useMemo(
    () => [
      {
        key: 'name',
        title: <Trans>Name / Strategy Provider</Trans>,
        render: (strategy) => (
          <StrategyNameCell>
            <StrategyName>{strategy.strategyName}</StrategyName>
            <StrategyBuilder>
              {strategy.userInfo.userAvatar && <img src={strategy.userInfo.userAvatar || ''} alt='' />}
              <span>{strategy.userInfo.userName || '--'}</span>
            </StrategyBuilder>
          </StrategyNameCell>
        ),
      },
      {
        key: 'Inital Equity / Equity ',
        title: <Trans>Inital Equity / Equity </Trans>,
        render: (strategy) => (
          <InitalEquity>
            <span>${formatNumber(toFix(strategy.startBalance, 2))}&nbsp;/&nbsp;</span>
            <span>${formatNumber(toFix(strategy.endBalance, 2))}</span>
          </InitalEquity>
        ),
      },
      {
        key: 'age',
        title: <Trans>Age</Trans>,
        render: (strategy) => (
          <AgeValue>
            <Trans>{strategy.ageDays} days</Trans>
          </AgeValue>
        ),
      },
      {
        key: 'PnL / APR',
        title: <Trans>PnL / APR</Trans>,
        render: (strategy) => (
          <PnlValue $isProfit={strategy.pnl >= 0}>
            <span>${formatNumber(toFix(strategy.pnl, 2))}</span>
            <span>({formatPercent({ value: strategy.allTimeApr / 100 })})</span>
          </PnlValue>
        ),
      },
      {
        key: 'Max drawdown',
        title: <Trans>Max drawdown</Trans>,
        render: (strategy) => <MaxDrawdown>{formatPercent({ value: strategy.maxDrawdown })}</MaxDrawdown>,
      },
      {
        key: 'Sharp ratio',
        title: <Trans>Sharp ratio</Trans>,
        render: (strategy) => <SharpRatioValue>{toFix(strategy.sharpeRatio)}</SharpRatioValue>,
      },
    ],
    [],
  )

  // 计算当前页显示的数据
  const paginatedVaults = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return allStrategies.slice(startIndex, endIndex)
  }, [allStrategies, currentPage, pageSize])

  // 处理翻页
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 处理每页条数变化
  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1) // 重置到第一页
  }

  // 处理行点击事件
  const handleRowClick = (vault: AllStrategiesOverview) => {
    onRowClick?.(vault.vaultId)
  }

  return (
    <StyledTable
      showPagination
      data={paginatedVaults}
      columns={columns}
      onRowClick={handleRowClick}
      headerBodyGap={0}
      rowHeight={70}
      rowGap={0}
      pageIndex={currentPage}
      pageSize={pageSize}
      totalSize={allStrategies.length}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
    />
  )
})

VaultsTable.displayName = 'VaultsTable'

export default VaultsTable
