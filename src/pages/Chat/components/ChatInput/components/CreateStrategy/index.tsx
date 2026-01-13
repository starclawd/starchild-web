import { ANI_DURATION } from 'constants/index'
import ChatInput from 'pages/CreateStrategy/components/Chat/components/ChatInput'
import styled, { css } from 'styled-components'

const CreateStrategyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  .chat-input-wrapper {
    padding: 0;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `}
`

export default function CreateStrategy() {
  return (
    <CreateStrategyWrapper id='createStrategyWrapper'>
      <ChatInput isChatPage />
    </CreateStrategyWrapper>
  )
}
