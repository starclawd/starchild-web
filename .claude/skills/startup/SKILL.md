---
name: startup
description: 项目启动规则。当用户需要启动项目、运行开发环境、执行 yarn start 时使用此技能。
---

# 启动项目规则

在帮助用户启动项目之前，**必须**按顺序执行以下检查。

## 启动步骤

### 1. 检查并切换到正确的开发分支

```bash
# 1. 读取目标分支
TARGET_BRANCH=$(cat .dev-branch | tr -d '[:space:]')

# 2. 获取当前分支
CURRENT_BRANCH=$(git branch --show-current)

# 3. 如果分支不一致，切换到目标分支
if [ "$CURRENT_BRANCH" != "$TARGET_BRANCH" ]; then
  echo "⚠️ 当前分支: $CURRENT_BRANCH，需要切换到: $TARGET_BRANCH"
  git fetch origin
  git checkout $TARGET_BRANCH
  git pull origin $TARGET_BRANCH
fi
```

### 2. 安装项目依赖

```bash
yarn install
```

> ⚠️ 必须使用 `required_permissions: ["all"]`

### 3. 编译国际化文件

```bash
yarn i18n:compile
```

> ⚠️ 必须执行此命令，否则缺失 lingui 编译文件会导致项目报错。

### 4. 检查 Prettier 扩展

确保用户已安装 Prettier 扩展 (`esbenp.prettier-vscode`)，**必须安装 v11.0.0 版本**（新版本在 Cursor 存在兼容性问题）。

### 5. 启动开发服务器

```bash
yarn start
```

---

## DevInspector 使用指南

项目启动后，告知用户 DevInspector 的使用方法：

| 操作              | 说明                                       |
| ----------------- | ------------------------------------------ |
| `Shift + Alt + C` | 开启/关闭检查模式                          |
| 鼠标悬停          | 查看组件名和文件路径                       |
| 点击元素          | 复制组件名，并自动在 Cursor 中打开对应文件 |
| `ESC`             | 退出检查模式                               |

### 工作流程

1. 在浏览器中打开项目页面
2. 按 `Shift + Alt + C` 开启检查模式（右上角会显示 "Inspector ON"）
3. 将鼠标移到需要修改的元素上
4. 点击该元素，Cursor 会自动打开对应的源码文件并定位到具体行

---

## 常见问题

### 项目启动失败

- 确保 Node.js 版本 >= 18
- 删除 `node_modules`，不能删除 `yarn.lock`，重新 `yarn install`

### Prettier 格式化不生效

- 确保安装了 Prettier 扩展，**版本必须是 v11.0.0**
- 检查 `.vscode/settings.json` 中的 `editor.formatOnSave` 是否为 `true`

### DevInspector 不工作

- 确保在开发环境运行（`yarn start`）
- 按 `Shift + Alt + C` 开启检查模式
