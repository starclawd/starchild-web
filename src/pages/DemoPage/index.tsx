import React, { useState } from 'react'
import styled from 'styled-components'
import AvatarDemo from 'components/Avatar/Demo'
import TableDemo from 'components/Table/Demo'
import BottomSheetDemo from 'components/BottomSheet/Demo'
import ButtonDemo from 'components/Button/Demo'
import InputDemo from 'components/Input/Demo'
import InputAreaDemo from 'components/InputArea/Demo'
import MarkdownDemo from 'components/Markdown/Demo'
import MemoizedHighlightDemo from 'components/MemoizedHighlight/Demo'
import ModalDemo from 'components/Modal/Demo'
import MoveTabListDemo from 'components/MoveTabList/Demo'
import NoDataDemo from 'components/NoData/Demo'
import PendingDemo from 'components/Pending/Demo'
import PopoverDemo from 'components/Popover/Demo'
import PortalDemo from 'components/Portal/Demo'
import ScrollContainerDemo from 'components/ScrollContainer/Demo'
import SelectDemo from 'components/Select/Demo'
import TabListDemo from 'components/TabList/Demo'
import TooltipDemo from 'components/Tooltip/Demo'
import TransitionWrapperDemo from 'components/TransitionWrapper/Demo'
import IconsDemo from 'components/Icons/Demo'
import PullUpRefreshDemo from 'components/PullUpRefresh/Demo'

const DemoPageWrapper = styled.div`
  display: flex;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
  overflow: hidden;
`

const Sidebar = styled.div`
  width: 280px;
  background: ${({ theme }) => theme.bgL2};
  border-right: 1px solid ${({ theme }) => theme.lineDark8};
  padding: 20px 0;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 240px;
  }
`

const SidebarHeader = styled.div`
  padding: 0 20px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    margin: 0;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.textL3};
    margin: 8px 0 0 0;
  }
`

const ComponentGroup = styled.div`
  margin-bottom: 16px;

  .group-title {
    padding: 8px 20px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.textL3};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const ComponentItem = styled.div<{ $active?: boolean }>`
  padding: 12px 20px;
  cursor: pointer;
  color: ${({ theme, $active }) => ($active ? theme.brand6 : theme.textL2)};
  background: ${({ theme, $active }) => ($active ? theme.brand6 + '15' : 'transparent')};
  border-right: ${({ theme, $active }) => ($active ? `3px solid ${theme.brand6}` : '3px solid transparent')};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand6 + '10'};
    color: ${({ theme }) => theme.brand6};
  }

  .component-name {
    font-weight: 500;
    font-size: 14px;
  }

  .component-desc {
    font-size: 12px;
    color: ${({ theme }) => theme.textL4};
    margin-top: 2px;
  }
`

const MainContent = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.bgL1};
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`

const ContentHeader = styled.div`
  padding: 24px 32px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  background: ${({ theme }) => theme.bgL1};
  flex-shrink: 0;
  z-index: 10;

  h2 {
    font-size: 28px;
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    margin: 0 0 8px 0;
  }

  p {
    font-size: 16px;
    color: ${({ theme }) => theme.textL3};
    margin: 0;
    line-height: 1.5;
  }
`

const ComponentContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  .demo-content {
    background: ${({ theme }) => theme.bgL1};
    height: 100%;
  }
`

// 组件配置
const components = [
  {
    id: 'input',
    name: 'Input',
    desc: '输入框组件',
    category: '数据录入',
    component: InputDemo,
  },
  {
    id: 'inputarea',
    name: 'InputArea',
    desc: '多行输入框组件',
    category: '数据录入',
    component: InputAreaDemo,
  },
  {
    id: 'select',
    name: 'Select',
    desc: '下拉选择组件',
    category: '数据录入',
    component: SelectDemo,
  },
  {
    id: 'button',
    name: 'Button',
    desc: '按钮组件',
    category: '通用',
    component: ButtonDemo,
  },
  {
    id: 'icons',
    name: 'Icons',
    desc: '图标库展示',
    category: '通用',
    component: IconsDemo,
  },
  {
    id: 'movetablist',
    name: 'MoveTabList',
    desc: '动态标签页组件',
    category: '通用',
    component: MoveTabListDemo,
  },
  {
    id: 'tablist',
    name: 'TabList',
    desc: '标签列表组件',
    category: '通用',
    component: TabListDemo,
  },
  {
    id: 'transitionwrapper',
    name: 'TransitionWrapper',
    desc: '过渡动画组件',
    category: '通用',
    component: TransitionWrapperDemo,
  },
  {
    id: 'avatar',
    name: 'Avatar',
    desc: '头像组件',
    category: '数据展示',
    component: AvatarDemo,
  },
  {
    id: 'table',
    name: 'Table',
    desc: '表格组件',
    category: '数据展示',
    component: TableDemo,
  },
  {
    id: 'markdown',
    name: 'Markdown',
    desc: 'Markdown 渲染组件',
    category: '数据展示',
    component: MarkdownDemo,
  },
  {
    id: 'memoizedhighlight',
    name: 'MemoizedHighlight',
    desc: '代码高亮组件',
    category: '数据展示',
    component: MemoizedHighlightDemo,
  },
  {
    id: 'nodata',
    name: 'NoData',
    desc: '空状态组件',
    category: '数据展示',
    component: NoDataDemo,
  },
  {
    id: 'pending',
    name: 'Pending',
    desc: '加载状态组件',
    category: '反馈',
    component: PendingDemo,
  },
  {
    id: 'popover',
    name: 'Popover',
    desc: '弹出框组件',
    category: '反馈',
    component: PopoverDemo,
  },
  {
    id: 'tooltip',
    name: 'Tooltip',
    desc: '提示组件',
    category: '反馈',
    component: TooltipDemo,
  },
  {
    id: 'portal',
    name: 'Portal',
    desc: '传送门组件',
    category: '通用',
    component: PortalDemo,
  },
  {
    id: 'scrollcontainer',
    name: 'ScrollContainer',
    desc: '滚动容器组件',
    category: '通用',
    component: ScrollContainerDemo,
  },
  {
    id: 'bottomsheet',
    name: 'BottomSheet',
    desc: '底部弹层组件',
    category: '反馈',
    component: BottomSheetDemo,
  },
  {
    id: 'modal',
    name: 'Modal',
    desc: '弹窗组件',
    category: '反馈',
    component: ModalDemo,
  },
  {
    id: 'pulluprefresh',
    name: 'PullUpRefresh',
    desc: '上拉加载更多组件',
    category: '通用',
    component: PullUpRefreshDemo,
  },
]

// 按分类分组
const componentGroups = components.reduce(
  (groups, component) => {
    const category = component.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(component)
    return groups
  },
  {} as Record<string, typeof components>,
)

export default function DemoPage() {
  const [activeComponent, setActiveComponent] = useState('avatar')

  const currentComponent = components.find((c) => c.id === activeComponent)
  const CurrentDemo = currentComponent?.component || (() => <div>组件未找到</div>)

  return (
    <DemoPageWrapper>
      <Sidebar className='scroll-style'>
        <SidebarHeader>
          <h1>组件库</h1>
          <p>Holomind Web 组件演示</p>
        </SidebarHeader>

        {Object.entries(componentGroups).map(([category, items]) => (
          <ComponentGroup key={category}>
            <div className='group-title'>{category}</div>
            {items.map((component) => (
              <ComponentItem
                key={component.id}
                $active={activeComponent === component.id}
                onClick={() => setActiveComponent(component.id)}
              >
                <div className='component-name'>{component.name}</div>
                <div className='component-desc'>{component.desc}</div>
              </ComponentItem>
            ))}
          </ComponentGroup>
        ))}
      </Sidebar>

      <MainContent>
        <ContentHeader>
          <h2>{currentComponent?.name}</h2>
          <p>{currentComponent?.desc}的完整演示和使用示例</p>
        </ContentHeader>

        <ComponentContent className='scroll-style'>
          <div className='demo-content'>
            <CurrentDemo />
          </div>
        </ComponentContent>
      </MainContent>
    </DemoPageWrapper>
  )
}
