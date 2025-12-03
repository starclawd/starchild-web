import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo } from 'react'
import styled from 'styled-components'
import SupportNetwork from '../SupportNetwork'
import { ANI_DURATION } from 'constants/index'
import Tooltip from 'components/Tooltip'
import { VaultInfo } from 'api/vaults'
import { formatKMBNumber } from 'utils/format'
import { toFix } from 'utils/calc'

const ConfigInfoWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`

const LeftContent = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`

const ConfigInfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  i {
    font-size: 14px;
    color: ${({ theme }) => theme.textL4};
  }
  span {
    transition: color ${ANI_DURATION}s;
    color: ${({ theme }) => theme.textL2};
  }
`

const RightContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
`

export default function ConfigInfo({ vaultData }: { vaultData: VaultInfo }) {
  const InfoList = useMemo(() => {
    const { tvl, supported_chains, lp_counts, vault_age } = vaultData
    return [
      {
        key: 'tvl',
        icon: <IconBase className='icon-vault-tvl' />,
        value: `$${formatKMBNumber(toFix(tvl, 2))} USDC`,
        tooltip: <Trans>TVL</Trans>,
      },
      {
        key: 'network',
        icon: <IconBase className='icon-vault-market' />,
        value: (
          <SupportNetwork
            networks={
              supported_chains?.map((chain) => ({
                id: chain.chain_id,
                name: chain.chain_name,
                icon: '',
              })) || []
            }
          />
        ),
        tooltip: <Trans>Network</Trans>,
      },
      {
        key: 'user',
        icon: <IconBase className='icon-vault-user' />,
        value: lp_counts,
        tooltip: <Trans>Depositors</Trans>,
      },
      {
        key: 'periods',
        icon: <IconBase className='icon-vault-period' />,
        value: <Trans>{vault_age} days</Trans>,
        tooltip: <Trans>Age</Trans>,
      },
    ]
  }, [vaultData])
  return (
    <ConfigInfoWrapper>
      <LeftContent>
        {InfoList.map((item) => (
          <ConfigInfoItem className='config-info-item' key={item.key}>
            {item.icon}
            <Tooltip disablePointerEvents placement='top' content={item.tooltip}>
              <span>{item.value}</span>
            </Tooltip>
          </ConfigInfoItem>
        ))}
      </LeftContent>
      <RightContent>
        <IconBase className='icon-chat-arrow-long' />
      </RightContent>
    </ConfigInfoWrapper>
  )
}
