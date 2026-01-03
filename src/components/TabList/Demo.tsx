import React, { useState } from 'react'
import styled from 'styled-components'
import TabList from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .tab-container {
    width: 100%;
    max-width: 500px;
    height: 40px;
  }

  .demo-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.textL1};
    }

    .description {
      color: ${({ theme }) => theme.textL3};
      font-size: 14px;
    }

    .stats {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: ${({ theme }) => theme.textL3};
      font-family: monospace;
    }
  }
`

const ContentDisplay = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;

  .content-text {
    color: ${({ theme }) => theme.textL1};
    font-size: 16px;
    text-align: center;
  }
`

const TabGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
`

const TabDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .demo-label {
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    font-size: 14px;
  }

  .demo-description {
    color: ${({ theme }) => theme.textL3};
    font-size: 12px;
  }

  .tab-wrapper {
    height: 40px;
  }
`

const StatusDisplay = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .label {
      color: ${({ theme }) => theme.textL3};
    }

    .value {
      color: ${({ theme }) => theme.textL1};
      font-weight: 500;
      font-family: monospace;
    }
  }
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.textL1};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
`

const PropsTable = styled.div`
  background: ${({ theme }) => theme.bgL2};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.textL1};
`

const PropsTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8}10;

  &:last-child {
    border-bottom: none;
  }
`

const PropsTableCell = styled.div<{ type?: 'prop' | 'type' | 'default' | 'desc' }>`
  font-family: ${(props) =>
    props.type === 'prop' || props.type === 'type' || props.type === 'default' ? 'monospace' : 'inherit'};
  color: ${({ theme, type }) => {
    switch (type) {
      case 'prop':
        return theme.textL1
      case 'type':
        return theme.brand100
      case 'default':
        return theme.textL3
      default:
        return theme.textL2
    }
  }};
`

const TabListDemo = () => {
  const [basicTabKey, setBasicTabKey] = useState<string | number>('tab1')
  const [iconTabKey, setIconTabKey] = useState<string | number>('home')
  const [contentTabKey, setContentTabKey] = useState<string | number>('product')
  const [numberTabKey, setNumberTabKey] = useState<string | number>(0)

  const [clickStats, setClickStats] = useState({
    totalClicks: 0,
    lastClickedTab: '',
    lastClickTime: '',
  })

  const handleTabClick = (tabName: string) => {
    setClickStats((prev) => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      lastClickedTab: tabName,
      lastClickTime: new Date().toLocaleTimeString(),
    }))
  }

  // 基础标签页配置
  const basicTabList = [
    {
      key: 'tab1',
      text: '选项一',
      clickCallback: (key: string | number) => {
        setBasicTabKey(key)
        handleTabClick('选项一')
      },
    },
    {
      key: 'tab2',
      text: '选项二',
      clickCallback: (key: string | number) => {
        setBasicTabKey(key)
        handleTabClick('选项二')
      },
    },
    {
      key: 'tab3',
      text: '选项三',
      clickCallback: (key: string | number) => {
        setBasicTabKey(key)
        handleTabClick('选项三')
      },
    },
  ]

  // 带图标的标签页配置
  const iconTabList = [
    {
      key: 'home',
      text: '首页',
      icon: <i className='iconfont icon-home' />,
      clickCallback: (key: string | number) => {
        setIconTabKey(key)
        handleTabClick('首页')
      },
    },
    {
      key: 'explore',
      text: '探索',
      icon: <i className='iconfont icon-explore' />,
      clickCallback: (key: string | number) => {
        setIconTabKey(key)
        handleTabClick('探索')
      },
    },
    {
      key: 'settings',
      text: '设置',
      icon: <i className='iconfont icon-settings' />,
      clickCallback: (key: string | number) => {
        setIconTabKey(key)
        handleTabClick('设置')
      },
    },
  ]

  // 内容联动标签页配置
  const contentTabList = [
    {
      key: 'product',
      text: '产品',
      clickCallback: (key: string | number) => {
        setContentTabKey(key)
        handleTabClick('产品')
      },
    },
    {
      key: 'service',
      text: '服务',
      clickCallback: (key: string | number) => {
        setContentTabKey(key)
        handleTabClick('服务')
      },
    },
    {
      key: 'support',
      text: '支持',
      clickCallback: (key: string | number) => {
        setContentTabKey(key)
        handleTabClick('支持')
      },
    },
  ]

  // 数字 key 的标签页配置
  const numberKeyTabList = [
    {
      key: 0,
      text: 'Tab 1',
      clickCallback: (key: string | number) => {
        setNumberTabKey(key)
        handleTabClick('Tab 1')
      },
    },
    {
      key: 1,
      text: 'Tab 2',
      clickCallback: (key: string | number) => {
        setNumberTabKey(key)
        handleTabClick('Tab 2')
      },
    },
  ]

  const getContentForTab = (key: string | number) => {
    const contents: Record<string, { title: string; description: string; features: string[] }> = {
      product: {
        title: '产品中心',
        description: '我们提供创新的技术产品解决方案，帮助客户实现数字化转型。',
        features: ['AI 智能分析', '云端部署', '实时监控', '数据可视化'],
      },
      service: {
        title: '专业服务',
        description: '提供全方位的技术服务和咨询，确保项目成功实施。',
        features: ['技术咨询', '项目实施', '系统集成', '运维支持'],
      },
      support: {
        title: '客户支持',
        description: '24/7 全天候技术支持，确保系统稳定运行。',
        features: ['在线客服', '电话支持', '邮件支持', '远程协助'],
      },
    }
    return contents[key as string] || contents.product
  }

  const currentContent = getContentForTab(contentTabKey)

  return (
    <DemoContainer>
      <DemoSection>
        <h2>TabList 标签页组件示例</h2>
        <p>
          TabList 是一个简洁的标签页切换组件，支持文本和图标显示。 选中状态通过背景色高亮显示，提供平滑的过渡动画效果。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最基本的标签页切换</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList tabKey={basicTabKey} tabList={basicTabList} />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>基础标签页</div>
              <div className='description'>支持多个选项之间的切换</div>
            </div>
            <div className='stats'>
              <span>当前选中: {basicTabKey}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const [tabKey, setTabKey] = useState('tab1')

const tabList = [
  {
    key: 'tab1',
    text: '选项一',
    clickCallback: (key) => setTabKey(key)
  },
  {
    key: 'tab2',
    text: '选项二',
    clickCallback: (key) => setTabKey(key)
  },
  {
    key: 'tab3',
    text: '选项三',
    clickCallback: (key) => setTabKey(key)
  }
]

<TabList tabKey={tabKey} tabList={tabList} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>带图标的标签页</h3>
        <p>支持在文本前添加图标</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList tabKey={iconTabKey} tabList={iconTabList} />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>图标标签页</div>
              <div className='description'>图标和文本组合展示</div>
            </div>
            <div className='stats'>
              <span>当前选中: {iconTabKey}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const iconTabList = [
  {
    key: 'home',
    text: '首页',
    icon: <i className='iconfont icon-home' />,
    clickCallback: (key) => setTabKey(key)
  },
  {
    key: 'explore',
    text: '探索',
    icon: <i className='iconfont icon-explore' />,
    clickCallback: (key) => setTabKey(key)
  },
  {
    key: 'settings',
    text: '设置',
    icon: <i className='iconfont icon-settings' />,
    clickCallback: (key) => setTabKey(key)
  }
]

<TabList tabKey={tabKey} tabList={iconTabList} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>多种使用场景</h3>
        <p>展示不同的标签页配置和使用场景</p>

        <TabGrid>
          <TabDemo>
            <div className='demo-label'>状态筛选</div>
            <div className='demo-description'>不同状态过滤</div>
            <div className='tab-wrapper'>
              <TabList
                tabKey={basicTabKey}
                tabList={[
                  { key: 'all', text: '全部', clickCallback: setBasicTabKey },
                  { key: 'active', text: '活跃', clickCallback: setBasicTabKey },
                  { key: 'inactive', text: '已结束', clickCallback: setBasicTabKey },
                ]}
              />
            </div>
          </TabDemo>

          <TabDemo>
            <div className='demo-label'>时间范围</div>
            <div className='demo-description'>时间筛选选项</div>
            <div className='tab-wrapper'>
              <TabList
                tabKey={numberTabKey}
                tabList={[
                  { key: 0, text: '24H', clickCallback: setNumberTabKey },
                  { key: 1, text: '7D', clickCallback: setNumberTabKey },
                  { key: 2, text: '30D', clickCallback: setNumberTabKey },
                  { key: 3, text: 'All', clickCallback: setNumberTabKey },
                ]}
              />
            </div>
          </TabDemo>

          <TabDemo>
            <div className='demo-label'>视图切换</div>
            <div className='demo-description'>不同视图模式</div>
            <div className='tab-wrapper'>
              <TabList
                tabKey={basicTabKey}
                tabList={[
                  { key: 'list', text: '列表', clickCallback: setBasicTabKey },
                  { key: 'grid', text: '网格', clickCallback: setBasicTabKey },
                ]}
              />
            </div>
          </TabDemo>

          <TabDemo>
            <div className='demo-label'>数据类型</div>
            <div className='demo-description'>不同数据类型切换</div>
            <div className='tab-wrapper'>
              <TabList
                tabKey={basicTabKey}
                tabList={[
                  { key: 'overview', text: '概览', clickCallback: setBasicTabKey },
                  { key: 'positions', text: '持仓', clickCallback: setBasicTabKey },
                  { key: 'history', text: '历史', clickCallback: setBasicTabKey },
                ]}
              />
            </div>
          </TabDemo>
        </TabGrid>
      </DemoSection>

      <DemoSection>
        <h3>与内容联动</h3>
        <p>标签页切换时同步更新下方内容</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList tabKey={contentTabKey} tabList={contentTabList} />
          </div>
          <ContentDisplay>
            <div className='content-text'>
              <h4 style={{ margin: '0 0 10px 0', color: 'inherit' }}>{currentContent.title}</h4>
              <p style={{ margin: '0 0 15px 0', opacity: 0.8 }}>{currentContent.description}</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                {currentContent.features.map((feature, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '4px 8px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </ContentDisplay>
        </DemoRow>

        <CodeBlock>
          {`const contentTabList = [
  {
    key: 'product',
    text: '产品',
    clickCallback: (key) => setContentTabKey(key)
  },
  // ... 其他标签页
]

// 根据当前标签显示不同内容
const currentContent = getContentForTab(contentTabKey)

<TabList tabKey={contentTabKey} tabList={contentTabList} />

<div className="content-area">
  {currentContent}
</div>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>数字类型 Key</h3>
        <p>使用数字作为标签页的 key</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList tabKey={numberTabKey} tabList={numberKeyTabList} />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>数字 Key 标签页</div>
              <div className='description'>使用数字类型作为 key 值</div>
            </div>
            <div className='stats'>
              <span>当前选中: {numberTabKey}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const [tabKey, setTabKey] = useState(0)

const tabList = [
  {
    key: 0,
    text: 'Tab 1',
    clickCallback: (key) => setTabKey(key)
  },
  {
    key: 1,
    text: 'Tab 2',
    clickCallback: (key) => setTabKey(key)
  }
]

<TabList tabKey={tabKey} tabList={tabList} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>使用统计</h3>
        <p>标签页点击和使用的统计信息</p>

        <StatusDisplay>
          <div className='status-item'>
            <span className='label'>总点击次数:</span>
            <span className='value'>{clickStats.totalClicks}</span>
          </div>
          <div className='status-item'>
            <span className='label'>最后点击的标签:</span>
            <span className='value'>{clickStats.lastClickedTab || '无'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>最后点击时间:</span>
            <span className='value'>{clickStats.lastClickTime || '无'}</span>
          </div>
        </StatusDisplay>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>TabList 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>tabKey</PropsTableCell>
            <PropsTableCell type='type'>string | number</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>当前激活的标签页 key（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>tabList</PropsTableCell>
            <PropsTableCell type='type'>TabItem[]</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>标签页列表配置（必填）</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>TabItem 接口定义</h3>
          <CodeBlock>
            {`interface TabItem {
  key: string | number;                   // 标签页的唯一标识
  text: React.ReactNode;                  // 标签页显示的文本或组件
  icon?: React.ReactNode;                 // 可选：标签页图标
  clickCallback: (tabKey: string | number) => void;  // 点击标签页时的回调函数
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>完整接口定义</h3>
          <CodeBlock>
            {`interface TabListProps {
  tabKey: string | number;              // 必填：当前激活的标签 key
  tabList: TabItem[];                   // 必填：标签页配置列表
}

// 使用示例
const tabList: TabItem[] = [
  {
    key: 'home',
    text: '首页',
    icon: <i className='iconfont icon-home' />,
    clickCallback: (key) => setTabKey(key)
  },
  {
    key: 'settings',
    text: '设置',
    clickCallback: (key) => setTabKey(key)
  }
]`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>灵活的 Key 类型</strong>：支持 string 或 number 类型作为标签页的唯一标识
              </li>
              <li>
                <strong>图标支持</strong>：可以在标签文本前添加图标，图标和文本自动居中对齐
              </li>
              <li>
                <strong>响应式文本</strong>：支持 React.ReactNode 作为文本，可以自定义复杂内容
              </li>
              <li>
                <strong>平滑过渡</strong>：选中状态切换时有平滑的颜色和背景过渡动画
              </li>
              <li>
                <strong>悬停效果</strong>：未选中的标签页在悬停时有透明度变化效果
              </li>
              <li>
                <strong>主题适配</strong>：完美适配暗色和亮色主题
              </li>
              <li>
                <strong>CSS 类名暴露</strong>：暴露 tab-list-wrapper、tab-item、active 等类名便于自定义样式
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
            {`// 基础使用
import TabList from 'components/TabList'

function TabComponent() {
  const [activeTab, setActiveTab] = useState('tab1')
  
  const tabList = [
    {
      key: 'tab1',
      text: '选项一',
      clickCallback: (key) => setActiveTab(key)
    },
    {
      key: 'tab2',
      text: '选项二',
      clickCallback: (key) => setActiveTab(key)
    }
  ]
  
  return (
    <TabList
      tabKey={activeTab}
      tabList={tabList}
    />
  )
}

// 带图标
const iconTabList = [
  {
    key: 'home',
    text: '首页',
    icon: <i className='iconfont icon-home' />,
    clickCallback: (key) => setActiveTab(key)
  },
  {
    key: 'profile',
    text: '我的',
    icon: <i className='iconfont icon-user' />,
    clickCallback: (key) => setActiveTab(key)
  }
]

<TabList tabKey={activeTab} tabList={iconTabList} />

// 与内容联动
function TabWithContent() {
  const [activeTab, setActiveTab] = useState('tab1')
  
  const contents = {
    tab1: '内容1',
    tab2: '内容2',
    tab3: '内容3'
  }
  
  const tabList = [
    { key: 'tab1', text: 'Tab 1', clickCallback: (key) => setActiveTab(key) },
    { key: 'tab2', text: 'Tab 2', clickCallback: (key) => setActiveTab(key) },
    { key: 'tab3', text: 'Tab 3', clickCallback: (key) => setActiveTab(key) }
  ]
  
  return (
    <div>
      <TabList tabKey={activeTab} tabList={tabList} />
      <div className="content">
        {contents[activeTab]}
      </div>
    </div>
  )
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default TabListDemo
