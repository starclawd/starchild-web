# Holomind Web

一个基于 React 的现代化加密货币交易分析平台，提供 AI 智能交易建议、回测分析、投资组合管理等功能。

## 项目简介

Holomind Web 是一个集成了 AI 技术的加密货币交易分析平台，为用户提供：

- 🤖 **AI 智能交易** - 基于机器学习的交易建议和策略分析
- 📊 **回测分析** - 历史数据回测，验证交易策略有效性
- 💰 **投资组合管理** - 多币种投资组合跟踪和分析
- 📈 **实时行情** - 集成多个交易所的实时价格数据
- 🔍 **市场洞察** - 深度市场分析和趋势预测
- 📱 **响应式设计** - 支持桌面端和移动端

## 技术栈

### 前端框架
- **React 19** - 现代化的前端框架
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 快速的构建工具
- **React Router** - 前端路由管理

### 状态管理
- **Redux Toolkit** - 状态管理
- **React Redux** - React 状态绑定
- **Redux Persist** - 状态持久化

### UI 组件
- **Styled Components** - CSS-in-JS 样式方案
- **Chart.js** - 图表库
- **Lightweight Charts** - 轻量级金融图表
- **React ChartJS 2** - React Chart.js 集成

### 国际化
- **Lingui** - 完整的国际化解决方案
- **Make Plural** - 复数规则处理

### 工具库
- **Day.js** - 日期处理
- **BigNumber.js** - 大数计算
- **Axios** - HTTP 请求
- **WebSocket** - 实时数据通信

### 开发工具
- **ESLint** - 代码规范检查
- **Prettier** - 代码格式化工具
- **Sass** - CSS 预处理器
- **Cross-env** - 跨平台环境变量

## 快速开始

### 环境要求
- Node.js >= v22.14.0
- Yarn >= 10.9.2

### 环境配置
复制环境变量示例文件：
```bash
cp .env.example .env
```

配置必要的环境变量：
- `VITE_TG_AUTH_TOKEN` - Telegram 认证令牌（本地开发用）

**重要说明**：`VITE_TG_AUTH_TOKEN` 主要用于本地开发时的 Telegram 登录。由于 Telegram 无法在本地环境直接获取用户 token，需要在本地开发时手动配置此 token 以进行登录测试。token直接从测试网复制即可

### 安装依赖
```bash
yarn install
```

### 启动开发服务器
```bash
yarn start
```

项目将在 `http://localhost:6066` 启动

### 构建项目
```bash
# 测试环境构建
yarn build:test

# 生产环境构建
yarn build
```

### 其他命令
```bash
# 代码检查
yarn lint

# 类型检查
yarn type-check

# 代码格式化
yarn format

# 检查代码格式
yarn format:check

# 格式化 src 目录
yarn format:src

# 国际化提取
yarn extract

# 编译国际化文件
yarn compile

# 预览构建结果
yarn preview
```

## 项目结构

```
src/
├── api/                    # API 接口层
├── assets/                 # 静态资源
│   ├── agent/             # 智能体相关图标
│   ├── chains/            # 区块链图标
│   ├── chat/              # 聊天相关图标
│   ├── icons/             # 通用图标资源
│   ├── insights/          # 市场洞察图片
│   ├── media/             # 媒体文件
│   └── png/               # PNG 图片资源
├── components/             # 公共组件
├── constants/              # 常量定义
├── hooks/                  # 自定义 Hooks
├── locales/               # 国际化文件
├── pages/                 # 页面组件
│   ├── AgentDetail/       # 智能体详情
│   ├── AgentHub/          # 智能体市场
│   ├── Chat/              # AI 聊天交互
│   ├── Connect/           # 连接页面
│   ├── Insights/          # 市场洞察
│   ├── Mobile/            # 移动端页面
│   ├── MyAgent/           # 我的智能体
│   └── Portfolio/         # 投资组合
├── store/                 # Redux 状态管理
├── styles/                # 全局样式
├── theme/                 # 主题配置
├── types/                 # TypeScript 类型定义
└── utils/                 # 工具函数
```

## 核心功能

### AI 交易助手
- 智能对话界面
- 交易策略建议
- 市场分析报告
- 语音交互支持

### 回测分析
- 历史数据回测
- 策略性能评估
- 风险收益分析
- 可视化图表展示

### 投资组合
- 多币种资产跟踪
- 交易历史记录
- 收益分析
- 风险评估

### 市场洞察
- 实时行情数据
- 技术指标分析
- 新闻资讯整合
- 市场趋势预测

## 开发规范

### 代码风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式

### 组件开发
- 优先使用函数式组件和 Hooks
- 使用 TypeScript 定义组件 Props
- 遵循单一职责原则

### 状态管理
- 使用 Redux Toolkit 简化状态管理
- 按功能模块组织 Store
- 使用 RTK Query 处理 API 请求

## 🚨 安全开发警示

### 外链安全规范

#### 1. HTML 标签外链处理
所有的 `<a>` 标签指向外部链接时，**必须**添加安全属性：

```html
<!-- ✅ 正确写法 -->
<a href="https://example.com" rel="noopener noreferrer" target="_blank">
  外部链接
</a>

<!-- ❌ 错误写法 -->
<a href="https://example.com" target="_blank">
  外部链接
</a>
```

**原因**：
- `rel="noopener"` - 防止新页面获取原页面的 `window.opener` 引用，避免安全漏洞
- `rel="noreferrer"` - 防止向目标页面发送 referrer 信息，保护用户隐私

#### 2. JavaScript 外链跳转
所有通过 JavaScript 处理的外链跳转，**必须**使用项目提供的安全函数：

```typescript
// ✅ 正确写法
import { goOutPageDirect } from 'src/utils/url'

// 跳转到外部页面
const handleExternalLink = () => {
  goOutPageDirect('https://example.com')
}

// ❌ 错误写法
const handleExternalLink = () => {
  window.open('https://example.com', '_blank')
  // 或
  window.location.href = 'https://example.com'
}
```

**`goOutPageDirect` 函数的安全特性**：
- 自动添加 `noopener` 和 `noreferrer` 属性
- 内置 URL 验证和清理
- 防止 JavaScript 注入攻击
- 统一的外链处理逻辑

#### 3. 安全检查清单

在代码审查时，请确保：

- [ ] 所有 `<a>` 标签的外链都包含 `rel="noopener noreferrer"`
- [ ] 所有 JS 外链跳转都使用 `goOutPageDirect` 函数
- [ ] 外链 URL 来源可信，避免用户输入的未验证 URL
- [ ] 动态生成的外链经过适当的编码和验证

#### 4. 常见安全风险

**Tabnabbing 攻击**：
```html
<!-- 危险：新页面可以控制原页面 -->
<a href="https://malicious-site.com" target="_blank">点击</a>

<!-- 安全：阻止新页面访问原页面 -->
<a href="https://trusted-site.com" rel="noopener noreferrer" target="_blank">点击</a>
```

**信息泄露**：
```html
<!-- 危险：向目标站点泄露 referrer 信息 -->
<a href="https://external-site.com" target="_blank">链接</a>

<!-- 安全：不发送 referrer 信息 -->
<a href="https://external-site.com" rel="noopener noreferrer" target="_blank">链接</a>
```

## 浏览器支持

- Chrome >= 88
- Firefox >= 84
- Safari >= 14
- Edge >= 88

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request


### 编辑器配置
为了获得更好的开发体验，建议安装以下插件：

#### VS Code / Cursor
- **Prettier - Code formatter** (`esbenp.prettier-vscode`) - 自动格式化代码

安装插件后，建议配置：
- 启用 "Format On Save" 自动保存时格式化
- 设置 Prettier 为默认格式化工具

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

- 项目主页: [GitHub Repository](https://github.com/JOJOexchange/holomind-web)
- 问题反馈: [Issues](https://github.com/JOJOexchange/holomind-web/issues)