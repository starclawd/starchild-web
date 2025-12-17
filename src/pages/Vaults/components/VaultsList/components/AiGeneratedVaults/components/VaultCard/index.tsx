import styled from 'styled-components'
import { AllStrategiesOverview } from 'store/vaults/vaults'
import { IconBase } from 'components/Icons'
import { useGetStrategyIconName, useVaultByVaultId } from 'store/vaults/hooks'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import VaultData from '../VaultData'
import { ANI_DURATION } from 'constants/index'
import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useMemo } from 'react'
import { formatKMBNumber, formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import cardBg from 'assets/vaults/card-bg.png'

const VaultCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc((100% - 20px) / 2);
  height: 100%;
  gap: 20px;
  padding: 8px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  background: ${({ theme }) => theme.black800};
  cursor: pointer;
  &:hover {
    .card-bg {
      opacity: 1;
    }
    .button-copy {
      border: none;
      background: ${({ theme }) => theme.brand100};
      color: ${({ theme }) => theme.textL1};
    }
  }
`
const CardContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 20px;
  padding: 12px;
`

const CardBg = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url(${cardBg});
  background-repeat: no-repeat;
  background-size: cover;
  opacity: 0;
  transition: opacity ${ANI_DURATION}s;
  pointer-events: none;
  border-radius: 8px;
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 32px;
`

const VaultBuilder = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  img {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }
`

const ButtonCopy = styled(ButtonBorder)`
  width: 106px;
  height: 32px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  padding: 0 12px;
  white-space: nowrap;
  color: ${({ theme }) => theme.textL3};
`

const VaultBaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60px;
  gap: 8px;
`

const VaultName = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const VaultInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const VaultInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  height: 24px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.black700};
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  span:first-child {
    color: rgba(255, 255, 255, 0.5);
  }
  span:last-child {
    color: ${({ theme }) => theme.textDark98};
  }
`

export default function VaultCard({ strategy }: { strategy: AllStrategiesOverview }) {
  const { strategyId, vaultId, strategyName, userInfo } = strategy
  const [, setCurrentRouter] = useCurrentRouter()
  const valutInfoList = useMemo(() => {
    return [
      {
        key: 'age',
        text: <Trans>Age:</Trans>,
        value: <Trans>{strategy.ageDays} days</Trans>,
      },
      {
        key: 'initialEquity',
        text: <Trans>Initial Equity:</Trans>,
        value: `${formatNumber(toFix(strategy.startBalance, 2))} USDC`,
      },
    ]
  }, [strategy])
  const handleViewVault = (vaultId: string) => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?strategyId=${strategyId}`)
  }
  return (
    <VaultCardWrapper key={strategyId} onClick={() => handleViewVault(vaultId)}>
      <CardContent>
        <CardBg className='card-bg' />
        <TopContent>
          <VaultBuilder>
            {userInfo?.userAvatar && <img src={userInfo?.userAvatar || ''} alt='' />}
            <span>{userInfo?.userName || '--'}</span>
          </VaultBuilder>
          <ButtonCopy className='button-copy'>
            <Trans>Copy strategy</Trans>
          </ButtonCopy>
        </TopContent>
        <VaultBaseInfo>
          <VaultName>{strategyName || '--'}</VaultName>
          <VaultInfo>
            {valutInfoList.map((item) => {
              return (
                <VaultInfoItem key={item.key}>
                  <span>{item.text}</span>
                  <span>{item.value}</span>
                </VaultInfoItem>
              )
            })}
          </VaultInfo>
        </VaultBaseInfo>
        <VaultData strategy={strategy} />
      </CardContent>
    </VaultCardWrapper>
  )
}
