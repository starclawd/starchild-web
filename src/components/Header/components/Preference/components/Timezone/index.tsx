import Select, { TriggerMethod } from 'components/Select'
import { SUPPORTED_TIMEZONES_TG, TIMEZONE_LABELS_TG } from 'constants/timezone'
import { vm } from 'pages/helper'
import { useCallback, useMemo } from 'react'
import { useIsMobile } from 'store/application/hooks'
import styled, { css } from 'styled-components'
import { useTheme } from 'store/themecache/hooks'

const TimezoneWrapper = styled.div`
  height: 44px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.black600};
  background: ${({ theme }) => theme.black700};
  backdrop-filter: blur(8px);
  .select-value-wrapper {
    padding: 0 12px;
    gap: 4px;
    &.show {
      .select-value {
        color: ${({ theme }) => theme.black0};
        i {
          color: ${({ theme }) => theme.black0};
        }
      }
    }
  }
`

const SelectValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
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
  const theme = useTheme()
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
        isActive: timezoneValue === timezone,
        text: TIMEZONE_LABELS_TG[timezone as keyof typeof TIMEZONE_LABELS_TG],
        clickCallback: chageTimezone,
      }
    })
  }, [timezoneValue, chageTimezone])
  return (
    <TimezoneWrapper>
      <Select
        usePortal
        useCircleSuccessIcon={false}
        alignPopWidth={!isMobile}
        placement='bottom-end'
        offsetLeft={0}
        offsetTop={2}
        triggerMethod={TriggerMethod.CLICK}
        dataList={timezoneList}
        value={timezoneValue}
        popItemHoverBg={theme.black600}
        popItemStyle={{
          borderRadius: '4px',
        }}
        popStyle={
          isMobile
            ? { width: vm(335) }
            : {
                background: theme.black800,
              }
        }
      >
        <SelectValue>{TIMEZONE_LABELS_TG[timezoneValue as keyof typeof TIMEZONE_LABELS_TG]}</SelectValue>
      </Select>
    </TimezoneWrapper>
  )
}
