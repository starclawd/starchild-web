import { IconBase } from 'components/Icons'
import styled from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useCallback, useMemo, useState } from 'react'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import Select, { TriggerMethod } from 'components/Select'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import { formatPercent } from 'utils/format'
import { useTheme } from 'store/themecache/hooks'
import { css } from 'styled-components'
import { isInvalidValue } from 'utils/calc'
import { useToggleStrategyId } from 'hooks/useAddUrlParam'

const ChatHeaderWrapper = styled.div<{ $isShowSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
  padding: 0 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black600};
  transition: background-color ${ANI_DURATION}s;
  .select-wrapper {
    width: 100%;
    height: 100%;
  }
  .select-border-wrapper {
    padding: 0;
    border-radius: 0;
    backdrop-filter: unset;
    background-color: transparent;
    border: none;
  }
  ${({ $isShowSelect }) =>
    $isShowSelect &&
    css`
      background-color: ${({ theme }) => theme.black800};
    `}
`

const SelectValue = styled.div<{ $isShowSelect: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textDark98};
  .icon-switch {
    font-size: 24px;
    color: ${({ theme }) => theme.textL3};
    transition: all ${ANI_DURATION}s;
  }
  ${({ $isShowSelect }) =>
    $isShowSelect &&
    css`
      .icon-switch {
        color: ${({ theme }) => theme.textL1};
      }
    `}
`

const SelectItem = styled.div<{ $apr: number; $isInvalidValue: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textDark80};
  ${({ $apr }) =>
    $apr > 0 &&
    css`
      span:last-child {
        color: ${({ theme }) => theme.green100};
      }
    `}
  ${({ $apr }) =>
    $apr < 0 &&
    css`
      span:last-child {
        color: ${({ theme }) => theme.red100};
      }
    `}
  ${({ $apr }) =>
    $apr === 0 &&
    css`
      span:last-child {
        color: ${({ theme }) => theme.textL2};
      }
    `}
  ${({ $isInvalidValue }) =>
    $isInvalidValue &&
    css`
      span:last-child {
        color: ${({ theme }) => theme.textL4};
      }
    `}
`

export default function ChatHeader() {
  const theme = useTheme()
  const toggleStrategyId = useToggleStrategyId()
  const { strategyId } = useParsedQueryString()
  const { myStrategies } = useMyStrategies()
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })
  const [isShowSelect, setIsShowSelect] = useState(false)
  const handleToggleStrategyId = useCallback(
    (strategyId: string) => {
      return () => {
        toggleStrategyId(strategyId)
      }
    },
    [toggleStrategyId],
  )

  const dataList = useMemo(() => {
    return myStrategies.map((strategy) => {
      const { strategy_id, strategy_name, all_time_apr } = strategy
      return {
        key: strategy_id,
        value: strategy_id,
        text: (
          <SelectItem $apr={all_time_apr} $isInvalidValue={isInvalidValue(all_time_apr)}>
            <span>{strategy_name}</span>
            <span>{!isInvalidValue(all_time_apr) ? formatPercent({ value: all_time_apr, mark: true }) : '--'}</span>
          </SelectItem>
        ),
        clickCallback: handleToggleStrategyId(strategy_id),
      }
    })
  }, [myStrategies, handleToggleStrategyId])

  return (
    <ChatHeaderWrapper $isShowSelect={isShowSelect}>
      <Select
        usePortal
        useOutShow
        hideExpand
        outSetShow={setIsShowSelect}
        outShow={isShowSelect}
        offsetLeft={-20}
        offsetTop={1}
        placement='bottom-start'
        triggerMethod={TriggerMethod.CLICK}
        dataList={dataList}
        value={strategyId || ''}
        popStyle={{
          width: '399px',
          borderRadius: '0',
          padding: '0 8px',
          backgroundColor: theme.black800,
        }}
        popItemHoverBg={theme.black600}
        popItemStyle={{
          borderRadius: '0',
          height: '40px',
          padding: '0 12px',
        }}
        popItemTextStyle={{
          width: '100%',
          height: '100%',
          borderBottom: `1px solid ${theme.lineDark4}`,
        }}
      >
        <SelectValue $isShowSelect={isShowSelect}>
          <span>{strategyDetail?.name}</span>
          <IconBase className='icon-switch' />
        </SelectValue>
      </Select>
    </ChatHeaderWrapper>
  )
}
