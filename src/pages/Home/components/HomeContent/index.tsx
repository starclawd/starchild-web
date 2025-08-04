import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AccessButton from './components/AccessButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin } from 'store/login/hooks'

const HomeContentWrapper = styled.div`
  display: flex;
`

export default function HomeContent() {
  const isLogin = useIsLogin()
  const { login } = useParsedQueryString()
  const [isShowAccessButton, setIsShowAccessButton] = useState(true)
  useEffect(() => {
    if (login === '1') {
      setIsShowAccessButton(false)
    }
  }, [login])
  return (
    <HomeContentWrapper>
      {(isShowAccessButton || !isLogin) && <AccessButton setIsShowAccessButton={setIsShowAccessButton} />}
    </HomeContentWrapper>
  )
}
