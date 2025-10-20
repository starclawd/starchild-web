import styled, { css } from 'styled-components'

/**
 * 内容容器样式组件
 * 定义气泡提示框的基本布局和样式
 */
export const ContentWrapper = styled.div<{ $canOperator?: boolean }>`
  position: relative;
  display: flex;
  max-width: 240px;
  height: auto;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  padding: 8px;
  border-radius: 8px;
  z-index: 99;
  text-align: left;
  cursor: ${({ $canOperator }) => ($canOperator ? 'pointer' : 'help')};
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.black600};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      max-width: calc(100vw - 28px);
    `}
`
