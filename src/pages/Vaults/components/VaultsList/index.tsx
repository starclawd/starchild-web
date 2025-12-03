import styled from 'styled-components'
import AiGeneratedVaults from './components/AiGeneratedVaults'
// import AiPoweredVaults from './components/AiPoweredVaults'
// import VaultsTabList from './components/VaultsTabList'
// import { useVaultsTabIndex } from 'store/vaults/hooks'

const VaultsListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

export default function VaultsList() {
  // const [vaultsTabIndex] = useVaultsTabIndex()
  return (
    <VaultsListWrapper>
      {/* <VaultsTabList /> */}
      <AiGeneratedVaults />
      {/* {vaultsTabIndex !== 2 && <AiGeneratedVaults />} */}
      {/* {vaultsTabIndex !== 1 && <AiPoweredVaults />} */}
    </VaultsListWrapper>
  )
}
