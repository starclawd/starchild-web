import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import type { Abi } from 'viem'
import erc20Abi from './src/abis/erc20.json'
import orderlyVaultAbi from './src/abis/orderly-vault.json'
import vaultAbi from './src/abis/vault.json'

/**
 * Wagmi CLI 配置
 *
 * 官方工具自动生成合约 Hooks
 * - 生成的文件位于：src/generated/
 * - 自动生成索引文件方便导入
 *
 * 使用方法:
 * 1. 将 ABI 文件放到 src/abis/ 目录
 * 2. 在下面的 contracts 数组中添加配置
 * 3. 运行: yarn wagmi generate
 * 4. 导入使用: import { useReadErc20Name } from 'hooks/contract/useGeneratedHooks'
 */
export default defineConfig({
  out: 'src/hooks/contract/useGeneratedHooks.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi as Abi,
    },
    {
      name: 'orderlyVault',
      abi: orderlyVaultAbi as Abi,
    },
    {
      name: 'vault',
      abi: vaultAbi as Abi,
    },
  ],
  plugins: [react()],
})
