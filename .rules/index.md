# 项目规则索引

> 根据用户需求，读取对应的规则文件。

## 规则文件索引

| 用户意图                         | 读取规则文件              |
| -------------------------------- | ------------------------- |
| 启动项目、运行项目、开发环境     | `.rules/startup.md`       |
| 执行命令、安装依赖、权限问题     | `.rules/permissions.md`   |
| 新增 API、调用接口、请求配置     | `.rules/api.md`           |
| 创建 store、状态管理、业务 hooks | `.rules/store.md`         |
| 创建组件、修改组件、使用公共组件 | `.rules/components.md`    |
| 样式修改、主题颜色、公共样式     | `.rules/styles.md`        |
| 文件放哪里、目录结构、类型定义   | `.rules/directories.md`   |
| 代码风格、命名规范、最佳实践     | `.rules/code-style.md`    |
| Web3 合约调用、区块链交互        | `.rules/web3-contract.md` |
| HTTPS 配置、本地域名、SSL 证书   | `.rules/https.md`         |
| WebSocket 连接、实时数据订阅     | `.rules/websocket.md`     |
| 图标处理、iconfont、SVG 图标     | `.rules/iconfont.md`      |

---

## 通用规则（始终遵循）

### 包管理器

- **必须使用 `yarn`**，禁止使用 npm
- 添加依赖: `yarn add <package>`
- 添加开发依赖: `yarn add -D <package>`

### 技术栈

- React 19 + TypeScript
- Vite 构建工具
- styled-components 样式方案
- Redux Toolkit + React Redux 状态管理
- @lingui 国际化 (i18n)
