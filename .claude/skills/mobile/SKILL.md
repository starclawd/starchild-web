---
name: mobile
description: 移动端适配规则。当需要开发移动端页面、处理响应式、适配安全区域、vm() 函数、移动端尺寸单位、手机端页面时使用此技能。
---

# 移动端适配规则

## 移动端尺寸单位

使用 `vm()` 函数将设计稿 px 转换为 vw 单位：

```typescript
import { vm } from 'pages/helper'

const Container = styled.div`
  padding: ${vm(16)}; // 16px → vw
  font-size: ${vm(14)}; // 14px → vw
  border-radius: ${vm(8)}; // 8px → vw
  margin-bottom: ${vm(20)}; // 20px → vw
`
```

### 保持 px 单位

某些情况需要保持 px（如边框）：

```typescript
const Border = styled.div`
  border: ${vm(1, true)} solid #ccc; // keepPx = true
`
```

## 安全区域适配

### 底部安全区域

```typescript
import { BottomSafeArea, ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'

// 页面底部安全区域
<BottomSafeArea>
  <Content />
</BottomSafeArea>

// 弹窗底部安全区域
<ModalSafeAreaWrapper>
  <ModalContent />
</ModalSafeAreaWrapper>
```

### 手动处理安全区域

```typescript
const Container = styled.div`
  @supports (bottom: env(safe-area-inset-bottom)) {
    padding-bottom: env(safe-area-inset-bottom);
  }
`
```

## 移动端目录结构

```
src/pages/Mobile/
├── index.tsx                    # 移动端路由入口
├── components/
│   ├── MobileHeader/           # 移动端头部
│   ├── MobileMenu/             # 移动端底部菜单
│   └── MobileMenuIcon/         # 菜单图标
├── MobileChat/                  # 移动端聊天页
├── MobileAgentDetail/           # 移动端详情页
└── MobileAgentHub/              # 移动端 Hub 页
```

## 移动端组件

| 组件              | 用途              |
| ----------------- | ----------------- |
| `MobileHeader`    | 移动端顶部导航栏  |
| `MobileMenu`      | 移动端底部 Tab 栏 |
| `BottomSheet`     | 底部弹出面板      |
| `PullDownRefresh` | 下拉刷新          |
| `PullUpRefresh`   | 上拉加载更多      |

## 移动端滚动优化

```typescript
const ScrollContainer = styled.div`
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; // iOS 滚动优化

  &::-webkit-scrollbar {
    display: none; // 隐藏滚动条
  }
`
```

## iOS 特殊处理

```typescript
import { isIos } from 'utils/userAgent'

// iOS 固定 body 防止弹性滚动
if (isIos) {
  document.body.classList.add('fixed-style')
  document.body.style.height = `${window.innerHeight}px`
}
```

## 设计稿尺寸

移动端设计稿宽度：`MOBILE_DESIGN_WIDTH`（在 `constants/index.ts` 中定义）

## ⚠️ 注意事项

1. 移动端样式**必须使用 `vm()` 函数**
2. 底部固定元素必须处理安全区域
3. 触摸滚动区域添加 `-webkit-overflow-scrolling: touch`
4. 移动端页面在 `src/pages/Mobile/` 目录下创建
