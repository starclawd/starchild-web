import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import ChatInput from 'pages/CreateStrategy/components/Chat/components/ChatInput'
import { ROUTER } from 'pages/router'
import { useCallback } from 'react'
import { useCurrentRouter } from 'store/application/hooks'
import { useChatTabIndex } from 'store/chat/hooks'
import styled from 'styled-components'
import home1 from 'assets/createstrategy/home-1.png'
import home2 from 'assets/createstrategy/home-2.png'

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
    width: 178px;
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
    color: ${({ theme }) => theme.textL3};
    transition: all ${ANI_DURATION}s;
    cursor: pointer;
    .icon-chat-arrow-long {
      font-size: 18px;
      transition: all ${ANI_DURATION}s;
      color: ${({ theme }) => theme.textL3};
    }
    &:hover {
      color: ${({ theme }) => theme.textL1};
      .icon-chat-arrow-long {
        color: ${({ theme }) => theme.textL1};
      }
    }
  }
`

const RightContent = styled(LeftContent)`
  display: flex;
  > span:first-child {
    width: 228px;
    span:first-child {
      color: ${({ theme }) => theme.textL1};
      background: unset;
      background-clip: unset;
      -webkit-background-clip: unset;
      -webkit-text-fill-color: unset;
    }
    span:last-child {
      color: ${({ theme }) => theme.textL3};
    }
  }
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
        <LeftContent style={{ backgroundImage: `url(${home1})` }}>
          <span>
            <span>
              <Trans>Want to deploy capital now?</Trans>
            </span>
            <span>
              <Trans>explore copying some of the top performing agents</Trans>
            </span>
          </span>
          <span onClick={goAgentMarketplace}>
            <span>
              <Trans>Agent marketplace</Trans>
            </span>
            <IconBase className='icon-chat-arrow-long' />
          </span>
        </LeftContent>
        <RightContent style={{ backgroundImage: `url(${home2})` }}>
          <span>
            <span>
              <Trans>Need inspiration?</Trans>
            </span>
            <span>
              <Trans>chat with starchild to get some inspiration from the best performing strategies</Trans>
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
