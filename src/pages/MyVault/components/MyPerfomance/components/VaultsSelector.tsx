import { memo, useMemo, useEffect } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { vm } from 'pages/helper'
import { useChartVaultId } from 'store/myvault/hooks/useChartVaultId'
import { useVaultsData } from 'store/vaults/hooks'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { t } from '@lingui/core/macro'

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  min-width: 170px;

  .select-border-wrapper {
    height: 28px;
    border-radius: 4px;
  }

  .vault-selector-pop {
    border-radius: 4px;
    span {
      font-size: 12px;
      line-height: 18px;
      font-weight: 600;
      color: ${({ theme }) => theme.textL2};
    }
    li:hover {
      border-radius: 4px;
    }
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 100%;
    `}
`

const SelectValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  color: ${({ theme }) => theme.textL3};
  margin-right: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(28)};
      font-size: ${vm(12)};
      line-height: ${vm(18)};
      margin-right: ${vm(8)};
      max-width: ${vm(100)};
    `}
`

const VaultsSelector = memo(() => {
  const theme = useTheme()
  const [chartVaultId, setChartVaultId] = useChartVaultId()
  const { allVaults, isLoadingVaults } = useVaultsData()

  // 创建选择器选项
  const vaultOptions: DataType[] = useMemo(() => {
    if (!allVaults.length) {
      return []
    }

    return allVaults.map((vault) => ({
      value: vault.vault_id,
      text: vault.vault_name,
      clickCallback: () => setChartVaultId(vault.vault_id),
    }))
  }, [allVaults, setChartVaultId])

  // 默认选择第一个金库
  useEffect(() => {
    if (!isLoadingVaults && allVaults.length > 0 && !chartVaultId) {
      setChartVaultId(allVaults[0].vault_id)
    }
  }, [isLoadingVaults, allVaults, chartVaultId, setChartVaultId])

  // 获取选中的金库名称
  const getSelectedVaultName = () => {
    if (isLoadingVaults || !allVaults.length) {
      return t`No vaults`
    }

    const selectedVault = allVaults.find((vault) => vault.vault_id === chartVaultId)
    return selectedVault?.vault_name || allVaults[0]?.vault_name || t`No vaults`
  }

  // 如果没有数据或正在加载，显示禁用状态
  if (isLoadingVaults || !vaultOptions.length) {
    return (
      <SelectorContainer>
        <SelectValue>{getSelectedVaultName()}</SelectValue>
      </SelectorContainer>
    )
  }

  return (
    <SelectorContainer>
      <Select
        value={chartVaultId || ''}
        dataList={vaultOptions}
        triggerMethod={TriggerMethod.CLICK}
        placement='bottom-end'
        hideExpand={false}
        iconExpandStyle={{
          color: theme.textL3,
        }}
        alignPopWidth={true}
        popClass='vault-selector-pop'
        borderWrapperBg='transparent'
      >
        <SelectValue>{getSelectedVaultName()}</SelectValue>
      </Select>
    </SelectorContainer>
  )
})

VaultsSelector.displayName = 'VaultsSelector'

export default VaultsSelector
