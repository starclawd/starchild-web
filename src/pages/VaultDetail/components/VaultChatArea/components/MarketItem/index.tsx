import styled, { css } from 'styled-components'
import ConfidenceChart from '../ConfidenceChart'
import { Trans } from '@lingui/react/macro'

const MarketItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const RightInfo = styled.div<{ $percent: number }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  right: 12px;
  top: 12px;
  min-width: 100px;
  padding-top: 17px;
  span:nth-child(2) {
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.green100};
  }
  span:nth-child(3) {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    margin-bottom: 9px;
    color: ${({ theme }) => theme.textL3};
  }
  span:nth-child(4) {
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    color: ${({ theme }) => theme.green100};
  }
  ${({ $percent }) =>
    $percent <= 80 &&
    css`
      span:nth-child(2) {
        color: ${({ theme }) => theme.orange100};
      }
      span:nth-child(4) {
        color: ${({ theme }) => theme.orange100};
      }
    `}
`

const TitleInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`

const Symbol = styled.div`
  display: flex;
  align-items: center;
  height: 20px;
  gap: 8px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.42px;
    color: ${({ theme }) => theme.textDark80};
  }
  span:last-child {
    height: 18px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px; /* 150% */
    letter-spacing: 0.36px;
    color: ${({ theme }) => theme.white};
    background-color: rgba(0, 222, 115, 0.15);
  }
`

const Des = styled.div`
  width: fit-content;
  padding: 4px 8px;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  border-radius: 4px;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.bgT20};
`

const Content = styled.div`
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

export default function MarketItem() {
  const percent = 50
  return (
    <MarketItemWrapper>
      <TitleInfo>
        <Symbol>
          <span>BTC-PERP</span>
          <span>Buy</span>
        </Symbol>
        <Des>RSI oversold + volume spike</Des>
      </TitleInfo>
      <RightInfo $percent={percent}>
        <ConfidenceChart percent={percent} />
        <span>50%</span>
        <span>
          <Trans>Confidence</Trans>
        </span>
        <span>
          <Trans>Confident entry signal</Trans>
        </span>
      </RightInfo>
      <Content></Content>
      <Time>2025-04-11 15:56:59</Time>
    </MarketItemWrapper>
  )
}
