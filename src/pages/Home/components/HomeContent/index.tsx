import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AccessButton from './components/AccessButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin } from 'store/login/hooks'
import NftMintAndBind from './components/NftMintAndBind'
import { isFromTGRedirection } from 'store/login/utils'

const HomeContentWrapper = styled.div`
  display: flex;
`

export default function HomeContent() {
  const isLogin = useIsLogin()
  const { login } = useParsedQueryString()
  const isFromTeleRedirection = isFromTGRedirection()
  const [isShowAccessButton, setIsShowAccessButton] = useState(true)
  useEffect(() => {
    if (login === '1' || isFromTeleRedirection) {
      setIsShowAccessButton(false)
    }
  }, [login, isFromTeleRedirection])
  if (isShowAccessButton || !isLogin) {
    return (
      <HomeContentWrapper>
        <AccessButton setIsShowAccessButton={setIsShowAccessButton} />
      </HomeContentWrapper>
    )
  }
  return (
    <HomeContentWrapper>
      <NftMintAndBind />
    </HomeContentWrapper>
  )
}
