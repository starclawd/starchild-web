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
  z-index: 10;
  background-color: ${({ theme }) => theme.black900};
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(13)} 0;
    `}
`

const StickyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1080px;
  margin: 0 auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
      padding: 0 ${vm(12)};
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
