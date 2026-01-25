# Iconfont 图标规则

## 图标处理流程

设计稿转代码时，涉及图标需按以下规则处理：

### 单色图标 → Iconfont

1. 将图标保存为 SVG 格式到 `src/assets/icons/` 目录
2. 运行 `yarn icons` 生成 iconfont
3. 使用 CSS class 引用图标

### 多色图标 → 独立 SVG

- 保存到 `src/assets/` 对应业务目录
- 作为 React 组件或 `<img>` 标签使用

## 目录结构

```
src/assets/icons/           # 单色 SVG 图标（用于生成 iconfont）
public/icon_fonts/          # 生成的字体文件（自动生成，禁止手动修改）
├── fonts/
│   ├── icomoon.ttf
│   ├── icomoon.woff
│   └── icomoon.svg
├── style.css               # 图标样式
└── selection.json          # 图标配置
```

## 使用步骤

### 1. 添加新图标

```bash
# 将 SVG 文件放入 src/assets/icons/
cp new-icon.svg src/assets/icons/

# 生成 iconfont
yarn icons
```

### 2. 在代码中使用

```tsx
// 方式 1：CSS class
<i className="icon-arrow" />

// 方式 2：styled-components
const Icon = styled.i`
  &::before {
    font-family: 'icomoon' !important;
  }
`
<Icon className="icon-arrow" />
```

## SVG 命名规范

| 规则 | 示例 |
| ---- | ---- |
| 小写字母 | `arrow.svg` ✅ `Arrow.svg` ❌ |
| 使用连字符 | `arrow-right.svg` ✅ `arrow_right.svg` ❌ |
| 语义化命名 | `search.svg` ✅ `icon1.svg` ❌ |

## 现有图标列表

运行以下命令查看所有可用图标：

```bash
ls src/assets/icons/
```

常用图标：
- `arrow.svg` - 箭头
- `close.svg` - 关闭
- `copy.svg` - 复制
- `delete.svg` - 删除
- `edit.svg` - 编辑
- `loading.svg` - 加载
- `search.svg` - 搜索
- `share.svg` - 分享

## ⚠️ 注意事项

1. **单色图标**：脚本会自动移除 `fill`、`stroke` 颜色属性
2. **禁止修改** `public/icon_fonts/` 目录，由 `yarn icons` 自动生成
3. 新增图标后必须运行 `yarn icons` 才能生效
4. 图标颜色通过 CSS `color` 属性控制
