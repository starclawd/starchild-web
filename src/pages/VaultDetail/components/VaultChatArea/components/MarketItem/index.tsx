import styled from 'styled-components'
import SectorChart from '../SectorChart'

const MarketItemWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const RightIcon = styled.div`
  display: flex;
  position: absolute;
  right: 12px;
  top: 12px;
  width: 90px;
  height: 90px;
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

export default function MarketItem() {
  return (
    <MarketItemWrapper>
      <TitleInfo>
        <Symbol>
          <span>BTC-PERP</span>
          <span>Buy</span>
        </Symbol>
        <Des>RSI oversold + volume spike</Des>
      </TitleInfo>
      <RightIcon>
        <SectorChart percent={20} />
      </RightIcon>
    </MarketItemWrapper>
  )
}
