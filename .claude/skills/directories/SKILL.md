---
name: directories
description: 项目目录结构。当需要了解文件放哪里、目录结构、类型定义位置时使用此技能。
---

# 项目目录结构

## 目录概览

| 目录              | 用途                       | 可修改                    |
| ----------------- | -------------------------- | ------------------------- |
| `src/components/` | 公共组件                   | ✅                        |
| `src/constants/`  | 常量配置                   | ✅                        |
| `src/hooks/`      | 通用 Hooks                 | ✅                        |
| `src/store/`      | 状态管理、业务 Hooks、类型 | ✅                        |
| `src/styles/`     | 公共样式                   | ✅                        |
| `src/types/`      | 公共类型定义               | ✅                        |
| `src/utils/`      | 工具方法                   | ✅                        |
| `src/theme/`      | 主题颜色配置               | ⛔ 只读 (见 GLOBAL_RULES) |

---

## 常量目录 (`src/constants/`)

**固定变量、配置常量必须放在此目录：**

| 文件名                 | 用途                     |
| ---------------------- | ------------------------ |
| `index.ts`             | 通用常量（如动画时长等） |
| `chainInfo.ts`         | 区块链网络配置           |
| `locales.ts`           | 国际化语言配置           |
| `timezone.ts`          | 时区配置                 |
| `vaultContractInfo.ts` | Vault 合约配置           |
| `brokerHash.ts`        | Broker 哈希配置          |

---

## 通用 Hooks (`src/hooks/`)

**通用的、与业务无关的 hooks 放在此目录：**

| Hook 名称              | 用途              |
| ---------------------- | ----------------- |
| `useCopyContent`       | 复制内容到剪贴板  |
| `useWindowSize`        | 监听窗口尺寸变化  |
| `useWindowVisible`     | 监听页面可见性    |
| `usePrevious`          | 获取上一次的值    |
| `useOnClickOutside`    | 点击外部区域检测  |
| `usePagination`        | 分页逻辑          |
| `useParsedQueryString` | 解析 URL 查询参数 |
| `useScrollDetection`   | 滚动检测          |
| `useSleep`             | 延时等待          |
| `useAddUrlParam`       | 添加 URL 参数     |
| `useAccountId`         | 获取账户 ID       |
| `useActiveLocale`      | 获取当前语言      |

> ⚠️ 业务相关的 hooks 放在 `src/store/*/hooks/` 目录下。

---

## 工具方法 (`src/utils/`)

**通用工具函数放在此目录，新增工具函数也放这里：**

| 文件名            | 用途                       |
| ----------------- | -------------------------- |
| `format.ts`       | 格式化工具（数字、日期等） |
| `calc.ts`         | 计算工具                   |
| `common.ts`       | 通用工具方法               |
| `url.ts`          | URL 处理工具               |
| `timezone.ts`     | 时区处理                   |
| `imageUtils.ts`   | 图片处理工具               |
| `chartUtils.ts`   | 图表工具                   |
| `userAgent.ts`    | 用户代理检测               |
| `handleError.ts`  | 错误处理                   |
| `eventEmitter.ts` | 事件发射器                 |

```typescript
// 使用示例
import { formatNumber, formatPercent } from 'utils/format'
import { isLocalEnv } from 'utils/url'
```

---

## 类型定义

| 类型分类     | 存放位置                           | 示例                    |
| ------------ | ---------------------------------- | ----------------------- |
| 全局通用类型 | `src/types/global.d.ts`            | Window 扩展、全局声明等 |
| 业务类型     | `src/store/[模块名]/[模块名].d.ts` | `vaults.d.ts`           |
| 公共组件类型 | `src/components/[组件名]/types.ts` | `types.ts`              |
