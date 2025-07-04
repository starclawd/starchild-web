import React, { useState } from 'react'
import styled from 'styled-components'
import TransitionWrapper from './index'

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
    min-height: 250px;
    padding: 30px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 20px;
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

const ControlsArea = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  background: ${({theme, $active}) => $active ? theme.brand6 : theme.bgL1};
  color: ${({theme, $active}) => $active ? 'white' : theme.textL1};
  border: 1px solid ${({theme, $active}) => $active ? theme.brand6 : theme.lineDark8};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  
  &:hover {
    background: ${({theme, $active}) => $active ? theme.brand6 : theme.bgL2};
    border-color: ${({theme}) => theme.brand6};
  }
`

const TransitionArea = styled.div`
  position: relative;
  border: 1px dashed ${({theme}) => theme.lineDark8};
  border-radius: 8px;
  min-height: 150px;
  background: ${({theme}) => theme.bgL1};
  overflow: hidden;
`

const ContentBox = styled.div`
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 6px;
  margin: 10px;
  
  .title {
    font-weight: bold;
    margin-bottom: 8px;
    font-size: 16px;
  }
  
  .content {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 12px;
  }
  
  .info {
    font-size: 12px;
    opacity: 0.8;
  }
`

const TransformContainer = styled.div`
  position: relative;
  height: 200px;
  border: 1px dashed ${({theme}) => theme.lineDark8};
  border-radius: 8px;
  background: ${({theme}) => theme.bgL1};
  overflow: hidden;
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

const TransitionWrapperDemo = () => {
  // 高度过渡控制
  const [heightVisible, setHeightVisible] = useState(false)
  
  // 宽度过渡控制
  const [widthVisible, setWidthVisible] = useState(false)
  
  // Transform过渡控制
  const [transformVisible, setTransformVisible] = useState(false)
  const [transformDirection, setTransformDirection] = useState<'left' | 'right' | 'top' | 'bottom'>('right')
  
  // 复合演示
  const [complexVisible, setComplexVisible] = useState(false)
  const [complexType, setComplexType] = useState<'height' | 'width' | 'transform'>('height')

  return (
    <DemoContainer>
      <DemoSection>
        <h2>TransitionWrapper 过渡动画组件示例</h2>
        <p>
          TransitionWrapper 是一个强大的过渡动画组件，支持高度、宽度和位移三种过渡类型，
          提供平滑的展开收起效果，适用于手风琴、侧边栏、面板等多种交互场景。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>高度过渡动画</h3>
        <p>垂直方向的展开收起动画，适用于内容展开、手风琴等场景</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">高度过渡</span>
            <span className="description">基于内容高度的自动过渡动画</span>
          </div>
          <div className="demo-area">
            <ControlsArea>
              <ControlButton 
                $active={heightVisible}
                onClick={() => setHeightVisible(!heightVisible)}
              >
                {heightVisible ? '收起内容' : '展开内容'}
              </ControlButton>
            </ControlsArea>
            
            <TransitionArea>
              <TransitionWrapper
                visible={heightVisible}
                transitionType="height"
                onTransitionEnd={() => console.log('高度过渡完成')}
              >
                <ContentBox>
                  <div className="title">高度过渡动画内容</div>
                  <div className="content">
                    这是一个演示高度过渡动画的内容区域。当点击展开按钮时，
                    内容会以平滑的动画效果从0高度展开到完整高度。
                  </div>
                  <div className="content">
                    TransitionWrapper 会自动计算内容的实际高度，
                    并创建流畅的过渡动画效果。这对于创建手风琴组件、
                    展开式菜单等交互效果非常有用。
                  </div>
                  <div className="info">
                    过渡类型: height | 自动高度计算
                  </div>
                </ContentBox>
              </TransitionWrapper>
            </TransitionArea>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>宽度过渡动画</h3>
        <p>水平方向的展开收起动画，适用于侧边栏、面板等场景</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">宽度过渡</span>
            <span className="description">基于内容宽度的自动过渡动画</span>
          </div>
          <div className="demo-area">
            <ControlsArea>
              <ControlButton 
                $active={widthVisible}
                onClick={() => setWidthVisible(!widthVisible)}
              >
                {widthVisible ? '收起面板' : '展开面板'}
              </ControlButton>
            </ControlsArea>
            
            <TransitionArea style={{ display: 'flex', alignItems: 'flex-start' }}>
              <TransitionWrapper
                visible={widthVisible}
                transitionType="width"
                defaultWidth={300}
                onTransitionEnd={() => console.log('宽度过渡完成')}
              >
                <ContentBox style={{ minWidth: '280px', margin: '10px' }}>
                  <div className="title">宽度过渡面板</div>
                  <div className="content">
                    这是一个侧边面板的演示，展示了宽度过渡动画的效果。
                  </div>
                  <div className="content">
                    面板会从0宽度平滑展开到设定的宽度，
                    适合用于侧边栏、工具面板等场景。
                  </div>
                  <div className="info">
                    过渡类型: width | 默认宽度: 300px
                  </div>
                </ContentBox>
              </TransitionWrapper>
              
              {widthVisible && (
                <div style={{ 
                  padding: '20px', 
                  color: '#666', 
                  fontSize: '14px',
                  flex: 1
                }}>
                  主要内容区域保持正常显示
                </div>
              )}
            </TransitionArea>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>位移过渡动画</h3>
        <p>基于 transform 的位移动画，支持四个方向的滑入滑出效果</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">位移过渡</span>
            <span className="description">支持上下左右四个方向的滑动效果</span>
          </div>
          <div className="demo-area">
            <ControlsArea>
              <ControlButton 
                $active={transformVisible}
                onClick={() => setTransformVisible(!transformVisible)}
              >
                {transformVisible ? '隐藏内容' : '显示内容'}
              </ControlButton>
              
              <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                {(['left', 'right', 'top', 'bottom'] as const).map(direction => (
                  <ControlButton
                    key={direction}
                    $active={transformDirection === direction}
                    onClick={() => setTransformDirection(direction)}
                  >
                    {direction}
                  </ControlButton>
                ))}
              </div>
            </ControlsArea>
            
            <TransformContainer>
              <TransitionWrapper
                visible={transformVisible}
                transitionType="transform"
                direction={transformDirection}
                onTransitionEnd={() => console.log(`${transformDirection}方向过渡完成`)}
              >
                <ContentBox style={{ 
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  bottom: '10px',
                  margin: '0'
                }}>
                  <div className="title">位移过渡动画</div>
                  <div className="content">
                    当前从 {transformDirection} 方向滑入。
                    这种动画效果常用于移动端的页面切换、
                    模态框的进入退出等场景。
                  </div>
                  <div className="info">
                    过渡类型: transform | 方向: {transformDirection}
                  </div>
                </ContentBox>
              </TransitionWrapper>
            </TransformContainer>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>综合演示</h3>
        <p>动态切换不同的过渡类型，体验各种动画效果</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">综合演示</span>
            <span className="description">切换不同过渡类型的统一演示</span>
          </div>
          <div className="demo-area">
            <ControlsArea>
              <ControlButton 
                $active={complexVisible}
                onClick={() => setComplexVisible(!complexVisible)}
              >
                {complexVisible ? '隐藏' : '显示'}
              </ControlButton>
              
              <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                {(['height', 'width', 'transform'] as const).map(type => (
                  <ControlButton
                    key={type}
                    $active={complexType === type}
                    onClick={() => setComplexType(type)}
                  >
                    {type}
                  </ControlButton>
                ))}
              </div>
            </ControlsArea>
            
            <TransitionArea style={{ 
              display: complexType === 'width' ? 'flex' : 'block',
              alignItems: complexType === 'width' ? 'flex-start' : 'stretch',
              position: complexType === 'transform' ? 'relative' : 'static',
              height: complexType === 'transform' ? '200px' : 'auto'
            }}>
              <TransitionWrapper
                visible={complexVisible}
                transitionType={complexType}
                direction="right"
                defaultWidth={250}
                onTransitionEnd={() => console.log(`${complexType} 过渡完成`)}
              >
                <ContentBox style={{
                  ...(complexType === 'transform' ? {
                    position: 'absolute',
                    top: '10px',
                    left: '10px',
                    right: '10px',
                    bottom: '10px',
                    margin: '0'
                  } : {}),
                  ...(complexType === 'width' ? {
                    minWidth: '230px'
                  } : {})
                }}>
                  <div className="title">动态过渡类型: {complexType}</div>
                  <div className="content">
                    {complexType === 'height' && '垂直展开收起动画，内容高度自适应'}
                    {complexType === 'width' && '水平展开收起动画，宽度可自定义'}
                    {complexType === 'transform' && '位移动画，支持四个方向的滑动'}
                  </div>
                  <div className="info">
                    当前过渡类型: {complexType}
                  </div>
                </ContentBox>
              </TransitionWrapper>
            </TransitionArea>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import TransitionWrapper from './TransitionWrapper'

// 高度过渡
<TransitionWrapper
  visible={show}
  transitionType="height"
  onTransitionEnd={() => console.log('完成')}
>
  <div>要过渡的内容</div>
</TransitionWrapper>

// 宽度过渡
<TransitionWrapper
  visible={show}
  transitionType="width"
  defaultWidth={300}
>
  <div>侧边面板内容</div>
</TransitionWrapper>

// 位移过渡
<TransitionWrapper
  visible={show}
  transitionType="transform"
  direction="right"
>
  <div>滑动内容</div>
</TransitionWrapper>

// 禁用动画
<TransitionWrapper
  visible={show}
  disabled={true}
>
  <div>无动画内容</div>
</TransitionWrapper>`}</CodeBlock>
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
            <div className="prop-name">visible</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>是否显示内容（必填）</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">transitionType</div>
            <div className="prop-type">'height' | 'width' | 'transform'</div>
            <div className="prop-default">'height'</div>
            <div>过渡动画类型</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">direction</div>
            <div className="prop-type">'left' | 'right' | 'top' | 'bottom'</div>
            <div className="prop-default">'right'</div>
            <div>位移方向（仅 transform 类型有效）</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">disabled</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>是否禁用过渡动画</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">defaultWidth</div>
            <div className="prop-type">number</div>
            <div className="prop-default">-</div>
            <div>默认宽度（仅 width 类型有效）</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">display</div>
            <div className="prop-type">string</div>
            <div className="prop-default">'block'</div>
            <div>隐藏时的 display 属性</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">disabledOverflow</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>是否禁用 overflow 控制</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">onTransitionEnd</div>
            <div className="prop-type">Function</div>
            <div className="prop-default">-</div>
            <div>过渡动画结束时的回调</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">rootStyle</div>
            <div className="prop-type">CSSProperties</div>
            <div className="prop-default">{}</div>
            <div>根元素自定义样式</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">className</div>
            <div className="prop-type">string</div>
            <div className="prop-default">''</div>
            <div>自定义CSS类名</div>
          </PropsRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>过渡类型说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>height</strong>：垂直方向的高度过渡，自动计算内容高度</li>
              <li><strong>width</strong>：水平方向的宽度过渡，可设置默认宽度</li>
              <li><strong>transform</strong>：基于位移和透明度的过渡，支持四个方向</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用场景</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>手风琴组件</strong>：使用 height 类型实现内容展开收起</li>
              <li><strong>侧边栏</strong>：使用 width 类型实现面板滑入滑出</li>
              <li><strong>页面切换</strong>：使用 transform 类型实现页面间的过渡</li>
              <li><strong>模态框</strong>：使用 transform 类型实现弹出动画</li>
              <li><strong>下拉菜单</strong>：使用 height 类型实现菜单展开</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default TransitionWrapperDemo