import styled, { css } from 'styled-components'
import { memo, useEffect, useCallback, useMemo, useRef } from 'react'
import { vm } from 'pages/helper'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import AgentCardSection from '../AgentCardSection'
import StickySearchHeader from '../StickySearchHeader'
import { AGENT_HUB_TYPE } from 'constants/agentHub'
import {
  useGetAgentInfoList,
  useGetSearchedCategoryAgentInfoList,
  useIsLoading,
  useAgentInfoList,
  useSearchedAgentInfoList,
  useIsLoadMoreLoading,
  useCategorySearchString,
  useCategorySearchTag,
} from 'store/agenthub/hooks'
import { debounce } from 'utils/common'
import { Trans } from '@lingui/react/macro'
import { useIsMobile } from 'store/application/hooks'
import ButtonGroup from '../ButtonGroup'

const AgentHubPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  margin: 20px;
  gap: 40px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0;
    `}
`

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      margin-bottom: ${vm(24)};
    `}
`

const Title = styled.h1`
  font-size: 36px;
  line-height: 44px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(26)};
    `}
`

const Description = styled.p`
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  color: ${({ theme }) => theme.textL3};
  margin: 0;
  text-align: center;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: ${vm(13)};
      line-height: ${vm(20)};
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1080px;
  gap: 20px;
  flex: 1;
  margin: 0 auto;
  width: 100%;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(16)};
    `}
`

interface AgentHubPageProps {
  category: any // 传入的分类常量
  filterType: AGENT_HUB_TYPE // 对应的过滤类型
  skeletonType?: 'default' | 'with-image' // 骨架屏类型
  runAgentCard?: React.ReactNode // 运行 agent 卡片
  onRunAgent?: () => void // 运行 agent 的回调
  showSearchBar?: boolean
}

export default memo(function AgentHubPage({
  category,
  filterType,
  skeletonType = 'default',
  runAgentCard,
  onRunAgent,
  showSearchBar = true,
}: AgentHubPageProps) {
  const agentHubPageWrapperRef = useScrollbarClass<HTMLDivElement>()
  const isInitializedRef = useRef(false)

  const isMobile = useIsMobile()
  const [isLoading] = useIsLoading()
  const [agentInfoList, agentInfoListTotal, agentInfoListPage, agentInfoListPageSize, categoryAgentTags] =
    useAgentInfoList()
  const [searchedAgentInfoList] = useSearchedAgentInfoList()
  const getAgentInfoList = useGetAgentInfoList()
  const getSearchedCategoryAgentInfoList = useGetSearchedCategoryAgentInfoList()
  const [isLoadMoreLoading] = useIsLoadMoreLoading()
  const [searchString, setSearchString] = useCategorySearchString()
  const [searchTag, setSearchTag] = useCategorySearchTag()

  // 根据搜索状态决定使用哪个列表
  const currentAgentsList = searchString ? searchedAgentInfoList : agentInfoList
  const currentTotal = searchString ? searchedAgentInfoList.length : agentInfoListTotal
  const currentPage = searchString ? 1 : agentInfoListPage
  const currentPageSize = searchString ? 20 : agentInfoListPageSize

  const loadData = useCallback(
    (filterString: string, tagString?: string) => {
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
    [getAgentInfoList, getSearchedCategoryAgentInfoList, filterType, agentInfoListPageSize],
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
      setSearchString('')
      setSearchTag('')
      loadData('', '')
    } else {
      // 搜索条件变化：防抖搜索
      debouncedSearch(searchString, searchTag)
    }
  }, [loadData, searchString, searchTag, setSearchTag, setSearchString, debouncedSearch])

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchString(value)
    },
    [setSearchString],
  )

  const handleButtonGroupClick = useCallback(
    (value: string) => {
      setSearchTag(value)
    },
    [setSearchTag],
  )

  // 计算是否还有更多数据 - 搜索状态下不支持分页
  const hasLoadMore = !searchString && !searchTag && currentTotal > 0 && currentAgentsList.length < currentTotal

  // 处理 load more - 搜索状态下不会调用
  const handleLoadMore = useCallback(async () => {
    if (isLoadMoreLoading) return

    if (!hasLoadMore) return
    await getAgentInfoList({
      page: currentPage + 1,
      pageSize: currentPageSize,
      filterType,
    })
  }, [isLoadMoreLoading, hasLoadMore, currentPage, currentPageSize, getAgentInfoList, filterType])

  return (
    <AgentHubPageWrapper ref={agentHubPageWrapperRef as any} className='scroll-style'>
      {!isMobile && (
        <Header>
          <Title>
            <Trans>{category.titleKey}</Trans>
          </Title>
          {category.descriptionKey && (
            <Description>
              <Trans>{category.descriptionKey}</Trans>
            </Description>
          )}
        </Header>
      )}
      <StickySearchHeader showSearchBar={showSearchBar} onSearchChange={handleSearchChange} searchString={searchString}>
        {categoryAgentTags?.length > 0 && (
          <ButtonGroup
            showAll={true}
            items={categoryAgentTags.map((tag) => ({
              id: tag,
              label: tag,
              value: tag,
            }))}
            onItemClick={handleButtonGroupClick}
          />
        )}
      </StickySearchHeader>
      <Content>
        <AgentCardSection
          category={category}
          isSectionMode={false}
          showViewMore={false}
          customAgents={currentAgentsList}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          isLoadMoreLoading={isLoadMoreLoading}
          hasLoadMore={hasLoadMore}
          runAgentCard={runAgentCard}
          skeletonType={skeletonType}
        />
      </Content>
    </AgentHubPageWrapper>
  )
})
