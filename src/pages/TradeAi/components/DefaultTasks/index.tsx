import { t } from '@lingui/core/macro'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { memo, useCallback, useMemo } from 'react'
import { useSendAiContent } from 'store/tradeai/hooks'
import styled, { css, useTheme } from 'styled-components'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const DefaultTasksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(20)};
  `}
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 8px;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px; 
    color: ${({ theme }) => theme.textL1};
  }
  span:last-child {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding: 0 ${vm(8)};
    span:first-child {
      font-size: .20rem;
      line-height: .28rem;
    }
    span:last-child {
      font-size: .14rem;
      line-height: .20rem;
    }
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const TaskItem = styled(BorderAllSide1PxBox)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  padding: 12px;
  width: 100%;
  min-height: 48px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  transition: color ${ANI_DURATION}s;
  color: ${({ theme }) => theme.textL4};
  ${({ theme }) => theme.isMobile
  ? css`
    padding: ${vm(12)};
    min-height: ${vm(48)};
    font-size: .12rem;
    line-height: .18rem;
  ` : css`
    &:hover {
      color: ${({ theme }) => theme.textL2};
    }
    cursor: pointer;
  `}
`

const IconWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  .icon-chat-back {
    transform: rotate(180deg);
    font-size: 14px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(24)};
    height: ${vm(24)};
    .icon-chat-back {
      font-size: .14rem;
    }
  `}
`

export default memo(function DefaultTasks() {
  const theme = useTheme()
  const sendAiContent = useSendAiContent()
  const sendContent = useCallback((content: string) => {
    return () => {
      sendAiContent({
        value: content,
      })
    }
  }, [sendAiContent])
  const taskItemList = [
    {
      key: '1',
      content: t`Receive a daily report including market overview, top news highlights, and BTC technical analysis — delivered every day at 00:00 UTC.`
    },
    {
      key: '2',
      content: t`Get a summary of your portfolio performance every Monday, including gains/losses, asset allocation changes, and top performers.`
    },
    {
      key: '3',
      content: t`Be instantly notified when the price of Bitcoin crosses key thresholds — for example, above $100,000 or below $60,000.`
    },
    {
      key: '4',
      content: t`Every Sunday, receive a crypto market sentiment summary based on social trends, funding rates, and the fear & greed index.`
    },
    {
      key: '5',
      content: t`Stay informed about newly listed tokens across major exchanges with real-time alerts, including token names and launch prices.`
    },
  ]
  return <DefaultTasksWrapper>
    <TitleWrapper>
      <span><Trans>Quick Start with Default Tasks</Trans></span>
      <span><Trans>Choose from these ready-made tasks to get started instantly, or type your own request below to create a custom task.</Trans></span>
    </TitleWrapper>
    <Content>
      {taskItemList.map((item) => {
        const { key, content } = item
        return <TaskItem
          key={key}
          $borderColor={theme.bgT30}
          $borderRadius={16}
          $borderStyle="dashed"
          onClick={sendContent(content)}
        >
          <span>{content}</span>
          <IconWrapper
            $borderColor={theme.bgT30}
            $borderRadius={12}
          >
            <IconBase className="icon-chat-back"/>
          </IconWrapper>
        </TaskItem>
      })}
    </Content>
  </DefaultTasksWrapper>
})
