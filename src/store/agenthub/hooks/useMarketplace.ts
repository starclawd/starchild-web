import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import {
  updateAgentMarketplaceInfoList,
  updateSearchedAgentMarketplaceInfoList,
  updateIsLoadingMarketplace,
} from '../reducer'
import { useLazyGetAgentMarketplaceListQuery, useLazySearchAgentsQuery } from 'api/agentHub'
import { AgentInfo } from '../agenthub'
import { convertApiDataListToAgentMarketplaceInfoList, filterAgentsByForCardView } from '../utils'
import { useAgentHubViewMode } from '../../agenthubcache/hooks'

/**
 * Agent市场信息列表状态管理
 */
export function useAgentMarketplaceInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const [viewMode] = useAgentHubViewMode()
  const agentMarketplaceInfoList = useSelector((state: RootState) => state.agentHub.agentMarketplaceInfoList)
  const dispatch = useDispatch()

  const setAgentMarketplaceInfoList = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateAgentMarketplaceInfoList(agents))
    },
    [dispatch],
  )

  return [agentMarketplaceInfoList, setAgentMarketplaceInfoList]
}

/**
 * 搜索到的Agent市场信息列表状态管理
 */
export function useSearchedAgentMarketplaceInfoList(): [AgentInfo[], (agents: AgentInfo[]) => void] {
  const searchedAgentMarketplaceInfoList = useSelector(
    (state: RootState) => state.agentHub.searchedAgentMarketplaceInfoList,
  )
  const dispatch = useDispatch()

  const setSearchedAgentMarketplaceInfoList = useCallback(
    (agents: AgentInfo[]) => {
      dispatch(updateSearchedAgentMarketplaceInfoList(agents))
    },
    [dispatch],
  )
  return [searchedAgentMarketplaceInfoList, setSearchedAgentMarketplaceInfoList]
}

/**
 * 市场加载状态管理
 */
export function useIsLoadingMarketplace(): [boolean, (isLoading: boolean) => void] {
  const isLoadingMarketplace = useSelector((state: RootState) => state.agentHub.isLoadingMarketplace)
  const dispatch = useDispatch()
  const setIsLoadingMarketplace = useCallback(
    (isLoading: boolean) => {
      dispatch(updateIsLoadingMarketplace(isLoading))
    },
    [dispatch],
  )
  return [isLoadingMarketplace, setIsLoadingMarketplace]
}

/**
 * 获取Agent市场信息列表
 */
export function useGetAgentMarketplaceInfoList() {
  const [, setAgentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [, setIsLoadingMarketplace] = useIsLoadingMarketplace()
  const [triggerGetAgentMarketplaceList] = useLazyGetAgentMarketplaceListQuery()

  return useCallback(async () => {
    try {
      setIsLoadingMarketplace(true)
      const data = await triggerGetAgentMarketplaceList()
      if (data.isSuccess) {
        const dataList = data.data.data
        const allAgents = convertApiDataListToAgentMarketplaceInfoList(dataList)

        // 设置 Card View 数据（应用类别筛选规则）
        const filteredAgentsForCardView = filterAgentsByForCardView(allAgents)
        setAgentMarketplaceInfoList(filteredAgentsForCardView)
      }
      return data
    } catch (error) {
      return error
    } finally {
      setIsLoadingMarketplace(false)
    }
  }, [setAgentMarketplaceInfoList, setIsLoadingMarketplace, triggerGetAgentMarketplaceList])
}

/**
 * 获取搜索的Agent市场信息列表
 */
export function useGetSearchedAgentMarketplaceInfoList() {
  const [, setSearchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
  const [, setIsLoadingMarketplace] = useIsLoadingMarketplace()
  const [triggerSearchAgents] = useLazySearchAgentsQuery()

  return useCallback(
    async (searchStr: string) => {
      try {
        setIsLoadingMarketplace(true)
        const data = await triggerSearchAgents({ searchStr })
        if (data.isSuccess) {
          const dataList = data.data.data
          const allAgents = convertApiDataListToAgentMarketplaceInfoList(dataList)

          // 设置 Card View 搜索数据（应用类别筛选规则）
          const filteredAgentsForCardView = filterAgentsByForCardView(allAgents)
          setSearchedAgentMarketplaceInfoList(filteredAgentsForCardView)
        }
        return data
      } catch (error) {
        return error
      } finally {
        setIsLoadingMarketplace(false)
      }
    },
    [setSearchedAgentMarketplaceInfoList, setIsLoadingMarketplace, triggerSearchAgents],
  )
}
