import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'
import { memo, useCallback } from 'react'
import { useConnectWalletModalToggle } from 'store/application/hooks'
import styled from 'styled-components'

const UnLoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 56px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  span:first-child {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
  }
`

const LoginButton = styled(ButtonCommon)`
  height: 32px;
  width: fit-content;
`

export default memo(function UnLogin() {
  const toggleConnectWalletModal = useConnectWalletModalToggle()
  const handleLogin = useCallback(() => {
    toggleConnectWalletModal()
  }, [toggleConnectWalletModal])
  return (
    <UnLoginWrapper>
      <span>
        <Trans>Log in to view AI responses</Trans>
      </span>
      <LoginButton onClick={handleLogin}>
        <Trans>Log in</Trans>
      </LoginButton>
    </UnLoginWrapper>
  )
})
