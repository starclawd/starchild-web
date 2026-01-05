import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod } from 'components/Select'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import styled from 'styled-components'

const SelectValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black100};
`

export enum WEEKLY_VALUE {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export default function WeeklySelect({
  weeklyValue,
  setWeeklyValue,
}: {
  weeklyValue: WEEKLY_VALUE
  setWeeklyValue: Dispatch<SetStateAction<WEEKLY_VALUE>>
}) {
  const weeklyMap = useMemo(() => {
    return {
      [WEEKLY_VALUE.MONDAY]: <Trans>Monday</Trans>,
      [WEEKLY_VALUE.TUESDAY]: <Trans>Tuesday</Trans>,
      [WEEKLY_VALUE.WEDNESDAY]: <Trans>Wednesday</Trans>,
      [WEEKLY_VALUE.THURSDAY]: <Trans>Thursday</Trans>,
      [WEEKLY_VALUE.FRIDAY]: <Trans>Friday</Trans>,
      [WEEKLY_VALUE.SATURDAY]: <Trans>Saturday</Trans>,
      [WEEKLY_VALUE.SUNDAY]: <Trans>Sunday</Trans>,
    }
  }, [])
  const chageWeekly = useCallback(
    (value: WEEKLY_VALUE) => {
      return () => {
        setWeeklyValue(value)
      }
    },
    [setWeeklyValue],
  )
  const weeklyList = useMemo(() => {
    return [
      {
        key: WEEKLY_VALUE.MONDAY,
        value: WEEKLY_VALUE.MONDAY,
        text: <Trans>Monday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.MONDAY),
      },
      {
        key: WEEKLY_VALUE.TUESDAY,
        value: WEEKLY_VALUE.TUESDAY,
        text: <Trans>Tuesday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.TUESDAY),
      },
      {
        key: WEEKLY_VALUE.WEDNESDAY,
        value: WEEKLY_VALUE.WEDNESDAY,
        text: <Trans>Wednesday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.WEDNESDAY),
      },
      {
        key: WEEKLY_VALUE.THURSDAY,
        value: WEEKLY_VALUE.THURSDAY,
        text: <Trans>Thursday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.THURSDAY),
      },
      {
        key: WEEKLY_VALUE.FRIDAY,
        value: WEEKLY_VALUE.FRIDAY,
        text: <Trans>Friday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.FRIDAY),
      },
      {
        key: WEEKLY_VALUE.SATURDAY,
        value: WEEKLY_VALUE.SATURDAY,
        text: <Trans>Saturday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.SATURDAY),
      },
      {
        key: WEEKLY_VALUE.SUNDAY,
        value: WEEKLY_VALUE.SUNDAY,
        text: <Trans>Sunday</Trans>,
        clickCallback: chageWeekly(WEEKLY_VALUE.SUNDAY),
      },
    ]
  }, [chageWeekly])
  return (
    <Select
      usePortal
      placement='bottom-start'
      offsetLeft={0}
      offsetTop={2}
      triggerMethod={TriggerMethod.CLICK}
      dataList={weeklyList}
      value={weeklyValue}
    >
      <SelectValue>{weeklyMap[weeklyValue]}</SelectValue>
    </Select>
  )
}
