import React from 'react';
import styled from 'styled-components';
import Table from './index';

// 示例样式
const DemoContainer = styled.div`
  padding: 20px;
`;

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
`;

const Tag = styled.span<{ color: string }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: ${props => props.color};
  color: white;
  font-size: 12px;
`;

// 定义数据类型
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

// 状态标签颜色映射
const statusColorMap = {
  active: '#52c41a',
  inactive: '#ff4d4f',
  pending: '#faad14',
};

// 状态文本映射
const statusTextMap = {
  active: '活跃',
  inactive: '禁用',
  pending: '待处理',
};

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
      // 不需要设置align:"right"，因为最后一列会自动右对齐
    },
  ];

  // 操作处理函数
  const handleEdit = (user: User) => {
    alert(`编辑用户: ${user.name}`);
  };

  const handleDelete = (user: User) => {
    alert(`删除用户: ${user.name}`);
  };

  return (
    <DemoContainer>
      <h2>用户管理表格</h2>
      <Table
        data={users}
        columns={columns}
        emptyText="暂无用户数据"
      />
    </DemoContainer>
  );
};

export default TableDemo; 