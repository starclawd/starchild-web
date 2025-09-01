import { useCallback, useMemo } from 'react'
import { AgentInfo } from '../agenthub'
import { useMarketplaceSearchString } from './useSearch'
import { useAgentMarketplaceInfoList, useSearchedAgentMarketplaceInfoList } from './useMarketplace'

/**
 * 统一的数据源选择 hook
 */
export function useCurrentAgentList(showSearchBar: boolean = true): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const [searchString] = useMarketplaceSearchString()
  const [agentMarketplaceInfoList, setAgentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [searchedAgentMarketplaceInfoList, setSearchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()

  const currentAgentList = useMemo(() => {
    return showSearchBar && searchString ? searchedAgentMarketplaceInfoList : agentMarketplaceInfoList
  }, [showSearchBar, searchString, searchedAgentMarketplaceInfoList, agentMarketplaceInfoList])

  const setCurrentAgentList = useCallback(
    (agents: AgentInfo[]) => {
      if (showSearchBar && searchString) {
        setSearchedAgentMarketplaceInfoList(agents)
      } else {
        setAgentMarketplaceInfoList(agents)
      }
    },

    [showSearchBar, searchString, setSearchedAgentMarketplaceInfoList, setAgentMarketplaceInfoList],
  )

  return [currentAgentList, setCurrentAgentList]
}
