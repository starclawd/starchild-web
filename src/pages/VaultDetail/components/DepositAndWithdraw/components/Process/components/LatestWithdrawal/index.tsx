import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { VaultTransactionHistory } from 'api/vaults'
import { LatestWithdrawalWrapper, Title, WithdrawContent, Status, Amount } from '../../styles'
import usdc from 'assets/tokens/usdc.png'
import { useCallback, useMemo } from 'react'
import AvailableClaim from '../AvailableClaim'
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'

const AvailableClaimWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  border-radius: 8px;
  padding: 12px;
`

export default function LatestWithdrawal({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [status, txnHash, chainId] = useMemo(() => {
    return [latestTransaction?.status, latestTransaction?.txn_hash, latestTransaction?.chain_id]
  }, [latestTransaction])

  const handleClickWithdraw = useCallback(() => {
    if (!txnHash || !chainId) return
    const chain = CHAIN_ID_TO_CHAIN[Number(chainId)]
    if (!chain) return
    const explorerLink = getExplorerLink(chain, txnHash)
    window.open(explorerLink, '_blank')
  }, [txnHash, chainId])

  return (
    <LatestWithdrawalWrapper>
      <Title>
        <Trans>Latest withdrawal request</Trans>
      </Title>
      <WithdrawContent onClick={handleClickWithdraw}>
        <Status>
          <span></span>
          {status}
        </Status>
        <Amount>
          <img src={usdc} alt='usdc' />
          <span className='amount'>{latestTransaction?.amount_change}</span>
        </Amount>
      </WithdrawContent>
      <AvailableClaimWrapper>
        <AvailableClaim />
      </AvailableClaimWrapper>
    </LatestWithdrawalWrapper>
  )
}
