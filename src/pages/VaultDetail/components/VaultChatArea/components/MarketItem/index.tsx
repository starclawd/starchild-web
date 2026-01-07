import styled from 'styled-components'
import { getSymbolLogoUrl } from 'store/vaultsdetail/dataTransforms'
import { StrategyDecisionType } from 'api/strategy'
import dayjs from 'dayjs'
import { useTimezone } from 'store/timezonecache/hooks'
import { useMemo } from 'react'
import { IconBase } from 'components/Icons'

const MarketItemWrapper = styled.div<{ $isLong: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const Time = styled.div`
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  color: ${({ theme }) => theme.black300};
`

const Content = styled.div`
  display: flex;
  gap: 4px;
  i {
    font-size: 18px;
    color: ${({ theme }) => theme.black100};
  }
`

const Right = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Symbol = styled.div<{ $isLong: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
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
    color: ${({ theme, $isLong }) => ($isLong ? theme.green100 : theme.red100)};
    background-color: ${({ theme, $isLong }) => ($isLong ? 'rgba(0, 222, 115, 0.15)' : 'rgba(255, 55, 91, 0.15)')};
  }
`

const Des = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black0};
`

export default function MarketItem({ decision }: { decision: StrategyDecisionType }) {
  const [timezone] = useTimezone()
  const { content, timestamp } = decision
  const { action, description } = content || { action: '', description: '' }
  const symbol = useMemo(() => {
    const symbol = content?.symbol || ''
    if (symbol.includes('_')) {
      return symbol.split('_')[1] || symbol
    }
    return symbol
  }, [content?.symbol])
  const isLong = action === 'buy'
  return (
    <MarketItemWrapper $isLong={isLong}>
      <Time>{dayjs.tz(timestamp, timezone).format('YYYY-MM-DD HH:mm:ss')}</Time>
      <Content>
        <IconBase className='icon-decision' />
        <Right>
          <Symbol $isLong={isLong}>
            <span>{symbol}-PERP</span>
            <span>{isLong ? 'Long' : 'Short'}</span>
          </Symbol>
          <Des>{description}</Des>
        </Right>
      </Content>
    </MarketItemWrapper>
  )
}
