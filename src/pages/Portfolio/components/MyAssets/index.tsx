import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { useMemo } from 'react'
import styled from 'styled-components'

const MyAssetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
`

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark54};
  }
  span:last-child {
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
    color: ${({ theme }) => theme.textL1};
  }
`

const FundVaultButton = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  padding: 8px 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 4px;
  gap: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const AccountItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  span:last-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    color: ${({ theme }) => theme.textL3};
  }
  &:last-child {
    span {
      text-align: right;
    }
  }
`

export default function MyAssets() {
  const AccountList = useMemo(() => {
    return [
      {
        key: 'Total PnL',
        text: <Trans>Total PnL</Trans>,
        value: '--',
      },
      {
        key: 'Total ROI',
        text: <Trans>Total ROI</Trans>,
        value: '--',
      },
      {
        key: 'Total APR',
        text: <Trans>Total APR</Trans>,
        value: '--',
      },
    ]
  }, [])
  return (
    <MyAssetsWrapper>
      <TopContent>
        <LeftContent>
          <span>
            <Trans>Total balance</Trans>
          </span>
          <span>$1,598,245.98</span>
        </LeftContent>
        <FundVaultButton>
          <Trans>Fund vault performance</Trans>
        </FundVaultButton>
      </TopContent>
      <BottomContent>
        {AccountList.map((item) => (
          <AccountItem key={item.key}>
            <span>{item.text}</span>
            <span>{item.value}</span>
          </AccountItem>
        ))}
      </BottomContent>
    </MyAssetsWrapper>
  )
}
