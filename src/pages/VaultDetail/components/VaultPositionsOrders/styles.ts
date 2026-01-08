import styled from 'styled-components'
import Table from 'components/Table'

// 表格样式组件
export const StyledTable = styled(Table)`
  thead {
    background-color: transparent;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 12px;
      right: 12px;
      height: 1px;
      background: ${({ theme }) => theme.black800};
    }
  }

  .header-container {
    height: 40px;
    background-color: ${({ theme }) => theme.black1000};

    th {
      font-size: 13px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.black200};
      &:first-child {
        padding-left: 46px; // 12px + 24px(logo) + 4px(margin) = 40px，与竖线对齐
      }
      &:last-child {
        padding-right: 12px;
      }
    }
  }

  .table-row {
    td {
      &:first-child {
        padding-left: 12px;
        border-radius: 4px 0 0 4px;
      }
      &:last-child {
        padding-right: 12px;
        border-radius: 0 4px 4px 0;
      }
    }
  }
` as typeof Table

// Loading状态居中容器
export const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`
