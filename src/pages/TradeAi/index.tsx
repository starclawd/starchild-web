import styled from 'styled-components'
import AiThreadsList from './components/AiThreadsList'
import FileDrag from './components/FileDrag'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const TradeAiWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-top: 1px solid ${({ theme }) => theme.line1};
`

const AiContent = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const RightContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100% - 316px);
  height: 100%;
  padding: 8px 8px 12px 0;
`

export default function TradeAi() {
  return <TradeAiWrapper>
    <AiContent>
      <AiThreadsList />
      <RightContent>
        <FileDrag />
      </RightContent>
    </AiContent>
  </TradeAiWrapper>
}
