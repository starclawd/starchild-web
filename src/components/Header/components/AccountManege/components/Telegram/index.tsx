import styled from 'styled-components'
import Icon from '../Icon'

const TelegramWrapper = styled.div`
  display: flex;
`

export default function Telegram() {
  return (
    <TelegramWrapper>
      <Icon iconName='icon-chat-upload' />
    </TelegramWrapper>
  )
}
