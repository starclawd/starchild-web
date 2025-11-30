import { Trans } from '@lingui/react/macro'
import { ButtonBorder } from 'components/Button'
import { IconBase } from 'components/Icons'
import NoData from 'components/NoData'
import { useMemo } from 'react'
import styled from 'styled-components'

const MyVaultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Title = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const VaultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const VaultsItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const ItemTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  padding: 16px;
  border-radius: 4px 4px 0 0;
  background-color: ${({ theme }) => theme.black700};
`

const TopLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
  span:last-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textDark54};
  }
`

const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > span:first-child {
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    text-align: right;
    color: ${({ theme }) => theme.textL2};
  }
  > span:last-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    text-align: right;
    span:first-child {
      color: ${({ theme }) => theme.green100};
    }
    span:last-child {
      color: ${({ theme }) => theme.green200};
    }
  }
`

const ItemBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 26px;
  padding: 0 12px;
  border-radius: 0 0 4px 4px;
  background-color: ${({ theme }) => theme.black800};
`

const BottomLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  .icon-vault-period {
    font-size: 14px;
    color: ${({ theme }) => theme.textL4};
  }
  span {
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
    color: ${({ theme }) => theme.textL2};
  }
`

const BottomRight = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
  }
  span:first-child {
    color: ${({ theme }) => theme.textL2};
  }
  span:last-child {
    color: ${({ theme }) => theme.brand100};
  }
`

const NoDataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4px;
  .no-data-wrapper {
    min-height: unset;
    height: auto;
  }
  .no-data-des {
    margin-top: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.textL1};
  }
`

const ViewAllValut = styled(ButtonBorder)`
  width: fit-content;
  height: 32px;
  margin-top: 16px;
  padding: 8px 12px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
`

export default function MyVaults() {
  const valutsList = useMemo(() => {
    return []
  }, [])
  return (
    <MyVaultsWrapper>
      <Title>
        <Trans>My vaults</Trans>
      </Title>
      <VaultsList>
        {valutsList.length > 0 ? (
          valutsList.map((item) => (
            <VaultsItem key={item}>
              <ItemTop>
                <TopLeft>
                  <span>Upbit New Listing Sniper</span>
                  <span>Annabelle</span>
                </TopLeft>
                <TopRight>
                  <span>$56,789.00</span>
                  <span>
                    <span>+$556.23</span>
                    <span>(67.5%)</span>
                  </span>
                </TopRight>
              </ItemTop>
              <ItemBottom>
                <BottomLeft>
                  <IconBase className='icon-vault-period' />
                  <span>12d 22h 59m </span>
                </BottomLeft>
                <BottomRight>
                  <span>
                    <Trans>Withdraw</Trans>
                  </span>
                  <span>
                    <Trans>Deposit</Trans>
                  </span>
                </BottomRight>
              </ItemBottom>
            </VaultsItem>
          ))
        ) : (
          <NoDataWrapper>
            <NoData text={<Trans>Your vaults are empty.</Trans>} />
            <span className='no-data-des'>
              <Trans>Explore all strategies and activate your first one.</Trans>
            </span>
            <ViewAllValut>
              <Trans>View all vaults</Trans>
            </ViewAllValut>
          </NoDataWrapper>
        )}
      </VaultsList>
    </MyVaultsWrapper>
  )
}
