import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { useMemo } from 'react'
import styled from 'styled-components'

const MyAssetsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 96px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgT30};
`

const AccountItem = styled.div<{ $isEmpty: boolean }>`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 2px;
  > span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL4};
  }
  > span:last-child {
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
    color: ${({ theme, $isEmpty }) => ($isEmpty ? theme.textL4 : theme.textL1)};
  }
`

const TotalCommission = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ClaimButton = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  padding: 8px 16px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL1};
`

export default function MyAssets() {
  const AccountList = useMemo(() => {
    return [
      {
        key: 'Total commission',
        text: <Trans>Total commission</Trans>,
        value: (
          <TotalCommission>
            <span>--</span>
            <ClaimButton>
              <Trans>Claim</Trans>
            </ClaimButton>
          </TotalCommission>
        ),
        isEmpty: true,
      },
      {
        key: 'Depositors',
        text: <Trans>Depositors</Trans>,
        value: '--',
        isEmpty: true,
      },
    ]
  }, [])
  return (
    <MyAssetsWrapper>
      {AccountList.map((item) => (
        <AccountItem key={item.key} $isEmpty={item.isEmpty}>
          <span>{item.text}</span>
          <span>{item.value}</span>
        </AccountItem>
      ))}
    </MyAssetsWrapper>
  )
}
