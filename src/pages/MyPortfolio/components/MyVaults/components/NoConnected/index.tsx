import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import NoData from 'components/NoData'
import { useConnectWalletModalToggle } from 'store/application/hooks'
import styled from 'styled-components'

const NoConnectedWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  .no-data-wrapper {
    min-height: unset;
    height: auto;
  }
  .no-data-des {
    margin-top: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.black0};
  }
`

const ConnectWallet = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  margin-top: 16px;
  padding: 8px 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
`

export default function NoConnected() {
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  return (
    <NoConnectedWrapper>
      <NoData text={<Trans>Wallet not connected</Trans>} />
      <span className='no-data-des'>
        <Trans>Please connect your wallet to continue.</Trans>
      </span>
      <ConnectWallet onClick={toggleConnectWalletModal}>
        <Trans>Connect wallet</Trans>
      </ConnectWallet>
    </NoConnectedWrapper>
  )
}
