import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { IconBase } from 'components/Icons'
import { AgentFeedbackComponentProps } from '../../types'
import useCopyContent from 'hooks/useCopyContent'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'

const CopyWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL2};
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  min-width: 32px;
  height: 32px;
  padding: 0 7px;
  border-radius: 44px;
  transition: all ${ANI_DURATION}s;
  cursor: pointer;

  i {
    font-size: 18px;
    color: ${({ theme }) => theme.textL2};
  }

  ${({ theme }) =>
    theme.isMobile
      ? css`
          min-width: ${vm(32)};
          height: ${vm(32)};
          padding: 0 ${vm(7)};
          font-size: 0.14rem;
          line-height: 0.2rem;
          border-radius: ${vm(44)};
          i {
            font-size: 0.18rem;
          }
          &:active {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `
      : css`
          &:hover {
            background-color: ${({ theme }) => theme.bgT30};
          }
        `}
`

const Copy = memo(function Copy({ responseContentRef }: AgentFeedbackComponentProps) {
  const { copyFromElement } = useCopyContent({ mode: 'element' })

  const handleCopy = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation()
      if (responseContentRef?.current) {
        copyFromElement(responseContentRef.current)
      }
    },
    [copyFromElement, responseContentRef],
  )

  return (
    <CopyWrapper onClick={handleCopy}>
      <IconBase className='icon-chat-copy' />
    </CopyWrapper>
  )
})

export default Copy
