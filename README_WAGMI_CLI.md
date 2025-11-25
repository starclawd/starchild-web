# Wagmi CLI 使用指南

## 🎯 概述

本项目使用 **Wagmi CLI** 官方工具自动生成类型安全的合约调用 Hooks。这是 Wagmi 官方推荐的最佳实践。

## 🚀 快速开始

如果你想快速了解如何使用，可以直接查看：

1. **配置文件**: `wagmi.config.ts` - 查看如何配置合约
2. **生成的 Hooks**: `src/hooks/contract/useGeneratedHooks.ts` - 查看生成的内容
3. **实际使用示例**: `src/hooks/contract/useUsdcContract.ts` - 查看如何封装使用

**一键生成合约 Hooks:**

```bash
yarn generate
```

## ✨ 优势对比

### ❌ 旧方案（自定义脚本）

- 需要维护自定义代码生成逻辑
- 类型支持不完整
- 需要手动处理 hooks 封装
- 与 Wagmi 版本更新不同步

### ✅ 新方案（Wagmi CLI）

- 官方维护，跟随 Wagmi 版本更新
- 完整的 TypeScript 类型支持
- 自动生成类型安全的 React Hooks
- 支持事件监听、交易模拟等高级功能
- 配置简单，开箱即用

## 📦 安装

```bash
yarn add -D @wagmi/cli
```

## 📁 项目结构

```
src/
├── abis/                    # 合约 ABI 文件
│   └── erc20.json
├── hooks/
│   └── contract/
│       ├── useGeneratedHooks.ts  # Wagmi CLI 生成的文件（自动生成）
│       └── useUsdcContract.ts    # 自定义封装的 Hook
└── ...
```

## ⚙️ 配置

在项目根目录创建 `wagmi.config.ts`:

```typescript
import { defineConfig } from '@wagmi/cli'
import { react } from '@wagmi/cli/plugins'
import type { Abi } from 'viem'
import erc20Abi from './src/abis/erc20.json'

export default defineConfig({
  out: 'src/hooks/contract/useGeneratedHooks.ts',
  contracts: [
    {
      name: 'erc20',
      abi: erc20Abi as Abi,
    },
  ],
  plugins: [
    react(), // 生成 React Hooks
  ],
})
```

## 🚀 使用方法

### 1. 添加 ABI 文件

将合约 ABI 文件放到 `src/abis/` 目录，并在 `wagmi.config.ts` 中配置。

### 2. 生成代码

```bash
yarn generate
```

这会在 `src/hooks/contract/useGeneratedHooks.ts` 中生成所有的 Hooks。

### 3. 在代码中使用

#### 读取合约数据

```typescript
import { useReadErc20Name, useReadErc20BalanceOf } from 'hooks/contract/useGeneratedHooks'

function TokenInfo({ tokenAddress, ownerAddress }) {
  // 读取代币名称（无参数方法）
  const { data: name } = useReadErc20Name({
    address: tokenAddress,
  })

  // 读取余额（有参数方法）
  const { data: balance } = useReadErc20BalanceOf({
    address: tokenAddress,
    args: [ownerAddress],
  })

  return (
    <div>
      <p>代币名称: {name}</p>
      <p>余额: {balance?.toString()}</p>
    </div>
  )
}
```

#### 写入合约数据

```typescript
import { useWriteErc20Transfer } from 'hooks/contract/useGeneratedHooks'
import { useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'

function TransferToken({ tokenAddress }) {
  const { writeContract, data: hash } = useWriteErc20Transfer()

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleTransfer = () => {
    writeContract({
      address: tokenAddress,
      args: ['0x...', parseEther('1.0')], // to, amount
    })
  }

  return (
    <button onClick={handleTransfer} disabled={isLoading}>
      {isLoading ? '转账中...' : '转账'}
    </button>
  )
}
```

#### 监听合约事件

```typescript
import { useWatchErc20TransferEvent } from 'hooks/contract/useGeneratedHooks'

function TransferListener({ tokenAddress }) {
  useWatchErc20TransferEvent({
    address: tokenAddress,
    onLogs: (logs) => {
      console.log('检测到转账:', logs)
    },
  })

  return <div>监听中...</div>
}
```

#### 模拟交易（检查是否会成功）

```typescript
import { useSimulateErc20Transfer, useWriteErc20Transfer } from 'hooks/contract/useGeneratedHooks'
import { parseEther } from 'viem'

function SafeTransfer({ tokenAddress, to }) {
  const { data: simulateData } = useSimulateErc20Transfer({
    address: tokenAddress,
    args: [to, parseEther('1.0')],
  })

  const { writeContract } = useWriteErc20Transfer()

  const handleTransfer = () => {
    if (simulateData?.request) {
      writeContract(simulateData.request)
    }
  }

  return (
    <button onClick={handleTransfer} disabled={!simulateData}>
      安全转账
    </button>
  )
}
```

## 📝 生成的内容

Wagmi CLI 会为每个合约生成以下内容：

### React Hooks

| Hook 类型                         | 用途         | 示例                           |
| --------------------------------- | ------------ | ------------------------------ |
| `useRead{Contract}{Function}`     | 读取合约数据 | `useReadErc20Name()`           |
| `useWrite{Contract}{Function}`    | 写入合约数据 | `useWriteErc20Transfer()`      |
| `useSimulate{Contract}{Function}` | 模拟交易     | `useSimulateErc20Transfer()`   |
| `useWatch{Contract}{Event}Event`  | 监听事件     | `useWatchErc20TransferEvent()` |

### ABI 导出

生成的文件也包含 ABI 常量，可以直接使用：

```typescript
import { erc20Abi } from 'hooks/contract/useGeneratedHooks'

// 可以在 viem 的 getContract 等方法中使用
const contract = getContract({
  address: '0x...',
  abi: erc20Abi,
  client: publicClient,
})
```

## 🔄 工作流程

1. **开发新合约集成**:
   - 将 ABI 文件放到 `src/abis/`
   - 更新 `wagmi.config.ts`，在 `contracts` 数组中添加新合约
   - 运行 `yarn generate`
   - 导入生成的 Hooks 并使用：`import { useReadXxx } from 'hooks/contract/useGeneratedHooks'`

2. **更新现有合约**:
   - 更新 ABI 文件
   - 运行 `yarn generate`
   - 代码会自动更新，TypeScript 会提示需要调整的地方

3. **封装自定义 Hook**:
   - 参考 `src/hooks/contract/useUsdcContract.ts`
   - 在自定义 Hook 中使用生成的 Hooks
   - 添加业务逻辑处理

## 💡 项目实际使用示例

### 自定义 USDC 合约 Hook

参考 `src/hooks/contract/useUsdcContract.ts`：

```typescript
import { useReadErc20BalanceOf, useReadErc20Decimals } from './useGeneratedHooks'

export const useUsdcContract = (address: string, account?: string) => {
  // 使用生成的 Hooks
  const { data: balance } = useReadErc20BalanceOf({
    address: address as `0x${string}`,
    args: account ? [account as `0x${string}`] : undefined,
  })

  const { data: decimals } = useReadErc20Decimals({
    address: address as `0x${string}`,
  })

  // 添加业务逻辑
  const formattedBalance = balance && decimals ? formatUnits(balance, decimals) : '0'

  return {
    balance,
    decimals,
    formattedBalance,
  }
}
```

## 🎓 官方资源

- [Wagmi CLI 文档](https://wagmi.sh/cli/getting-started)
- [Wagmi React Hooks](https://wagmi.sh/react/getting-started)
- [Viem 文档](https://viem.sh/)

## 🆚 对比旧方案

| 特性           | 旧方案（自定义脚本）  | 新方案（Wagmi CLI） |
| -------------- | --------------------- | ------------------- |
| 类型安全       | ⚠️ 部分支持           | ✅ 完整支持         |
| 代码生成       | ⚠️ 需要维护           | ✅ 官方维护         |
| 功能完整性     | ⚠️ 基础功能           | ✅ 完整功能         |
| 事件监听       | ❌ 不支持             | ✅ 支持             |
| 交易模拟       | ❌ 不支持             | ✅ 支持             |
| Wagmi 版本兼容 | ⚠️ 需要手动适配       | ✅ 自动兼容         |
| 学习成本       | ⚠️ 需要理解自定义逻辑 | ✅ 遵循官方文档     |

## ⚠️ 注意事项

1. **不要直接修改生成的文件** (`useGeneratedHooks.ts`)
   - 该文件由 `yarn generate` 自动生成
   - 任何手动修改都会在下次生成时被覆盖
   - 如需自定义逻辑，请创建新的 Hook 文件（如 `useUsdcContract.ts`）

2. **TypeScript 类型提示**
   - 生成的 Hooks 提供完整的类型推断
   - 参数类型错误会在编译时被捕获
   - 充分利用 IDE 的智能提示功能

3. **链式调用与多合约**
   - 可以在一个组件中使用多个生成的 Hooks
   - 合理组织自定义 Hooks 以提高代码复用性

## ✅ 结论

**建议使用 Wagmi CLI 官方方案**，它提供了：

- 更好的类型安全
- 更完整的功能
- 更少的维护成本
- 更好的社区支持
