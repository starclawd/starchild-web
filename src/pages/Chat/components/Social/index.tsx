import { IconBase } from 'components/Icons'
import { memo, useMemo } from 'react'
import styled from 'styled-components'
import { URL, X } from 'utils/url'
import { ANI_DURATION } from 'constants/index'

const SocialWrapper = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  height: 24px;
  gap: 20px;
`

const IconWrapper = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  i {
    transition: all ${ANI_DURATION}s;
    font-size: 24px;
    color: ${({ theme }) => theme.black200};
  }
  &:hover {
    i {
      color: ${({ theme }) => theme.black0};
    }
  }
`

export default memo(function Social() {
  const dataList = useMemo(() => {
    return [
      {
        key: 'telegram',
        href: '',
        icon: 'icon-telegram',
      },
      {
        key: 'x',
        href: URL[X],
        icon: 'icon-x',
      },
    ]
  }, [])
  return (
    <SocialWrapper>
      {dataList.map((item) => (
        <IconWrapper key={item.key} href={item.href} target='_blank' rel='noopener noreferrer'>
          <IconBase className={item.icon} />
        </IconWrapper>
      ))}
    </SocialWrapper>
  )
})
