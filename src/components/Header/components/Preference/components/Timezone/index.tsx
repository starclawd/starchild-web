import Select, { TriggerMethod } from 'components/Select'
import { SUPPORTED_TIMEZONES_TG, TIMEZONE_LABELS_TG } from 'constants/timezone'
import { vm } from 'pages/helper'
import { useCallback, useMemo } from 'react'
import { useIsMobile } from 'store/application/hooks'
import styled, { css } from 'styled-components'

const SelectValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.14rem;
      line-height: 0.2rem;
    `}
`

export default function Timezone({
  timezoneValue,
  setTimezoneValue,
}: {
  timezoneValue: string
  setTimezoneValue: (timezone: string) => void
}) {
  const isMobile = useIsMobile()
  const chageTimezone = useCallback(
    (value: string) => {
      setTimezoneValue(value)
    },
    [setTimezoneValue],
  )
  const timezoneList = useMemo(() => {
    return SUPPORTED_TIMEZONES_TG.map((timezone) => {
      return {
        key: timezone,
        value: timezone,
        text: TIMEZONE_LABELS_TG[timezone as keyof typeof TIMEZONE_LABELS_TG],
        clickCallback: chageTimezone,
      }
    })
  }, [chageTimezone])
  return (
    <Select
      usePortal
      alignPopWidth={!isMobile}
      placement='bottom-end'
      offsetLeft={0}
      offsetTop={2}
      triggerMethod={TriggerMethod.CLICK}
      dataList={timezoneList}
      value={timezoneValue}
      popStyle={isMobile ? { width: vm(335) } : {}}
    >
      <SelectValue>{TIMEZONE_LABELS_TG[timezoneValue as keyof typeof TIMEZONE_LABELS_TG]}</SelectValue>
    </Select>
  )
}
