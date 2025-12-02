import { Trans } from '@lingui/react/macro'
import styled from 'styled-components'
import usdc from 'assets/tokens/usdc.png'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useAppKit, useAppKitNetwork } from '@reown/appkit/react'
import NetworkIcon from 'components/NetworkIcon'
import { IconBase } from 'components/Icons'
import { CHAIN_ID } from 'constants/chainInfo'
import { useClaimInfo } from 'store/vaultsdetail/hooks/useClaimInfo'
import { useCallback, useMemo } from 'react'

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

const ButtonSwitch = styled(ButtonBorder)`
  height: 28px;
  padding: 0 12px;
`

const RotatedIcon = styled(IconBase)`
  transform: rotate(90deg);
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};
  margin-left: 4px;
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
  const { open } = useAppKit()
  const { chainId } = useAppKitNetwork()
  const availableClaimAmount = useMemo(() => {
    return claimData[chainId as keyof typeof claimData]?.claimableAmount ?? 0
  }, [claimData, chainId])
  const handleNetworkSwitch = useCallback(() => {
    try {
      open({ view: 'Networks' })
    } catch (error) {
      console.error('切换网络失败:', error)
    }
  }, [open])

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
        <ButtonSwitch onClick={handleNetworkSwitch}>
          <NetworkIcon networkId={String(chainId) || String(CHAIN_ID.BASE)} size={18} />
          <RotatedIcon className='icon-chat-expand' />
        </ButtonSwitch>
        <ButtonClaim>
          <Trans>Claim</Trans>
        </ButtonClaim>
      </RightContent>
    </AvailableClaimWrapper>
  )
}
