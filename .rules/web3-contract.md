# Web3 合约调用规则

> 详细文档：[README_WAGMI_CLI.md](../README_WAGMI_CLI.md)

## 使用 Wagmi CLI 生成合约 Hooks

### 快速开始

```bash
# 生成合约 Hooks
yarn generate
```

### 目录结构

```
src/
├── abis/                         # 合约 ABI 文件（JSON）
│   └── erc20.json
└── hooks/contract/
    ├── useGeneratedHooks.ts      # 自动生成（禁止手动修改）
    └── useUsdcContract.ts        # 自定义封装 Hook
```

### 新增合约步骤

1. 将 ABI 文件放到 `src/abis/` 目录
2. 更新 `wagmi.config.ts` 配置：

```typescript
import newContractAbi from './src/abis/newContract.json'

export default defineConfig({
  contracts: [
    // 添加新合约
    { name: 'newContract', abi: newContractAbi as Abi },
  ],
})
```

3. 运行 `yarn generate`
4. 从 `hooks/contract/useGeneratedHooks` 导入使用

### 生成的 Hooks 命名规则

| Hook 类型 | 用途 | 示例 |
| --------- | ---- | ---- |
| `useRead{Contract}{Function}` | 读取合约 | `useReadErc20Name()` |
| `useWrite{Contract}{Function}` | 写入合约 | `useWriteErc20Transfer()` |
| `useSimulate{Contract}{Function}` | 模拟交易 | `useSimulateErc20Transfer()` |
| `useWatch{Contract}{Event}Event` | 监听事件 | `useWatchErc20TransferEvent()` |

### 使用示例

#### 读取数据

```typescript
import { useReadErc20BalanceOf } from 'hooks/contract/useGeneratedHooks'

const { data: balance } = useReadErc20BalanceOf({
  address: tokenAddress,
  args: [ownerAddress],
})
```

#### 写入数据

```typescript
import { useWriteErc20Transfer } from 'hooks/contract/useGeneratedHooks'

const { writeContract, data: hash } = useWriteErc20Transfer()

writeContract({
  address: tokenAddress,
  args: [toAddress, parseEther('1.0')],
})
```

#### 封装自定义 Hook

```typescript
// src/hooks/contract/useMyContract.ts
import { useReadErc20BalanceOf } from './useGeneratedHooks'

export const useMyContract = (address: string) => {
  const { data: balance } = useReadErc20BalanceOf({
    address: address as `0x${string}`,
    args: [account as `0x${string}`],
  })

  return { balance }
}
```

### ⚠️ 注意事项

1. **禁止修改** `useGeneratedHooks.ts`，该文件由 `yarn generate` 自动生成
2. 自定义逻辑请创建新的 Hook 文件
3. 地址类型需转换为 `` `0x${string}` ``
