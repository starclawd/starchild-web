---
name: i18n
description: 国际化规则。当需要添加翻译文本、处理多语言、使用 lingui、Trans 组件、useLingui、提取翻译、编译翻译时使用此技能。
---

# 国际化规则 (i18n)

项目使用 **@lingui** 进行国际化处理。

## 基本用法

### 在 JSX 中使用

```typescript
import { Trans } from '@lingui/react/macro'

// ✅ 正确：使用 Trans 组件包裹
<Trans>Strategy</Trans>
<Trans>Log in to view AI responses</Trans>

// ❌ 错误：直接写文本
<span>Strategy</span>
```

### 在 JS 中使用

```typescript
import { useLingui } from '@lingui/react/macro'

function MyComponent() {
  const { t } = useLingui()

  // 在 JS 逻辑中使用 t 函数
  const message = t`Strategy created successfully`

  return <div>{message}</div>
}
```

### 带变量的翻译

```typescript
import { Trans } from '@lingui/react/macro'

// 带变量
<Trans>Hello {username}</Trans>
<Trans>You have {count} messages</Trans>
```

## 翻译文件

```
src/locales/
├── en-US.po    # 英文翻译源文件
├── en-US.json  # 编译后的英文
├── zh-CN.po    # 中文翻译源文件
└── zh-CN.json  # 编译后的中文
```

## 工作流程

### 1. 添加新文本后提取翻译

```bash
yarn extract
```

这会扫描代码中的 `<Trans>` 和 `t\`` 用法，更新 `.po` 文件。

### 2. 编辑翻译文件

在 `src/locales/zh-CN.po` 中添加翻译：

```po
msgid "Strategy"
msgstr "策略"

msgid "Log in"
msgstr "登录"
```

### 3. 编译翻译

```bash
yarn compile
# 或
yarn i18n:compile:local
```

## ⚠️ 注意事项

1. **所有用户可见文本**都必须使用 `<Trans>` 包裹
2. **启动项目前**必须运行 `yarn i18n:compile:local`
3. 占位符文本（如 `placeholder`）也需要翻译
4. 不要翻译代码中的变量名、CSS 类名等
