import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AccessButton from './components/AccessButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin } from 'store/login/hooks'
import { useAppKitAccount } from '@reown/appkit/react'
import ConnectWallet from './components/ConnectWallet'

const HomeContentWrapper = styled.div`
  display: flex;
`

export default function HomeContent() {
  const isLogin = useIsLogin()
  const { login } = useParsedQueryString()
  const [isShowAccessButton, setIsShowAccessButton] = useState(true)
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  useEffect(() => {
    if (login === '1') {
      setIsShowAccessButton(false)
    }
  }, [login])
  if (isShowAccessButton) {
    return (
      <HomeContentWrapper>
        <AccessButton setIsShowAccessButton={setIsShowAccessButton} />
      </HomeContentWrapper>
    )
  }
  return <HomeContentWrapper>{isLogin && !address && <ConnectWallet />}</HomeContentWrapper>
}
