import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import { useMemo } from 'react'

const Header = styled.div`
  position: absolute;
  left: 0;
  top: 72px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 34px;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          top: 65px;
          height: ${vm(30)};
        `
      : css``}
`

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`

const MenuList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
  gap: 48px;
  width: fit-content;
  height: 100%;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          gap: ${vm(15)};
          padding: 0 ${vm(8)};
        `
      : css``}
`

const MenuItem = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-family: 'PowerGrotesk';
  color: #fff;
  font-size: 16px;
  font-style: normal;
  font-weight: 300;
  line-height: 22px; /* 137.5% */
  letter-spacing: 3.2px;
  text-transform: uppercase;
  ${({ theme }) =>
    theme.isMobile
      ? css`
          font-size: 0.12rem;
          line-height: 0.3rem;
        `
      : css`
          cursor: pointer;
        `}
`

interface HomeMenuProps {
  opacity: number
}

export default function HomeMenu({ opacity }: HomeMenuProps) {
  const menuList = useMemo(() => {
    return [
      {
        text: <Trans>TOOLS &gt;</Trans>,
        value: 'TOOLS',
      },
      {
        text: <Trans>COMMUNITY &gt;</Trans>,
        value: 'COMMUNITY',
      },
      {
        text: <Trans>ECOSYSTEM &gt;</Trans>,
        value: 'ECOSYSTEM',
      },
    ]
  }, [])

  return (
    <Header>
      <HeaderContent>
        <MenuList>
          {menuList.map((item) => {
            const { text, value } = item
            return <MenuItem key={value}>{text}</MenuItem>
          })}
        </MenuList>
      </HeaderContent>
    </Header>
  )
}
