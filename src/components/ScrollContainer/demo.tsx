import React, { useState } from 'react'
import styled from 'styled-components'
import { ScrollContainer } from './ScrollContainer'

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
    min-height: 200px;
    padding: 20px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;
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

const ExampleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ExampleItem = styled.div`
  padding: 12px 16px;
  background: ${({theme}) => theme.bgL1};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 6px;
  color: ${({theme}) => theme.textL2};
  font-size: 14px;
`

const HorizontalList = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px;
  white-space: nowrap;
`

const HorizontalItem = styled.div`
  flex-shrink: 0;
  padding: 12px 20px;
  background: ${({theme}) => theme.brand6};
  color: white;
  border-radius: 6px;
  font-size: 14px;
  min-width: 120px;
  text-align: center;
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

const ScrollContainerDemo = () => {
  const [customHeight, setCustomHeight] = useState(200)
  
  const generateItems = (count: number) => 
    Array.from({ length: count }, (_, i) => `列表项 ${i + 1} - 这是一个示例内容`)
  
  const generateHorizontalItems = (count: number) =>
    Array.from({ length: count }, (_, i) => `卡片 ${i + 1}`)

  return (
    <DemoContainer>
      <DemoSection>
        <h2>ScrollContainer 滚动容器组件示例</h2>
        <p>
          ScrollContainer 是一个带有自定义滚动条样式的容器组件，支持垂直和水平滚动，
          具有智能的滚动检测功能，在移动端隐藏滚动条以提供更好的用户体验。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法 - 垂直滚动</h3>
        <p>当内容超出容器高度时，自动显示垂直滚动条</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">基础垂直滚动容器</span>
            <span className="description">固定高度容器，内容超出时显示滚动条</span>
          </div>
          <div className="demo-area">
            <ScrollContainer style={{ height: '200px', width: '300px' }}>
              <ExampleList>
                {generateItems(20).map((item, index) => (
                  <ExampleItem key={index}>
                    {item}
                  </ExampleItem>
                ))}
              </ExampleList>
            </ScrollContainer>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>水平滚动</h3>
        <p>当内容超出容器宽度时，自动显示水平滚动条</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">水平滚动容器</span>
            <span className="description">固定宽度容器，水平内容超出时显示滚动条</span>
          </div>
          <div className="demo-area">
            <ScrollContainer style={{ width: '400px', maxWidth: '100%' }}>
              <HorizontalList>
                {generateHorizontalItems(10).map((item, index) => (
                  <HorizontalItem key={index}>
                    {item}
                  </HorizontalItem>
                ))}
              </HorizontalList>
            </ScrollContainer>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>动态高度调整</h3>
        <p>可以动态调整容器高度，观察滚动条的变化</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">动态高度容器</span>
            <span className="description">拖动滑块调整容器高度</span>
          </div>
          <div className="demo-area" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ color: '#999', fontSize: '14px' }}>容器高度:</label>
              <input
                type="range"
                min="100"
                max="400"
                value={customHeight}
                onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                style={{ width: '200px' }}
              />
              <span style={{ color: '#1890ff', fontSize: '14px', fontFamily: 'monospace' }}>
                {customHeight}px
              </span>
            </div>
            
            <ScrollContainer style={{ height: `${customHeight}px`, width: '350px' }}>
              <ExampleList>
                {generateItems(15).map((item, index) => (
                  <ExampleItem key={index}>
                    {item} - 高度: {customHeight}px
                  </ExampleItem>
                ))}
              </ExampleList>
            </ScrollContainer>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>自定义样式</h3>
        <p>支持通过 className 和 style 属性自定义容器样式</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">带边框和阴影的容器</span>
            <span className="description">自定义样式的滚动容器</span>
          </div>
          <div className="demo-area">
            <ScrollContainer 
              style={{ 
                height: '180px', 
                width: '320px',
                border: '2px solid #1890ff',
                borderRadius: '12px',
                padding: '16px',
                background: 'rgba(24, 144, 255, 0.05)',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.2)'
              }}
            >
              <ExampleList>
                {generateItems(12).map((item, index) => (
                  <ExampleItem key={index} style={{ background: 'rgba(255,255,255,0.1)' }}>
                    🎨 {item}
                  </ExampleItem>
                ))}
              </ExampleList>
            </ScrollContainer>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import { ScrollContainer } from './ScrollContainer'

// 基础用法
<ScrollContainer style={{ height: '200px', width: '300px' }}>
  <div>长内容...</div>
</ScrollContainer>

// 自定义样式
<ScrollContainer 
  style={{ 
    height: '180px', 
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px'
  }}
  className="custom-scroll"
>
  <div>自定义样式的内容...</div>
</ScrollContainer>`}</CodeBlock>
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
            <div className="prop-name">children</div>
            <div className="prop-type">ReactNode</div>
            <div className="prop-default">-</div>
            <div>容器内的子组件内容（必填）</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">className</div>
            <div className="prop-type">string</div>
            <div className="prop-default">-</div>
            <div>自定义CSS类名</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">style</div>
            <div className="prop-type">React.CSSProperties</div>
            <div className="prop-default">-</div>
            <div>自定义内联样式对象</div>
          </PropsRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>智能滚动检测</strong>：自动检测是否需要显示滚动条</li>
              <li><strong>自定义滚动条样式</strong>：在桌面端显示美观的细滚动条</li>
              <li><strong>移动端优化</strong>：在移动设备上隐藏滚动条，使用原生滚动</li>
              <li><strong>悬停效果</strong>：桌面端鼠标悬停时滚动条变为可见状态</li>
              <li><strong>自适应间距</strong>：有垂直滚动条时自动调整右边距</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default ScrollContainerDemo