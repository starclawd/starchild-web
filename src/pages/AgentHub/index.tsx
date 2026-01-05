import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { vm } from 'pages/helper'
import ButtonGroup from './components/ButtonGroup'
import StickySearchHeader from 'pages/AgentHub/components/StickySearchHeader'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { AGENT_CATEGORIES } from 'constants/agentHub'
import { useMarketplaceSearchString } from 'store/agenthub/hooks/useSearch'
import { debounce } from 'utils/common'
import { useIsMobile } from 'store/application/hooks'
import AgentTopNavigationBar from './components/AgentTopNavigationBar'
import { t } from '@lingui/core/macro'
import SwitchViewButton from './components/SwitchViewButton'
import { useAgentHubViewMode } from 'store/agenthubcache/hooks'
import { AgentHubViewMode } from 'store/agenthubcache/agenthubcache'
import AgentListViewSortingBar from './components/AgentListViewSortingBar'
import AgentMarketplaceListView from './components/AgentMarketplaceListView'
import AgentMarketplaceCardView from './components/AgentMarketplaceCardOverview'
import AgentMarketplaceCategoryCardView from './components/AgentMarketplaceCategoryCardView'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ListViewSortingColumn, ListViewSortingOrder } from 'store/agenthub/agenthub'
import AgentCardSection from './components/AgentCardSection'
import { useCurrentRouter } from 'store/application/hooks'
import { ROUTER } from 'pages/router'

const AgentHubContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: calc(100% - ${vm(44)});
    `}
`

const AgentHubWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-top: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin: 0;
    `}
`

const MarketPlaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 40px 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: 0;
    `}
`

const MarketPlaceHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 40px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      margin-bottom: 0;
      padding: 0 ${vm(16)};
    `}
`

const Title = styled.h1`
  font-size: 36px;
  line-height: 44px;
  font-weight: 500;
  color: ${({ theme }) => theme.black0};
  margin: 0;
  text-align: center;
`

const ButtonGroupBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: start;
  justify-content: space-between;
  width: 100%;
`

interface AgentHubProps {
  showSearchBar?: boolean
}

export default memo(function AgentHub({ showSearchBar = true }: AgentHubProps) {
  const agentHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [searchString, setSearchString] = useMarketplaceSearchString()
  const [displaySearchString, setDisplaySearchString] = useState(searchString)
  const isMobile = useIsMobile()
  const [viewMode, setViewMode] = useAgentHubViewMode()
  const queryParams = useParsedQueryString()
  const location = useLocation()
  const [, setCurrentRouter] = useCurrentRouter()

  // 为不同showSearchBar值创建独立的状态实例
  const [instanceStates, setInstanceStates] = useState<
    Record<
      string,
      {
        category?: string
        sortingColumn?: ListViewSortingColumn
        sortingOrder?: ListViewSortingOrder
      }
    >
  >({
    true: { category: '', sortingColumn: undefined, sortingOrder: undefined },
    false: { category: '', sortingColumn: undefined, sortingOrder: undefined },
  })

  // 获取当前实例的状态
  const currentInstance = instanceStates[String(showSearchBar)]

  // 根据routeHash获取对应的category
  const getCategoryByRouteHash = useCallback((routeHash: string): string => {
    if (!routeHash) return ''
    const category = AGENT_CATEGORIES.find((cat) => cat.routeHash === routeHash)
    return category ? category.id : ''
  }, [])

  // 根据category获取对应的routeHash
  const getRouteHashByCategory = useCallback((category: string): string => {
    if (!category) return ''
    const categoryObj = AGENT_CATEGORIES.find((cat) => cat.id === category)
    return categoryObj ? categoryObj.routeHash : ''
  }, [])

  // 验证routeHash是否有效
  const isValidRouteHash = useCallback((routeHash: string) => {
    if (!routeHash) return true // 空字符串是有效的（表示显示所有分类）
    return AGENT_CATEGORIES.some((cat) => cat.routeHash === routeHash)
  }, [])

  // 延迟设置真正的搜索字符串（用于防抖）
  const debouncedSetSearchString = useMemo(() => debounce(setSearchString, 500), [setSearchString])

  // 处理搜索变化
  const handleSearchChange = useCallback(
    (value: string) => {
      setDisplaySearchString(value)
      debouncedSetSearchString(value)
    },
    [debouncedSetSearchString],
  )

  // 同步 displaySearchString 和 searchString
  useEffect(() => {
    setDisplaySearchString(searchString)
  }, [searchString])

  // 处理 URL 参数中的 viewMode 设置
  useEffect(() => {
    if (queryParams.viewMode === 'list') {
      setViewMode(AgentHubViewMode.LIST)
    }
  }, [queryParams.viewMode, setViewMode])

  // 当 showSearchBar 变化时，重置该实例的状态
  useEffect(() => {
    setInstanceStates((prev) => ({
      ...prev,
      [String(showSearchBar)]: {
        category: '',
        sortingColumn: undefined,
        sortingOrder: undefined,
      },
    }))
  }, [showSearchBar])

  // 处理实例的分类变化
  const handleInstanceCategoryChange = useCallback(
    (category: string, updateUrl = true) => {
      setInstanceStates((prev) => ({
        ...prev,
        [String(showSearchBar)]: {
          ...prev[String(showSearchBar)],
          category,
        },
      }))

      // 同步URL哈希，使用routeHash
      if (updateUrl) {
        const routeHash = getRouteHashByCategory(category)
        if (routeHash) {
          setCurrentRouter(`${ROUTER.AGENT_HUB}#${routeHash}`)
        } else {
          setCurrentRouter(ROUTER.AGENT_HUB)
        }
      }
    },
    [showSearchBar, setCurrentRouter, getRouteHashByCategory],
  )

  // 初始化时从URL哈希解析category
  useEffect(() => {
    const routeHash = location.hash.slice(1) // 移除 # 符号
    if (routeHash && isValidRouteHash(routeHash)) {
      const category = getCategoryByRouteHash(routeHash)
      if (category) {
        // 不更新URL，避免循环
        handleInstanceCategoryChange(category, false)
      }
    }
  }, [location.hash, isValidRouteHash, getCategoryByRouteHash, handleInstanceCategoryChange])

  // 处理实例的排序变化
  const handleInstanceSort = useCallback(
    (column: any) => {
      setInstanceStates((prev) => {
        const currentState = prev[String(showSearchBar)]
        let newSortingColumn = column
        let newSortingOrder: any = null

        if (currentState.sortingColumn === column) {
          // 同一个字段连续点击：降序 -> 升序 -> 取消排序
          if (currentState.sortingOrder === ListViewSortingOrder.DESC) {
            newSortingOrder = ListViewSortingOrder.ASC
          } else if (currentState.sortingOrder === ListViewSortingOrder.ASC) {
            newSortingColumn = null
            newSortingOrder = null
          } else {
            newSortingOrder = ListViewSortingOrder.DESC
          }
        } else {
          // 切换字段：从降序开始
          newSortingOrder = ListViewSortingOrder.DESC
        }

        return {
          ...prev,
          [String(showSearchBar)]: {
            ...currentState,
            sortingColumn: newSortingColumn,
            sortingOrder: newSortingOrder,
          },
        }
      })
    },
    [showSearchBar],
  )

  const handleButtonGroupClick = useCallback(
    (sectionId: string) => {
      handleInstanceCategoryChange(sectionId, true)
    },
    [handleInstanceCategoryChange],
  )

  return (
    <AgentHubContainer>
      <AgentTopNavigationBar />
      <AgentHubWrapper ref={agentHubWrapperRef as any} className='scroll-style'>
        <MarketPlaceWrapper>
          {!isMobile && (
            <MarketPlaceHeader>
              <Title>
                <Trans>Agent Marketplace</Trans>
              </Title>
            </MarketPlaceHeader>
          )}
          <StickySearchHeader
            showSearchBar={showSearchBar}
            onSearchChange={handleSearchChange}
            searchString={displaySearchString}
          >
            <ButtonGroupBarWrapper>
              <ButtonGroup
                items={AGENT_CATEGORIES.map((category) => ({
                  id: category.id,
                  label: t(category.titleKey),
                  value: category.id,
                }))}
                onItemClick={handleButtonGroupClick}
                showAll={true}
                value={currentInstance.category}
              />
              <SwitchViewButton />
            </ButtonGroupBarWrapper>
            {viewMode === AgentHubViewMode.LIST && (
              <AgentListViewSortingBar
                sortingColumn={currentInstance.sortingColumn}
                sortingOrder={currentInstance.sortingOrder}
                onSort={handleInstanceSort}
              />
            )}
          </StickySearchHeader>

          {viewMode === AgentHubViewMode.CARD && currentInstance.category == '' && (
            <AgentMarketplaceCardView showSearchBar={showSearchBar} />
          )}

          {viewMode === AgentHubViewMode.CARD && currentInstance.category !== '' && currentInstance.category && (
            <AgentMarketplaceCategoryCardView showSearchBar={showSearchBar} category={currentInstance.category} />
          )}

          {viewMode === AgentHubViewMode.LIST && (
            <AgentMarketplaceListView
              key={`list_${showSearchBar}`}
              showSearchBar={showSearchBar}
              category={currentInstance.category}
              sortingColumn={currentInstance.sortingColumn}
              sortingOrder={currentInstance.sortingOrder}
              searchString={showSearchBar ? searchString : ''}
            />
          )}
        </MarketPlaceWrapper>
      </AgentHubWrapper>
    </AgentHubContainer>
  )
})
