import styled, { css } from 'styled-components'
import { memo, useEffect, useCallback, useRef, useMemo } from 'react'
import { vm } from 'pages/helper'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE } from 'store/agenthub/agenthub.d'
import AgentCardSection from '../AgentCardSection'
import {
  useGetAgentInfoList,
  useGetSearchedCategoryAgentInfoList,
  useIsLoading,
  useAgentInfoList,
  useSearchedAgentInfoList,
  useIsLoadMoreLoading,
  useMarketplaceSearchString,
  useCategorySearchTag,
} from 'store/agenthub/hooks'
import { debounce } from 'utils/common'
import { useIsMobile } from 'store/application/hooks'

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

interface AgentMarketplaceCategoryCardViewProps {
  showSearchBar: boolean
  category: string
}

export default memo(function AgentMarketplaceCategoryCardView({
  showSearchBar,
  category,
}: AgentMarketplaceCategoryCardViewProps) {
  const isInitializedRef = useRef(false)
  const isMobile = useIsMobile()

  // Redux state hooks
  const [isLoading] = useIsLoading()
  const [agentInfoList, agentInfoListTotal, agentInfoListPage, agentInfoListPageSize] = useAgentInfoList()
  const [searchedAgentInfoList] = useSearchedAgentInfoList()
  const getAgentInfoList = useGetAgentInfoList()
  const getSearchedCategoryAgentInfoList = useGetSearchedCategoryAgentInfoList()
  const [isLoadMoreLoading] = useIsLoadMoreLoading()
  const [searchString, setSearchString] = useMarketplaceSearchString()
  const [searchTag, setSearchTag] = useCategorySearchTag()

  // 根据 category 获取对应的 AgentCategory 对象
  const categoryInfo = AGENT_CATEGORIES.find((cat) => cat.id === category)

  // 如果找不到对应的分类，返回空
  if (!categoryInfo) {
    return null
  }

  // 根据搜索状态决定使用哪个列表
  const currentAgentsList = showSearchBar && searchString ? searchedAgentInfoList : agentInfoList
  const currentTotal = showSearchBar && searchString ? searchedAgentInfoList.length : agentInfoListTotal
  const currentPage = showSearchBar && searchString ? 1 : agentInfoListPage
  const currentPageSize = showSearchBar && searchString ? 20 : agentInfoListPageSize

  // 获取对应的过滤类型
  const getFilterType = useCallback((categoryId: string) => {
    return categoryId as AGENT_HUB_TYPE
  }, [])

  const loadData = useCallback(
    (filterString: string, tagString?: string) => {
      const filterType = getFilterType(category)

      if (filterString.trim() !== '') {
        // 使用搜索接口，不支持分页
        getSearchedCategoryAgentInfoList({
          searchStr: filterString,
          category: filterType,
          tag: tagString,
        })
      } else {
        // 使用普通列表接口
        getAgentInfoList({
          page: 1,
          pageSize: agentInfoListPageSize,
          filterType,
          tag: tagString,
        })
      }
    },
    [getAgentInfoList, getSearchedCategoryAgentInfoList, category, agentInfoListPageSize, getFilterType],
  )

  // 搜索防抖处理
  const debouncedSearch = useMemo(
    () => debounce((filterString: string, tagString?: string) => loadData(filterString, tagString), 500),
    [loadData],
  )

  // 初始化和搜索条件变化处理
  useEffect(() => {
    if (!isInitializedRef.current) {
      // 初始化：清空搜索标签并加载数据
      isInitializedRef.current = true

      // mobile的搜索状态下不需要重置搜索条件
      setSearchTag('')
      if (isMobile && !showSearchBar) {
        loadData('', '')
      } else {
        loadData(searchString, '')
      }
    } else {
      // 搜索条件变化：防抖搜索
      if (isMobile && !showSearchBar) {
        debouncedSearch('', searchTag)
      } else {
        debouncedSearch(searchString, searchTag)
      }
    }
  }, [loadData, searchString, searchTag, setSearchTag, setSearchString, debouncedSearch, isMobile, showSearchBar])

  // 计算是否还有更多数据 - 搜索状态下不支持分页
  const hasLoadMore =
    ((isMobile && !showSearchBar) || (!searchString && !searchTag)) &&
    currentTotal > 0 &&
    currentAgentsList.length < currentTotal

  // 处理 load more - 搜索状态下不会调用
  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreLoading) return

    if (!hasLoadMore) return

    const filterType = getFilterType(category)
    await getAgentInfoList({
      page: currentPage + 1,
      pageSize: currentPageSize,
      filterType,
    })
  }, [isLoadMoreLoading, hasLoadMore, currentPage, currentPageSize, getAgentInfoList, category, getFilterType])

  // 获取skeleton类型
  const skeletonType = [AGENT_HUB_TYPE.INDICATOR, AGENT_HUB_TYPE.STRATEGY].includes(category as AGENT_HUB_TYPE)
    ? 'with-image'
    : 'default'

  return (
    <ContentWrapper>
      <AgentCardSection
        category={categoryInfo}
        isSectionMode={false}
        showViewMore={false}
        customAgents={currentAgentsList}
        isLoading={isLoading}
        onLoadMore={handleLoadMore}
        isLoadMoreLoading={isLoadMoreLoading}
        hasLoadMore={hasLoadMore}
        skeletonType={skeletonType}
      />
    </ContentWrapper>
  )
})
