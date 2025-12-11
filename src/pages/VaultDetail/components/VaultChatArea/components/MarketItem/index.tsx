import styled from 'styled-components'
import { getSymbolLogoUrl } from 'store/vaultsdetail/dataTransforms'
import { StrategyDecisionType } from 'api/strategy'
import dayjs from 'dayjs'
import { useTimezone } from 'store/timezonecache/hooks'

const MarketItemWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
  border-left: 2px solid ${({ theme, $isLong }) => ($isLong ? theme.green100 : theme.red100)};
`

const Symbol = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  height: 20px;
  img {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
  span:nth-child(2) {
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
    letter-spacing: 0.42px;
    margin-right: 8px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.textDark80};
  }
  span:nth-child(3) {
    height: 18px;
    padding: 0 8px;
    border-radius: 4px;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px; /* 150% */
    letter-spacing: 0.36px;
    color: ${({ theme, $isLong }) => ($isLong ? theme.green100 : theme.red100)};
    background-color: ${({ theme, $isLong }) => ($isLong ? 'rgba(0, 222, 115, 0.15)' : 'rgba(255, 55, 91, 0.15)')};
  }
`

const Des = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

const Time = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  margin-top: 12px;
  color: ${({ theme }) => theme.textL3};
`

export default function MarketItem({ decision }: { decision: StrategyDecisionType }) {
  const [timezone] = useTimezone()
  const { content, timestamp } = decision
  const { symbol, action, description } = content
  const isLong = action === 'buy'
  return (
    <MarketItemWrapper $isLong={isLong}>
      <Symbol $isLong={isLong}>
        <img src={getSymbolLogoUrl(symbol)} alt='' />
        <span>{symbol}</span>
        <span>{isLong ? 'Long' : 'Short'}</span>
      </Symbol>
      <Des>{description}</Des>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
    </MarketItemWrapper>
  )
}
