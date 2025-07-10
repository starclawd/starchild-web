import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'

const CreatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(10)};
    `}
`

const CreatorName = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: ${({ theme }) => theme.textL2};

  &:hover {
    background-color: ${({ theme }) => theme.bgL2};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(3)} ${vm(6)};
      border-radius: ${vm(3)};
    `}
`

interface CreatorInfoProps {
  creator: string
  onClick?: () => void
}

export default memo(function CreatorInfo({ creator, onClick }: CreatorInfoProps) {
  return (
    <CreatorContainer>
      <Trans>Created by:</Trans>
      <CreatorName onClick={onClick}>{creator}</CreatorName>
    </CreatorContainer>
  )
})
