import { memo, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { TAB_CONFIG, TAB_CONTENT_CONFIG, TabKey } from 'constants/useCases'
import { useActiveTab, useCarouselPaused, useIsPlaying } from 'store/usecases/hooks/useUseCasesHooks'
import { ANI_DURATION } from 'constants/index'
import { useIsMobile } from 'store/application/hooks'
import Select, { TriggerMethod, DataType } from 'components/Select'
import { useTheme } from 'styled-components'
import { vm } from 'pages/helper'

const TabContainer = styled.div`
  margin-bottom: 40px;
  overflow-x: auto;
  min-height: 48px;

  /* 隐藏滚动条但保持可滚动 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const TabListWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  width: fit-content;
  height: 48px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  border-radius: 12px;
`

const TabItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  height: 40px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;
  gap: 4px;
  flex-shrink: 0;

  background-color: ${({ $active, theme }) => ($active ? theme.bgT30 : 'transparent')};
  color: ${({ theme }) => theme.textL1};

  &:hover {
    background-color: ${({ $active, theme }) => ($active ? theme.bgT30 : theme.bgT20)};
  }

  i {
    font-size: 18px;
    flex-shrink: 0;
    line-height: 1;
  }

  span {
    flex-shrink: 0;
  }
`

// 移动端下拉选单容器
const MobileSelectContainer = styled.div`
  margin-bottom: ${vm(12)};
  min-height: 40px;
  .select-border-wrapper {
    border-radius: ${vm(8)};
  }
`

// 移动端选单按钮
const MobileSelectButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0;
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;

  &:hover {
    background-color: ${({ theme }) => theme.bgT20};
  }
`

// 移动端选单文本容器
const MobileSelectContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  color: ${({ theme }) => theme.textL1};

  i {
    font-size: 0.18rem;
    line-height: 0.2rem;
    flex-shrink: 0;
  }

  span {
    font-size: 0.14rem;
    font-weight: 400;
    line-height: 0.2rem;
    flex-shrink: 0;
  }
`

// 下拉选单选项容器
const SelectOptionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  color: ${({ theme }) => theme.textL2};

  i {
    font-size: 0.18rem;
    line-height: 0.2rem;
    flex-shrink: 0;
  }

  span {
    font-size: 0.14rem;
    font-weight: 400;
    line-height: 0.2rem;
    flex: 1;
  }
`

function UseCasesTabBar() {
  const [, setIsPlaying] = useIsPlaying()
  const [activeTab, setActiveTab] = useActiveTab()
  const [, setCarouselPaused] = useCarouselPaused()
  const isMobile = useIsMobile()
  const theme = useTheme()

  const handleTabClick = useCallback(
    (value: TabKey) => {
      setIsPlaying(false)
      setActiveTab(value)
    },
    [setActiveTab, setIsPlaying],
  )

  // 转换为下拉选单的数据格式
  const selectDataList: DataType[] = useMemo(() => {
    return TAB_CONFIG.map((tab) => {
      const tabConfig = TAB_CONTENT_CONFIG[tab.value as TabKey]
      return {
        text: (
          <SelectOptionContent>
            {tabConfig?.icon && <i className={tabConfig.icon} />}
            <span>{tab.text}</span>
          </SelectOptionContent>
        ),
        value: tab.value,
        key: tab.key,
        isActive: activeTab === tab.value,
        clickCallback: () => handleTabClick(tab.value as TabKey),
      }
    })
  }, [activeTab, handleTabClick])

  // 获取当前选中的tab信息
  const currentTab = useMemo(() => {
    return TAB_CONFIG.find((tab) => tab.value === activeTab)
  }, [activeTab])

  const currentTabConfig = useMemo(() => {
    return TAB_CONTENT_CONFIG[activeTab]
  }, [activeTab])

  const onShowDropdown = useCallback(() => {
    setCarouselPaused(true)
  }, [setCarouselPaused])

  // 移动端显示下拉选单
  if (isMobile) {
    return (
      <MobileSelectContainer>
        <Select
          value={activeTab}
          dataList={selectDataList}
          triggerMethod={TriggerMethod.CLICK}
          usePortal={true}
          placement='bottom-start'
          alignPopWidth={true}
          activeIconColor={theme.textL2}
          hideScrollbar={true}
          borderWrapperBg='transparent'
          onShow={onShowDropdown}
        >
          <MobileSelectButton>
            <MobileSelectContent>
              {currentTabConfig?.icon && <i className={currentTabConfig.icon} />}
              <span>{currentTab?.text}</span>
            </MobileSelectContent>
          </MobileSelectButton>
        </Select>
      </MobileSelectContainer>
    )
  }

  // 桌面端显示tab bar
  return (
    <TabContainer>
      <TabListWrapper>
        {TAB_CONFIG.map((tab) => {
          const tabConfig = TAB_CONTENT_CONFIG[tab.value as TabKey]
          const iconClassName = tabConfig?.icon
          const isActive = activeTab === tab.value

          return (
            <TabItem key={tab.key} $active={isActive} onClick={() => handleTabClick(tab.value as TabKey)}>
              {iconClassName && <i className={iconClassName} />}
              <span>{tab.text}</span>
            </TabItem>
          )
        })}
      </TabListWrapper>
    </TabContainer>
  )
}

UseCasesTabBar.displayName = 'UseCasesTabBar'

export default memo(UseCasesTabBar)
