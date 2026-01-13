import React, { useState } from 'react'
import styled from 'styled-components'
import NoData from './index'

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
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .nodata-container {
    width: 100%;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.black800};
    border-radius: 8px;
    overflow: hidden;
  }

  .demo-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.black0};
    }

    .description {
      color: ${({ theme }) => theme.black200};
      font-size: 14px;
    }

    .stats {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: ${({ theme }) => theme.black200};
      font-family: monospace;
    }
  }
`

const ScenarioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin: 20px 0;
`

const ScenarioDemo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .scenario-label {
    font-weight: 600;
    color: ${({ theme }) => theme.black0};
    font-size: 14px;
  }

  .scenario-description {
    color: ${({ theme }) => theme.black200};
    font-size: 12px;
    margin-bottom: 10px;
  }

  .scenario-container {
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.black800};
    border-radius: 8px;
    overflow: hidden;
    min-height: 200px;
  }
`

const MockContainer = styled.div<{ $height?: string }>`
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  height: ${({ $height }) => $height || '300px'};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .mock-header {
    padding: 15px 20px;
    background: ${({ theme }) => theme.bgL1};
    border-bottom: 1px solid ${({ theme }) => theme.black800};
    font-weight: 600;
    color: ${({ theme }) => theme.black0};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mock-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
`

const ControlPanel = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.black300)};
  color: ${({ theme, $active }) => ($active ? theme.black0 : theme.black0)};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand100};
    color: ${({ theme }) => theme.black0};
  }
`

const CustomNoDataWrapper = styled.div<{ $height?: string; $padding?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: ${({ $height }) => $height || '304px'};
  gap: 20px;
  padding: ${({ $padding }) => $padding || '20px'};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgL1};

  .custom-icon {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${({ theme }) => theme.black300}20;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    color: ${({ theme }) => theme.black300};
  }

  .custom-text {
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.black200};
    text-align: center;
  }

  .custom-action {
    margin-top: 10px;
  }
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

const NoDataDemo = () => {
  const [activeScenario, setActiveScenario] = useState('table')
  const [showData, setShowData] = useState(false)

  const scenarios = [
    { id: 'table', name: '数据表格', description: '表格数据为空时的显示' },
    { id: 'list', name: '列表页面', description: '列表内容为空时的显示' },
    { id: 'search', name: '搜索结果', description: '搜索无结果时的显示' },
    { id: 'dashboard', name: '仪表板', description: '图表数据为空时的显示' },
  ]

  const CustomNoData = ({
    icon,
    text,
    action,
    height = '250px',
    padding = '20px',
  }: {
    icon: string
    text: string
    action?: React.ReactNode
    height?: string
    padding?: string
  }) => (
    <CustomNoDataWrapper $height={height} $padding={padding}>
      <div className='custom-icon'>{icon}</div>
      <div className='custom-text'>{text}</div>
      {action && <div className='custom-action'>{action}</div>}
    </CustomNoDataWrapper>
  )

  const mockTableData = showData
    ? [
        { id: 1, name: '用户1', status: '活跃' },
        { id: 2, name: '用户2', status: '待激活' },
        { id: 3, name: '用户3', status: '活跃' },
      ]
    : []

  return (
    <DemoContainer>
      <DemoSection>
        <h2>NoData 空状态组件示例</h2>
        <p>
          NoData 组件用于在数据为空时向用户展示友好的提示信息。 组件自动适配移动端和桌面端样式，支持国际化文本显示。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最基本的空状态显示</p>

        <DemoRow>
          <div className='nodata-container'>
            <NoData />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>基础空状态组件</div>
              <div className='description'>显示默认的空数据图片和文本</div>
            </div>
            <div className='stats'>
              <span>国际化: 支持</span>
              <span>响应式: 是</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`import NoData from 'components/NoData'

// 基础使用
<NoData />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>不同场景下的应用</h3>
        <p>在各种常见场景中使用空状态组件</p>

        <ControlPanel>
          {scenarios.map((scenario) => (
            <ControlButton
              key={scenario.id}
              $active={activeScenario === scenario.id}
              onClick={() => setActiveScenario(scenario.id)}
            >
              {scenario.name}
            </ControlButton>
          ))}
        </ControlPanel>

        <ScenarioGrid>
          <ScenarioDemo>
            <div className='scenario-label'>数据表格</div>
            <div className='scenario-description'>表格数据为空时的显示状态</div>
            <MockContainer className='scenario-container'>
              <div className='mock-header'>
                用户列表
                <ControlButton onClick={() => setShowData(!showData)}>
                  {showData ? '清空数据' : '加载数据'}
                </ControlButton>
              </div>
              <div className='mock-content'>
                {mockTableData.length > 0 ? (
                  <div style={{ width: '100%' }}>
                    {mockTableData.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          padding: '10px 20px',
                          borderBottom: '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span>{item.name}</span>
                        <span>{item.status}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <NoData />
                )}
              </div>
            </MockContainer>
          </ScenarioDemo>

          <ScenarioDemo>
            <div className='scenario-label'>搜索结果</div>
            <div className='scenario-description'>搜索无结果时的显示</div>
            <MockContainer className='scenario-container'>
              <div className='mock-header'>搜索: "不存在的内容"</div>
              <div className='mock-content'>
                <CustomNoData
                  icon='🔍'
                  text='未找到匹配的搜索结果，请尝试其他关键词'
                  action={<ControlButton>重新搜索</ControlButton>}
                />
              </div>
            </MockContainer>
          </ScenarioDemo>

          <ScenarioDemo>
            <div className='scenario-label'>仪表板图表</div>
            <div className='scenario-description'>图表数据为空时的显示</div>
            <MockContainer className='scenario-container' $height='200px'>
              <div className='mock-header'>销售趋势图</div>
              <div className='mock-content'>
                <CustomNoData icon='📊' text='暂无图表数据' height='150px' padding='10px' />
              </div>
            </MockContainer>
          </ScenarioDemo>

          <ScenarioDemo>
            <div className='scenario-label'>文件列表</div>
            <div className='scenario-description'>文件夹为空时的显示</div>
            <MockContainer className='scenario-container'>
              <div className='mock-header'>我的文档</div>
              <div className='mock-content'>
                <CustomNoData
                  icon='📁'
                  text='文件夹为空，开始上传您的第一个文件'
                  action={<ControlButton>上传文件</ControlButton>}
                />
              </div>
            </MockContainer>
          </ScenarioDemo>
        </ScenarioGrid>

        <CodeBlock>
          {`// 在表格中使用
function DataTable({ data }) {
  return (
    <div>
      {data.length > 0 ? (
        <table>
          {/* 表格内容 */}
        </table>
      ) : (
        <NoData />
      )}
    </div>
  )
}

// 在列表中使用
function ItemList({ items }) {
  if (items.length === 0) {
    return <NoData />
  }
  
  return (
    <div>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义空状态</h3>
        <p>根据具体场景自定义空状态的显示内容</p>

        <ScenarioGrid>
          <ScenarioDemo>
            <div className='scenario-label'>购物车为空</div>
            <div className='scenario-description'>电商购物车空状态</div>
            <div className='scenario-container'>
              <CustomNoData
                icon='🛒'
                text='购物车是空的，快去挑选您喜欢的商品吧！'
                action={<ControlButton>去购物</ControlButton>}
              />
            </div>
          </ScenarioDemo>

          <ScenarioDemo>
            <div className='scenario-label'>收藏夹为空</div>
            <div className='scenario-description'>用户收藏列表空状态</div>
            <div className='scenario-container'>
              <CustomNoData icon='❤️' text='您还没有收藏任何内容' action={<ControlButton>浏览推荐</ControlButton>} />
            </div>
          </ScenarioDemo>

          <ScenarioDemo>
            <div className='scenario-label'>消息中心</div>
            <div className='scenario-description'>无消息时的显示</div>
            <div className='scenario-container'>
              <CustomNoData icon='💬' text='暂无新消息' height='200px' />
            </div>
          </ScenarioDemo>

          <ScenarioDemo>
            <div className='scenario-label'>网络错误</div>
            <div className='scenario-description'>网络连接失败状态</div>
            <div className='scenario-container'>
              <CustomNoData
                icon='🌐'
                text='网络连接失败，请检查您的网络设置'
                action={<ControlButton>重试</ControlButton>}
              />
            </div>
          </ScenarioDemo>
        </ScenarioGrid>

        <CodeBlock>
          {`// 自定义空状态组件
function CustomEmptyState({ 
  icon, 
  title, 
  description, 
  action 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '40px 20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>
        {icon}
      </div>
      <h3 style={{ marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        {description}
      </p>
      {action}
    </div>
  )
}

// 使用示例
<CustomEmptyState
  icon="🛒"
  title="购物车为空"
  description="快去挑选您喜欢的商品吧！"
  action={<button>去购物</button>}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>响应式设计</h3>
        <p>组件在不同设备上的适配效果</p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li>
              <strong>桌面端</strong>：固定高度 304px，圆角边框，图片宽度 180px
            </li>
            <li>
              <strong>移动端</strong>：移除圆角，透明背景，图片宽度自适应，字体大小调整
            </li>
            <li>
              <strong>布局适配</strong>：垂直居中布局，间距自动调整
            </li>
            <li>
              <strong>主题适配</strong>：自动适配暗色和亮色主题
            </li>
          </ul>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h4 style={{ marginBottom: '10px', color: 'inherit' }}>桌面端样式</h4>
            <MockContainer>
              <NoData />
            </MockContainer>
          </div>
          <div>
            <h4 style={{ marginBottom: '10px', color: 'inherit' }}>移动端样式预览</h4>
            <div
              style={{
                transform: 'scale(0.8)',
                transformOrigin: 'top left',
                border: '2px solid #666',
                borderRadius: '20px',
                overflow: 'hidden',
                width: '300px',
                height: '400px',
              }}
            >
              <div
                style={{
                  background: 'transparent',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '15px',
                  }}
                >
                  <img
                    src='/assets/chat/no-data.png'
                    alt='no-data'
                    style={{ width: '120px' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <div
                    style={{
                      display: 'none',
                      width: '120px',
                      height: '120px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                    }}
                  >
                    📄
                  </div>
                  <span style={{ fontSize: '14px', color: '#999' }}>No data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>NoData 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='desc' style={{ gridColumn: '1 / -1', textAlign: 'center', fontStyle: 'italic' }}>
              该组件不接受任何 props，是一个纯展示组件
            </PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>组件特性</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>零配置</strong>：组件开箱即用，无需传入任何参数
              </li>
              <li>
                <strong>国际化支持</strong>：使用 @lingui/react 提供多语言支持
              </li>
              <li>
                <strong>响应式设计</strong>：自动适配移动端和桌面端样式
              </li>
              <li>
                <strong>主题适配</strong>：完美适配暗色和亮色主题
              </li>
              <li>
                <strong>图片优化</strong>：使用专门设计的空状态图片
              </li>
              <li>
                <strong>布局灵活</strong>：可以嵌入任何容器中使用
              </li>
              <li>
                <strong>样式统一</strong>：与整体设计系统保持一致
              </li>
              <li>
                <strong>性能优化</strong>：轻量级组件，渲染性能优秀
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用场景</h3>
          <CodeBlock>
            {`// 1. 数据列表为空
function DataList({ items }) {
  if (items.length === 0) {
    return <NoData />
  }
  
  return (
    <div>
      {items.map(item => <Item key={item.id} data={item} />)}
    </div>
  )
}

// 2. 搜索结果为空
function SearchResults({ results, query }) {
  if (results.length === 0 && query) {
    return <NoData />
  }
  
  return <ResultList results={results} />
}

// 3. 加载失败时的备用显示
function DataContainer() {
  const { data, loading, error } = useData()
  
  if (loading) return <Loading />
  if (error) return <ErrorState />
  if (!data || data.length === 0) return <NoData />
  
  return <DataDisplay data={data} />
}

// 4. 条件渲染
function ConditionalContent({ condition, children }) {
  return condition ? children : <NoData />
}

// 5. 在表格组件中
function Table({ data, columns }) {
  return (
    <div className="table-container">
      {data.length > 0 ? (
        <table>
          <thead>
            {/* 表头 */}
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                {/* 表格行 */}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <NoData />
      )}
    </div>
  )
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>自定义空状态建议</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 15px 0', lineHeight: '1.6' }}>
              虽然 NoData 组件提供了通用的空状态显示，但在某些特定场景下，您可能需要自定义空状态：
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>个性化文案</strong>：根据具体业务场景提供更精准的提示文字
              </li>
              <li>
                <strong>操作引导</strong>：添加引导用户进行下一步操作的按钮
              </li>
              <li>
                <strong>品牌一致性</strong>：使用符合品牌调性的图标和色彩
              </li>
              <li>
                <strong>上下文相关</strong>：根据用户当前的操作上下文提供相关建议
              </li>
              <li>
                <strong>错误区分</strong>：区分"数据为空"和"加载失败"等不同状态
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default NoDataDemo
