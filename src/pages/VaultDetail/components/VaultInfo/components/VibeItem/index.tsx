import { memo } from 'react'
import styled from 'styled-components'

const VibeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  span {
    max-width: 480px;
    font-size: 13px;
    font-style: italic;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
  }
`
export default memo(function VibeItem({ vibe }: { vibe: string }) {
  return (
    <VibeWrapper>
      <span>"{vibe || '--'}"</span>
    </VibeWrapper>
  )
})
