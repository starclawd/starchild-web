# Git Hooks

这个目录包含项目的 Git Hooks，用于在提交和推送前进行代码质量检查。

## 包含的 Hooks

### pre-push
在 `git push` 前自动执行以下检查：
1. **代码格式化** (`yarn format`) - 确保代码格式统一
2. **类型检查** (`yarn type-check`) - 确保 TypeScript 代码无类型错误
3. **代码规范检查** (`yarn lint`) - 确保代码符合 ESLint 规范

## 安装

### 方式一：使用 npm scripts（推荐）
```bash
yarn install:hooks
```

### 方式二：手动安装
```bash
./.githooks/install-hooks.sh
```

## 检查内容

### 1. 代码格式化检查
- 执行 `prettier --write .`
- 如果代码格式不规范，会自动修复并阻止推送
- 确保所有代码符合项目的格式规范

### 2. 类型检查
- 执行 `tsc -b --force`
- 如果有 TypeScript 类型错误，会阻止推送
- 确保代码的类型安全

### 3. 代码规范检查
- 执行 `yarn lint`
- 如果有 ESLint 错误或警告，会阻止推送
- 确保代码符合项目的编码规范

## 注意事项

- 这些检查只在 `git push` 时执行，不会影响日常的 `git commit`
- 如果任何检查失败，推送会被阻止，你需要先修复问题再重新推送
- 建议所有开发者都安装这些 hooks 以保持代码质量一致性
