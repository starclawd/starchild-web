import { VaultTransactionHistory } from 'api/vaults'
import Tooltip from 'components/Tooltip'
import { useCallback, useMemo } from 'react'
import usdc from 'assets/tokens/usdc.png'
import { LatestDepositWrapper, Title, DepositContent, Status, Amount } from '../../styles'
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'
import { DEPOSIT_STATUS_MAP, getDepositTooltipContent } from 'constants/vaultTransaction'
import { Trans } from '@lingui/react/macro'

export default function LatestDeposit({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [status, txnHash, chainId] = useMemo(() => {
    return [latestTransaction?.status, latestTransaction?.txn_hash, latestTransaction?.chain_id]
  }, [latestTransaction])

  const tooltipContent = useMemo(() => {
    return getDepositTooltipContent(latestTransaction)
  }, [latestTransaction])
  const handleClickWithdraw = useCallback(() => {
    if (!txnHash || !chainId) return
    const chain = CHAIN_ID_TO_CHAIN[Number(chainId)]
    if (!chain) return
    const explorerLink = getExplorerLink(chain, txnHash)
    window.open(explorerLink, '_blank')
  }, [txnHash, chainId])

  return (
    <LatestDepositWrapper>
      <Title>
        <Trans>Latest deposit</Trans>
      </Title>
      <DepositContent onClick={handleClickWithdraw}>
        <Status>
          <span></span>
          {tooltipContent ? (
            <Tooltip placement='top' content={tooltipContent}>
              {DEPOSIT_STATUS_MAP[status] || status}
            </Tooltip>
          ) : (
            DEPOSIT_STATUS_MAP[status] || status
          )}
        </Status>
        <Amount>
          <img src={usdc} alt='usdc' width={16} height={16} />
          <span className='amount'>{latestTransaction?.amount_change}</span>
        </Amount>
      </DepositContent>
    </LatestDepositWrapper>
  )
}
