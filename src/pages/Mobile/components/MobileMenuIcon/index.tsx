import { IconBase } from 'components/Icons'
import { useCallback } from 'react'
import { useIsShowMobileMenu } from 'store/application/hooks'
import styled from 'styled-components'

const MobileMenuWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  .icon-mobile-menu {
    font-size: 0.24rem;
    color: ${({ theme }) => theme.textL3};
  }
`

export default function MobileMenuIcon() {
  const [, setIsShowMobileMenu] = useIsShowMobileMenu()
  const changeIsShowMobileMenu = useCallback(() => {
    setIsShowMobileMenu(true)
  }, [setIsShowMobileMenu])
  return (
    <MobileMenuWrapper onClick={changeIsShowMobileMenu}>
      <IconBase className='icon-mobile-menu' />
    </MobileMenuWrapper>
  )
}
