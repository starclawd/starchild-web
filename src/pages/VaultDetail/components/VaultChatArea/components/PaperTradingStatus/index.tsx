import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { memo, useMemo } from 'react'
import { PAPER_TRADING_STATUS } from 'store/createstrategy/createstrategy'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'
import styled from 'styled-components'

const PaperTradingStatusWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: fit-content;
  min-height: 34px;
  gap: 4px;
  padding: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.black800};
  background: ${({ theme }) => theme.black600};
  .icon-warn {
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
`

export default memo(function PaperTradingStatus() {
  const { strategyId } = useParsedQueryString()
  const { paperTradingPublicData } = usePaperTradingPublic({ strategyId: strategyId || '' })
  const paperTradingStatus = useMemo(() => {
    return paperTradingPublicData?.status
  }, [paperTradingPublicData])
  return (
    <PaperTradingStatusWrapper>
      <IconBase className='icon-warn' />
      <span>
        {paperTradingStatus === PAPER_TRADING_STATUS.PAUSED ? (
          <Trans>
            Paper trading has been automatically paused. Please click to restart. Note: Paper trading cannot be
            restarted if your strategy is currently deployed.
          </Trans>
        ) : paperTradingStatus === PAPER_TRADING_STATUS.SUSPENDED ? (
          <Trans>The strategy has been paused.</Trans>
        ) : (
          <Trans>The strategy has been delisted.</Trans>
        )}
      </span>
    </PaperTradingStatusWrapper>
  )
})
