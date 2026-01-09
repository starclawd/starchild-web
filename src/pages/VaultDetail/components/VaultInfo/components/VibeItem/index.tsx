import { memo } from 'react'
import styled from 'styled-components'

const VibeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    &:first-child {
      color: ${({ theme }) => theme.brand200};
    }
    &:last-child {
      max-width: 480px;
      font-size: 13px;
      font-style: italic;
      font-weight: 400;
      line-height: 18px;
      color: ${({ theme }) => theme.black200};
    }
  }
`
export default memo(function VibeItem({ vibe }: { vibe: string }) {
  return (
    <VibeWrapper>
      <span>Just for test</span>
      <span>"{vibe || '--'}"</span>
    </VibeWrapper>
  )
})
