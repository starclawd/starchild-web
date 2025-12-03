import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'
import { useState } from 'react'
import styled from 'styled-components'

const SignalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SignalDetail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  height: 74px;
  padding: 8px;
  background-color: ${({ theme }) => theme.black900};
  border-left: 2px solid ${({ theme }) => theme.black400};
`

const SignalTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.textL4};
  }
`

const SignlText = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const SignalProgress = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 4px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.black1000};
  background-color: ${({ theme }) => theme.brand100};
`

const MonitoringProgress = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 26px;
  padding: 4px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.black600};
`

export default function Signal() {
  const [isShowMonitoringProgress, setIsShowMonitoringProgress] = useState(false)
  return (
    <SignalWrapper>
      <SignalDetail>
        <SignalTitle>
          <span>
            <Trans>Market Overview</Trans>
          </span>
          <span>11-19 20:59:40</span>
        </SignalTitle>
        <SignlText>
          BTC and ETH are trading sideways amid reduced volatility. Altcoins show mixed performance — SOL maintains
          strongBTC and ETH are trading sideways amid reduced volatility. Altcoins show mixed performance — SOL
          maintains strong
        </SignlText>
      </SignalDetail>

      {isShowMonitoringProgress ? (
        <MonitoringProgress>
          <Pending />
          <span>
            <Trans>Monitoring in progress...</Trans>
          </span>
        </MonitoringProgress>
      ) : (
        <SignalProgress>
          <IconBase className='icon-star' />
          <span>
            <Trans>AI reasoning in progress...</Trans>
          </span>
        </SignalProgress>
      )}
    </SignalWrapper>
  )
}
