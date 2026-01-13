import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { memo } from 'react'
import styled from 'styled-components'

const ResponseProgressWrapper = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 4px;
  height: 26px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.brand100};
  .icon-progress-response {
    font-size: 18px;
    color: ${({ theme }) => theme.brand100};
  }
`

const LoadingDots = styled.span`
  display: inline-flex;
  width: 18px;

  @keyframes dot1 {
    0%,
    100% {
      opacity: 0;
    }
    10%,
    90% {
      opacity: 1;
    }
  }

  @keyframes dot2 {
    0%,
    33%,
    100% {
      opacity: 0;
    }
    43%,
    90% {
      opacity: 1;
    }
  }

  @keyframes dot3 {
    0%,
    66%,
    100% {
      opacity: 0;
    }
    76%,
    90% {
      opacity: 1;
    }
  }

  span {
    &:nth-child(1) {
      animation: dot1 1.5s infinite;
    }
    &:nth-child(2) {
      animation: dot2 1.5s infinite;
    }
    &:nth-child(3) {
      animation: dot3 1.5s infinite;
    }
  }
`

export default memo(function ResponseProgress() {
  return (
    <ResponseProgressWrapper>
      <IconBase className='icon-progress-response' />
      <span>
        <Trans>AI reasoning in progress</Trans>
        <LoadingDots>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </LoadingDots>
      </span>
    </ResponseProgressWrapper>
  )
})
