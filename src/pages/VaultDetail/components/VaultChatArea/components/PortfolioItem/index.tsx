import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import styled, { css } from 'styled-components'
import RiskChart from '../RiskChart'
import { useMemo } from 'react'

const PortfolioItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 20px;
  margin-bottom: 8px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .icon-signal-warn {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }
`

const Des = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: ${({ theme }) => theme.textL1};
  margin-bottom: 20px;
`

const Time = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.textL3};
`

const RiskInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  span {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
`

export default function PortfolioItem() {
  const percent = 90
  const riskText = useMemo(() => {
    if (percent <= 30) {
      return <Trans>Low Risk</Trans>
    } else if (percent <= 60) {
      return <Trans>Medium Risk</Trans>
    } else {
      return <Trans>High Risk</Trans>
    }
  }, [percent])
  return (
    <PortfolioItemWrapper>
      <Title>
        <Left>
          <IconBase className='icon-signal-warn' />
          <span>
            <Trans>Portfolio Alert | Total Exposure</Trans>
          </span>
        </Left>
        <RiskInfo>
          <RiskChart percent={percent} />
          <span>{riskText}</span>
        </RiskInfo>
      </Title>
      <Des>
        Your total portfolio shows cumulative unrealized PnL: -$456,789 (-6.2%). Average ROE across active positions has
        dropped below the safety threshold. Current margin utilization: 78%, indicating elevated liquidation risk if
        volatility increases.
      </Des>
      <Time>2025-04-11 15:56:59</Time>
    </PortfolioItemWrapper>
  )
}
