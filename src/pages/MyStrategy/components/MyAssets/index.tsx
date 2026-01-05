import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useTheme } from 'store/themecache/hooks'

const MyAssetsWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 96px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.black600};
`

const AccountItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 2px;
  > span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black300};
  }
  > span:last-child {
    font-size: 26px;
    font-style: normal;
    font-weight: 700;
    line-height: 34px;
    color: ${({ theme }) => theme.black0};
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
  color: ${({ theme }) => theme.black0};
`

export default function MyAssets() {
  const theme = useTheme()
  const AccountList = useMemo(() => {
    return [
      {
        key: 'Total commission',
        text: <Trans>Total commission</Trans>,
        value: (
          <TotalCommission>
            <span style={{ color: theme.black300 }}>--</span>
            {/* <ClaimButton>
              <Trans>Claim</Trans>
            </ClaimButton> */}
          </TotalCommission>
        ),
      },
      {
        key: 'Depositors',
        text: <Trans>Depositors</Trans>,
        value: <span style={{ color: theme.black300 }}>--</span>,
      },
    ]
  }, [theme])
  return (
    <MyAssetsWrapper>
      {AccountList.map((item) => (
        <AccountItem key={item.key}>
          <span>{item.text}</span>
          <span>{item.value}</span>
        </AccountItem>
      ))}
    </MyAssetsWrapper>
  )
}
