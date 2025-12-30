import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import { memo, useCallback, useState, useEffect } from 'react'
import { usePublicPaperTradingAction, usePrivatePaperTradingAction } from 'store/createstrategy/hooks/usePaperTrading'
import { useStrategyDetail } from 'store/createstrategy/hooks/useStrategyDetail'
import useParsedQueryString from 'hooks/useParsedQueryString'
import styled from 'styled-components'

const ToggleButton = styled(ButtonCommon)`
  width: fit-content;
  min-width: 60px;
  height: 32px;
  padding: 8px 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
`

export default memo(function PublicPrivateToggle() {
  const { strategyId } = useParsedQueryString()
  const [isToggling, setIsToggling] = useState(false)
  const [isPublicPaperTrading, setIsPublicPaperTrading] = useState(false)
  const triggerPublicPaperTrading = usePublicPaperTradingAction()
  const triggerPrivatePaperTrading = usePrivatePaperTradingAction()

  // 获取策略详情，用于初始化状态
  const { strategyDetail } = useStrategyDetail({ strategyId: strategyId || '' })

  // 初始化 public/private 状态
  useEffect(() => {
    if (strategyDetail?.is_public !== undefined) {
      setIsPublicPaperTrading(strategyDetail.is_public)
    }
  }, [strategyDetail?.is_public, setIsPublicPaperTrading])

  const handleToggle = useCallback(async () => {
    if (!strategyId || isToggling) return

    try {
      setIsToggling(true)

      if (isPublicPaperTrading) {
        // 当前是 public，切换到 private
        const result = await triggerPrivatePaperTrading(strategyId)
        if (result?.is_public !== undefined) {
          setIsPublicPaperTrading(result?.is_public)
        }
      } else {
        // 当前是 private，切换到 public
        const result = await triggerPublicPaperTrading(strategyId)
        if (result?.is_public !== undefined) {
          setIsPublicPaperTrading(result?.is_public)
        }
      }
    } catch (error) {
      console.error('Toggle public/private failed:', error)
    } finally {
      setIsToggling(false)
    }
  }, [
    strategyId,
    isPublicPaperTrading,
    isToggling,
    triggerPublicPaperTrading,
    triggerPrivatePaperTrading,
    setIsPublicPaperTrading,
  ])

  return (
    <ToggleButton onClick={handleToggle} $disabled={isToggling}>
      {isToggling ? <Pending /> : isPublicPaperTrading ? <Trans>Private</Trans> : <Trans>Public</Trans>}
    </ToggleButton>
  )
})
