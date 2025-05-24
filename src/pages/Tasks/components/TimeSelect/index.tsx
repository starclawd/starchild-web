import Select, { TriggerMethod } from 'components/Select'
import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import TimePanel from '../TimePanel'

const SelectValue = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

export default function TimeSelect({
  hours,
  minutes,
  setHours,
  setMinutes
}: {
  hours: number
  minutes: number
  setHours: Dispatch<SetStateAction<number>>
  setMinutes: Dispatch<SetStateAction<number>>
}) {
  return <Select
    usePortal
    customize
    placement="bottom-end"
    offsetLeft={0}
    offsetTop={2}
    triggerMethod={TriggerMethod.CLICK}
    dataList={[]}
    value=""
    customizeNode={<TimePanel
      hours={hours}
      minutes={minutes}
      setHours={setHours}
      setMinutes={setMinutes}
    />}
  >
    <SelectValue>
      {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}
    </SelectValue>
  </Select>
}
