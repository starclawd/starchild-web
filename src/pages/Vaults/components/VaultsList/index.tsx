import styled from 'styled-components'
import ProtocolVaults from './components/ProtocolVaults'
import CommunityVaults from './components/CommunityVaults'
import VaultsTabList from './components/VaultsTabList'
import { useVaultsTabIndex } from 'store/vaults/hooks'

const VaultsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

export default function VaultsList() {
  const [vaultsTabIndex] = useVaultsTabIndex()
  return (
    <VaultsListWrapper>
      <VaultsTabList />
      {vaultsTabIndex !== 2 && <ProtocolVaults />}
      {vaultsTabIndex !== 1 && <CommunityVaults />}
    </VaultsListWrapper>
  )
}
