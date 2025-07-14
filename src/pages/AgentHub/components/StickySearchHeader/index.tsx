import styled, { css } from 'styled-components'
import { memo, ReactNode } from 'react'
import { vm } from 'pages/helper'
import SearchBar from 'pages/AgentHub/components/SearchBar'

interface StickySearchHeaderProps {
  onSearchChange?: (value: string) => void
  children?: ReactNode // 用于放置 CategoryTabs 或其他筛选组件等
  showSearchBar?: boolean
  searchString?: string
}

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: ${({ theme }) => theme.bgL0};
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)} 0;
      margin-bottom: ${vm(16)};
    `}
`

const StickyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      padding: 0 ${vm(16)};
    `}
`

const StickySearchHeader = memo<StickySearchHeaderProps>(function StickySearchHeader({
  onSearchChange,
  children,
  showSearchBar = true,
  searchString,
}) {
  return (
    <StickyHeader>
      <StickyContent>
        {showSearchBar && <SearchBar onChange={onSearchChange || (() => {})} value={searchString} />}
        {children}
      </StickyContent>
    </StickyHeader>
  )
})

export default StickySearchHeader
