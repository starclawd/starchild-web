import { Trans } from '@lingui/react/macro'
import { useMemo } from 'react'
import styled from 'styled-components'

const CreateStrategyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const TopContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 20px;
  border-radius: 24px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(12px);
`

const Title = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  padding: 0 8px;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  color: ${({ theme }) => theme.textL4};
`

const TempInfo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.black900};
  > span {
    font-size: 11px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.text20};
    span {
      color: ${({ theme }) => theme.textL4};
    }
  }
`

const Operator = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
`

const BottomContent = styled.div`
  display: flex;
  flex-direction: column;
`

export default function CreateStrategy() {
  const tempInfoList = useMemo(() => {
    return [
      {
        key: 'signal',
        text: (
          <Trans>
            <span>Signal:</span> Weekly Fibo Reversion (Long Only) A counter-trend strategy operating on the weekly
            timeframe. It places 10x leveraged limit orders at key Fibonacci retracement levels to catch oversold
            bounces.
          </Trans>
        ),
      },
      {
        key: 'entry',
        text: (
          <Trans>
            <span>Entry:</span> Long execution upon the first touch of a Fibonacci support level.
          </Trans>
        ),
      },
      {
        key: 'exit',
        text: (
          <Trans>
            <span>Exit:</span> Take profit immediately on a 5% price rebound.
          </Trans>
        ),
      },
      {
        key: 'constraint',
        text: (
          <Trans>
            <span>Constraint:</span> Strictly "First-Touch Only"—orders are cancelled if the level is revisited.
          </Trans>
        ),
      },
    ]
  }, [])
  return (
    <CreateStrategyWrapper id='createStrategyWrapper'>
      <TopContent>
        <Title>
          <Trans>Express your strategy in natural language.</Trans>
        </Title>
        <TempInfo>
          {tempInfoList.map((item) => (
            <span key={item.key}>{item.text}</span>
          ))}
          <Operator>
            <span>
              <Trans>Use template</Trans>
            </span>
          </Operator>
        </TempInfo>
      </TopContent>
      <BottomContent></BottomContent>
    </CreateStrategyWrapper>
  )
}
