import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { useMemo } from 'react'
import styled from 'styled-components'

const WalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-grow: 1;
  width: 100%;
`

const Item = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  gap: 6px;
  width: 100%;
  height: 36px;
  padding: 0 8px;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
  span {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
`

export default function Wallet() {
  const list = useMemo(() => {
    return [
      {
        key: 'My wallet',
        title: <Trans>My wallet</Trans>,
        icon: 'icon-wallet',
      },
      {
        key: 'Transactions',
        title: <Trans>Transactions</Trans>,
        icon: 'icon-chat-switch',
      },
      {
        key: 'Receive',
        title: <Trans>Receive</Trans>,
        icon: 'icon-header-qrcode',
      },
    ]
  }, [])
  return (
    <WalletWrapper>
      {list.map((item) => {
        const { key, title, icon } = item
        return (
          <Item key={key}>
            <IconBase className={icon} />
            <span>{title}</span>
          </Item>
        )
      })}
    </WalletWrapper>
  )
}
