import React, { useState } from 'react'
import styled from 'styled-components'
import TabList, { TAB_TYPE } from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.black0};
  min-height: 100vh;

  h2 {
    color: ${({ theme }) => theme.black0};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.black100};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.black200};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;

  h2 {
    color: ${({ theme }) => theme.black0};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.black100};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.black200};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .tab-container {
    min-width: 300px;
  }

  .demo-info {
    flex: 1;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.black0};
      margin-bottom: 5px;
    }

    .description {
      color: ${({ theme }) => theme.black200};
      font-size: 14px;
    }
  }
`

const DemoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.black0};
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
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.black0};
`

const PropsTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.black800}10;

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
        return theme.black0
      case 'type':
        return theme.brand100
      case 'default':
        return theme.black200
      default:
        return theme.black100
    }
  }};
`

const SelectedInfo = styled.div`
  margin-top: 10px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.brand100}20;
  border-radius: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.brand100};
`

const TabListDemo = () => {
  const [lineTabKey, setLineTabKey] = useState<string>('tab1')
  const [bgTabKey, setBgTabKey] = useState<string>('tab1')
  const [simpleTabKey, setSimpleTabKey] = useState<string>('tab1')
  const [iconTabKey, setIconTabKey] = useState<string>('overview')
  const [customTabKey, setCustomTabKey] = useState<string>('tab1')

  const basicTabs = [
    { key: 'tab1', text: 'Tab 1', clickCallback: () => {} },
    { key: 'tab2', text: 'Tab 2', clickCallback: () => {} },
    { key: 'tab3', text: 'Tab 3', clickCallback: () => {} },
  ]

  const iconTabs = [
    { key: 'overview', text: 'Overview', icon: <i className='icon-home' />, clickCallback: () => {} },
    { key: 'analytics', text: 'Analytics', icon: <i className='icon-chart' />, clickCallback: () => {} },
    { key: 'settings', text: 'Settings', icon: <i className='icon-setting' />, clickCallback: () => {} },
  ]

  const manyTabs = [
    { key: 'tab1', text: 'First', clickCallback: () => {} },
    { key: 'tab2', text: 'Second', clickCallback: () => {} },
    { key: 'tab3', text: 'Third', clickCallback: () => {} },
    { key: 'tab4', text: 'Fourth', clickCallback: () => {} },
    { key: 'tab5', text: 'Fifth', clickCallback: () => {} },
  ]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>TabList 标签列表组件示例</h2>
        <p>
          TabList 是一个支持多种样式的标签切换组件，包含 LINE（线条指示器）、BG（背景指示器）和
          SIMPLE（简单样式）三种模式。 支持动画过渡效果、自定义样式、图标等功能。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>LINE 模式（默认）</h3>
        <p>带有下划线指示器的标签样式，适合导航和内容切换场景</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList
              tabKey={lineTabKey}
              tabType={TAB_TYPE.LINE}
              tabList={basicTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setLineTabKey(tab.key),
              }))}
            />
            <SelectedInfo>当前选中: {lineTabKey}</SelectedInfo>
          </div>
          <div className='demo-info'>
            <div className='label'>TAB_TYPE.LINE</div>
            <div className='description'>下划线指示器模式，适合用于页面导航</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`import TabList, { TAB_TYPE } from 'components/TabList'

const [activeTab, setActiveTab] = useState('tab1')

const tabs = [
  { key: 'tab1', text: 'Tab 1', clickCallback: () => setActiveTab('tab1') },
  { key: 'tab2', text: 'Tab 2', clickCallback: () => setActiveTab('tab2') },
  { key: 'tab3', text: 'Tab 3', clickCallback: () => setActiveTab('tab3') },
]

<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.LINE}
  tabList={tabs}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>BG 模式</h3>
        <p>带有背景高亮指示器的标签样式，有边框包裹，适合作为切换按钮组</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList
              tabKey={bgTabKey}
              tabType={TAB_TYPE.BG}
              tabList={basicTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setBgTabKey(tab.key),
              }))}
            />
            <SelectedInfo>当前选中: {bgTabKey}</SelectedInfo>
          </div>
          <div className='demo-info'>
            <div className='label'>TAB_TYPE.BG</div>
            <div className='description'>背景高亮指示器模式，有边框包裹</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.BG}
  tabList={tabs}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>SIMPLE 模式</h3>
        <p>简洁的标签样式，选中项带有边框和背景色，不带滑动动画</p>

        <DemoRow>
          <div className='tab-container'>
            <TabList
              tabKey={simpleTabKey}
              tabType={TAB_TYPE.SIMPLE}
              tabList={basicTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setSimpleTabKey(tab.key),
              }))}
            />
            <SelectedInfo>当前选中: {simpleTabKey}</SelectedInfo>
          </div>
          <div className='demo-info'>
            <div className='label'>TAB_TYPE.SIMPLE</div>
            <div className='description'>简单样式模式，无滑动动画效果</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.SIMPLE}
  tabList={tabs}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>带图标的标签</h3>
        <p>每个标签项可以添加图标，图标会显示在文字前面</p>

        <DemoGrid>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>LINE 模式 + 图标</h4>
            <TabList
              tabKey={iconTabKey}
              tabType={TAB_TYPE.LINE}
              tabList={iconTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setIconTabKey(tab.key),
              }))}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>BG 模式 + 图标</h4>
            <TabList
              tabKey={iconTabKey}
              tabType={TAB_TYPE.BG}
              tabList={iconTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setIconTabKey(tab.key),
              }))}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>SIMPLE 模式 + 图标</h4>
            <TabList
              tabKey={iconTabKey}
              tabType={TAB_TYPE.SIMPLE}
              tabList={iconTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setIconTabKey(tab.key),
              }))}
            />
          </div>
          <SelectedInfo>当前选中: {iconTabKey}</SelectedInfo>
        </DemoGrid>

        <CodeBlock>
          {`const iconTabs = [
  { key: 'overview', text: 'Overview', icon: <i className='icon-home' />, clickCallback: () => setActiveTab('overview') },
  { key: 'analytics', text: 'Analytics', icon: <i className='icon-chart' />, clickCallback: () => setActiveTab('analytics') },
  { key: 'settings', text: 'Settings', icon: <i className='icon-setting' />, clickCallback: () => setActiveTab('settings') },
]

<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.LINE}
  tabList={iconTabs}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义样式</h3>
        <p>支持自定义 gap、borderRadius、itemBorderRadius 和 activeIndicatorBackground</p>

        <DemoGrid>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>自定义间距 (gap: 12px)</h4>
            <TabList
              tabKey={customTabKey}
              tabType={TAB_TYPE.LINE}
              gap={12}
              tabList={basicTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setCustomTabKey(tab.key),
              }))}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>
              自定义圆角 (borderRadius: 20px, itemBorderRadius: 16px)
            </h4>
            <TabList
              tabKey={customTabKey}
              tabType={TAB_TYPE.BG}
              borderRadius={20}
              itemBorderRadius={16}
              tabList={basicTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setCustomTabKey(tab.key),
              }))}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>
              自定义指示器颜色 (activeIndicatorBackground: #52c41a)
            </h4>
            <TabList
              tabKey={customTabKey}
              tabType={TAB_TYPE.BG}
              activeIndicatorBackground='#52c41a'
              tabList={basicTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setCustomTabKey(tab.key),
              }))}
            />
          </div>
          <SelectedInfo>当前选中: {customTabKey}</SelectedInfo>
        </DemoGrid>

        <CodeBlock>
          {`// 自定义间距
<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.LINE}
  gap={12}
  tabList={tabs}
/>

// 自定义圆角
<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.BG}
  borderRadius={20}
  itemBorderRadius={16}
  tabList={tabs}
/>

// 自定义指示器颜色
<TabList
  tabKey={activeTab}
  tabType={TAB_TYPE.BG}
  activeIndicatorBackground='#52c41a'
  tabList={tabs}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>多标签支持</h3>
        <p>支持多个标签项，自动调整每个标签的宽度</p>

        <DemoGrid>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>LINE 模式 - 5 个标签</h4>
            <TabList
              tabKey={lineTabKey}
              tabType={TAB_TYPE.LINE}
              tabList={manyTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setLineTabKey(tab.key),
              }))}
            />
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>BG 模式 - 5 个标签</h4>
            <TabList
              tabKey={bgTabKey}
              tabType={TAB_TYPE.BG}
              tabList={manyTabs.map((tab) => ({
                ...tab,
                clickCallback: () => setBgTabKey(tab.key),
              }))}
            />
          </div>
        </DemoGrid>
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
            <PropsTableCell type='type'>number | string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>当前选中的标签 key（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>tabList</PropsTableCell>
            <PropsTableCell type='type'>TabItem[]</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>标签项列表（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>tabType</PropsTableCell>
            <PropsTableCell type='type'>TAB_TYPE</PropsTableCell>
            <PropsTableCell type='default'>TAB_TYPE.LINE</PropsTableCell>
            <PropsTableCell type='desc'>标签样式类型：LINE / BG / SIMPLE</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>gap</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>4</PropsTableCell>
            <PropsTableCell type='desc'>标签项之间的间距（px）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>borderRadius</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>12 (web) / 8 (mobile)</PropsTableCell>
            <PropsTableCell type='desc'>外层容器圆角（仅 BG 模式）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>itemBorderRadius</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>8</PropsTableCell>
            <PropsTableCell type='desc'>标签项和指示器的圆角</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>forceWebStyle</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>强制使用 Web 样式（不使用移动端适配）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>activeIndicatorBackground</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>theme.brand200</PropsTableCell>
            <PropsTableCell type='desc'>活动指示器的背景色</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>className</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>自定义类名</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <h3>TabItem 接口</h3>
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>key</PropsTableCell>
            <PropsTableCell type='type'>number | string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>标签项的唯一标识（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>text</PropsTableCell>
            <PropsTableCell type='type'>React.ReactNode</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>标签文本内容（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>icon</PropsTableCell>
            <PropsTableCell type='type'>React.ReactNode</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>标签图标（可选）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>clickCallback</PropsTableCell>
            <PropsTableCell type='type'>() =&gt; void</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>点击回调函数（必填）</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <h3>TAB_TYPE 枚举</h3>
        <CodeBlock>
          {`export enum TAB_TYPE {
  LINE = 'line',   // 下划线指示器模式
  BG = 'bg',       // 背景高亮指示器模式
  SIMPLE = 'simple' // 简单样式模式（无滑动动画）
}`}
        </CodeBlock>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`interface TabItem {
  key: number | string;           // 标签唯一标识
  text: React.ReactNode;          // 标签文本
  icon?: React.ReactNode;         // 可选：标签图标
  clickCallback: () => void;      // 点击回调
}

interface TabListProps {
  className?: string;                    // 可选：自定义类名
  gap?: number;                          // 可选：标签间距（默认 4）
  tabKey: number | string;               // 必需：当前选中的标签 key
  tabType?: TAB_TYPE;                    // 可选：标签样式类型（默认 LINE）
  borderRadius?: number;                 // 可选：外层容器圆角
  itemBorderRadius?: number;             // 可选：标签项圆角
  tabList: TabItem[];                    // 必需：标签项列表
  forceWebStyle?: boolean;               // 可选：强制使用 Web 样式
  activeIndicatorBackground?: string;    // 可选：指示器背景色
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default TabListDemo
