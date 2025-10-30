import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { vm } from 'pages/helper'
import { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 14px;
  color: ${({ theme }) => theme.textL4};
  transition: all ${ANI_DURATION}s;
  cursor: pointer;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: ${vm(20)};
          height: ${vm(20)};
          font-size: 0.14rem;
        `
      : css`
          &:hover {
            color: ${({ theme }) => theme.textL1};
          }
        `}
`

export default function Icon({ iconName, onClick }: { iconName: string; onClick?: MouseEventHandler<HTMLDivElement> }) {
  return (
    <IconWrapper onClick={onClick}>
      <IconBase className={iconName} />
    </IconWrapper>
  )
}
