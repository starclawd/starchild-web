---
name: components
description: 组件开发规范。当需要创建组件、修改组件、使用公共组件时使用此技能。
---

# 组件开发规范

## 公共组件列表 (`src/components/`)

**使用组件前，先检查是否已有可复用的公共组件：**

| 组件名              | 用途                   |
| ------------------- | ---------------------- |
| `Avatar`            | 头像组件               |
| `BottomSheet`       | 底部弹出面板（移动端） |
| `Button`            | 按钮组件               |
| `Divider`           | 分割线                 |
| `Icons`             | 图标组件（IconBase）   |
| `Input`             | 输入框                 |
| `InputArea`         | 多行文本输入           |
| `LazyImage`         | 远程图片懒加载         |
| `Markdown`          | Markdown 渲染          |
| `MemoizedHighlight` | 代码高亮               |
| `Modal`             | 弹窗组件               |
| `NoData`            | 空状态展示             |
| `Pending`           | 加载中状态             |
| `Popover`           | 气泡弹出框             |
| `Portal`            | Portal 传送门          |
| `PullDownRefresh`   | 下拉刷新               |
| `PullUpRefresh`     | 上拉加载更多           |
| `Select`            | 下拉选择器             |
| `Skeleton`          | 骨架屏                 |
| `Table`             | 表格组件（支持排序）   |
| `TabList`           | 标签页切换             |
| `Toast`             | 轻提示                 |
| `Tooltip`           | 文字提示               |
| `TypewriterCursor`  | 打字机光标效果         |

> 💡 每个组件都有 `Demo.tsx` 文件，可参考使用示例。

## 组件目录结构

```
src/components/Avatar/
├── index.tsx      # 组件入口
├── types.ts       # 组件类型定义
└── Demo.tsx       # 使用示例
```

## 组件开发规范

> 💡 `memo` 包裹、`$` 前缀等通用规则见 [GLOBAL_RULES.md](../../GLOBAL_RULES.md)

- styled-components 定义放在文件顶部，组件之前

## 图片使用规范

| 图片类型 | 使用方式              |
| -------- | --------------------- |
| 远程图片 | 使用 `LazyImage` 组件 |
| 本地图片 | 使用原生 `<img>` 标签 |

```typescript
// ✅ 远程图片
<LazyImage
  src="https://example.com/image.png"
  width={100}
  height={100}
  fallbackSrc={defaultImg}
/>

// ✅ 本地图片
import logo from 'assets/icons/logo.svg'
<img src={logo} alt="Logo" />
```
