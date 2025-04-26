# Table 表格组件

高度可定制的表格组件，支持自定义列渲染、列宽设置及对齐方式，并默认最后一列右对齐。

## 功能特点

- 表头和表体列自动对齐
- 支持每列元素自定义渲染
- 支持设置列宽
- 支持设置列对齐方式（左、中、右）
- 最后一列默认右对齐
- 空数据显示自定义
- 响应式设计（水平滚动）
- 单元格无默认内边距和外边距
- 列宽自适应调整，整体均匀分布
- 相邻列之间有12px的间距，但第一列左边和最后一列右边没有间距
- 可自定义表头高度（默认18px）
- 可自定义表体行高（默认44px）
- 可自定义行间距（默认20px）
- 可自定义表头和表体之间的间距（默认20px）

## 使用示例

```tsx
import Table from 'components/Table';

// 定义数据类型
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
  actions?: string;
}

// 示例数据
const users: User[] = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
];

const UserTable = () => {
  // 定义列配置
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px', // 可选，设置列宽
    },
    {
      key: 'name',
      title: '姓名',
    },
    {
      key: 'age',
      title: '年龄',
      align: 'center' as const, // 设置对齐方式
    },
    {
      key: 'email',
      title: '邮箱',
    },
    {
      key: 'actions',
      title: '操作',
      // 自定义渲染
      render: (record: User) => (
        <div>
          <button onClick={() => alert(`编辑用户: ${record.name}`)}>编辑</button>
          <button onClick={() => alert(`删除用户: ${record.name}`)}>删除</button>
        </div>
      ),
      // 不需要设置align:"right"，因为最后一列会自动右对齐
    },
  ];

  return (
    <Table
      data={users}
      columns={columns}
      emptyText="暂无用户数据"
      headerHeight={18} // 可选，设置表头高度
      rowHeight={44} // 可选，设置表体行高
      rowGap={20} // 可选，设置行间距
      headerBodyGap={20} // 可选，设置表头和表体之间的间距
    />
  );
};

export default UserTable;
```

## 属性说明

### TableProps

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| data | T[] | 是 | - | 表格数据 |
| columns | ColumnDef<T>[] | 是 | - | 表格列定义 |
| className | string | 否 | - | 自定义CSS类名 |
| emptyText | ReactNode | 否 | '' | 空数据显示内容 |
| headerHeight | number | 否 | 18 | 表头高度(px) |
| rowHeight | number | 否 | 44 | 表体行高(px) |
| rowGap | number | 否 | 20 | 行间距(px) |
| headerBodyGap | number | 否 | 20 | 表头和表体之间的间距(px) |

### ColumnDef

| 属性名 | 类型 | 必填 | 默认值 | 说明 |
|--------|------|------|--------|------|
| key | string | 是 | - | 列唯一标识，对应数据对象的属性名 |
| title | ReactNode | 是 | - | 列标题 |
| width | string | 否 | 'auto' | 列宽度，如 '100px'、'10%' 等，不设置则自动均匀分布 |
| align | 'left' \| 'center' \| 'right' | 否 | 'left' | 列对齐方式 |
| render | (record: T, index: number) => ReactNode | 否 | - | 自定义渲染函数 | 