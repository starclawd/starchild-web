import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import styled from 'styled-components'

const ChainOfThoughtWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  padding: 12px;
  background-color: ${({ theme }) => theme.black800};
`

const Title = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
`

const Des = styled.div`
  display: flex;
  flex-direction: column;
`

const DesItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding-left: 8px;
  gap: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  color: ${({ theme }) => theme.textL2};

  &::before {
    content: '•';
    flex-shrink: 0;
  }
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

export default function ChainOfThought() {
  return (
    <ChainOfThoughtWrapper>
      <Title>
        <Trans>🧠 Chain of Thought</Trans>
      </Title>
      <Des>
        <DesItem>BTC and ETH are trading sideways amid reduced volatility.</DesItem>
      </Des>
      <Time>2025-04-11 15:56:59</Time>
    </ChainOfThoughtWrapper>
  )
}
