import { Trans } from '@lingui/react/macro'
import MoveTabList, { MoveType } from 'components/MoveTabList'
import { useCallback, useMemo } from 'react'
import { useVaultsTabIndex } from 'store/vaults/hooks'
import styled from 'styled-components'

const VaultsTabListWrapper = styled.div`
  display: flex;
  .move-tab-item {
    height: 42px;
    color: ${({ theme }) => theme.textL3};
    &.active {
      color: ${({ theme }) => theme.textL1};
    }
  }
  .active-indicator {
    height: 42px;
  }
`

export default function VaultsTabList() {
  const [vaultsTabIndex, setVaultsTabIndex] = useVaultsTabIndex()
  const handleTabClick = useCallback(
    (index: number) => {
      setVaultsTabIndex(index)
    },
    [setVaultsTabIndex],
  )
  const tabList = useMemo(
    () => [
      {
        key: 0,
        text: <Trans>All</Trans>,
        clickCallback: () => handleTabClick(0),
      },
      {
        key: 1,
        text: <Trans>AI generated Vaults</Trans>,
        clickCallback: () => handleTabClick(1),
      },
      {
        key: 2,
        text: <Trans>AI powered Vaults</Trans>,
        clickCallback: () => handleTabClick(2),
      },
    ],
    [handleTabClick],
  )
  return (
    <VaultsTabListWrapper>
      <MoveTabList moveType={MoveType.LINE} tabList={tabList} tabIndex={vaultsTabIndex} />
    </VaultsTabListWrapper>
  )
}
