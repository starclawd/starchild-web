import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { t } from "@lingui/core/macro";
import { memo, useCallback } from 'react'
import { ANI_DURATION } from 'constants/index'
import { useSendAiContent } from 'store/tradeai/hooks'
import { TRADE_AI_TYPE } from 'store/tradeai/tradeai.d'

const ChatTypeSuggestedList = styled.div`
  display: flex;
  flex-direction: column;
  left: 0;
  width: 100%;
  height: 244px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bg3};
`

const SuggestedItem = styled.div`
  display: flex;
  flex-direction: column;
  .title {
    display: flex;
    align-items: center;
    height: 32px;
    padding: 8px 14px;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    color: ${({ theme }) => theme.text3};
  }
`

const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 36px;
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.text1};
  &:hover {
    background-color: ${({ theme }) => theme.bg10};
  }
`

const PageTypeSuggestedList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  width: 100%;
  .title-box {
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 31%;
    left: 18.8%;
    top: 12%;
  }
  .title {
    font-size: 32px;
    font-weight: 800;
    line-height: 40px;
    margin-bottom: 20px;
    color: ${({ theme }) => theme.commonWhite};
  }
  .second-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 20px;
    color: ${({ theme }) => theme.commonWhite};
  }
`

const PageTypeSuggestedListWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 20px;
`

const ImgWrapper = styled.div`
  width: 100%;
  height: 240px;
  border-radius: 16px;
  margin-bottom: 60px;
  overflow: hidden;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const PageTypeSuggestedItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 607px;
  gap: 20px;
  .popover-wrapper {
    width: 100%;
  }
`

const PageTypeSuggestedItemItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  height: auto;
  padding: 20px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 800;
  line-height: 20px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg10};
  cursor: pointer;
`

const OrderTypeSuggestedList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 20px;
  color: ${({ theme }) => theme.text1};
  .popover-wrapper {
    width: 100%;
  }
  .title {
    font-size: 20px;
    font-weight: 800;
    line-height: 26px;
  }
  .second-title {
    padding: 0 20px;
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    text-align: center;
    color: ${({ theme }) => theme.text3};
  }
  ${({ theme }) =>
    theme.isMobile && css`
      padding-top: 20px;
      .icon-logo {
        font-size: 103px;
        line-height: 24px;
      }
      .title {
        font-size: 18px;
        line-height: 24px;
      }
    `
  }
`

const SmallImgWrapper = styled.div`
  width: 100%;
  height: 92px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`

const OrderTypeSuggestedItem = styled.div`
  display: flex;
  justify-content: flex-start;
  text-align: left;
  width: 100%;
  height: auto;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 800;
  line-height: 18px;
  border: 1px solid transparent;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.bg10};
  cursor: pointer;
`


export default memo(function Suggested({
  tradeAiType,
}: {
  tradeAiType: TRADE_AI_TYPE
}) {
  const sendAiContent = useSendAiContent()
  const suggestedList = [
    {
      key: 'Suggested',
      type: <Trans>Suggested</Trans>,
      list: [
        {
          key: 'price',
          content: t`Latest BTC price prediction`
        },
        {
          key: 'strategy',
          content: t`Can you give me a quick technical analysis of BTC and ETH for today?`
        },
      ]
    },
    {
      key: 'Trade',
      type: <Trans>Trade</Trans>,
      list: [
        {
          key: 'news',
          content: t`Quick order: Long BTC at $100,000, stop loss at -10%`
        },
      ]
    },
  ]
  const orderTypeSuggestedList = [
    {
      key: 'prediction',
      className: 'green',
      text: t`Latest BTC price prediction`
    },
    {
      key: 'order',
      className: 'red',
      text: t`Quick order: Long BTC at $100,000, stop loss at -10%`
    },
    {
      key: 'Can you give me a quick',
      className: 'red',
      text: t`Can you give me a quick technical analysis of BTC and ETH for today?`
    },
  ]
  const pageTypeSuggestedList = [
    {
      key: '1',
      list: [
        {
          key: 'Latest BTC price prediction',
          className: 'red',
          text: t`Latest BTC price prediction`
        },
        {
          key: 'Should I go short or long on ETH, and why?',
          className: 'red',
          text: t`Should I go short or long on ETH, and why?`
        },
        {
          key: 'Can you give me a quick technical analysis of BTC and ETH for today?',
          className: 'red',
          text: t`Can you give me a quick technical analysis of BTC and ETH for today?`
        },
      ]
    },
    {
      key: '2',
      list: [
        {
          key: 'Quick order: Long BTC at $100,000, stop loss at -10%',
          className: 'red',
          text: t`Quick order: Long BTC at $100,000, stop loss at -10%`
        },
        {
          key: 'Latest Web3 updates',
          className: 'blue',
          text: t`Latest Web3 updates`
        },
        {
          key: 'Upcoming events',
          className: 'blue',
          text: t`Upcoming events`
        },
      ]
    },
  ]
  const requestStream = useCallback((content: string) => {
    return () => {
      sendAiContent({
        value: content,
      })
    }
  }, [sendAiContent])
  return tradeAiType === TRADE_AI_TYPE.PAGE_TYPE
    ? <PageTypeSuggestedList>
      <ImgWrapper style={{ backgroundImage: `url(${''})` }} ></ImgWrapper>
      <span className="title-box">
        <span className="title"><Trans>How can I assist you today?</Trans></span>
        <span className="second-title"><Trans>Ask anything about the market, tutorials, or input a command for placing an order Try to ask:</Trans></span>
      </span>
      <PageTypeSuggestedListWrapper>
        {pageTypeSuggestedList.map((data) => {
          const { key, list } = data
          return <PageTypeSuggestedItem key={key}>
            {list.map((data) => {
              const { key, text } = data
              return <PageTypeSuggestedItemItem key={key} onClick={requestStream(text)}>
                {text}
              </PageTypeSuggestedItemItem>
            })}
          </PageTypeSuggestedItem>
        })}
      </PageTypeSuggestedListWrapper>
    </PageTypeSuggestedList>
    : tradeAiType === TRADE_AI_TYPE.CHAT_TYPE
      ? <ChatTypeSuggestedList>
        {suggestedList.map((data) => {
          const { key, type, list } = data
          return <SuggestedItem key={key}>
            <span className="title">{type}</span>
            {list.map((data) => {
              const { key, content } = data
              return <Item onClick={requestStream(content)} key={key}>{content}</Item>
            })}
          </SuggestedItem>
        })}
      </ChatTypeSuggestedList>
      : <OrderTypeSuggestedList>
        <SmallImgWrapper style={{ backgroundImage: `url(${''})` }} ></SmallImgWrapper>
        <span className="title"><Trans>How can I assist you today?</Trans></span>
        <span className="second-title"><Trans>Ask anything about the market, tutorials, or input a command for placing an order Try to ask:</Trans></span>
        {orderTypeSuggestedList.map((data) => {
          const { key, text } = data
          return <OrderTypeSuggestedItem key={key} onClick={requestStream(text)}>
            {text}
          </OrderTypeSuggestedItem>
        })}
      </OrderTypeSuggestedList>
})
