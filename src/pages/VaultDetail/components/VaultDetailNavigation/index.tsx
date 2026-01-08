import { memo, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import VaultsWalletConnect from 'pages/Vaults/components/VaultsWalletConnect'
import { WALLET_CONNECT_MODE } from 'store/vaults/vaults'
import { IconBase } from 'components/Icons'
import { ANI_DURATION } from 'constants/index'
import { useIsShowStrategyMarket } from 'store/vaultsdetailcache/hooks'

const NavigationContainer = styled.div`
  display: flex;
  align-content: center;
  justify-content: space-between;
  flex-shrink: 0;
  height: 60px;
  padding: 0 20px;
  cursor: pointer;
  border-right: 1px solid ${({ theme }) => theme.black800};
  border-bottom: 1px solid ${({ theme }) => theme.black800};
`

const LeftSection = styled.div<{ $isShowStrategyMarket: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.black0};
  transition: all ${ANI_DURATION}s;
  .icon-fold,
  .icon-stratege-expand {
    font-size: 18px;
    color: ${({ theme }) => theme.black0};
  }
  &:hover {
    opacity: 0.7;
  }
`

const VaultDetailNavigation = memo(() => {
  const [isShowStrategyMarket, setIsShowStrategyMarket] = useIsShowStrategyMarket()

  const toggleStrategyMarket = useCallback(() => {
    setIsShowStrategyMarket(!isShowStrategyMarket)
  }, [isShowStrategyMarket, setIsShowStrategyMarket])

  return (
    <NavigationContainer>
      <LeftSection $isShowStrategyMarket={isShowStrategyMarket} onClick={toggleStrategyMarket}>
        <IconBase className={!isShowStrategyMarket ? 'icon-fold' : 'icon-stratege-expand'} />
        <Trans>Strategy market</Trans>
      </LeftSection>
      <VaultsWalletConnect mode={WALLET_CONNECT_MODE.SHRINK} />
    </NavigationContainer>
  )
})

VaultDetailNavigation.displayName = 'VaultDetailNavigation'

export default VaultDetailNavigation
