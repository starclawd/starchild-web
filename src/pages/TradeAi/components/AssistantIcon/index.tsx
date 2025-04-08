
import styled from 'styled-components'
import { memo } from 'react'
import { IconBase } from 'components/Icons'

const AssistantIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.line1};
  .icon-s-logo {
    font-size: 18px;
  }
`

export default memo(function AssistantIcon() {
  return <AssistantIconWrapper>
    <IconBase className="icon-s-logo" />
  </AssistantIconWrapper>
})
