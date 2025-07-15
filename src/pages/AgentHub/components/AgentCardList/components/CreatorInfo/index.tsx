import styled, { css } from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import Avatar from 'components/Avatar'

const CreatorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(12)};
    `}
`

const CreatorName = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  color: ${({ theme }) => theme.textL2};
  display: flex;
  align-items: center;
  gap: 6px;

  // cursor: pointer;
  // &:hover {
  //   background-color: ${({ theme }) => theme.bgL2};
  // }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)} ${vm(8)};
      border-radius: ${vm(4)};
      gap: ${vm(6)};
    `}
`

interface CreatorInfoProps {
  creator: string
  avatar?: string
  onClick?: () => void
}

export default memo(function CreatorInfo({ creator, avatar, onClick }: CreatorInfoProps) {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    onClick?.()
  }

  return (
    <CreatorContainer>
      <Trans>Created by:</Trans>
      <CreatorName onClick={handleClick}>
        <Avatar name={creator} size={24} avatar={avatar} />
        {creator}
      </CreatorName>
    </CreatorContainer>
  )
})
