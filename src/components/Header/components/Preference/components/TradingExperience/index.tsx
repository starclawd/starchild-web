import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod } from 'components/Select'
import { useIsMobile } from 'store/application/hooks'
import { useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'

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

export default function TradingExperience({
  tradingExperienceValue,
  setTradingExperienceValue,
}: {
  tradingExperienceValue: string
  setTradingExperienceValue: (tradingExperience: string) => void
}) {
  const isMobile = useIsMobile()
  const chageTradingExperience = useCallback(
    (value: string) => {
      setTradingExperienceValue(value)
    },
    [setTradingExperienceValue],
  )
  const tradingExperienceMap = useMemo(() => {
    return {
      Beginner: <Trans>Beginner</Trans>,
      Pro: <Trans>Pro</Trans>,
      Expert: <Trans>Expert</Trans>,
    }
  }, [])
  const tradingExperienceList = useMemo(() => {
    return [
      {
        key: 'Beginner',
        value: 'Beginner',
        text: <Trans>Beginner</Trans>,
        clickCallback: chageTradingExperience,
      },
      {
        key: 'Pro',
        value: 'Pro',
        text: <Trans>Pro</Trans>,
        clickCallback: chageTradingExperience,
      },
      {
        key: 'Expert',
        value: 'Expert',
        text: <Trans>Expert</Trans>,
        clickCallback: chageTradingExperience,
      },
    ]
  }, [chageTradingExperience])
  return (
    <Select
      usePortal
      alignPopWidth={!isMobile}
      placement='bottom-start'
      offsetLeft={0}
      offsetTop={2}
      triggerMethod={TriggerMethod.CLICK}
      dataList={tradingExperienceList}
      value={tradingExperienceValue}
      popStyle={isMobile ? { width: vm(335) } : {}}
    >
      <SelectValue>{tradingExperienceMap[tradingExperienceValue as keyof typeof tradingExperienceMap]}</SelectValue>
    </Select>
  )
}
