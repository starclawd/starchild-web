import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Pending from './index'

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

  .pending-container {
    min-height: 100px;
    padding: 20px;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.lineDark8};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
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

const PendingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin: 20px 0;
`

const PendingDemoWrapper = styled.div`
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
    margin-bottom: 10px;
  }

  .demo-container {
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.lineDark8};
    border-radius: 8px;
    padding: 20px;
    min-height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const MockDataContainer = styled.div<{ $isLoading: boolean }>`
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 8px;
  min-height: 200px;
  position: relative;
  overflow: hidden;

  .mock-header {
    padding: 15px 20px;
    background: ${({ theme }) => theme.bgL1};
    border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .mock-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    ${({ $isLoading }) =>
      $isLoading &&
      `
      position: relative;
      opacity: 0.5;
    `}
  }

  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
`

const ControlPanel = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
`

const ControlButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.textDark98};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand100};
    opacity: 0.8;
  }

  &:disabled {
    background: ${({ theme }) => theme.textL4};
    cursor: not-allowed;
    opacity: 0.6;
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

const PendingDemo = () => {
  const [isLoading1, setIsLoading1] = useState(false)
  const [isLoading2, setIsLoading2] = useState(false)
  const [isLoading3, setIsLoading3] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [simulationActive, setSimulationActive] = useState(false)

  const [loadingStats, setLoadingStats] = useState({
    totalLoadings: 0,
    lastLoadTime: '',
    longestLoadDuration: 0,
    averageLoadTime: 0,
    loadTimes: [] as number[],
  })

  // 模拟加载进度
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (simulationActive) {
      interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            setSimulationActive(false)
            return 0
          }
          return prev + Math.random() * 10
        })
      }, 200)
    }

    return () => clearInterval(interval)
  }, [simulationActive])

  const startLoading = (loadingType: number) => {
    const startTime = Date.now()

    switch (loadingType) {
      case 1:
        setIsLoading1(true)
        setTimeout(() => {
          setIsLoading1(false)
          recordLoadTime(startTime)
        }, 2000)
        break
      case 2:
        setIsLoading2(true)
        setTimeout(() => {
          setIsLoading2(false)
          recordLoadTime(startTime)
        }, 3000)
        break
      case 3:
        setIsLoading3(true)
        setTimeout(() => {
          setIsLoading3(false)
          recordLoadTime(startTime)
        }, 1500)
        break
    }
  }

  const recordLoadTime = (startTime: number) => {
    const duration = Date.now() - startTime
    setLoadingStats((prev) => {
      const newLoadTimes = [...prev.loadTimes, duration]
      const averageTime = newLoadTimes.reduce((a, b) => a + b, 0) / newLoadTimes.length

      return {
        totalLoadings: prev.totalLoadings + 1,
        lastLoadTime: new Date().toLocaleTimeString(),
        longestLoadDuration: Math.max(prev.longestLoadDuration, duration),
        averageLoadTime: averageTime,
        loadTimes: newLoadTimes.slice(-10), // 只保留最近10次记录
      }
    })
  }

  const startProgressSimulation = () => {
    setLoadingProgress(0)
    setSimulationActive(true)
  }

  const mockData = [
    { id: 1, name: '用户数据', status: '已完成' },
    { id: 2, name: '订单信息', status: '处理中' },
    { id: 3, name: '统计报表', status: '等待中' },
  ]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Pending 加载状态组件示例</h2>
        <p>Pending 组件用于显示加载状态，具有旋转动画效果。 支持小型和大型两种显示模式，自动适配移动端和桌面端样式。</p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最简单的加载状态显示</p>

        <DemoRow>
          <div className='pending-container'>
            <Pending />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>基础加载状态</div>
              <div className='description'>只显示旋转图标，无文字</div>
            </div>
            <div className='stats'>
              <span>图标大小: 18px</span>
              <span>动画: 旋转</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`import Pending from 'components/Pending'

// 基础使用
<Pending />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>带文字的加载状态</h3>
        <p>显示加载图标和提示文字</p>

        <DemoRow>
          <div className='pending-container'>
            <Pending text='加载中...' />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>带文字加载状态</div>
              <div className='description'>显示图标和自定义提示文字</div>
            </div>
            <div className='stats'>
              <span>文字大小: 12px</span>
              <span>间距: 4px</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Pending text="加载中..." />
<Pending text="数据同步中..." />
<Pending text="请稍候..." />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>全屏加载模式</h3>
        <p>isNotButtonLoading 模式用于全屏或容器级别的加载状态</p>

        <DemoRow>
          <div className='pending-container' style={{ height: '200px' }}>
            <Pending text='数据加载中...' isNotButtonLoading />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>全屏加载模式</div>
              <div className='description'>占满容器，图标更大，居中显示</div>
            </div>
            <div className='stats'>
              <span>图标大小: 36px</span>
              <span>布局: 居中</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Pending 
  text="数据加载中..." 
  isNotButtonLoading={true} 
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>不同使用场景</h3>
        <p>在各种常见场景中使用加载状态</p>

        <PendingGrid>
          <PendingDemoWrapper>
            <div className='demo-label'>按钮加载状态</div>
            <div className='demo-description'>按钮点击后的加载状态</div>
            <div className='demo-container'>
              <ControlButton onClick={() => startLoading(1)} disabled={isLoading1}>
                {isLoading1 ? <Pending text='提交中' /> : '提交表单'}
              </ControlButton>
            </div>
          </PendingDemoWrapper>

          <PendingDemoWrapper>
            <div className='demo-label'>搜索加载</div>
            <div className='demo-description'>搜索结果加载中</div>
            <div className='demo-container'>
              <ControlButton onClick={() => startLoading(2)} disabled={isLoading2}>
                {isLoading2 ? <Pending text='搜索中' /> : '开始搜索'}
              </ControlButton>
            </div>
          </PendingDemoWrapper>

          <PendingDemoWrapper>
            <div className='demo-label'>内联加载</div>
            <div className='demo-description'>文本中的内联加载</div>
            <div className='demo-container'>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>正在处理</span>
                <Pending />
                <ControlButton onClick={() => startLoading(3)} disabled={isLoading3}>
                  {isLoading3 ? '处理中' : '开始处理'}
                </ControlButton>
              </div>
            </div>
          </PendingDemoWrapper>

          <PendingDemoWrapper>
            <div className='demo-label'>自定义样式</div>
            <div className='demo-description'>自定义图标颜色和大小</div>
            <div className='demo-container'>
              <Pending
                text='自定义样式'
                iconStyle={{
                  color: '#ff6b6b',
                  fontSize: '24px',
                }}
              />
            </div>
          </PendingDemoWrapper>
        </PendingGrid>

        <CodeBlock>
          {`// 按钮加载状态
<button disabled={isLoading}>
  {isLoading ? <Pending text="提交中" /> : '提交表单'}
</button>

// 内联加载
<div>
  正在处理 <Pending /> 请稍候...
</div>

// 自定义样式
<Pending 
  text="自定义样式" 
  iconStyle={{ 
    color: '#ff6b6b', 
    fontSize: '24px' 
  }} 
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>容器加载状态</h3>
        <p>在数据容器中显示加载状态</p>

        <MockDataContainer $isLoading={isLoading1}>
          <div className='mock-header'>
            数据列表
            <ControlButton onClick={() => startLoading(1)} disabled={isLoading1}>
              刷新数据
            </ControlButton>
          </div>
          <div className='mock-content'>
            {mockData.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '10px 15px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{item.name}</span>
                <span style={{ color: item.status === '已完成' ? '#52c41a' : '#faad14' }}>{item.status}</span>
              </div>
            ))}
          </div>
          {isLoading1 && (
            <div className='loading-overlay'>
              <Pending text='加载数据中...' isNotButtonLoading />
            </div>
          )}
        </MockDataContainer>

        <CodeBlock>
          {`function DataContainer() {
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  
  const loadData = async () => {
    setIsLoading(true)
    try {
      const result = await fetchData()
      setData(result)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div style={{ position: 'relative' }}>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
      
      {isLoading && (
        <div className="loading-overlay">
          <Pending text="加载中..." isNotButtonLoading />
        </div>
      )}
    </div>
  )
}`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>进度模拟</h3>
        <p>模拟实际的加载进度</p>

        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
            <Pending text={`加载进度 ${Math.round(loadingProgress)}%`} />
            <ControlButton onClick={startProgressSimulation} disabled={simulationActive}>
              {simulationActive ? '加载中...' : '开始模拟'}
            </ControlButton>
          </div>

          <div
            style={{
              width: '100%',
              height: '8px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #1890ff, #36cfc9)',
                borderRadius: '4px',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>

        <CodeBlock>
          {`const [progress, setProgress] = useState(0)
const [isLoading, setIsLoading] = useState(false)

const startLoading = () => {
  setIsLoading(true)
  const interval = setInterval(() => {
    setProgress(prev => {
      if (prev >= 100) {
        clearInterval(interval)
        setIsLoading(false)
        return 0
      }
      return prev + Math.random() * 10
    })
  }, 200)
}

return (
  <div>
    <Pending text={\`加载进度 \${Math.round(progress)}%\`} />
    <div className="progress-bar">
      <div style={{ width: \`\${progress}%\` }} />
    </div>
  </div>
)`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>加载统计</h3>
        <p>实时的加载状态统计信息</p>

        <StatusDisplay>
          <div className='status-item'>
            <span className='label'>总加载次数:</span>
            <span className='value'>{loadingStats.totalLoadings}</span>
          </div>
          <div className='status-item'>
            <span className='label'>最后加载时间:</span>
            <span className='value'>{loadingStats.lastLoadTime || '无'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>最长加载时间:</span>
            <span className='value'>{loadingStats.longestLoadDuration}ms</span>
          </div>
          <div className='status-item'>
            <span className='label'>平均加载时间:</span>
            <span className='value'>{Math.round(loadingStats.averageLoadTime)}ms</span>
          </div>
          <div className='status-item'>
            <span className='label'>当前加载状态:</span>
            <span className='value'>
              {isLoading1 || isLoading2 || isLoading3 || simulationActive ? '加载中' : '空闲'}
            </span>
          </div>
        </StatusDisplay>

        <ControlPanel>
          <ControlButton onClick={() => startLoading(1)}>2秒加载测试</ControlButton>
          <ControlButton onClick={() => startLoading(2)}>3秒加载测试</ControlButton>
          <ControlButton onClick={() => startLoading(3)}>1.5秒加载测试</ControlButton>
        </ControlPanel>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>Pending 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>text</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>""</PropsTableCell>
            <PropsTableCell type='desc'>加载提示文字</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>iconStyle</PropsTableCell>
            <PropsTableCell type='type'>CSSProperties</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>图标自定义样式</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>isNotButtonLoading</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否为全屏加载模式</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`interface PendingProps {
  text?: string;                          // 可选：加载提示文字
  iconStyle?: React.CSSProperties;        // 可选：图标自定义样式
  isNotButtonLoading?: boolean;                   // 可选：是否为全屏加载模式，默认false
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>旋转动画</strong>：使用 CSS 动画实现平滑的旋转效果
              </li>
              <li>
                <strong>双模式设计</strong>：普通模式和全屏模式，适应不同使用场景
              </li>
              <li>
                <strong>响应式设计</strong>：移动端和桌面端不同的字体大小
              </li>
              <li>
                <strong>灵活定制</strong>：支持自定义图标样式和文字内容
              </li>
              <li>
                <strong>主题适配</strong>：使用主题色彩，完美适配暗色和亮色主题
              </li>
              <li>
                <strong>轻量级</strong>：组件体积小，性能优秀
              </li>
              <li>
                <strong>易用性</strong>：简单的 API，开箱即用
              </li>
              <li>
                <strong>国际化支持</strong>：配合 @lingui 实现多语言支持
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
            {`// 基础使用
import Pending from 'components/Pending'

function LoadingButton() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    setIsLoading(true)
    try {
      await performAction()
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <button onClick={handleClick} disabled={isLoading}>
      {isLoading ? <Pending text="处理中..." /> : '点击操作'}
    </button>
  )
}

// 全屏加载
function DataPage() {
  const [isNotButtonLoading, setIsFetching] = useState(true)
  const [data, setData] = useState(null)
  
  useEffect(() => {
    loadData().then(result => {
      setData(result)
      setIsFetching(false)
    })
  }, [])
  
  if (isNotButtonLoading) {
    return <Pending text="加载数据中..." isNotButtonLoading />
  }
  
  return <DataDisplay data={data} />
}

// 自定义样式
<Pending 
  text="自定义加载" 
  iconStyle={{ 
    color: '#ff4d4f', 
    fontSize: '20px' 
  }} 
/>

// 内联使用
<div>
  数据同步中 <Pending /> 请稍候...
</div>

// 容器加载遮罩
function LoadingContainer({ children, isLoading }) {
  return (
    <div style={{ position: 'relative' }}>
      {children}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Pending text="加载中..." isNotButtonLoading />
        </div>
      )}
    </div>
  )
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default PendingDemo
