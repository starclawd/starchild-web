import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import ChatInput from 'pages/CreateStrategy/components/Chat/components/ChatInput'
import { ROUTER } from 'pages/router'
import { useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useChatTabIndex } from 'store/chat/hooks'
import styled from 'styled-components'

const CreateStrategyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  .chat-input-wrapper {
    padding: 0;
  }
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
    transition: all ${ANI_DURATION}s;
    cursor: pointer;
    &:hover {
      opacity: 0.7;
    }
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
  const [, setCurrentRouter] = useCurrentRouter()
  const [, setChatTabIndex] = useChatTabIndex()
  const goAgentMarketplace = useCallback(() => {
    setCurrentRouter(ROUTER.AGENT_HUB)
  }, [setCurrentRouter])
  const goChat = useCallback(() => {
    setChatTabIndex(0)
  }, [setChatTabIndex])
  return (
    <CreateStrategyWrapper id='createStrategyWrapper'>
      <ChatInput isChatPage />
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
          <span onClick={goAgentMarketplace}>
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
          <span onClick={goChat}>
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
