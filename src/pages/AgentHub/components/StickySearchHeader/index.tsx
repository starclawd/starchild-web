import styled, { css } from 'styled-components'
import { memo, ReactNode } from 'react'
import { vm } from 'pages/helper'
import SearchBar from 'pages/AgentHub/components/SearchBar'
import { AgentHubViewMode } from 'store/agenthubcache/agenthubcache'
import { useAgentHubViewMode } from 'store/agenthubcache/hooks'

interface StickySearchHeaderProps {
  onSearchChange?: (value: string) => void
  children?: ReactNode // 用于放置 CategoryTabs 或其他筛选组件等
  showSearchBar?: boolean
  searchString?: string
}

const StickyHeader = styled.div<{ $showSearchBar: boolean; $isListView: boolean }>`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: ${({ theme }) => theme.black900};
  padding-bottom: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  ${({ theme, $showSearchBar, $isListView }) =>
    theme.isMobile &&
    css`
      padding: 0;
      margin-bottom: 0;
      height: ${$showSearchBar ? ($isListView ? vm(140) : vm(112)) : $isListView ? vm(82) : vm(54)};
      background-color: ${!$showSearchBar ? theme.black900 : 'transparent'};
    `}
`

const StickyContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1080px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
      padding: 0 ${vm(12)};
    `}
`

const StickySearchHeader = memo<StickySearchHeaderProps>(function StickySearchHeader({
  onSearchChange,
  children,
  showSearchBar = true,
  searchString,
}) {
  const [viewMode] = useAgentHubViewMode()

  return (
    <StickyHeader $showSearchBar={showSearchBar} $isListView={viewMode === AgentHubViewMode.LIST}>
      <StickyContent>
        {showSearchBar && <SearchBar onChange={onSearchChange || (() => {})} value={searchString} />}
        {children}
      </StickyContent>
    </StickyHeader>
  )
})

export default StickySearchHeader
