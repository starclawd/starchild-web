import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import styled from 'styled-components'

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
  margin-bottom: 8px;
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

export default function PortfolioItem() {
  return (
    <PortfolioItemWrapper>
      <Title>
        <IconBase className='icon-signal-warn' />
        <span>
          <Trans>Portfolio Alert | Total Exposure</Trans>
        </span>
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
