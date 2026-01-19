import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Input, { InputType } from 'components/Input'
import { ChangeEvent, useCallback, useState, ReactNode, useMemo, memo } from 'react'
import styled from 'styled-components'
import Strategies from './components/Strategies'
import { useSort, useSortableHeader, SortDirection } from 'components/TableSortableColumn'
import { ANI_DURATION } from 'constants/index'
import Tooltip from 'components/Tooltip'
import tagBg from 'assets/vaults/tag-bg.png'
import { useAllStrategiesOverview } from 'store/vaults/hooks'
import { useUserInfo, useIsLogin } from 'store/login/hooks'
import StrategyItem from './components/StrategyItem'

const StrategyTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Title = styled.div`
  position: sticky;
  top: 0;
  z-index: 11;
  background-color: ${({ theme }) => theme.black1000};
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
  position: sticky;
  top: 88px;
  z-index: 10;
  background-color: ${({ theme }) => theme.black1000};
  padding: 0 40px;
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

const MyStrategiesSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px 40px 0;
  transition: all ${ANI_DURATION}s;
  ${({ theme }) => theme.mediaMaxWidth.width1280`
    padding: 0 20px;
  `}
`

const MyStrategiesTable = styled.table`
  width: 100%;
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

const SectionDivider = styled.div`
  position: relative;
  width: 100%;
  height: 24px;
  background-image: url(${tagBg});
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-position: center;
  display: flex;
  align-items: center;
  padding-left: 16px;
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

export default memo(function StrategyTable() {
  const [searchValue, setSearchValue] = useState('')
  const { sortState, handleSort } = useSort('all_time_apr', SortDirection.DESC)
  const createSortableHeader = useSortableHeader(sortState, handleSort)

  const { allStrategies } = useAllStrategiesOverview()
  const [{ userInfoId }] = useUserInfo()
  const isLogin = useIsLogin()

  const changeSearchValue = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchValue(value)
  }, [])

  // 计算基于 all_time_apr 倒序的排名 Map（与 Strategies 组件保持一致）
  const aprRankMap = useMemo(() => {
    const sorted = [...allStrategies].sort((a, b) => {
      const aValue = a.all_time_apr
      const bValue = b.all_time_apr
      // 倒序排列（DESC），大的在前
      return bValue - aValue
    })
    const rankMap = new Map<string, number>()
    sorted.forEach((strategy, index) => {
      if (strategy.strategy_id) {
        rankMap.set(String(strategy.strategy_id), index + 1)
      }
    })
    return rankMap
  }, [allStrategies])

  // 筛选出当前用户创建的策略
  const myStrategies = useMemo(() => {
    if (!isLogin || !userInfoId) return []
    return allStrategies.filter((strategy) => strategy.user_info?.user_info_id === Number(userInfoId))
  }, [allStrategies, userInfoId, isLogin])

  // 通过 searchValue 筛选用户自己的策略
  const filteredMyStrategies = useMemo(() => {
    if (!searchValue.trim()) {
      return myStrategies
    }

    const lowerSearchValue = searchValue.toLowerCase().trim()
    return myStrategies.filter((strategy) => {
      const userName = strategy.user_info?.user_name?.toLowerCase() || ''
      const strategyName = strategy.strategy_name?.toLowerCase() || ''
      return userName.includes(lowerSearchValue) || strategyName.includes(lowerSearchValue)
    })
  }, [myStrategies, searchValue])

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
      <Title>
        <span>
          <Trans>Leaderboard</Trans>
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

      {/* 用户自己创建的策略 - 在 Title 下面，TableHeader 上面，随页面滚动 */}
      {filteredMyStrategies.length > 0 && (
        <MyStrategiesSection>
          <MyStrategiesTable>
            <colgroup>
              {COLUMN_WIDTHS.map((width, index) => (
                <col key={index} style={{ width }} />
              ))}
            </colgroup>
            {filteredMyStrategies.map((record, index) => (
              <StrategyItem
                key={record.strategy_id || `my-${index}`}
                record={record}
                aprRank={record.strategy_id ? aprRankMap.get(String(record.strategy_id)) || 0 : 0}
              />
            ))}
          </MyStrategiesTable>
          {/* 分割区域 */}
          <SectionDivider />
        </MyStrategiesSection>
      )}

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

      <TableContent>
        <Strategies searchValue={searchValue} sortState={sortState} />
      </TableContent>
    </StrategyTableWrapper>
  )
})
