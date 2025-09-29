import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import AccessButton from './components/AccessButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin } from 'store/login/hooks'
import { useAppKitAccount } from '@reown/appkit/react'
import ConnectWallet from './components/ConnectWallet'
import FollowOnTelegram from './components/FollowOnTelegram'
import JoinWaitlist from './components/JoinWaitlist'
import NftMintAndBind from './components/NftMintAndBind'
import { useCandidateStatus } from 'store/home/hooks'
import { isFromTGRedirection } from 'store/login/utils'

const HomeContentWrapper = styled.div`
  display: flex;
`

export default function HomeContent() {
  const isLogin = useIsLogin()
  const { login } = useParsedQueryString()
  const isFromTeleRedirection = isFromTGRedirection()
  const [{ inWhitelist, inWaitList }] = useCandidateStatus()
  const [isShowAccessButton, setIsShowAccessButton] = useState(true)
  const { address } = useAppKitAccount({ namespace: 'eip155' })
  const needConnectWallet = useMemo(() => {
    return isLogin && !address
  }, [isLogin, address])
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
      {needConnectWallet ? (
        <ConnectWallet />
      ) : inWhitelist ? (
        <NftMintAndBind />
      ) : inWaitList ? (
        <FollowOnTelegram />
      ) : (
        <JoinWaitlist />
      )}
    </HomeContentWrapper>
  )
}
