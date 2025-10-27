import { useEffect, useState } from 'react'
import styled from 'styled-components'
import AccessButton from './components/AccessButton'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { useIsLogin } from 'store/login/hooks'
import NftMintAndBind from './components/NftMintAndBind'

const HomeContentWrapper = styled.div`
  display: flex;
`

export default function HomeContent() {
  const isLogin = useIsLogin()
  if (!isLogin) {
    return (
      <HomeContentWrapper>
        <AccessButton />
      </HomeContentWrapper>
    )
  }
  return (
    <HomeContentWrapper>
      <NftMintAndBind />
    </HomeContentWrapper>
  )
}
