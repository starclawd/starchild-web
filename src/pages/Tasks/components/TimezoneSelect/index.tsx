import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod } from 'components/Select'
import { SUPPORTED_TIMEZONES, TIMEZONE_LABELS } from 'constants/timezone'
import { Dispatch, SetStateAction, useCallback, useMemo } from 'react'
import styled from 'styled-components'

const SelectValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

export default function TimezoneSelect({
  timezoneValue,
  setTimezoneValue
}: {
  timezoneValue: string
  setTimezoneValue: Dispatch<SetStateAction<string>>
}) {
  const chageTimezone = useCallback((value: string) => {
    setTimezoneValue(value)
  }, [setTimezoneValue])
  const timezoneList = useMemo(() => {
    return SUPPORTED_TIMEZONES.map((timezone) => {
      return {
        key: timezone,
        value: timezone,
        text: TIMEZONE_LABELS[timezone as keyof typeof TIMEZONE_LABELS],
        clickCallback: chageTimezone
      }
    })
  }, [chageTimezone])
  return <Select
    usePortal
    placement="bottom-start"
    offsetLeft={0}
    offsetTop={2}
    triggerMethod={TriggerMethod.CLICK}
    dataList={timezoneList}
    value={timezoneValue}
  >
    <SelectValue>
      {TIMEZONE_LABELS[timezoneValue as keyof typeof TIMEZONE_LABELS]}
    </SelectValue>
  </Select>
}
