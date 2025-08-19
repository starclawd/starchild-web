import styled, { css } from 'styled-components'
import { Trans } from '@lingui/react/macro'
import { memo, useCallback, useMemo, useEffect, useRef, useState } from 'react'
import { vm } from 'pages/helper'
import ButtonGroup from './components/ButtonGroup'
import StickySearchHeader from 'pages/AgentHub/components/StickySearchHeader'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import { AGENT_CATEGORIES, AGENT_HUB_TYPE, TOKEN_DEEP_DIVE } from 'constants/agentHub'
import { AgentCategory } from 'store/agenthub/agenthub'
import AgentCardSection from './components/AgentCardSection'
import {
  useMarketplaceSearchString,
  useAgentMarketplaceInfoList,
  useSearchedAgentMarketplaceInfoList,
  useIsLoadingMarketplace,
  useGetAgentMarketplaceInfoList,
  useGetSearchedAgentMarketplaceInfoList,
} from 'store/agenthub/hooks'
import { debounce } from 'utils/common'
import { useIsMobile } from 'store/application/hooks'
import AgentTopNavigationBar from './components/AgentTopNavigationBar'
import { i18n } from '@lingui/core'
import { t } from '@lingui/core/macro'
import { IconButton } from 'components/Button'
import SwitchViewButton from './components/SwitchViewButton'
import { useAgentHubViewMode } from 'store/agenthubcache/hooks'
import { AgentHubViewMode } from 'store/agenthubcache/agenthubcache'
import AgentTable from './components/AgentTableList/components/AgentTable'

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

const SectionsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 80px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
    `}
`

const ButtonGroupBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`

interface AgentHubProps {
  showSearchBar?: boolean
}

export default memo(function AgentHub({ showSearchBar = true }: AgentHubProps) {
  const agentHubWrapperRef = useScrollbarClass<HTMLDivElement>()

  const [agentMarketplaceInfoList] = useAgentMarketplaceInfoList()
  const [searchedAgentMarketplaceInfoList] = useSearchedAgentMarketplaceInfoList()
  const [isLoading] = useIsLoadingMarketplace()
  const getAgentMarketplaceList = useGetAgentMarketplaceInfoList()
  const getSearchedAgentMarketplaceList = useGetSearchedAgentMarketplaceInfoList()
  const [searchString, setSearchString] = useMarketplaceSearchString()
  const isInitializedRef = useRef(false)
  const isMobile = useIsMobile()
  const [viewMode] = useAgentHubViewMode()
  const [currentTag, setCurrentTag] = useState<string>('')

  const currentAgentList = showSearchBar && searchString ? searchedAgentMarketplaceInfoList : agentMarketplaceInfoList

  const loadData = useCallback(
    (filterString: string) => {
      if (filterString) {
        getSearchedAgentMarketplaceList(filterString)
      } else {
        getAgentMarketplaceList()
      }
    },
    [getAgentMarketplaceList, getSearchedAgentMarketplaceList],
  )

  // 搜索防抖处理
  const debouncedSearch = useMemo(() => debounce(loadData, 500), [loadData])

  // 初始化
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true
      loadData(searchString)
    }
  }, [loadData, searchString])

  // 处理搜索字符串变化
  useEffect(() => {
    if (isInitializedRef.current) {
      debouncedSearch(searchString)
    }
  }, [searchString, debouncedSearch])

  // 添加一个ref来跟踪是否是程序化滚动
  const isProgrammaticScrollRef = useRef(false)

  const handleButtonGroupClick = useCallback(
    (sectionId: string) => {
      setCurrentTag(sectionId)
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
    [agentHubWrapperRef, isMobile, showSearchBar, setCurrentTag],
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
            onSearchChange={setSearchString}
            searchString={searchString}
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
                value={currentTag}
              />
              <SwitchViewButton />
            </ButtonGroupBarWrapper>
          </StickySearchHeader>

          {viewMode === AgentHubViewMode.CARD && (
            <SectionsWrapper>
              {AGENT_CATEGORIES.map((category: AgentCategory) => {
                // // 获取特定的runAgentCard组件
                // let runAgentCard = undefined
                // if (category.id === AGENT_HUB_TYPE.SIGNAL_SCANNER) {
                //   runAgentCard = <RunAgentCard onRunAgent={handleRunAgent} />
                // } else if (category.id === AGENT_HUB_TYPE.INDICATOR) {
                //   runAgentCard = <IndicatorRunAgentCard onRunAgent={handleRunAgent} />
                // }

                // 获取skeleton类型
                const skeletonType = category.id === AGENT_HUB_TYPE.INDICATOR ? 'with-image' : 'default'

                return (
                  <AgentCardSection
                    key={category.id}
                    category={category}
                    isSectionMode={true}
                    showViewMore={isMobile ? !showSearchBar : !searchString}
                    maxAgents={showSearchBar && searchString ? undefined : category.maxDisplayCountOnMarketPlace}
                    customAgents={currentAgentList
                      .filter((agent) => agent.types.some((type) => type === category.id))
                      .filter((agent) => {
                        if (category.id === AGENT_HUB_TYPE.KOL_RADAR) {
                          return agent.kolInfo !== undefined
                        }
                        if (category.id === AGENT_HUB_TYPE.TOKEN_DEEP_DIVE) {
                          return agent.tokenInfo !== undefined
                        }
                        return true
                      })}
                    isLoading={isLoading}
                    // runAgentCard={runAgentCard}
                    skeletonType={skeletonType}
                  />
                )
              })}
            </SectionsWrapper>
          )}
          {viewMode === AgentHubViewMode.LIST && (
            <AgentTable
              agents={currentAgentList
                .filter((agent) => agent.kolInfo === undefined && agent.tokenInfo === undefined)
                .filter((agent, index, array) => array.findIndex((a) => a.agentId === agent.agentId) === index)
                .filter((agent) => agent.types.some((type) => (currentTag === '' ? true : type === currentTag)))
                .sort((a, b) => {
                  return b.subscriberCount - a.subscriberCount
                })}
              isLoading={isLoading}
              hasLoadMore={false}
              isLoadMoreLoading={false}
            />
          )}
        </MarketPlaceWrapper>
      </AgentHubWrapper>
    </AgentHubContainer>
  )
})
