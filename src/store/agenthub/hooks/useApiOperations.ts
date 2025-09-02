import { useCallback } from 'react'
import {
  useLazyGetAgentHubListQuery,
  useLazyGetKolsListQuery,
  useLazyGetTokensListQuery,
  useLazySearchAgentsQuery,
} from 'api/agentHub'
import { AgentInfo, AgentInfoListParams } from '../agenthub'
import {
  convertApiTaskListToAgentInfoList,
  convertApiKolListToAgentInfoList,
  convertApiTokenListToAgentInfoList,
} from '../utils'
import { useUserInfo } from '../../login/hooks'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import { useAgentInfoList, useIsLoading, useIsLoadMoreLoading } from './useAgentInfo'
import { useSearchedAgentInfoList } from './useSearch'

/**
 * 获取Agent信息列表
 */
export function useGetAgentInfoList() {
  const [, , , , , setAgentInfoList] = useAgentInfoList()
  const [, setIsLoading] = useIsLoading()
  const [, setIsLoadMoreLoading] = useIsLoadMoreLoading()
  const [triggerGetAgentInfoList] = useLazyGetAgentHubListQuery()
  const [triggerGetKolsList] = useLazyGetKolsListQuery()
  const [triggerGetTokensList] = useLazyGetTokensListQuery()

  return useCallback(
    async (params: AgentInfoListParams) => {
      const { page = 1, filterType } = params
      const isFirstPage = page === 1

      try {
        if (isFirstPage) {
          setIsLoading(true)
        } else {
          setIsLoadMoreLoading(true)
        }

        let response
        let convertedData: any[] = []
        let categoryAgentTags: string[] = []
        let pagination: any = {}

        // 根据 filterType和tag决定调用哪个 API 和使用哪个转换函数
        if (filterType === AGENT_HUB_TYPE.KOL_RADAR && !params.tag) {
          // kol radar且没有tag时，调用kols list api
          response = await triggerGetKolsList(params)
          if (response.isSuccess) {
            const data = response.data
            pagination = data.data.pagination
            convertedData = convertApiKolListToAgentInfoList(data.data.kols)
            categoryAgentTags = []
          }
        } else if (filterType === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE && !params.tag) {
          // token deep dive且没有tag时，调用tokens list api
          response = await triggerGetTokensList(params)
          if (response.isSuccess) {
            const data = response.data
            pagination = data.pagination || {}
            convertedData = convertApiTokenListToAgentInfoList(data.data)
            categoryAgentTags = []
          }
        } else {
          // 默认情况使用原有的 API
          response = await triggerGetAgentInfoList(params)
          if (response.isSuccess) {
            const data = response.data.data
            pagination = data.pagination
            convertedData = convertApiTaskListToAgentInfoList(
              data.tasks.map((task: any) => ({
                ...task,
                categories: [filterType],
              })),
            )
            categoryAgentTags = response.data.tags || []
          }
        }

        if (response.isSuccess) {
          const finalData = {
            data: convertedData,
            categoryAgentTags,
            total: pagination?.total_count || 0,
            page: pagination?.page || 1,
            pageSize: pagination?.page_size || 10,
          }
          setAgentInfoList(finalData)
        }

        return response
      } catch (error) {
        console.log(error)
        return error
      } finally {
        if (isFirstPage) {
          setIsLoading(false)
        } else {
          setIsLoadMoreLoading(false)
        }
      }
    },
    [
      setAgentInfoList,
      setIsLoading,
      setIsLoadMoreLoading,
      triggerGetAgentInfoList,
      triggerGetKolsList,
      triggerGetTokensList,
    ],
  )
}

/**
 * 获取搜索分类Agent信息列表
 */
export function useGetSearchedCategoryAgentInfoList() {
  const [, setSearchedAgentInfoList] = useSearchedAgentInfoList()
  const [, setIsLoading] = useIsLoading()
  const [triggerSearchAgents] = useLazySearchAgentsQuery()

  return useCallback(
    async (params: { searchStr: string; category: string; tag?: string }) => {
      const { searchStr, category, tag } = params

      try {
        setIsLoading(true)
        // clear data before search
        setSearchedAgentInfoList([])
        const response = await triggerSearchAgents({ searchStr, category, tag })
        let convertedData: any[] = []
        if (response.isSuccess) {
          const data = response.data.data
          if (category === AGENT_HUB_TYPE.KOL_RADAR) {
            convertedData = convertApiKolListToAgentInfoList(data[category].kols)
          } else if (category === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE) {
            convertedData = convertApiTokenListToAgentInfoList(data[category].tokens)
          } else {
            convertedData = convertApiTaskListToAgentInfoList(
              data[category].tasks.map((task: any) => ({
                ...task,
                categories: [category],
              })),
            )
          }

          setSearchedAgentInfoList(convertedData)
        }
        return response
      } catch (error) {
        console.error('Failed to search agents:', error)
        return error
      } finally {
        setIsLoading(false)
      }
    },
    [setSearchedAgentInfoList, setIsLoading, triggerSearchAgents],
  )
}
