# Telegram WebApp 自动登录功能

## 功能概述

这个功能允许用户通过 Telegram Inline Keyboard 打开网页应用时，自动获取 Telegram 用户信息并完成登录，无需手动点击登录按钮。

## 实现原理

1. **检测环境**: 当页面加载时，检测是否在 Telegram WebApp 环境中运行
2. **获取用户信息**: 从 `window.Telegram.WebApp.initDataUnsafe` 中获取用户信息
3. **验证数据**: 验证用户数据的完整性和有效性
4. **自动登录**: 使用获取到的用户信息调用 `triggerGetAuthToken` 进行登录

## 文件结构

```
src/
├── utils/telegramWebApp.ts         # Telegram WebApp 工具函数
├── hooks/useTelegramWebAppLogin.ts # 自动登录 Hook
└── pages/App.tsx                   # 集成到主应用
```

## 核心文件说明

### 1. `utils/telegramWebApp.ts`

提供了一系列工具函数：

- `isTelegramWebApp()`: 检测是否在 Telegram WebApp 环境中
- `getTelegramWebAppUser()`: 获取 Telegram 用户信息
- `validateTelegramWebAppData()`: 验证数据有效性
- `isFromTelegramInlineKeyboard()`: 检测是否来自 Inline Keyboard
- `debugTelegramWebApp()`: 调试函数，输出详细信息

### 2. `hooks/useTelegramWebAppLogin.ts`

自定义 Hook，提供以下功能：

- 自动检测 Telegram WebApp 环境
- 在满足条件时自动触发登录
- 提供手动登录方法
- 错误处理和状态管理

### 3. `pages/App.tsx` 集成

在主应用中集成了自动登录功能，包括：

- 错误提示（Toast）
- 调试信息输出
- 登录成功/失败回调

## 使用方式

### 基本用法

```tsx
import { useTelegramWebAppLogin } from 'hooks/useTelegramWebAppLogin'

function MyComponent() {
  const { isTelegramWebApp, isFromInlineKeyboard, isAutoLogging, error, manualLogin } = useTelegramWebAppLogin({
    autoLogin: true,
    onlyFromInlineKeyboard: true,
    onLoginSuccess: () => {
      console.log('登录成功')
    },
    onLoginError: (error) => {
      console.error('登录失败:', error)
    },
  })

  return (
    <div>
      {isTelegramWebApp && <p>在 Telegram WebApp 中运行</p>}
      {isAutoLogging && <p>正在自动登录...</p>}
      {error && <p>错误: {error.message}</p>}
    </div>
  )
}
```

### 配置选项

```tsx
interface UseTelegramWebAppLoginOptions {
  autoLogin?: boolean // 是否启用自动登录，默认 true
  onlyFromInlineKeyboard?: boolean // 是否只在来自 Inline Keyboard 时自动登录，默认 true
  onLoginSuccess?: () => void // 登录成功回调
  onLoginError?: (error: Error) => void // 登录失败回调
}
```

## 触发条件

自动登录会在以下条件都满足时触发：

1. ✅ 在 Telegram WebApp 环境中运行
2. ✅ 用户尚未登录
3. ✅ 来自 Telegram Inline Keyboard（如果启用了 `onlyFromInlineKeyboard`）
4. ✅ Telegram 用户数据验证通过
5. ✅ 尚未尝试过自动登录

## 安全机制

1. **数据验证**: 验证 Telegram 用户数据的完整性
2. **时间检查**: 检查认证数据是否在有效期内（24小时）
3. **重复防护**: 避免重复尝试登录
4. **错误处理**: 完善的错误捕获和处理机制

## 调试功能

在开发环境中，可以使用以下功能进行调试：

```tsx
import { debugTelegramWebApp, getTelegramWebAppInfo } from 'utils/telegramWebApp'

// 在控制台输出详细调试信息
debugTelegramWebApp()

// 获取环境信息对象
const info = getTelegramWebAppInfo()
console.log(info)
```

## 常见问题

### 1. 自动登录没有触发

检查以下条件：

- 是否在 Telegram WebApp 环境中？
- URL 中是否有相关的启动参数？
- 用户是否已经登录？
- 控制台是否有错误信息？

### 2. 登录失败

可能的原因：

- Telegram 用户数据无效
- 网络连接问题
- 服务端认证失败
- 用户数据已过期

### 3. 调试信息

在开发环境中，打开控制台查看详细的调试信息，包括：

- Telegram WebApp 环境检测结果
- 用户信息和验证状态
- 登录流程的每个步骤

## 注意事项

1. 这个功能只在 Telegram WebApp 环境中有效
2. 需要确保 Telegram Bot 已正确配置
3. 用户数据的有效期为 24 小时
4. 自动登录只会尝试一次，避免无限循环
5. 在生产环境中，调试信息不会输出到控制台
