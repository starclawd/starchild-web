import { memo, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { CommunityVaultFilter } from 'store/vaults/vaults'
import { ButtonCommon } from 'components/Button'
import Select, { DataType, TriggerMethod } from 'components/Select'

interface VaultsFiltersProps {
  filter: CommunityVaultFilter
  onFilterChange: (filter: Partial<CommunityVaultFilter>) => void
}

const FiltersContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const FilterLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  font-weight: 500;
  white-space: nowrap;
`

const FilterButton = styled(ButtonCommon)<{ $isActive?: boolean }>`
  height: 32px;
  padding: 0 12px;
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.lineDark8};
  background: ${({ theme, $isActive }) => ($isActive ? theme.blue100 : theme.bgL1)};
  color: ${({ theme, $isActive }) => ($isActive ? theme.white : theme.textL1)};

  &:hover {
    background: ${({ theme, $isActive }) => ($isActive ? theme.blue100 : theme.bgL2)};
  }
`

const DropdownButton = styled(FilterButton)`
  position: relative;
  padding-right: 24px;

  &::after {
    content: '';
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    border: 1px solid currentColor;
    border-left: none;
    border-top: none;
    transform: translateY(-50%) rotate(45deg);
  }
`

const SelectContainer = styled.div`
  .select-wrapper {
    .select-border-wrapper {
      height: 32px;
      padding: 0 12px;
      font-size: 13px;
      border: 1px solid ${({ theme }) => theme.lineDark8};
      background: ${({ theme }) => theme.bgL1};
      color: ${({ theme }) => theme.textL1};
      border-radius: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: ${({ theme }) => theme.bgL2};
      }
    }

    &.show .select-border-wrapper {
      background: ${({ theme }) => theme.blue100};
      color: ${({ theme }) => theme.white};
    }
  }
`

const CheckboxGroup = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.textL1};
  user-select: none;

  &:hover {
    color: ${({ theme }) => theme.textL1};
  }
`

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  appearance: none;
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 3px;
  background: ${({ theme }) => theme.bgL1};
  cursor: pointer;
  position: relative;

  &:checked {
    background: ${({ theme }) => theme.blue100};
    border-color: ${({ theme }) => theme.blue100};

    &::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 0px;
      width: 4px;
      height: 8px;
      border: 2px solid white;
      border-left: none;
      border-top: none;
      transform: rotate(45deg);
    }
  }

  &:hover {
    border-color: ${({ theme }) => theme.blue100};
  }
`

const VaultsFilters = memo<VaultsFiltersProps>(({ filter, onFilterChange }) => {
  const handleTimeFilterChange = useCallback(
    (timeFilter: CommunityVaultFilter['timeFilter']) => {
      onFilterChange({ timeFilter })
    },
    [onFilterChange],
  )

  const handleStatusFilterChange = useCallback(
    (statusFilter: CommunityVaultFilter['statusFilter']) => {
      onFilterChange({ statusFilter })
    },
    [onFilterChange],
  )

  const handleHideZeroBalancesChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange({ hideZeroBalances: event.target.checked })
    },
    [onFilterChange],
  )

  const timeFilterOptions = useMemo(
    (): DataType[] => [
      {
        text: <Trans>All time</Trans>,
        value: 'all_time',
        isActive: filter.timeFilter === 'all_time',
        clickCallback: handleTimeFilterChange,
      },
      {
        text: <Trans>30d</Trans>,
        value: '30d',
        isActive: filter.timeFilter === '30d',
        clickCallback: handleTimeFilterChange,
      },
    ],
    [filter.timeFilter, handleTimeFilterChange],
  )

  const statusFilterOptions = useMemo(
    (): DataType[] => [
      {
        text: <Trans>All</Trans>,
        value: 'all',
        isActive: filter.statusFilter === 'all',
        clickCallback: handleStatusFilterChange,
      },
      {
        text: <Trans>Live</Trans>,
        value: 'live',
        isActive: filter.statusFilter === 'live',
        clickCallback: handleStatusFilterChange,
      },
      {
        text: <Trans>Launching soon</Trans>,
        value: 'launching_soon',
        isActive: filter.statusFilter === 'launching_soon',
        clickCallback: handleStatusFilterChange,
      },
      {
        text: <Trans>Closed</Trans>,
        value: 'closed',
        isActive: filter.statusFilter === 'closed',
        clickCallback: handleStatusFilterChange,
      },
    ],
    [filter.statusFilter, handleStatusFilterChange],
  )

  const getTimeFilterDisplayText = () => {
    switch (filter.timeFilter) {
      case '30d':
        return <Trans>30d</Trans>
      default:
        return <Trans>All time</Trans>
    }
  }

  const getStatusFilterDisplayText = () => {
    switch (filter.statusFilter) {
      case 'live':
        return <Trans>Live</Trans>
      case 'launching_soon':
        return <Trans>Launching soon</Trans>
      case 'closed':
        return <Trans>Closed</Trans>
      default:
        return <Trans>All</Trans>
    }
  }

  return (
    <FiltersContainer>
      <FilterGroup>
        <SelectContainer>
          <Select
            value={filter.timeFilter}
            dataList={timeFilterOptions}
            triggerMethod={TriggerMethod.CLICK}
            placement='bottom-start'
            alignPopWidth
          >
            {getTimeFilterDisplayText()}
          </Select>
        </SelectContainer>
      </FilterGroup>

      <FilterGroup>
        <FilterLabel>
          <Trans>Status</Trans>
        </FilterLabel>
        <SelectContainer>
          <Select
            value={filter.statusFilter}
            dataList={statusFilterOptions}
            triggerMethod={TriggerMethod.CLICK}
            placement='bottom-start'
            alignPopWidth
          >
            {getStatusFilterDisplayText()}
          </Select>
        </SelectContainer>
      </FilterGroup>

      <CheckboxGroup>
        <Checkbox checked={filter.hideZeroBalances} onChange={handleHideZeroBalancesChange} />
        <Trans>Hide zero balances</Trans>
      </CheckboxGroup>
    </FiltersContainer>
  )
})

VaultsFilters.displayName = 'VaultsFilters'

export default VaultsFilters
