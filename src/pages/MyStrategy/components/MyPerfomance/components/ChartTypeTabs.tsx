import { memo } from 'react'
import styled, { css } from 'styled-components'
import { vm } from 'pages/helper'
import { t } from '@lingui/core/macro'

const TabsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  border-radius: 8px;
  width: fit-content;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(4)};
      border-radius: ${vm(8)};
      gap: ${vm(4)};
    `}
`

const TabItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  height: 32px;
  padding: 0 12px;
  border-radius: 36px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
  background: ${({ theme }) => theme.bgT30};
  cursor: default; // 不可点击

  ${({ theme }) =>
    theme.isMobile &&
    css`
      min-width: ${vm(60)};
      height: ${vm(32)};
      padding: 0 ${vm(12)};
      border-radius: ${vm(36)};
      font-size: ${vm(14)};
      line-height: ${vm(20)};
    `}
`

const ChartTypeTabs = memo(() => {
  return (
    <TabsContainer>
      <TabItem>{t`Equity`}</TabItem>
    </TabsContainer>
  )
})

ChartTypeTabs.displayName = 'ChartTypeTabs'

export default ChartTypeTabs
