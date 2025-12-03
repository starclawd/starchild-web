import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import usdc from 'assets/tokens/usdc.png'
import { formatNumber } from 'utils/format'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useAppKitNetwork } from '@reown/appkit/react'
import NetworkIcon from 'components/NetworkIcon'
import { IconBase } from 'components/Icons'
import { CHAIN_ID } from 'constants/chainInfo'
import { useClaimInfo } from 'store/vaultsdetail/hooks/useClaimInfo'
import { useCallback, useMemo } from 'react'
import { useSwitchChainModalToggle } from 'store/application/hooks'
import NetworkSelector, { ColorMode } from 'pages/Vaults/components/VaultsWalletConnect/components/NetworkSelector'

const AvailableClaimWrapper = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 100%;
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  > span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    img {
      width: 18px;
      height: 18px;
    }
  }
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ButtonClaim = styled(ButtonCommon)`
  height: 28px;
  padding: 0 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
`

export default function AvailableClaim() {
  const [claimData] = useClaimInfo()
  const { chainId } = useAppKitNetwork()
  const toggleSwitchChainModal = useSwitchChainModalToggle()
  const availableClaimAmount = useMemo(() => {
    return claimData[chainId as keyof typeof claimData]?.claimableAmount ?? 0
  }, [claimData, chainId])

  return (
    <AvailableClaimWrapper>
      <LeftContent>
        <span>
          <Trans>Claimable</Trans>
        </span>
        <span>
          <img src={usdc} alt='usdc' />
          <span>{formatNumber(availableClaimAmount)}</span>
        </span>
      </LeftContent>
      <RightContent>
        <NetworkSelector colorMode={ColorMode.DARK} />
        <ButtonClaim>
          <Trans>Claim</Trans>
        </ButtonClaim>
      </RightContent>
    </AvailableClaimWrapper>
  )
}
