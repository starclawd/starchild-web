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

export default function AiExperience({
  aiExperienceValue,
  setAiExperienceValue,
}: {
  aiExperienceValue: string
  setAiExperienceValue: (aiExperience: string) => void
}) {
  const isMobile = useIsMobile()
  const chageAiExperience = useCallback(
    (value: string) => {
      setAiExperienceValue(value)
    },
    [setAiExperienceValue],
  )
  const aiExperienceMap = useMemo(() => {
    return {
      Manual: <Trans>Novice</Trans>,
      'AI-powered': <Trans>Advanced</Trans>,
    }
  }, [])
  const aiExperienceList = useMemo(() => {
    return [
      {
        key: 'Manual',
        value: 'Manual',
        text: <Trans>Novice</Trans>,
        clickCallback: chageAiExperience,
      },
      {
        key: 'AI-powered',
        value: 'AI-powered',
        text: <Trans>Advanced</Trans>,
        clickCallback: chageAiExperience,
      },
    ]
  }, [chageAiExperience])
  return (
    <Select
      usePortal
      alignPopWidth={!isMobile}
      placement='bottom-end'
      offsetLeft={0}
      offsetTop={2}
      triggerMethod={TriggerMethod.CLICK}
      dataList={aiExperienceList}
      value={aiExperienceValue}
      popStyle={isMobile ? { width: vm(335) } : {}}
    >
      <SelectValue>{aiExperienceMap[aiExperienceValue as keyof typeof aiExperienceMap]}</SelectValue>
    </Select>
  )
}
