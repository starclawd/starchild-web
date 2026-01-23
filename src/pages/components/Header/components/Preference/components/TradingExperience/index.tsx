import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod } from 'components/Select'
import { useIsMobile } from 'store/application/hooks'
import { useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'

const TradingExperienceWrapper = styled.div`
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

export default function TradingExperience({
  tradingExperienceValue,
  setTradingExperienceValue,
}: {
  tradingExperienceValue: string
  setTradingExperienceValue: (tradingExperience: string) => void
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const chageTradingExperience = useCallback(
    (value: string) => {
      setTradingExperienceValue(value)
    },
    [setTradingExperienceValue],
  )
  const tradingExperienceMap = useMemo(() => {
    return {
      Beginner: <Trans>Novice</Trans>,
      Pro: <Trans>Intermediate</Trans>,
      Expert: <Trans>Advanced</Trans>,
    }
  }, [])
  const tradingExperienceList = useMemo(() => {
    return [
      {
        key: 'Beginner',
        value: 'Beginner',
        isActive: tradingExperienceValue === 'Beginner',
        text: <Trans>Novice</Trans>,
        clickCallback: chageTradingExperience,
      },
      {
        key: 'Pro',
        value: 'Pro',
        isActive: tradingExperienceValue === 'Pro',
        text: <Trans>Intermediate</Trans>,
        clickCallback: chageTradingExperience,
      },
      {
        key: 'Expert',
        value: 'Expert',
        isActive: tradingExperienceValue === 'Expert',
        text: <Trans>Advanced</Trans>,
        clickCallback: chageTradingExperience,
      },
    ]
  }, [tradingExperienceValue, chageTradingExperience])
  return (
    <TradingExperienceWrapper>
      <Select
        usePortal
        alignPopWidth={!isMobile}
        placement='bottom-start'
        offsetLeft={0}
        offsetTop={2}
        triggerMethod={TriggerMethod.CLICK}
        dataList={tradingExperienceList}
        value={tradingExperienceValue}
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
        <SelectValue>{tradingExperienceMap[tradingExperienceValue as keyof typeof tradingExperienceMap]}</SelectValue>
      </Select>
    </TradingExperienceWrapper>
  )
}
