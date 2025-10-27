import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateSearchedAgentInfoList, updateMarketplaceSearchString, updateCategorySearchTag } from '../reducer'
import { AgentInfo } from '../agenthub'

/**
 * 市场搜索字符串状态管理
 */
export function useMarketplaceSearchString(): [string, (searchString: string) => void] {
  const marketplaceSearchString = useSelector((state: RootState) => state.agentHub.marketplaceSearchString)
  const dispatch = useDispatch()
  const setMarketplaceSearchString = useCallback(
    (searchString: string) => {
      dispatch(updateMarketplaceSearchString(searchString))
    },
    [dispatch],
  )
  return [marketplaceSearchString, setMarketplaceSearchString]
}

/**
 * 分类搜索标签状态管理
 */
export function useCategorySearchTag(): [string, (searchTag: string) => void] {
  const categorySearchTag = useSelector((state: RootState) => state.agentHub.categorySearchTag)
  const dispatch = useDispatch()
  const setCategorySearchTag = useCallback(
    (searchTag: string) => {
      dispatch(updateCategorySearchTag(searchTag))
    },
    [dispatch],
  )
  return [categorySearchTag, setCategorySearchTag]
}

/**
 * 搜索到的Agent信息列表状态管理
 */
export function useSearchedAgentInfoList(): [AgentInfo[], (data: AgentInfo[]) => void] {
  const searchedAgentInfoList = useSelector((state: RootState) => state.agentHub.searchedAgentInfoList)
  const dispatch = useDispatch()
  const setSearchedAgentInfoList = useCallback(
    (data: AgentInfo[]) => {
      dispatch(updateSearchedAgentInfoList(data))
    },
    [dispatch],
  )
  return [searchedAgentInfoList, setSearchedAgentInfoList]
}
