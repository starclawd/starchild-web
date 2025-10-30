import styled from 'styled-components'
import Icon from '../Icon'

const GoogleWrapper = styled.div`
  display: flex;
`

export default function Google() {
  return (
    <GoogleWrapper>
      <Icon iconName='icon-chat-upload' />
    </GoogleWrapper>
  )
}
