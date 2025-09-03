import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useEffect, useRef, useState } from 'react'
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
import AgentMarketplaceCardView from './components/AgentMarketplaceCardView'
import useParsedQueryString from 'hooks/useParsedQueryString'
import { ListViewSortingColumn, ListViewSortingOrder } from 'store/agenthub/agenthub'

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
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  text-align: center;
  text-transform: capitalize;
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

  // 保留全局分类状态用于向后兼容，但主要使用实例状态
  const [currentTag, setCurrentTag] = useState('')

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
    (category: string) => {
      setInstanceStates((prev) => ({
        ...prev,
        [String(showSearchBar)]: {
          ...prev[String(showSearchBar)],
          category,
        },
      }))
    },
    [showSearchBar],
  )

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

  // 添加一个ref来跟踪是否是程序化滚动
  const isProgrammaticScrollRef = useRef(false)

  const handleButtonGroupClick = useCallback(
    (sectionId: string) => {
      // 更新全局状态（保持向后兼容）
      if (viewMode === AgentHubViewMode.CARD) {
        setCurrentTag(sectionId)
      } else {
        handleInstanceCategoryChange(sectionId)
      }

      const scrollContainer = agentHubWrapperRef.current
      if (scrollContainer) {
        const element = scrollContainer.querySelector(`[id="${sectionId}"]`)
        if (element) {
          const containerRect = scrollContainer.getBoundingClientRect()
          const elementRect = element.getBoundingClientRect()
          const offset = isMobile ? (showSearchBar ? 90 : 40) : 140
          const targetTop = scrollContainer.scrollTop + elementRect.top - containerRect.top - offset

          // 标记为程序化滚动
          isProgrammaticScrollRef.current = true
          scrollContainer.scrollTo({
            top: targetTop,
            behavior: 'smooth',
          })
          // 滚动完成后重置标记
          setTimeout(() => {
            isProgrammaticScrollRef.current = false
          }, 1000)
        }
      }
    },
    [agentHubWrapperRef, isMobile, showSearchBar, setCurrentTag, handleInstanceCategoryChange, viewMode],
  )

  const handleRunAgent = useCallback(() => {
    console.log('Run Agent clicked')
    // Handle run agent action
  }, [])

  // 滚动监听，自动更新currentTag
  useEffect(() => {
    const scrollContainer = agentHubWrapperRef.current
    if (!scrollContainer || viewMode !== AgentHubViewMode.CARD) return

    const handleScroll = debounce(() => {
      // 如果是程序化滚动，则不更新currentTag
      if (isProgrammaticScrollRef.current) return

      const containerRect = scrollContainer.getBoundingClientRect()
      const stickyHeaderHeight = isMobile ? (showSearchBar ? 90 : 40) : 140
      // 滚动检测偏移量配置
      // 这个值决定了section在距离顶部多远时被认为是"当前激活"的section
      // 正值: section顶部距离sticky header底部还有这么多像素时就激活（提前激活）
      // 0: section顶部刚好到达sticky header底部时激活
      // 负值: section顶部超过sticky header底部这么多像素后才激活（延迟激活）
      // 建议范围: -200 到 200，可根据实际效果调整
      const scrollDetectionOffset = 100

      // 检测点位置 = 容器顶部 + sticky header高度 + 自定义偏移量
      const detectionPoint = containerRect.top + stickyHeaderHeight + scrollDetectionOffset

      let activeSection = ''
      let lastSectionAboveDetectionPoint = ''

      // 遍历所有的section，找到当前应该激活的section
      AGENT_CATEGORIES.forEach((category) => {
        const element = scrollContainer.querySelector(`[id="${category.id}"]`)
        if (element) {
          const elementRect = element.getBoundingClientRect()
          const elementTop = elementRect.top

          // 如果section顶部在检测点上方，记录它
          if (elementTop <= detectionPoint) {
            lastSectionAboveDetectionPoint = category.id
          }
        }
      })

      // 使用最后一个在检测点上方的section作为当前激活的section
      activeSection = lastSectionAboveDetectionPoint || AGENT_CATEGORIES[0]?.id || ''

      // 如果找到了激活的section，且与当前不同，则更新
      if (activeSection && activeSection !== currentTag) {
        setCurrentTag(activeSection)
      }
    }, 100)

    scrollContainer.addEventListener('scroll', handleScroll)

    // 初始检查一次
    handleScroll()

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [agentHubWrapperRef, currentTag, isMobile, showSearchBar, setCurrentTag, viewMode])

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
                showAll={viewMode === AgentHubViewMode.LIST}
                value={viewMode === AgentHubViewMode.CARD ? currentTag : currentInstance.category}
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

          {viewMode === AgentHubViewMode.CARD && <AgentMarketplaceCardView showSearchBar={showSearchBar} />}
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
