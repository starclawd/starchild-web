import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { VaultTransactionHistory } from 'api/vaults'
import { LatestWithdrawalWrapper, Title, WithdrawContent, Status, Amount } from '../../styles'
import usdc from 'assets/tokens/usdc.png'
import { useCallback, useMemo } from 'react'
import AvailableClaim from '../AvailableClaim'
import { CHAIN_ID_TO_CHAIN } from 'constants/chainInfo'
import { getExplorerLink } from 'utils'
import Tooltip from 'components/Tooltip'
import { useClaimInfo } from 'store/vaultsdetail/hooks/useClaimInfo'
import { WITHDRAW_STATUS_MAP, getWithdrawTooltipContent } from 'pages/VaultDetail/components/DepositAndWithdraw/types'

const AvailableClaimWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  padding: 12px;
`

export default function LatestWithdrawal({ latestTransaction }: { latestTransaction: VaultTransactionHistory }) {
  const [claimData] = useClaimInfo()
  const [status, txnHash, chainId] = useMemo(() => {
    return [latestTransaction?.status, latestTransaction?.txn_hash, latestTransaction?.chain_id]
  }, [latestTransaction])

  const tooltipContent = useMemo(() => {
    return getWithdrawTooltipContent(latestTransaction)
  }, [latestTransaction])
  const handleClickWithdraw = useCallback(() => {
    if (!txnHash || !chainId) return
    const chain = CHAIN_ID_TO_CHAIN[Number(chainId)]
    if (!chain) return
    const explorerLink = getExplorerLink(chain, txnHash)
    window.open(explorerLink, '_blank')
  }, [txnHash, chainId])

  // 判断所有链的 claimableAmount 是否都为 0
  const hasAnyClaimableAmount = useMemo(() => {
    return Object.values(claimData).some((item) => item?.claimableAmount > 0)
  }, [claimData])

  return (
    <LatestWithdrawalWrapper>
      <Title>
        <Trans>Latest withdrawal request</Trans>
      </Title>
      <WithdrawContent onClick={handleClickWithdraw}>
        <Status>
          <span></span>
          {tooltipContent ? (
            <Tooltip placement='top' content={tooltipContent}>
              {WITHDRAW_STATUS_MAP[status] || status}
            </Tooltip>
          ) : (
            WITHDRAW_STATUS_MAP[status] || status
          )}
        </Status>
        <Amount>
          <img src={usdc} alt='usdc' width={16} height={16} />
          <span className='amount'>{latestTransaction?.amount_change}</span>
        </Amount>
      </WithdrawContent>
      {hasAnyClaimableAmount && (
        <AvailableClaimWrapper>
          <AvailableClaim />
        </AvailableClaimWrapper>
      )}
    </LatestWithdrawalWrapper>
  )
}
