import dayjs from 'dayjs'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'
import { useFetchLatestTransactionHistoryData } from 'store/vaults/hooks/useTransactionData'
import styled, { css } from 'styled-components'
import usdc from 'assets/tokens/usdc.png'
import Tooltip from 'components/Tooltip'

const ProcessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0 ${vm(20)} ${vm(20)};
    `}
`

const Title = styled.div`
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 153.846% */
  letter-spacing: 0.39px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`
const DepositProcessWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`
const WithdrawProcessWrapper = styled(DepositProcessWrapper)``

const DepositProcess = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  > span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      border-radius: ${vm(8)};
      > span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const WithdrawProcess = styled(DepositProcess)``

const Status = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.green100};
  span {
    width: 4px;
    height: 4px;
    border-radius: 1px;
    background-color: ${({ theme }) => theme.green100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.12rem;
      line-height: 0.18rem;
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const Amount = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  img {
    width: 16px;
    height: 16px;
  }
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  .amount {
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      img {
        width: ${vm(16)};
        height: ${vm(16)};
      }
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const WithdrawProcess1 = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.bgT20};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)};
      border-radius: ${vm(8)};
    `}
`

const TopContent = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    &:first-child {
      color: ${({ theme }) => theme.textDark54};
    }
    &:last-child {
      color: ${({ theme }) => theme.brand100};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(8)};
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

const CenterContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
  span:first-child,
  span:nth-child(4),
  span:nth-child(5) {
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    border: 1px solid ${({ theme }) => theme.black300};
    background: ${({ theme }) => theme.black800};
  }
  span:nth-child(4) {
    position: absolute;
    top: 0;
    left: 50%;
  }
  span:nth-child(2),
  span:nth-child(3) {
    width: 50%;
    height: 2px;
    background-color: ${({ theme }) => theme.black500};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(4)};
      span:first-child,
      span:nth-child(4),
      span:nth-child(5) {
        width: ${vm(8)};
        height: ${vm(8)};
        border-radius: ${vm(2)};
      }
      span:nth-child(2),
      span:nth-child(3) {
        height: ${vm(2)};
      }
    `}
`

const BottomContent = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL4};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
    `}
`

export default function Process({ activeTab }: { activeTab: number }) {
  const { latestTransactionHistory } = useFetchLatestTransactionHistoryData()
  const latestTransaction = useMemo(() => {
    return latestTransactionHistory.find(
      (item) => (activeTab === 0 && item.type === 'deposit') || (activeTab === 1 && item.type === 'withdrawal'),
    )
  }, [latestTransactionHistory])
  const [status, estAssignPeriodTime, unlockTime] = useMemo(() => {
    const time = latestTransaction?.est_assign_period_time
    const unlockTime = latestTransaction?.unlock_time
    return [
      latestTransaction?.status,
      dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
      dayjs(unlockTime).format('YYYY-MM-DD HH:mm:ss'),
    ]
  }, [latestTransaction])

  const statusMap = useMemo(() => {
    return {
      prepending: <Trans>Pending</Trans>,
      pending: <Trans>Pending</Trans>,
      available: <Trans>Success</Trans>,
      locked: <Trans>Locked</Trans>,
    }
  }, [])
  return (
    <ProcessWrapper>
      {activeTab === 0 && latestTransaction && (
        <DepositProcessWrapper>
          <Title>
            <Trans>Latest deposit</Trans>
          </Title>
          <DepositProcess>
            <Status>
              <span></span>
              <Tooltip
                placement='top'
                content={
                  status === 'prepending' || status === 'pending' ? (
                    <Trans>Expected to be processed at {estAssignPeriodTime}</Trans>
                  ) : status === 'locked' ? (
                    <Trans>Shares from this deposit will unlock at {unlockTime}</Trans>
                  ) : (
                    ''
                  )
                }
              >
                {statusMap[status as keyof typeof statusMap]}
              </Tooltip>
            </Status>
            <Amount>
              <img src={usdc} alt='usdc' />
              <span className='amount'>{latestTransaction?.amount_change}</span>
            </Amount>
          </DepositProcess>
        </DepositProcessWrapper>
      )}
      {activeTab === 1 && latestTransaction && status === 'claimable' && (
        <WithdrawProcessWrapper>
          <Title>
            <Trans>Latest withdrawal request</Trans>
          </Title>
          <WithdrawProcess>
            <Status>
              <span></span>
              {status}
            </Status>
            <Amount>
              <img src={usdc} alt='usdc' />
              <span className='amount'>{latestTransaction?.amount_change}</span>
            </Amount>
          </WithdrawProcess>
        </WithdrawProcessWrapper>
      )}
      {activeTab === 1 && latestTransaction && status !== 'claimable' && (
        <WithdrawProcess1>
          <TopContent>
            <span>
              <Trans>Withdraw process</Trans>
            </span>
            <span>
              <Trans>Up to 6 hours</Trans>
            </span>
          </TopContent>
          <CenterContent>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </CenterContent>
          <BottomContent>
            <span>
              <Trans>Initiate</Trans>
            </span>
            <span>
              <Trans>Vault process</Trans>
            </span>
            <span>
              <Trans>Transferred</Trans>
            </span>
          </BottomContent>
        </WithdrawProcess1>
      )}
    </ProcessWrapper>
  )
}
