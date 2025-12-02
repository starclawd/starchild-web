import { WithdrawProcessWrapper, TopContent, CenterContent, BottomContent } from '../../styles'
import { Trans } from '@lingui/react/macro'

export default function WithdrawProcess() {
  return (
    <WithdrawProcessWrapper>
      <TopContent>
        <span>
          <Trans>Withdraw process</Trans>
        </span>
        <span>
          <Trans>Up to 6 hours</Trans>
        </span>
      </TopContent>
      <CenterContent>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </CenterContent>
      <BottomContent>
        <span>
          <Trans>Initiate</Trans>
        </span>
        <span>
          <Trans>Vault process</Trans>
        </span>
        <span>
          <Trans>Transferred</Trans>
        </span>
      </BottomContent>
    </WithdrawProcessWrapper>
  )
}
