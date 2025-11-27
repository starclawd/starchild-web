import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo } from 'react'
import { ProtocolVault } from 'store/vaults/vaults'
import styled from 'styled-components'

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

export default function ConfigInfo({ vaultData }: { vaultData: ProtocolVault }) {
  const InfoList = useMemo(() => {
    return [
      {
        key: 'tvl',
        icon: <IconBase className='icon-vault-tvl' />,
        value: `${vaultData.tvl} USDC`,
      },
      {
        key: 'user',
        icon: <IconBase className='icon-vault-user' />,
        value: vaultData.raw?.lp_counts,
      },
      {
        key: 'periods',
        icon: <IconBase className='icon-vault-period' />,
        value: <Trans>{vaultData.raw?.vault_age} days</Trans>,
      },
    ]
  }, [vaultData])
  return (
    <ConfigInfoWrapper>
      <LeftContent>
        {InfoList.map((item) => (
          <ConfigInfoItem key={item.key}>
            {item.icon}
            <span>{item.value}</span>
          </ConfigInfoItem>
        ))}
      </LeftContent>
      <RightContent>
        <IconBase className='icon-chat-arrow-long' />
      </RightContent>
    </ConfigInfoWrapper>
  )
}
