import { vm } from 'pages/helper'
import { forwardRef, ReactNode, useRef } from 'react'
import styled, { css } from 'styled-components'

const ScrollPageContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.black100};
  width: 100%;
  height: 100%;
  padding: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
    `}
`

interface ScrollPageContentProps {
  children?: ReactNode
  className?: string
}

const ScrollPageContent = forwardRef<HTMLDivElement, ScrollPageContentProps>(({ children, className }, ref) => {
  const defaultRef = useRef<HTMLDivElement>(null)
  const finalRef = ref || defaultRef
  const finalClassName = `scroll-style ${className || ''}`.trim()

  return (
    <ScrollPageContentWrapper ref={finalRef} className={finalClassName}>
      {children}
    </ScrollPageContentWrapper>
  )
})

ScrollPageContent.displayName = 'ScrollPageContent'

export default ScrollPageContent
