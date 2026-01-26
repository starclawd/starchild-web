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
fi
```

### 2. 拉取最新代码

> ⚠️ **必须执行**：每次启动前、切换分支后，都需要拉取最新代码，避免代码冲突。

```bash
git pull
```

### 3. 安装项目依赖

```bash
yarn install
```

> ⚠️ 必须使用 `required_permissions: ["all"]`

### 4. 编译国际化文件

```bash
yarn i18n:compile:local
```

> ⚠️ 必须执行此命令，否则缺失 lingui 编译文件会导致项目报错。

### 5. 检查 Prettier 扩展

确保用户已安装 Prettier 扩展 (`esbenp.prettier-vscode`)，**必须安装 v11.0.0 版本**（新版本在 Cursor 存在兼容性问题）。

### 6. 启动开发服务器

```bash
yarn start
```

---

## 推荐安装 Pencil 扩展

项目启动后，推荐用户安装 **Pencil** 扩展，可以将 UI 设计稿转换为代码。

### Pencil 功能介绍

| 功能         | 说明                                       |
| ------------ | ------------------------------------------ |
| 设计稿转代码 | 将 Figma 等设计稿直接转换为 React 组件代码 |
| 可视化编辑   | 在 Cursor 中可视化编辑 `.pen` 设计文件     |
| AI 辅助生成  | 结合 AI 自动生成高保真代码                 |
| 组件识别     | 自动识别设计稿中的组件结构                 |

### 安装步骤

1. **安装 Pencil 扩展**
   - 在 Cursor 扩展商店搜索 `Pencil`
   - 点击安装

2. **配置 MCP 服务**
   - 打开 Cursor 设置 → Features → MCP Servers
   - 添加 Pencil MCP 服务器配置

3. **验证安装**
   - 重启 Cursor
   - 创建或打开 `.pen` 文件测试

### 使用流程

```
1. 从 Figma 导出设计稿或创建 .pen 文件
2. 在 Cursor 中打开 .pen 文件
3. 使用 AI 对话生成代码："把这个设计转为 React 组件"
4. Pencil 自动生成 styled-components 代码
```

### 与项目集成

| 设计元素 | 处理方式                                       |
| -------- | ---------------------------------------------- |
| 单色图标 | 保存到 `src/assets/icons/` → 运行 `yarn icons` |
| 多色图标 | 保存到 `src/assets/[业务目录]/`                |
| 组件代码 | 按项目规范生成，使用 styled-components         |

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
