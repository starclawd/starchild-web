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
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  padding: 12px 20px;

  span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      flex-direction: column;
      gap: ${vm(16)};
      align-items: flex-start;
      padding: ${vm(16)} 0;
      margin-bottom: ${vm(20)};
    `}
`

const WalletSection = styled.div`
  ${({ theme }) =>
    theme.isMobile &&
    `
    width: 100%;
  `}
`

const VaultDetailNavigation = memo(() => {
  const [, setCurrentRouter] = useCurrentRouter()
  const theme = useTheme()

  const handleBack = useCallback(() => {
    setCurrentRouter(ROUTER.VAULTS)
  }, [setCurrentRouter])

  return (
    <NavigationContainer>
      <span>
        <IconButton icon='icon-chat-back' onClick={handleBack} color={theme.textL2} />
        <Trans>Vibe trading</Trans>
      </span>
      <WalletSection>
        <VaultsWalletConnect />
      </WalletSection>
    </NavigationContainer>
  )
})

VaultDetailNavigation.displayName = 'VaultDetailNavigation'

export default VaultDetailNavigation
