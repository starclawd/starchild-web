import { memo, useMemo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { Trans } from '@lingui/react/macro'
import { StrategiesOverviewDataType } from 'api/strategy'
import { STRATEGY_STATUS } from 'store/createstrategy/createstrategy'
import ShinyButton from 'pages/CreateStrategy/components/StrategyInfo/components/ShinyButton'
import {
  useDeleteStrategyModalToggle,
  useDelistStrategyModalToggle,
  useDeployModalToggle,
  usePauseStrategyModalToggle,
} from 'store/application/hooks'
import { useCurrentStrategyId, useRestartStrategy } from 'store/mystrategy/hooks/useMyStrategies'
import { useAppKitAccount } from '@reown/appkit/react'
import { useMyStrategies } from 'store/mystrategy/hooks/useMyStrategies'
import Pending from 'components/Pending'

const BottomRightWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .deploy-button {
    width: 52px;
    height: 26px;
    font-size: 8px;
  }
`

const ButtonBorderWrapper = styled(ButtonBorder)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black200};
`

const ButtonCommonWrapper = styled(ButtonCommon)`
  width: fit-content;
  padding: 0 12px;
  height: 24px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`
export default memo(function BottomRight({ strategy }: { strategy: StrategiesOverviewDataType }) {
  const { status, strategy_id } = strategy
  const { address } = useAppKitAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { refetch: refetchMyStrategies } = useMyStrategies()
  const [, setCurrentStrategyId] = useCurrentStrategyId()
  const triggerRestartStrategy = useRestartStrategy()
  const toggleDelistStrategyModal = useDelistStrategyModalToggle()
  const toggleDeleteStrategyModal = useDeleteStrategyModalToggle()
  const togglePauseStrategyModal = usePauseStrategyModalToggle()
  const toggleDeployModal = useDeployModalToggle()
  const isReleased = useMemo(() => {
    return status === STRATEGY_STATUS.DEPLOYED || status === STRATEGY_STATUS.PAUSED
  }, [status])
  const isUnreleased = useMemo(() => {
    return (
      status === STRATEGY_STATUS.DRAFT || status === STRATEGY_STATUS.DRAFT_READY || status === STRATEGY_STATUS.DEPLOYING
    )
  }, [status])
  const isDraftReady = useMemo(() => {
    return status === STRATEGY_STATUS.DRAFT_READY || status === STRATEGY_STATUS.DEPLOYING
  }, [status])
  const isDelisted = useMemo(() => {
    return status === STRATEGY_STATUS.DELISTED || status === STRATEGY_STATUS.ARCHIVED
  }, [status])
  const handleDelist = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      toggleDelistStrategyModal()
    },
    [toggleDelistStrategyModal, setCurrentStrategyId, strategy_id],
  )
  const handlePause = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      togglePauseStrategyModal()
    },
    [togglePauseStrategyModal, setCurrentStrategyId, strategy_id],
  )
  const handleDelete = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      setCurrentStrategyId(strategy_id)
      toggleDeleteStrategyModal()
    },
    [toggleDeleteStrategyModal, setCurrentStrategyId, strategy_id],
  )
  const handleDeploy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      toggleDeployModal(strategy_id)
    },
    [toggleDeployModal, strategy_id],
  )
  const handleWithdraw = useCallback(() => {
    console.log('handleWithdraw')
  }, [])
  const handleRestart = useCallback(async () => {
    if (isLoading) return
    try {
      if (address && strategy_id) {
        setIsLoading(true)
        const data = await triggerRestartStrategy({ strategyId: strategy_id, walletId: address })
        if ((data as any)?.data?.status === 'success') {
          await refetchMyStrategies()
        }
        setIsLoading(false)
        return data
      }
    } catch (error) {
      setIsLoading(false)
      return error
    }
  }, [strategy_id, address, refetchMyStrategies, triggerRestartStrategy, isLoading])
  if (isReleased) {
    return (
      <BottomRightWrapper>
        <ButtonBorderWrapper onClick={handleDelist}>
          <Trans>Delist</Trans>
        </ButtonBorderWrapper>
        {status === STRATEGY_STATUS.DEPLOYED ? (
          <ButtonBorderWrapper onClick={handlePause}>
            <Trans>Pause</Trans>
          </ButtonBorderWrapper>
        ) : (
          <ButtonCommonWrapper onClick={handleRestart}>
            {isLoading ? <Pending /> : <Trans>Restart</Trans>}
          </ButtonCommonWrapper>
        )}
      </BottomRightWrapper>
    )
  } else if (isUnreleased) {
    return (
      <BottomRightWrapper>
        <ButtonBorderWrapper onClick={handleDelete}>
          <Trans>Delete</Trans>
        </ButtonBorderWrapper>
        {isDraftReady && (
          <ShinyButton className='deploy-button' onClick={handleDeploy}>
            <Trans>Deploy</Trans>
          </ShinyButton>
        )}
      </BottomRightWrapper>
    )
  } else if (isDelisted) {
    return (
      <BottomRightWrapper>
        <ButtonBorderWrapper onClick={handleWithdraw}>
          <Trans>Withdraw</Trans>
        </ButtonBorderWrapper>
      </BottomRightWrapper>
    )
  }
  return null
})
