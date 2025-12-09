import { Trans } from '@lingui/react/macro'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { IconBase } from 'components/Icons'
import Select, { TriggerMethod } from 'components/Select'
import ChatInput from 'pages/CreateStrategy/components/Chat/components/ChatInput'
import { vm } from 'pages/helper'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

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

const UseTemp = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
`

const Operator = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 40px;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .select-wrapper {
    height: 40px;
    .select-border-wrapper {
      gap: 6px;
      border-radius: 32px;
      background-color: transparent;
    }
  }
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-style-type {
    font-size: 18px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ButtonPrompt = styled(ButtonBorder)`
  gap: 6px;
  width: fit-content;
  height: 40px;
  padding: 0 12px;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  .icon-signal-warn {
    font-size: 18px;
    color: ${({ theme }) => theme.yellow100};
  }
`

const SendButton = styled(ButtonCommon)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  .icon-chat-back {
    font-size: 18px;
    transform: rotate(90deg);
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: ${vm(40)};
      height: ${vm(40)};
      .icon-chat-back {
        font-size: ${vm(18)};
      }
    `}
`

const BottomContent = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  height: 150px;
`

const LeftContent = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-radius: 12px;
  padding: 16px;
  width: 50%;
  > span:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 215px;
    height: 100%;
    span:first-child {
      font-size: 20px;
      font-style: normal;
      font-weight: 500;
      line-height: 28px;
      background: linear-gradient(94deg, rgba(255, 255, 255, 0.98) 0.57%, rgba(153, 153, 153, 0.98) 63.36%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    span:last-child {
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.textL4};
    }
  }
  > span:last-child {
    display: flex;
    align-items: flex-end;
    justify-content: flex-end;
    gap: 4px;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
    color: ${({ theme }) => theme.textL1};
    .icon-chat-arrow-long {
      font-size: 18px;
      color: ${({ theme }) => theme.textL1};
    }
  }
`

const RightContent = styled(LeftContent)`
  display: flex;
`

export default function CreateStrategy() {
  const [showInput, setShowInput] = useState(false)
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
  const selectList = useMemo(() => {
    return [
      {
        text: '1',
        value: '1',
        clickCallback: () => {},
      },
    ]
  }, [])
  return (
    <CreateStrategyWrapper id='createStrategyWrapper'>
      {!showInput ? (
        <TopContent>
          <Title>
            <Trans>Express your strategy in natural language.</Trans>
          </Title>
          <TempInfo>
            {tempInfoList.map((item) => (
              <span key={item.key}>{item.text}</span>
            ))}
            <UseTemp>
              <span>
                <Trans>Use template</Trans>
              </span>
            </UseTemp>
          </TempInfo>
          <Operator>
            <Left>
              <Select triggerMethod={TriggerMethod.CLICK} value='' dataList={selectList}>
                <SelectValue>
                  <IconBase className='icon-style-type' />
                  <span>
                    <span>Trend Following</span>
                  </span>
                </SelectValue>
              </Select>
              <ButtonPrompt>
                <IconBase className='icon-signal-warn' />
                <Trans>Prompt</Trans>
              </ButtonPrompt>
            </Left>
            <SendButton $disabled={true}>
              <IconBase className='icon-chat-back' />
            </SendButton>
          </Operator>
        </TopContent>
      ) : (
        <ChatInput />
      )}
      <BottomContent>
        <LeftContent>
          <span>
            <span>
              <Trans>Don't know how to write a strategy?</Trans>
            </span>
            <span>
              <Trans>Explore the Agent Market or Insights to find high-performing signals.</Trans>
            </span>
          </span>
          <span>
            <span>
              <Trans>Agent marketplace</Trans>
            </span>
            <IconBase className='icon-chat-arrow-long' />
          </span>
        </LeftContent>
        <RightContent>
          <span>
            <span>
              <Trans>Need inspiration?</Trans>
            </span>
            <span>
              <Trans>Chat with Smart Contract (SC) to summarize strategies from top KOLs.</Trans>
            </span>
          </span>
          <span>
            <span>
              <Trans>Chat now</Trans>
            </span>
            <IconBase className='icon-chat-arrow-long' />
          </span>
        </RightContent>
      </BottomContent>
    </CreateStrategyWrapper>
  )
}
