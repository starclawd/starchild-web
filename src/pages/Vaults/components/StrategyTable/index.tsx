import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Input, { InputType } from 'components/Input'
import { ChangeEvent, useCallback, useState, ReactNode } from 'react'
import styled from 'styled-components'
import Strategies from './components/Strategies'
import { useSort, useSortableHeader, SortDirection } from 'components/TableSortableColumn'
import { ANI_DURATION } from 'constants/index'
import { IconBase } from 'components/Icons'
import Tooltip from 'components/Tooltip'

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
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    padding: 20px 20px;
  `}
`

const InputWrapper = styled.div`
  width: 500px;
  height: 100%;
`

const TableHeaderWrapper = styled.div`
  padding: 12px 40px 0;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    padding: 12px 20px 0;
  `}
`

const HeaderTable = styled.table`
  width: 100%;
  height: 38px;
  border-collapse: collapse;
  table-layout: fixed;
  --name-column-width: 20%;

  ${({ theme }) => theme.mediaMaxWidth.width1920`
    --name-column-width: 280px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1440`
    --name-column-width: 260px;
  `}
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    --name-column-width: 240px;
  `}
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
    padding-left: 0;
    padding-right: 0;
  }
`

const TableContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 40px;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    padding: 0 20px;
  `}
`

const MaxDrawdown = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-circle-warning {
    transition: all ${ANI_DURATION}s;
    &:hover {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const TVF = styled(MaxDrawdown)``

interface HeaderConfig {
  key: string
  title: ReactNode
  align?: 'left' | 'center' | 'right'
}

// 列宽配置 - header 和 body 共用
// name 列使用 CSS 变量实现响应式宽度
export const COLUMN_WIDTHS = [
  '50px', // #
  'var(--name-column-width)', // name - 响应式宽度，最小 280px
  '200px', // leader
  'auto', // All time APR - 自适应
  'auto', // Age - 自适应
  'auto', // Max drawdown - 自适应
  'auto', // TVF - 自适应
  'auto', // Followers - 自适应
  '80px', // Snapshot - 固定宽度
]

export default function StrategyTable() {
  const [searchValue, setSearchValue] = useState('')
  const { sortState, handleSort } = useSort('all_time_apr', SortDirection.DESC)
  const createSortableHeader = useSortableHeader(sortState, handleSort)

  const changeSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }, [])

  const headers: HeaderConfig[] = [
    { key: 'rank', title: '#', align: 'left' },
    { key: 'name', title: <Trans>Name</Trans>, align: 'left' },
    { key: 'leader', title: <Trans>Leader</Trans>, align: 'left' },
    { key: 'allTimeApr', title: createSortableHeader(<Trans>All time APR</Trans>, 'all_time_apr'), align: 'left' },
    { key: 'ageDays', title: createSortableHeader(<Trans>Age(days)</Trans>, 'age_days'), align: 'left' },
    {
      key: 'maxDrawdown',
      title: createSortableHeader(
        <MaxDrawdown>
          <Tooltip placement='top' content={<Trans>The biggest drop from the peak. Lower means less risk.</Trans>}>
            <Trans>Max drawdown</Trans>
          </Tooltip>
        </MaxDrawdown>,
        'max_drawdown',
      ),
      align: 'left',
    },
    {
      key: 'tvf',
      title: createSortableHeader(
        <TVF>
          <Tooltip placement='top' content={<Trans>Total follower assets. Higher TVF means more interest.</Trans>}>
            <Trans>TVF</Trans>
          </Tooltip>
        </TVF>,
        'tvf',
      ),
      align: 'left',
    },
    { key: 'followers', title: createSortableHeader(<Trans>Followers</Trans>, 'followers'), align: 'left' },
    { key: 'snapshot', title: <Trans>Snapshot</Trans>, align: 'right' },
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
              placeholder={t`Search by name or leader...`}
              inputType={InputType.SEARCH}
              onResetValue={() => setSearchValue('')}
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
