import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import styled from 'styled-components'

const OverviewItemWrapper = styled.div`
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
  margin-bottom: 4px;
`

const Time = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: ${({ theme }) => theme.textL3};
`

export default function OverviewItem() {
  return (
    <OverviewItemWrapper>
      <Title>
        <IconBase className='icon-market-pulse' />
        <span>
          <Trans>Market Overview</Trans>
        </span>
      </Title>
      <Des>
        BTC and ETH are trading sideways amid reduced volatility. Altcoins show mixed performance — SOL maintains strong
        momentum, while ETH consolidates near support. Overall sentiment is neutral-to-bullish, with liquidity improving
        across major pairs and funding rates remaining stable.
      </Des>
      <Time>2025-04-11 15:56:59</Time>
    </OverviewItemWrapper>
  )
}
