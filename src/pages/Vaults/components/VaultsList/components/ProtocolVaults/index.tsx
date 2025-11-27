import { memo } from 'react'
import styled from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { useGetStrategyIconName, useProtocolVaultsData } from 'store/vaults/hooks/useVaultData'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'
import Pending from 'components/Pending'
import { IconBase, IconLinearStrategy1, IconLinearStrategy2, IconLinearStrategy3 } from 'components/Icons'
import { formatNumber } from 'utils/format'
import { toFix } from 'utils/calc'
import VaultData from './components/VaultData'
import Signal from './components/Signal'
import ConfigInfo from './components/ConfigInfo'

const ProtocolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionTitle = styled.div`
  font-size: 26px;
  font-style: normal;
  font-weight: 400;
  line-height: 34px;
  color: ${({ theme }) => theme.textL1};
  span {
    display: inline-block;
    margin-left: 2px;
    color: ${({ theme }) => theme.brand100};
  }
`

const VaultList = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  height: 346px;
`

const VaultCard = styled.div`
  display: flex;
  flex-direction: column;
  width: calc((100% - 24px) / 3);
  height: 100%;
  gap: 2px;
  cursor: pointer;
`

const TopContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  height: 310px;
  padding: 16px;
  background-color: ${({ theme }) => theme.black700};
  .icon-strategy1,
  .icon-strategy2,
  .icon-strategy3 {
    position: absolute;
    font-size: 80px;
    top: 8px;
    right: 8px;
    color: ${({ theme }) => theme.text10};
  }
`

const VaultBaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 82px;
  gap: 8px;
`

const VaultName = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textDark98};
`

const VaultBuilder = styled.div`
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textDark54};
`

const BottomContent = styled.div`
  display: flex;
  width: 100%;
  height: 34px;
  padding: 8px 12px;
  background-color: ${({ theme }) => theme.black800};
`

const ProtocolVaults = memo(() => {
  const strategyIconNameMapping = useGetStrategyIconName()
  const { protocolVaults, isLoadingProtocolVaults } = useProtocolVaultsData()
  const [, setCurrentRouter] = useCurrentRouter()

  const handleViewVault = (vaultId: string) => {
    setCurrentRouter(`${ROUTER.VAULT_DETAIL}?vaultId=${vaultId}`)
  }

  return (
    <ProtocolContainer>
      <SectionTitle>
        <Trans>AI generated Vaults</Trans>
        <span>*</span>
      </SectionTitle>

      {isLoadingProtocolVaults ? (
        <Pending isFetching />
      ) : (
        <VaultList>
          {protocolVaults.map((vault, index) => {
            return (
              <VaultCard key={vault.id} onClick={() => handleViewVault(vault.id)}>
                <TopContent>
                  <IconBase className={strategyIconNameMapping[vault.id]} />
                  <VaultBaseInfo>
                    <VaultName>{vault.name}</VaultName>
                    <VaultBuilder>
                      <span>{vault.raw?.sp_name}</span>
                    </VaultBuilder>
                  </VaultBaseInfo>
                  <VaultData vaultData={vault} />
                  <Signal vaultData={vault} />
                </TopContent>
                <BottomContent>
                  <ConfigInfo vaultData={vault} />
                </BottomContent>
              </VaultCard>
            )
          })}
        </VaultList>
      )}
    </ProtocolContainer>
  )
})

ProtocolVaults.displayName = 'ProtocolVaults'

export default ProtocolVaults
