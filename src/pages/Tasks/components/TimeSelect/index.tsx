import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod } from 'components/Select'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import styled from 'styled-components'

const SelectValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

export enum WEEKLY_VALUE {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday'
}

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export default function WeeklySelect({
  hours,
  minutes
}: {
  hours: number
  minutes: number
}) {
  return <Select
    usePortal
    customize
    placement="bottom-start"
    offsetLeft={0}
    offsetTop={2}
    triggerMethod={TriggerMethod.CLICK}
    dataList={[]}
    value=""
    customizeNode={<TimeWrapper>

    </TimeWrapper>}
  >
    <SelectValue>
      1
    </SelectValue>
  </Select>
}
