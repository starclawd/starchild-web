import { Trans } from '@lingui/react/macro'
import Select, { TriggerMethod } from 'components/Select'
import { useIsMobile } from 'store/application/hooks'
import { useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { useTheme } from 'store/themecache/hooks'

const AiExperienceWrapper = styled.div`
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

export default function AiExperience({
  aiExperienceValue,
  setAiExperienceValue,
}: {
  aiExperienceValue: string
  setAiExperienceValue: (aiExperience: string) => void
}) {
  const isMobile = useIsMobile()
  const theme = useTheme()
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
        isActive: aiExperienceValue === 'Manual',
        text: <Trans>Novice</Trans>,
        clickCallback: chageAiExperience,
      },
      {
        key: 'AI-powered',
        value: 'AI-powered',
        isActive: aiExperienceValue === 'AI-powered',
        text: <Trans>Advanced</Trans>,
        clickCallback: chageAiExperience,
      },
    ]
  }, [aiExperienceValue, chageAiExperience])
  return (
    <AiExperienceWrapper>
      <Select
        usePortal
        alignPopWidth={!isMobile}
        placement='bottom-end'
        offsetLeft={0}
        offsetTop={2}
        triggerMethod={TriggerMethod.CLICK}
        dataList={aiExperienceList}
        value={aiExperienceValue}
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
        <SelectValue>{aiExperienceMap[aiExperienceValue as keyof typeof aiExperienceMap]}</SelectValue>
      </Select>
    </AiExperienceWrapper>
  )
}
