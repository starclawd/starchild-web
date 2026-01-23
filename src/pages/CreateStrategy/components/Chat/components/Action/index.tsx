import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo, useCallback, useMemo } from 'react'
import { ACTION_TYPE, SuggestedActionsDataType } from 'store/createstrategy/createstrategy'
import styled from 'styled-components'
import { ANI_DURATION } from 'constants/index'
import { useHandleGenerateCode } from 'store/createstrategy/hooks/useCode'
import { useHandlePausePaperTrading, useHandleStartPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 48px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black800};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
  }
  .icon-arrow {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
    transform: rotate(90deg);
  }
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
  i {
    font-size: 24px;
    color: ${({ theme }) => theme.black0};
  }
`

export default memo(function Action({ action }: { action: SuggestedActionsDataType }) {
  const handleGenerateCode = useHandleGenerateCode()
  const handleStartPaperTrading = useHandleStartPaperTrading()
  const handleStopPaperTrading = useHandlePausePaperTrading()
  const iconMap: Partial<Record<ACTION_TYPE, { icon: string }>> = useMemo(() => {
    return {
      [ACTION_TYPE.GENERATE_CODE]: {
        icon: 'icon-generate-code',
      },
      [ACTION_TYPE.START_PAPER_TRADING]: {
        icon: 'icon-paper-trading',
      },
      [ACTION_TYPE.STOP_PAPER_TRADING]: {
        icon: 'icon-paper-trading',
      },
      [ACTION_TYPE.DEPLOY_LIVE]: {
        icon: 'icon-launch',
      },
    }
  }, [])
  const clickCallback = useCallback(() => {
    const { action_type, label } = action
    if (action_type === ACTION_TYPE.GENERATE_CODE) {
      handleGenerateCode(label)
    } else if (action_type === ACTION_TYPE.START_PAPER_TRADING) {
      handleStartPaperTrading(label)
    } else if (action_type === ACTION_TYPE.STOP_PAPER_TRADING) {
      handleStopPaperTrading(label)
    } else if (action_type === ACTION_TYPE.DEPLOY_LIVE) {
      console.log('deploy')
    }
  }, [action, handleGenerateCode, handleStartPaperTrading, handleStopPaperTrading])
  return (
    <ActionWrapper onClick={clickCallback}>
      <Left>
        <IconBase className={iconMap[action.action_type]?.icon} />
        <span>{action.label}</span>
      </Left>
      <IconBase className='icon-arrow' />
    </ActionWrapper>
  )
})
