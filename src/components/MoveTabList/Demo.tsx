import React, { useState } from 'react'
import styled from 'styled-components'
import MoveTabList from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({theme}) => theme.bgL1};
  color: ${({theme}) => theme.textL1};
  min-height: 100vh;
  
  h2 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  h3 {
    color: ${({theme}) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  p {
    color: ${({theme}) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;
  
  h2 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;
  }
  
  h3 {
    color: ${({theme}) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  p {
    color: ${({theme}) => theme.textL3};
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
  background: ${({theme}) => theme.bgL2};
  border-radius: 8px;
  
  .tab-container {
    width: 100%;
    max-width: 400px;
  }
  
  .demo-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    
    .label {
      font-weight: 600;
      color: ${({theme}) => theme.textL1};
    }
    
    .description {
      color: ${({theme}) => theme.textL3};
      font-size: 14px;
    }
    
    .stats {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: ${({theme}) => theme.textL3};
      font-family: monospace;
    }
  }
`

const ContentDisplay = styled.div`
  margin-top: 20px;
  padding: 20px;
  background: ${({theme}) => theme.bgL0};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 8px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .content-text {
    color: ${({theme}) => theme.textL1};
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
  background: ${({theme}) => theme.bgL2};
  border-radius: 8px;
  
  .demo-label {
    font-weight: 600;
    color: ${({theme}) => theme.textL1};
    font-size: 14px;
  }
  
  .demo-description {
    color: ${({theme}) => theme.textL3};
    font-size: 12px;
  }
`

const StatusDisplay = styled.div`
  margin: 20px 0;
  padding: 15px;
  background: ${({theme}) => theme.bgL2};
  border-radius: 8px;
  
  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    
    .label {
      color: ${({theme}) => theme.textL3};
    }
    
    .value {
      color: ${({theme}) => theme.textL1};
      font-weight: 500;
      font-family: monospace;
    }
  }
`

const CodeBlock = styled.pre`
  background: ${({theme}) => theme.bgL2};
  color: ${({theme}) => theme.textL1};
  padding: 15px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
  margin: 15px 0;
`

const PropsTable = styled.div`
  background: ${({theme}) => theme.bgL2};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  font-weight: 600;
  border-bottom: 1px solid ${({theme}) => theme.lineDark8};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${({theme}) => theme.textL1};
`

const PropsTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({theme}) => theme.lineDark8}10;
  
  &:last-child {
    border-bottom: none;
  }
`

const PropsTableCell = styled.div<{ type?: 'prop' | 'type' | 'default' | 'desc' }>`
  font-family: ${props => props.type === 'prop' || props.type === 'type' || props.type === 'default' ? 'monospace' : 'inherit'};
  color: ${({theme, type}) => {
    switch(type) {
      case 'prop': return theme.textL1;
      case 'type': return theme.brand6;
      case 'default': return theme.textL3;
      default: return theme.textL2;
    }
  }};
`

const MoveTabListDemo = () => {
  const [twoTabIndex, setTwoTabIndex] = useState(0)
  const [threeTabIndex, setThreeTabIndex] = useState(0)
  const [dynamicTabIndex, setDynamicTabIndex] = useState(0)
  const [contentTabIndex, setContentTabIndex] = useState(0)
  const [forceWebTabIndex, setForceWebTabIndex] = useState(0)
  
  const [clickStats, setClickStats] = useState({
    totalClicks: 0,
    twoTabClicks: 0,
    threeTabClicks: 0,
    lastClickedTab: '',
    lastClickTime: ''
  })

  const handleTabClick = (tabType: string, tabName: string) => {
    setClickStats(prev => ({
      ...prev,
      totalClicks: prev.totalClicks + 1,
      [`${tabType}TabClicks`]: prev[`${tabType}TabClicks` as keyof typeof prev] as number + 1,
      lastClickedTab: tabName,
      lastClickTime: new Date().toLocaleTimeString()
    }))
  }

  // 二选项卡配置
  const twoTabList = [
    {
      key: 0,
      text: '选项一',
      clickCallback: () => {
        setTwoTabIndex(0)
        handleTabClick('two', '选项一')
      }
    },
    {
      key: 1,
      text: '选项二',
      clickCallback: () => {
        setTwoTabIndex(1)
        handleTabClick('two', '选项二')
      }
    }
  ]

  // 三选项卡配置
  const threeTabList = [
    {
      key: 0,
      text: 'Tab 1',
      clickCallback: () => {
        setThreeTabIndex(0)
        handleTabClick('three', 'Tab 1')
      }
    },
    {
      key: 1,
      text: 'Tab 2',
      clickCallback: () => {
        setThreeTabIndex(1)
        handleTabClick('three', 'Tab 2')
      }
    },
    {
      key: 2,
      text: 'Tab 3',
      clickCallback: () => {
        setThreeTabIndex(2)
        handleTabClick('three', 'Tab 3')
      }
    }
  ]

  // 动态选项卡配置
  const [dynamicTabs, setDynamicTabs] = useState([
    { key: 0, text: '首页', content: '这是首页的内容区域' },
    { key: 1, text: '关于', content: '这是关于页面的内容' },
    { key: 2, text: '联系', content: '这是联系我们的内容' }
  ])

  const dynamicTabList = dynamicTabs.map(tab => ({
    key: tab.key,
    text: tab.text,
    clickCallback: () => {
      setDynamicTabIndex(tab.key)
      handleTabClick('dynamic', tab.text)
    }
  }))

  // 内容展示选项卡
  const contentTabList = [
    {
      key: 0,
      text: '产品',
      clickCallback: () => {
        setContentTabIndex(0)
        handleTabClick('content', '产品')
      }
    },
    {
      key: 1,
      text: '服务',
      clickCallback: () => {
        setContentTabIndex(1)
        handleTabClick('content', '服务')
      }
    },
    {
      key: 2,
      text: '支持',
      clickCallback: () => {
        setContentTabIndex(2)
        handleTabClick('content', '支持')
      }
    }
  ]

  // 强制Web样式选项卡
  const forceWebTabList = [
    {
      key: 0,
      text: '桌面版',
      clickCallback: () => {
        setForceWebTabIndex(0)
        handleTabClick('forceWeb', '桌面版')
      }
    },
    {
      key: 1,
      text: '移动版',
      clickCallback: () => {
        setForceWebTabIndex(1)
        handleTabClick('forceWeb', '移动版')
      }
    }
  ]

  const getContentForTab = (index: number) => {
    const contents = [
      {
        title: '产品中心',
        description: '我们提供创新的技术产品解决方案，帮助客户实现数字化转型。',
        features: ['AI 智能分析', '云端部署', '实时监控', '数据可视化']
      },
      {
        title: '专业服务',
        description: '提供全方位的技术服务和咨询，确保项目成功实施。',
        features: ['技术咨询', '项目实施', '系统集成', '运维支持']
      },
      {
        title: '客户支持',
        description: '24/7 全天候技术支持，确保系统稳定运行。',
        features: ['在线客服', '电话支持', '邮件支持', '远程协助']
      }
    ]
    return contents[index] || contents[0]
  }

  const currentContent = getContentForTab(contentTabIndex)

  const addDynamicTab = () => {
    const newKey = Math.max(...dynamicTabs.map(t => t.key)) + 1
    setDynamicTabs(prev => [...prev, {
      key: newKey,
      text: `Tab ${newKey + 1}`,
      content: `这是动态添加的第 ${newKey + 1} 个标签页内容`
    }])
  }

  const removeDynamicTab = () => {
    if (dynamicTabs.length > 2) {
      setDynamicTabs(prev => prev.slice(0, -1))
      if (dynamicTabIndex >= dynamicTabs.length - 1) {
        setDynamicTabIndex(dynamicTabs.length - 2)
      }
    }
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>MoveTabList 动态标签页组件示例</h2>
        <p>
          MoveTabList 是一个带有动画指示器的标签页组件，支持2个或3个标签页。
          具有平滑的动画过渡效果，自动适配移动端和桌面端样式。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法 - 两个标签页</h3>
        <p>最基本的两个选项切换</p>
        
        <DemoRow>
          <div className="tab-container">
            <MoveTabList
              tabIndex={twoTabIndex}
              tabList={twoTabList}
            />
          </div>
          <div className="demo-info">
            <div>
              <div className="label">二选项标签页</div>
              <div className="description">支持两个选项之间的切换</div>
            </div>
            <div className="stats">
              <span>当前选中: {twoTabIndex === 0 ? '选项一' : '选项二'}</span>
              <span>点击次数: {clickStats.twoTabClicks}</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`const [tabIndex, setTabIndex] = useState(0)

const tabList = [
  {
    key: 0,
    text: '选项一',
    clickCallback: () => setTabIndex(0)
  },
  {
    key: 1,
    text: '选项二',
    clickCallback: () => setTabIndex(1)
  }
]

<MoveTabList
  tabIndex={tabIndex}
  tabList={tabList}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>三个标签页</h3>
        <p>支持三个选项的标签页切换</p>
        
        <DemoRow>
          <div className="tab-container">
            <MoveTabList
              tabIndex={threeTabIndex}
              tabList={threeTabList}
            />
          </div>
          <div className="demo-info">
            <div>
              <div className="label">三选项标签页</div>
              <div className="description">支持三个选项之间的切换</div>
            </div>
            <div className="stats">
              <span>当前选中: Tab {threeTabIndex + 1}</span>
              <span>点击次数: {clickStats.threeTabClicks}</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`const threeTabList = [
  {
    key: 0,
    text: 'Tab 1',
    clickCallback: () => setTabIndex(0)
  },
  {
    key: 1,
    text: 'Tab 2',
    clickCallback: () => setTabIndex(1)
  },
  {
    key: 2,
    text: 'Tab 3',
    clickCallback: () => setTabIndex(2)
  }
]

<MoveTabList
  tabIndex={tabIndex}
  tabList={threeTabList}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>多种样式组合</h3>
        <p>展示不同的标签页配置和样式</p>
        
        <TabGrid>
          <TabDemo>
            <div className="demo-label">开关式标签</div>
            <div className="demo-description">类似开关的二选项</div>
            <MoveTabList
              tabIndex={twoTabIndex}
              tabList={[
                { key: 0, text: '开启', clickCallback: () => setTwoTabIndex(0) },
                { key: 1, text: '关闭', clickCallback: () => setTwoTabIndex(1) }
              ]}
            />
          </TabDemo>
          
          <TabDemo>
            <div className="demo-label">模式切换</div>
            <div className="demo-description">不同模式之间切换</div>
            <MoveTabList
              tabIndex={threeTabIndex}
              tabList={[
                { key: 0, text: '列表', clickCallback: () => setThreeTabIndex(0) },
                { key: 1, text: '网格', clickCallback: () => setThreeTabIndex(1) },
                { key: 2, text: '卡片', clickCallback: () => setThreeTabIndex(2) }
              ]}
            />
          </TabDemo>
          
          <TabDemo>
            <div className="demo-label">时间范围</div>
            <div className="demo-description">时间筛选选项</div>
            <MoveTabList
              tabIndex={threeTabIndex}
              tabList={[
                { key: 0, text: '今天', clickCallback: () => setThreeTabIndex(0) },
                { key: 1, text: '本周', clickCallback: () => setThreeTabIndex(1) },
                { key: 2, text: '本月', clickCallback: () => setThreeTabIndex(2) }
              ]}
            />
          </TabDemo>
          
          <TabDemo>
            <div className="demo-label">状态筛选</div>
            <div className="demo-description">不同状态过滤</div>
            <MoveTabList
              tabIndex={twoTabIndex}
              tabList={[
                { key: 0, text: '全部', clickCallback: () => setTwoTabIndex(0) },
                { key: 1, text: '活跃', clickCallback: () => setTwoTabIndex(1) }
              ]}
            />
          </TabDemo>
        </TabGrid>
      </DemoSection>

      <DemoSection>
        <h3>与内容联动</h3>
        <p>标签页切换时同步更新下方内容</p>
        
        <DemoRow>
          <div className="tab-container">
            <MoveTabList
              tabIndex={contentTabIndex}
              tabList={contentTabList}
            />
          </div>
          <ContentDisplay>
            <div className="content-text">
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
                      fontSize: '12px'
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
    key: 0,
    text: '产品',
    clickCallback: () => {
      setContentTabIndex(0)
      // 更新内容显示
    }
  },
  // ... 其他标签页
]

// 根据当前标签显示不同内容
const currentContent = getContentForTab(contentTabIndex)

<MoveTabList
  tabIndex={contentTabIndex}
  tabList={contentTabList}
/>

<div className="content-area">
  {currentContent}
</div>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>动态标签管理</h3>
        <p>演示动态添加和删除标签页</p>
        
        <DemoRow>
          <div className="tab-container">
            <MoveTabList
              tabIndex={dynamicTabIndex}
              tabList={dynamicTabList}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button 
              onClick={addDynamicTab}
              style={{
                padding: '8px 16px',
                backgroundColor: '#52c41a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              添加标签页
            </button>
            <button 
              onClick={removeDynamicTab}
              disabled={dynamicTabs.length <= 2}
              style={{
                padding: '8px 16px',
                backgroundColor: dynamicTabs.length <= 2 ? '#ccc' : '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: dynamicTabs.length <= 2 ? 'not-allowed' : 'pointer'
              }}
            >
              删除标签页
            </button>
          </div>
          
          <ContentDisplay>
            <div className="content-text">
              {dynamicTabs[dynamicTabIndex]?.content || '内容未找到'}
            </div>
          </ContentDisplay>
        </DemoRow>
        
        <CodeBlock>
{`const [tabs, setTabs] = useState([
  { key: 0, text: '首页', content: '首页内容' },
  { key: 1, text: '关于', content: '关于内容' }
])

const addTab = () => {
  const newKey = Math.max(...tabs.map(t => t.key)) + 1
  setTabs(prev => [...prev, {
    key: newKey,
    text: \`Tab \${newKey + 1}\`,
    content: \`新标签页内容\`
  }])
}

const tabList = tabs.map(tab => ({
  key: tab.key,
  text: tab.text,
  clickCallback: () => setTabIndex(tab.key)
}))

<MoveTabList
  tabIndex={tabIndex}
  tabList={tabList}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>强制Web样式</h3>
        <p>在移动端强制使用桌面端样式</p>
        
        <DemoRow>
          <div className="tab-container">
            <MoveTabList
              tabIndex={forceWebTabIndex}
              tabList={forceWebTabList}
              forceWebStyle
            />
          </div>
          <div className="demo-info">
            <div>
              <div className="label">强制Web样式</div>
              <div className="description">即使在移动端也使用桌面端样式</div>
            </div>
            <div className="stats">
              <span>当前选中: {forceWebTabIndex === 0 ? '桌面版' : '移动版'}</span>
              <span>强制样式: 是</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`<MoveTabList
  tabIndex={tabIndex}
  tabList={tabList}
  forceWebStyle={true} // 强制使用桌面端样式
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>使用统计</h3>
        <p>标签页点击和使用的统计信息</p>
        
        <StatusDisplay>
          <div className="status-item">
            <span className="label">总点击次数:</span>
            <span className="value">{clickStats.totalClicks}</span>
          </div>
          <div className="status-item">
            <span className="label">二选项标签页点击:</span>
            <span className="value">{clickStats.twoTabClicks}</span>
          </div>
          <div className="status-item">
            <span className="label">三选项标签页点击:</span>
            <span className="value">{clickStats.threeTabClicks}</span>
          </div>
          <div className="status-item">
            <span className="label">最后点击的标签:</span>
            <span className="value">{clickStats.lastClickedTab || '无'}</span>
          </div>
          <div className="status-item">
            <span className="label">最后点击时间:</span>
            <span className="value">{clickStats.lastClickTime || '无'}</span>
          </div>
          <div className="status-item">
            <span className="label">动态标签页数量:</span>
            <span className="value">{dynamicTabs.length}</span>
          </div>
        </StatusDisplay>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>
          MoveTabList 组件支持的所有属性参数
        </p>
        
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          
          <PropsTableRow>
            <PropsTableCell type="prop">tabIndex</PropsTableCell>
            <PropsTableCell type="type">number</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">当前激活的标签页索引（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">tabList</PropsTableCell>
            <PropsTableCell type="type">TabItem[]</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">标签页列表配置（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">forceWebStyle</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">false</PropsTableCell>
            <PropsTableCell type="desc">是否强制使用桌面端样式</PropsTableCell>
          </PropsTableRow>
        </PropsTable>
        
        <div style={{ marginTop: '20px' }}>
          <h3>TabItem 接口定义</h3>
          <CodeBlock>
{`interface TabItem {
  key: number;                            // 标签页的唯一标识
  text: React.ReactNode;                  // 标签页显示的文本或组件
  clickCallback: () => void;              // 点击标签页时的回调函数
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>完整接口定义</h3>
          <CodeBlock>
{`interface MoveTabListProps {
  tabIndex: number;                       // 必填：当前激活的标签页索引
  tabList: TabItem[];                     // 必填：标签页配置列表
  forceWebStyle?: boolean;                // 可选：强制桌面端样式，默认false
}

// 使用示例
const tabList: TabItem[] = [
  {
    key: 0,
    text: '首页',
    clickCallback: () => setTabIndex(0)
  },
  {
    key: 1,
    text: '关于',
    clickCallback: () => setTabIndex(1)
  }
]`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>动画指示器</strong>：平滑的背景指示器动画，清晰显示当前选中状态</li>
              <li><strong>自适应布局</strong>：自动适配2个或3个标签页的宽度分布</li>
              <li><strong>响应式设计</strong>：移动端和桌面端不同的样式和交互</li>
              <li><strong>平滑过渡</strong>：使用 cubic-bezier 缓动函数提供流畅的动画效果</li>
              <li><strong>主题适配</strong>：完美适配暗色和亮色主题</li>
              <li><strong>触摸优化</strong>：移动端触摸友好的设计</li>
              <li><strong>灵活配置</strong>：支持自定义文本、回调函数和样式强制</li>
              <li><strong>性能优化</strong>：使用 useMemo 优化动画计算</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
{`// 基础使用
import MoveTabList from 'components/MoveTabList'

function TabComponent() {
  const [activeTab, setActiveTab] = useState(0)
  
  const tabList = [
    {
      key: 0,
      text: '选项一',
      clickCallback: () => setActiveTab(0)
    },
    {
      key: 1,
      text: '选项二',
      clickCallback: () => setActiveTab(1)
    }
  ]
  
  return (
    <MoveTabList
      tabIndex={activeTab}
      tabList={tabList}
    />
  )
}

// 三个标签页
const threeTabList = [
  { key: 0, text: 'Tab 1', clickCallback: () => setActiveTab(0) },
  { key: 1, text: 'Tab 2', clickCallback: () => setActiveTab(1) },
  { key: 2, text: 'Tab 3', clickCallback: () => setActiveTab(2) }
]

// 强制桌面端样式（在移动端）
<MoveTabList
  tabIndex={activeTab}
  tabList={tabList}
  forceWebStyle={true}
/>

// 与内容联动
function TabWithContent() {
  const [activeTab, setActiveTab] = useState(0)
  
  const contents = ['内容1', '内容2', '内容3']
  
  const tabList = [
    { key: 0, text: 'Tab 1', clickCallback: () => setActiveTab(0) },
    { key: 1, text: 'Tab 2', clickCallback: () => setActiveTab(1) },
    { key: 2, text: 'Tab 3', clickCallback: () => setActiveTab(2) }
  ]
  
  return (
    <div>
      <MoveTabList
        tabIndex={activeTab}
        tabList={tabList}
      />
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

export default MoveTabListDemo