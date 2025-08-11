import React from 'react'
import styled from 'styled-components'
import Table from './index'

// 示例样式
const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const Button = styled.button`
  margin-right: 8px;
  padding: 4px 8px;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #40a9ff;
  }

  &:last-child {
    background-color: #ff4d4f;

    &:hover {
      background-color: #ff7875;
    }
  }
`

const Tag = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
  color: white;
  font-size: 12px;
`

const PropsTable = styled.div`
  background: ${({ theme }) => theme.bgL2};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textL1};
`

const PropsTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8}10;

  &:last-child {
    border-bottom: none;
  }
`

const PropsTableCell = styled.div<{ type?: 'prop' | 'type' | 'default' | 'desc' }>`
  font-family: ${(props) =>
    props.type === 'prop' || props.type === 'type' || props.type === 'default' ? 'monospace' : 'inherit'};
  color: ${({ theme, type }) => {
    switch (type) {
      case 'prop':
        return theme.textL1
      case 'type':
        return theme.brand100
      case 'default':
        return theme.textL3
      default:
        return theme.textL2
    }
  }};
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.textL1};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
`

// 定义数据类型
interface User {
  id: number
  name: string
  age: number
  status: 'active' | 'inactive' | 'pending'
  email: string
}

// 示例数据
const users: User[] = [
  { id: 1, name: '张三', age: 25, status: 'active', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, status: 'inactive', email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, status: 'pending', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', age: 22, status: 'active', email: 'zhaoliu@example.com' },
]

// 状态标签颜色映射
const statusColorMap = {
  active: '#52c41a',
  inactive: '#ff4d4f',
  pending: '#faad14',
}

// 状态文本映射
const statusTextMap = {
  active: '活跃',
  inactive: '禁用',
  pending: '待处理',
}

const TableDemo: React.FC = () => {
  // 表格列定义
  const columns = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
    },
    {
      key: 'name',
      title: '姓名',
    },
    {
      key: 'age',
      title: '年龄',
      align: 'center' as const,
    },
    {
      key: 'status',
      title: '状态',
      // 自定义渲染状态标签
      render: (record: User) => <Tag color={statusColorMap[record.status]}>{statusTextMap[record.status]}</Tag>,
    },
    {
      key: 'email',
      title: '邮箱',
    },
    {
      key: 'actions',
      title: '操作',
      // 自定义渲染操作按钮
      render: (record: User) => (
        <>
          <Button onClick={() => handleEdit(record)}>编辑</Button>
          <Button onClick={() => handleDelete(record)}>删除</Button>
        </>
      ),
      // 不需要设置align:"right"，因为最后一列会自动右对齐
    },
  ]

  // 操作处理函数
  const handleEdit = (user: User) => {
    alert(`编辑用户: ${user.name}`)
  }

  const handleDelete = (user: User) => {
    alert(`删除用户: ${user.name}`)
  }

  return (
    <DemoContainer>
      <h2>Table 表格组件示例</h2>
      <p>表格组件用于展示结构化数据，支持自定义列定义、自定义渲染、分页等功能。</p>

      <h3>基本用法</h3>
      <p>最基本的表格展示，包含数据渲染和自定义操作列</p>

      <Table data={users} columns={columns} emptyText='暂无用户数据' />

      <CodeBlock>
        {`// 定义数据类型
interface User {
  id: number;
  name: string;
  age: number;
  status: 'active' | 'inactive' | 'pending';
  email: string;
}

// 示例数据
const users: User[] = [
  { id: 1, name: '张三', age: 25, status: 'active', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', age: 30, status: 'inactive', email: 'lisi@example.com' },
  { id: 3, name: '王五', age: 28, status: 'pending', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', age: 22, status: 'active', email: 'zhaoliu@example.com' },
];

// 表格列定义
const columns = [
  {
    key: 'id',
    title: 'ID',
    width: '80px',
  },
  {
    key: 'name',
    title: '姓名',
  },
  {
    key: 'age',
    title: '年龄',
    align: 'center' as const,
  },
  {
    key: 'status',
    title: '状态',
    // 自定义渲染状态标签
    render: (record: User) => (
      <Tag color={statusColorMap[record.status]}>
        {statusTextMap[record.status]}
      </Tag>
    ),
  },
  {
    key: 'email',
    title: '邮箱',
  },
  {
    key: 'actions',
    title: '操作',
    // 自定义渲染操作按钮
    render: (record: User) => (
      <>
        <Button onClick={() => handleEdit(record)}>编辑</Button>
        <Button onClick={() => handleDelete(record)}>删除</Button>
      </>
    ),
  },
];

// 使用表格
<Table
  data={users}
  columns={columns}
  emptyText="暂无用户数据"
/>`}
      </CodeBlock>

      <h3>空数据展示</h3>
      <p>当没有数据时的空状态展示</p>

      <Table data={[]} columns={columns} emptyText='暂无用户数据' />

      <CodeBlock>
        {`<Table
  data={[]}
  columns={columns}
  emptyText="暂无用户数据"
/>`}
      </CodeBlock>

      <h3>分页表格</h3>
      <p>支持分页功能的表格，适用于大量数据展示</p>

      <Table
        data={users}
        columns={columns}
        emptyText='暂无用户数据'
        showPagination={true}
        pageIndex={1}
        totalSize={50}
        pageSize={4}
        onPageChange={(page) => console.log('切换到第', page, '页')}
      />

      <CodeBlock>
        {`<Table
  data={users}
  columns={columns}
  emptyText="暂无用户数据"
  showPagination={true}
  pageIndex={1}
  totalSize={50}
  pageSize={4}
  onPageChange={(page) => console.log('切换到第', page, '页')}
/>`}
      </CodeBlock>

      <h3>自定义样式</h3>
      <p>可以通过调整行高、间距等参数来自定义表格样式</p>

      <Table
        data={users.slice(0, 2)}
        columns={columns}
        emptyText='暂无用户数据'
        rowHeight={60}
        rowGap={30}
        headerHeight={24}
        headerBodyGap={30}
      />

      <CodeBlock>
        {`<Table
  data={users}
  columns={columns}
  emptyText="暂无用户数据"
  rowHeight={60}        // 行高60px
  rowGap={30}          // 行间距30px
  headerHeight={24}    // 表头高度24px
  headerBodyGap={30}   // 表头表体间距30px
/>`}
      </CodeBlock>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>Table 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>data</PropsTableCell>
            <PropsTableCell type='type'>T[]</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>表格数据数组</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>columns</PropsTableCell>
            <PropsTableCell type='type'>ColumnDef[]</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>列定义数组</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>className</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>自定义 CSS 类名</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>emptyText</PropsTableCell>
            <PropsTableCell type='type'>ReactNode</PropsTableCell>
            <PropsTableCell type='default'>""</PropsTableCell>
            <PropsTableCell type='desc'>空数据时的显示内容</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>headerHeight</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>18</PropsTableCell>
            <PropsTableCell type='desc'>表头高度(px)</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>rowHeight</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>44</PropsTableCell>
            <PropsTableCell type='desc'>表体行高(px)</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>rowGap</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>20</PropsTableCell>
            <PropsTableCell type='desc'>行间距(px)</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>headerBodyGap</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>20</PropsTableCell>
            <PropsTableCell type='desc'>表头和表体间距(px)</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>showPagination</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否显示翻页器</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>pageIndex</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>1</PropsTableCell>
            <PropsTableCell type='desc'>当前页码</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>totalSize</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>0</PropsTableCell>
            <PropsTableCell type='desc'>总数据条数</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>pageSize</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>10</PropsTableCell>
            <PropsTableCell type='desc'>每页条数</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onPageChange</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>翻页回调函数</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>ColumnDef 接口定义</h3>
          <CodeBlock>
            {`interface ColumnDef<T> {
  key: string;                               // 列的唯一标识
  title: ReactNode;                          // 列标题
  width?: string;                            // 列宽度
  render?: (record: T, index: number) => ReactNode; // 自定义渲染函数
  align?: 'left' | 'center' | 'right';      // 对齐方式
}

interface TableProps<T> {
  data: T[];                                 // 必填：表格数据
  columns: ColumnDef<T>[];                   // 必填：列定义
  className?: string;                        // 可选：自定义类名
  emptyText?: ReactNode;                     // 可选：空数据显示内容
  headerHeight?: number;                     // 可选：表头高度
  rowHeight?: number;                        // 可选：行高
  rowGap?: number;                           // 可选：行间距
  headerBodyGap?: number;                    // 可选：表头表体间距
  showPagination?: boolean;                  // 可选：是否显示分页
  pageIndex?: number;                        // 可选：当前页码
  totalSize?: number;                        // 可选：总数据量
  pageSize?: number;                         // 可选：每页条数
  onPageChange?: (page: number) => void;     // 可选：翻页回调
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default TableDemo
