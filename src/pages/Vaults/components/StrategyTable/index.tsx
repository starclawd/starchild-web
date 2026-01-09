import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Input, { InputType } from 'components/Input'
import { ChangeEvent, useCallback, useState, ReactNode } from 'react'
import styled from 'styled-components'
import Strategies from './components/Strategies'
import { useSort, useSortableHeader } from 'components/TableSortableColumn'

const StrategyTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

// Title + TableHeader 一起 sticky
const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.black1000};
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 88px;
  padding: 20px 40px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  > span {
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    color: ${({ theme }) => theme.black0};
  }
`

const InputWrapper = styled.div`
  width: 500px;
  height: 100%;
`

const TableHeaderWrapper = styled.div`
  padding: 12px 40px 0;
`

const HeaderTable = styled.table`
  width: 100%;
  height: 38px;
  border-collapse: collapse;
  table-layout: fixed;
`

const HeaderRow = styled.tr`
  height: 38px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const TableHeaderCell = styled.th<{ $align?: 'left' | 'center' | 'right' }>`
  text-align: ${(props) => props.$align || 'left'};
  white-space: nowrap;
  color: ${({ theme }) => theme.black200};
  padding: 0 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;

  &:first-child {
    padding-left: 0;
  }
  &:last-child {
    padding-right: 0;
  }
`

const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 40px;
`

interface HeaderConfig {
  key: string
  title: ReactNode
  align?: 'left' | 'center' | 'right'
  width: string
}

// 列宽配置 - header 和 body 共用
export const COLUMN_WIDTHS = [
  '4%', // #
  '20%', // name
  '14%', // leader
  '12%', // All time APR
  '10%', // Age
  '12%', // Max drawdown
  '12%', // TVF
  '8%', // Followers
  '8%', // Snapshot
]

export default function StrategyTable() {
  const [searchValue, setSearchValue] = useState('')
  const { sortState, handleSort } = useSort()
  const createSortableHeader = useSortableHeader(sortState, handleSort)

  const changeSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }, [])

  const headers: HeaderConfig[] = [
    { key: 'rank', title: '#', align: 'left', width: COLUMN_WIDTHS[0] },
    { key: 'name', title: <Trans>Name</Trans>, align: 'left', width: COLUMN_WIDTHS[1] },
    { key: 'leader', title: <Trans>Leader</Trans>, align: 'left', width: COLUMN_WIDTHS[2] },
    {
      key: 'allTimeApr',
      title: createSortableHeader(<Trans>All time APR</Trans>, 'all_time_apr'),
      align: 'left',
      width: COLUMN_WIDTHS[3],
    },
    {
      key: 'ageDays',
      title: createSortableHeader(<Trans>Age</Trans>, 'age_days'),
      align: 'left',
      width: COLUMN_WIDTHS[4],
    },
    {
      key: 'maxDrawdown',
      title: createSortableHeader(<Trans>Max drawdown</Trans>, 'max_drawdown'),
      align: 'left',
      width: COLUMN_WIDTHS[5],
    },
    {
      key: 'tvf',
      title: createSortableHeader(<Trans>TVF</Trans>, 'tvf'),
      align: 'left',
      width: COLUMN_WIDTHS[6],
    },
    {
      key: 'followers',
      title: createSortableHeader(<Trans>Followers</Trans>, 'followers'),
      align: 'left',
      width: COLUMN_WIDTHS[7],
    },
    { key: 'snapshot', title: <Trans>Snapshot</Trans>, align: 'right', width: COLUMN_WIDTHS[8] },
  ]

  return (
    <StrategyTableWrapper>
      <StickyHeader>
        <Title>
          <span>
            <Trans>Strategy hub</Trans>
          </span>
          <InputWrapper>
            <Input
              inputValue={searchValue}
              onChange={changeSearchValue}
              placeholder={t`Search by vault address, name or leader...`}
              inputType={InputType.SEARCH}
            />
          </InputWrapper>
        </Title>
        <TableHeaderWrapper>
          <HeaderTable>
            <colgroup>
              {COLUMN_WIDTHS.map((width, index) => (
                <col key={index} style={{ width }} />
              ))}
            </colgroup>
            <thead>
              <HeaderRow>
                {headers.map((header) => (
                  <TableHeaderCell key={header.key} $align={header.align}>
                    {header.title}
                  </TableHeaderCell>
                ))}
              </HeaderRow>
            </thead>
          </HeaderTable>
        </TableHeaderWrapper>
      </StickyHeader>
      <TableContent>
        <Strategies searchValue={searchValue} sortState={sortState} />
      </TableContent>
    </StrategyTableWrapper>
  )
}
