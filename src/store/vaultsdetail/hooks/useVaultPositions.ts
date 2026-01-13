import { useGetVaultPositionsQuery, VaultPosition } from 'api/vaults'

// Vault Position hook - 获取所有数据，在前端Table中分页显示
export function useVaultPositions(vaultId: string) {
  const {
    data: positions = [],
    isLoading,
    error,
    refetch,
  } = useGetVaultPositionsQuery(
    { vault_id: vaultId },
    {
      skip: !vaultId, // 当vaultId为空时跳过查询
      refetchOnMountOrArgChange: true,
      pollingInterval: 60000, // 每1分钟轮询一次
    },
  )

  return {
    positions,
    isLoading,
    error,
    refetch,
    totalCount: positions.length,
  }
}
