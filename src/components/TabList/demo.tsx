import React, { useState } from 'react'
import styled from 'styled-components'
import TabList from './index'

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
  
  .demo-area {
    min-height: 80px;
    padding: 20px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
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
  }
`

const ContentArea = styled.div`
  padding: 20px;
  background: ${({theme}) => theme.bgL1};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 8px;
  margin-top: 16px;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .content-text {
    font-size: 16px;
    color: ${({theme}) => theme.textL2};
    text-align: center;
  }
`

const PropsTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
`

const PropsHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  margin-bottom: 15px;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
`

const PropsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  
  &:last-child {
    border-bottom: none;
  }
  
  .prop-name {
    font-family: monospace;
    font-weight: 500;
  }
  
  .prop-type {
    font-family: monospace;
    color: #1890ff;
  }
  
  .prop-default {
    font-family: monospace;
    color: #52c41a;
  }
`

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 13px;
  line-height: 1.4;
  color: #f8f8f2;
`

const TabListDemo = () => {
  const [activeTab1, setActiveTab1] = useState('tab1')
  const [activeTab2, setActiveTab2] = useState('home')
  const [activeTab3, setActiveTab3] = useState('all')
  const [activeTab4, setActiveTab4] = useState('work')
  
  // 基础标签数据
  const basicTabs = [
    { key: 'tab1', text: '标签一', value: 'tab1', isActive: activeTab1 === 'tab1', clickCallback: setActiveTab1 },
    { key: 'tab2', text: '标签二', value: 'tab2', isActive: activeTab1 === 'tab2', clickCallback: setActiveTab1 },
    { key: 'tab3', text: '标签三', value: 'tab3', isActive: activeTab1 === 'tab3', clickCallback: setActiveTab1 },
  ]
  
  // 导航标签数据
  const navTabs = [
    { key: 'home', text: '首页', value: 'home', isActive: activeTab2 === 'home', clickCallback: setActiveTab2 },
    { key: 'products', text: '产品', value: 'products', isActive: activeTab2 === 'products', clickCallback: setActiveTab2 },
    { key: 'about', text: '关于我们', value: 'about', isActive: activeTab2 === 'about', clickCallback: setActiveTab2 },
    { key: 'contact', text: '联系我们', value: 'contact', isActive: activeTab2 === 'contact', clickCallback: setActiveTab2 },
  ]
  
  // 状态过滤标签
  const filterTabs = [
    { key: 'all', text: '全部', value: 'all', isActive: activeTab3 === 'all', clickCallback: setActiveTab3 },
    { key: 'active', text: '进行中', value: 'active', isActive: activeTab3 === 'active', clickCallback: setActiveTab3 },
    { key: 'completed', text: '已完成', value: 'completed', isActive: activeTab3 === 'completed', clickCallback: setActiveTab3 },
    { key: 'pending', text: '待处理', value: 'pending', isActive: activeTab3 === 'pending', clickCallback: setActiveTab3 },
  ]
  
  // 类别标签数据
  const categoryTabs = [
    { key: 'work', text: '🏢 工作', value: 'work', isActive: activeTab4 === 'work', clickCallback: setActiveTab4 },
    { key: 'personal', text: '👤 个人', value: 'personal', isActive: activeTab4 === 'personal', clickCallback: setActiveTab4 },
    { key: 'study', text: '📚 学习', value: 'study', isActive: activeTab4 === 'study', clickCallback: setActiveTab4 },
    { key: 'health', text: '🏃 健康', value: 'health', isActive: activeTab4 === 'health', clickCallback: setActiveTab4 },
    { key: 'hobby', text: '🎨 爱好', value: 'hobby', isActive: activeTab4 === 'hobby', clickCallback: setActiveTab4 },
  ]
  
  const getTabContent = (activeValue: string) => {
    const contentMap: Record<string, string> = {
      // 基础标签内容
      tab1: '这是标签一的内容，展示基础的标签切换功能。',
      tab2: '这是标签二的内容，标签切换带有平滑的动画效果。',
      tab3: '这是标签三的内容，支持自定义样式和主题。',
      
      // 导航标签内容
      home: '欢迎来到首页！这里展示了主要的产品信息和公司概况。',
      products: '产品页面展示了我们的全系列产品和服务详情。',
      about: '关于我们页面介绍了公司的历史、愿景和团队信息。',
      contact: '联系我们页面提供了多种联系方式和在线咨询服务。',
      
      // 状态过滤内容
      all: '显示所有任务和项目，包括各种状态的内容。',
      active: '显示正在进行中的任务，这些任务需要持续关注。',
      completed: '显示已完成的任务，这些任务已经成功结束。',
      pending: '显示待处理的任务，这些任务等待进一步操作。',
      
      // 类别标签内容
      work: '工作相关的内容，包括项目管理、会议安排和工作计划。',
      personal: '个人生活相关的内容，包括日常安排和个人目标。',
      study: '学习相关的内容，包括课程安排、学习笔记和知识管理。',
      health: '健康相关的内容，包括运动计划、饮食管理和健康监测。',
      hobby: '爱好相关的内容，包括兴趣活动、创意项目和娱乐安排。',
    }
    
    return contentMap[activeValue] || '选择一个标签查看相应内容'
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>TabList 标签列表组件示例</h2>
        <p>
          TabList 是一个简洁优雅的标签切换组件，支持圆角设计、活跃状态高亮、
          平滑动画过渡，适用于导航、分类过滤、内容切换等多种场景。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>基本的标签切换功能，支持点击切换活跃状态</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">基础标签列表</span>
            <span className="description">圆角设计，活跃状态蓝色高亮</span>
          </div>
          <div className="demo-area">
            <div style={{ width: '100%' }}>
              <TabList tabList={basicTabs} />
              <ContentArea>
                <div className="content-text">
                  {getTabContent(activeTab1)}
                </div>
              </ContentArea>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>导航菜单</h3>
        <p>用作网站导航菜单的标签列表</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">导航标签</span>
            <span className="description">适合作为页面导航使用</span>
          </div>
          <div className="demo-area">
            <div style={{ width: '100%' }}>
              <TabList tabList={navTabs} />
              <ContentArea>
                <div className="content-text">
                  {getTabContent(activeTab2)}
                </div>
              </ContentArea>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>状态过滤</h3>
        <p>用于内容状态过滤的标签列表</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">过滤标签</span>
            <span className="description">用于筛选不同状态的内容</span>
          </div>
          <div className="demo-area">
            <div style={{ width: '100%' }}>
              <TabList tabList={filterTabs} />
              <ContentArea>
                <div className="content-text">
                  {getTabContent(activeTab3)}
                </div>
              </ContentArea>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>带图标的分类标签</h3>
        <p>包含 emoji 图标的分类标签列表</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">分类标签</span>
            <span className="description">支持图标和文字组合显示</span>
          </div>
          <div className="demo-area">
            <div style={{ width: '100%' }}>
              <TabList tabList={categoryTabs} />
              <ContentArea>
                <div className="content-text">
                  {getTabContent(activeTab4)}
                </div>
              </ContentArea>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import TabList from './TabList'

// 准备标签数据
const [activeTab, setActiveTab] = useState('tab1')

const tabList = [
  {
    key: 'tab1',
    text: '标签一',
    value: 'tab1',
    isActive: activeTab === 'tab1',
    clickCallback: setActiveTab
  },
  {
    key: 'tab2',
    text: '标签二',
    value: 'tab2',
    isActive: activeTab === 'tab2',
    clickCallback: setActiveTab
  }
]

// 使用组件
<TabList tabList={tabList} />

// 带图标的标签
const iconTabs = [
  {
    key: 'home',
    text: '🏠 首页',
    value: 'home',
    isActive: activeTab === 'home',
    clickCallback: setActiveTab
  }
]`}</CodeBlock>
      </DemoSection>

      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <PropsTable>
          <PropsHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsHeader>
          <PropsRow>
            <div className="prop-name">tabList</div>
            <div className="prop-type">TabItem[]</div>
            <div className="prop-default">-</div>
            <div>标签列表数据（必填）</div>
          </PropsRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>TabItem 接口</h3>
          <PropsTable>
            <PropsHeader>
              <div>属性</div>
              <div>类型</div>
              <div>默认值</div>
              <div>描述</div>
            </PropsHeader>
            <PropsRow>
              <div className="prop-name">key</div>
              <div className="prop-type">string</div>
              <div className="prop-default">-</div>
              <div>标签唯一标识（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className="prop-name">text</div>
              <div className="prop-type">string</div>
              <div className="prop-default">-</div>
              <div>标签显示文本（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className="prop-name">value</div>
              <div className="prop-type">string</div>
              <div className="prop-default">-</div>
              <div>标签值（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className="prop-name">isActive</div>
              <div className="prop-type">boolean</div>
              <div className="prop-default">-</div>
              <div>是否为活跃状态（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className="prop-name">clickCallback</div>
              <div className="prop-type">Function</div>
              <div className="prop-default">-</div>
              <div>点击回调函数（必填）</div>
            </PropsRow>
          </PropsTable>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>样式特性</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>圆角设计</strong>：22px 边界半径，现代化外观</li>
              <li><strong>活跃状态</strong>：蓝色背景高亮显示当前选中标签</li>
              <li><strong>平滑动画</strong>：背景色切换带有过渡动画效果</li>
              <li><strong>响应式</strong>：支持不同屏幕尺寸下的良好显示</li>
              <li><strong>间距优化</strong>：合理的内边距和标签间距设计</li>
              <li><strong>主题适配</strong>：自动适配应用主题色彩</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用场景</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>导航菜单</strong>：网站主导航或子页面导航</li>
              <li><strong>内容分类</strong>：文章分类、产品分类等</li>
              <li><strong>状态过滤</strong>：任务状态、订单状态筛选</li>
              <li><strong>视图切换</strong>：列表视图、卡片视图等</li>
              <li><strong>功能模块</strong>：不同功能区域的切换</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default TabListDemo