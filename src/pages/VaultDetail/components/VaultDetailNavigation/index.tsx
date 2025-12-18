import { memo, useCallback } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { IconButton } from 'components/Button'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import { vm } from 'pages/helper'

const NavigationContainer = styled.div`
  display: flex;
  height: 49px;
  padding: 0 8px;
`

const InnerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
`

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL2};
  .icon-chat-back {
    font-size: 24px;
    color: ${({ theme }) => theme.textL2};
  }
`

const VaultDetailNavigation = memo(() => {
  const [, setCurrentRouter] = useCurrentRouter()
  const theme = useTheme()

  const handleBack = useCallback(() => {
    setCurrentRouter(ROUTER.VAULTS)
  }, [setCurrentRouter])

  return (
    <NavigationContainer>
      <InnerContent>
        <LeftSection>
          <IconButton icon='icon-chat-back' onClick={handleBack} color={theme.textL2} />
          <Trans>Vibe trading</Trans>
        </LeftSection>
        <VaultsWalletConnect isCreateStrategy mode='compact' />
      </InnerContent>
    </NavigationContainer>
  )
})

VaultDetailNavigation.displayName = 'VaultDetailNavigation'

export default VaultDetailNavigation
