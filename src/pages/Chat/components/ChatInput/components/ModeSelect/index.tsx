import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Select, { TriggerMethod } from 'components/Select'
import { memo, useMemo } from 'react'
import { useChatTabIndex } from 'store/chat/hooks'
import styled from 'styled-components'
import { ANI_DURATION } from 'constants/index'

const ModeSelectWrapper = styled.div`
  display: flex;
  height: 40px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.black600};
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

const SelectItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 4px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black100};
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
  &:hover {
    color: ${({ theme }) => theme.black0};
    i {
      color: ${({ theme }) => theme.black0};
    }
  }
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black100};
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
  &:hover {
    color: ${({ theme }) => theme.black0};
    i {
      color: ${({ theme }) => theme.black0};
    }
  }
`

export default memo(function ModeSelect() {
  const [chatTabIndex, setChatTabIndex] = useChatTabIndex()
  const iconMap = useMemo(() => {
    return {
      '0': {
        icon: 'icon-create-strategy',
        text: <Trans>Create strategy</Trans>,
      },
      '1': {
        icon: 'icon-tools',
        text: <Trans>Tools</Trans>,
      },
    }
  }, [])
  const dataList = useMemo(() => {
    return [
      {
        key: '0',
        value: 0,
        text: (
          <SelectItem>
            <IconBase className={iconMap['0']?.icon} />
            <Trans>{iconMap['0']?.text}</Trans>
          </SelectItem>
        ),
        clickCallback: () => {
          setChatTabIndex(0)
        },
      },
      {
        key: '1',
        value: 1,
        text: (
          <SelectItem>
            <IconBase className={iconMap['1']?.icon} />
            <Trans>{iconMap['1']?.text}</Trans>
          </SelectItem>
        ),
        clickCallback: () => {
          setChatTabIndex(1)
        },
      },
    ]
  }, [setChatTabIndex, iconMap])
  return (
    <ModeSelectWrapper>
      <Select
        usePortal
        value=''
        offsetLeft={0}
        dataList={dataList}
        triggerMethod={TriggerMethod.CLICK}
        placement='bottom-start'
        popItemStyle={{
          padding: '0',
        }}
        popItemTextStyle={{
          width: '100%',
        }}
      >
        <SelectValue className='select-value'>
          <IconBase className={iconMap[chatTabIndex.toString() as keyof typeof iconMap]?.icon} />
          <Trans>{iconMap[chatTabIndex.toString() as keyof typeof iconMap]?.text}</Trans>
        </SelectValue>
      </Select>
    </ModeSelectWrapper>
  )
})
