import { ANI_DURATION } from 'constants/index'
import ChatInput from 'pages/CreateStrategy/components/Chat/components/ChatInput'
import styled from 'styled-components'

const CreateStrategyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  .chat-input-wrapper {
    padding: 0;
  }
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
  return (
    <CreateStrategyWrapper id='createStrategyWrapper'>
      <ChatInput isChatPage />
    </CreateStrategyWrapper>
  )
}
