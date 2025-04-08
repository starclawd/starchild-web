
import styled from 'styled-components'
// import dayjs from 'dayjs'
import { memo, useCallback, useMemo } from 'react'
import { Trans } from '@lingui/react/macro'
import AiLoading from '../AiLoading'

const InsightsNewsWrapper = styled.div`
  display: flex;
  flex-shrink: 0;
  width: 316px;
  height: 100%;
  padding: 8px;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0px 8px 20px 8px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.bg3};
`

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 72px;
  padding: 28px 14px 20px;
  font-size: 18px;
  font-weight: 800;
  line-height: 24px;
  color: ${({ theme }) => theme.text1};
`

const NewsList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-right: 4px;
`

const ListItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.line2};
`

const ItemTop = styled.div<{ isLong: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  height: 36px;
  .top-left {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 800;
    line-height: 18px;
    color: ${({ theme }) => theme.text3};
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      line-height: 16px;
      padding: 0 6px;
      height: 20px;
      border-radius: 6px;
      color: ${({ theme, isLong }) => isLong ? theme.green : theme.red};
      background-color: ${({ theme, isLong }) => isLong ? theme.depthGreen : theme.depthRed};
    }
  }
  .top-right {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transform: scale(0.7);
  }
`

const ItemBottom = styled.div`
  display: flex;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  color: ${({ theme }) => theme.text1};
`

function ListItem() {
  const showTradeAi = useCallback(() => {
    console.log(1)
  }, [])
  return <ListItemWrapper>
    <ItemTop isLong={true}>
      <span className="top-left">
        2024-9-15 08:00
        <span>Long</span>
      </span>
      <span className="top-right">
        <AiLoading
          isLoading={false}
          isRecording={false}
          onClick={showTradeAi}
        />
      </span>
    </ItemTop>
    <ItemBottom>
      价值12.25亿美元的BTC期权合约和价值2.9亿美元的ETH期权合约将于明天到期。
    </ItemBottom>
  </ListItemWrapper>
}

export default memo(function InsightsNews() {
  const newsList = useMemo(() => {
    return [
      {
        id: 'dfsdfsff'
      }
    ]
  }, [])
  return <InsightsNewsWrapper>
    <ContentWrapper>
      <Header><Trans>News</Trans></Header>
      <NewsList className="scroll-style">
        {newsList.map((data) => {
          return <ListItem key={data.id} />
        })}
      </NewsList>
    </ContentWrapper>
  </InsightsNewsWrapper>
})
