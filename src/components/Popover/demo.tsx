import React, { useState } from 'react'
import styled from 'styled-components'
import Popover from './index'

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
    min-height: 100px;
    padding: 40px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
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
    
    .stats {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: ${({theme}) => theme.textL3};
      font-family: monospace;
    }
  }
`

const PopoverGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin: 40px 0;
  padding: 40px;
  background: ${({theme}) => theme.bgL0};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 8px;
`

const TriggerButton = styled.button`
  padding: 8px 16px;
  background: ${({theme}) => theme.brand6};
  color: ${({theme}) => theme.textDark98};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({theme}) => theme.brand6};
    opacity: 0.8;
  }
  
  &:active {
    transform: translateY(1px);
  }
`

const SecondaryButton = styled(TriggerButton)`
  background: ${({theme}) => theme.textL3};
  
  &:hover {
    background: ${({theme}) => theme.textL2};
  }
`

const PopoverContent = styled.div`
  background: ${({theme}) => theme.bgL1};
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({theme}) => theme.lineDark8};
  max-width: 250px;
  
  .popover-title {
    font-weight: 600;
    color: ${({theme}) => theme.textL1};
    margin-bottom: 8px;
    font-size: 14px;
  }
  
  .popover-text {
    color: ${({theme}) => theme.textL2};
    font-size: 12px;
    line-height: 1.4;
    margin-bottom: 10px;
  }
  
  .popover-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }
  
  .popover-button {
    padding: 4px 8px;
    background: ${({theme}) => theme.brand6};
    color: ${({theme}) => theme.textDark98};
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    
    &:hover {
      opacity: 0.8;
    }
    
    &.secondary {
      background: ${({theme}) => theme.textL4};
      color: ${({theme}) => theme.textL1};
    }
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

const PopoverDemo = () => {
  const [showBasic, setShowBasic] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [showBottom, setShowBottom] = useState(false)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [showHover, setShowHover] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [showActions, setShowActions] = useState(false)
  
  const [popoverStats, setPopoverStats] = useState({
    totalShows: 0,
    totalHides: 0,
    lastTrigger: '',
    currentlyOpen: 0
  })

  const handleShow = (type: string) => {
    setPopoverStats(prev => ({
      ...prev,
      totalShows: prev.totalShows + 1,
      lastTrigger: type,
      currentlyOpen: prev.currentlyOpen + 1
    }))
  }

  const handleHide = () => {
    setPopoverStats(prev => ({
      ...prev,
      totalHides: prev.totalHides + 1,
      currentlyOpen: Math.max(0, prev.currentlyOpen - 1)
    }))
  }

  const handleBasicToggle = () => {
    if (!showBasic) {
      handleShow('基础弹出框')
    } else {
      handleHide()
    }
    setShowBasic(!showBasic)
  }

  const handlePositionShow = (position: string, setter: (show: boolean) => void) => {
    handleShow(position)
    setter(true)
    // 3秒后自动关闭
    setTimeout(() => {
      setter(false)
      handleHide()
    }, 3000)
  }

  const BasicPopoverContent = () => (
    <PopoverContent>
      <div className="popover-title">基础弹出框</div>
      <div className="popover-text">
        这是一个基础的弹出框示例，可以包含任意内容。
      </div>
      <div className="popover-actions">
        <button 
          className="popover-button secondary"
          onClick={() => {
            setShowBasic(false)
            handleHide()
          }}
        >
          关闭
        </button>
      </div>
    </PopoverContent>
  )

  const PositionPopoverContent = ({ title }: { title: string }) => (
    <PopoverContent>
      <div className="popover-title">{title}</div>
      <div className="popover-text">
        这个弹出框从{title}方向显示，展示了不同的定位效果。
      </div>
    </PopoverContent>
  )

  const ActionPopoverContent = () => (
    <PopoverContent>
      <div className="popover-title">确认操作</div>
      <div className="popover-text">
        您确定要执行此操作吗？此操作无法撤销。
      </div>
      <div className="popover-actions">
        <button 
          className="popover-button secondary"
          onClick={() => {
            setShowActions(false)
            handleHide()
          }}
        >
          取消
        </button>
        <button 
          className="popover-button"
          onClick={() => {
            alert('操作已确认')
            setShowActions(false)
            handleHide()
          }}
        >
          确认
        </button>
      </div>
    </PopoverContent>
  )

  const CustomPopoverContent = () => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center',
      minWidth: '200px'
    }}>
      <div style={{ fontSize: '18px', marginBottom: '10px' }}>🎉</div>
      <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>自定义样式</div>
      <div style={{ fontSize: '12px', opacity: 0.9 }}>
        这是一个自定义样式的弹出框
      </div>
      <button 
        style={{
          marginTop: '10px',
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '6px',
          color: 'white',
          cursor: 'pointer'
        }}
        onClick={() => {
          setShowCustom(false)
          handleHide()
        }}
      >
        关闭
      </button>
    </div>
  )

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Popover 弹出框组件示例</h2>
        <p>
          Popover 组件基于 @popperjs/core 实现，提供灵活的弹出提示功能。
          支持多种定位方式、自定义样式和丰富的交互选项。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最简单的弹出框使用方式</p>
        
        <DemoRow>
          <div className="demo-area">
            <Popover
              show={showBasic}
              content={<BasicPopoverContent />}
              placement="top"
              onClickOutside={() => {
                setShowBasic(false)
                handleHide()
              }}
            >
              <TriggerButton onClick={handleBasicToggle}>
                {showBasic ? '关闭弹出框' : '点击显示弹出框'}
              </TriggerButton>
            </Popover>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">基础弹出框</div>
              <div className="description">点击按钮显示/隐藏弹出框</div>
            </div>
            <div className="stats">
              <span>状态: {showBasic ? '显示中' : '隐藏'}</span>
              <span>位置: top</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`const [show, setShow] = useState(false)

<Popover
  show={show}
  content={
    <div style={{ padding: '10px', background: 'white', borderRadius: '4px' }}>
      弹出框内容
    </div>
  }
  placement="top"
  onClickOutside={() => setShow(false)}
>
  <button onClick={() => setShow(!show)}>
    触发按钮
  </button>
</Popover>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>不同定位方式</h3>
        <p>支持上下左右四个方向的定位</p>
        
        <PopoverGrid>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Popover
              show={showTop}
              content={<PositionPopoverContent title="顶部" />}
              placement="top"
            >
              <TriggerButton onClick={() => handlePositionShow('顶部弹出框', setShowTop)}>
                顶部弹出
              </TriggerButton>
            </Popover>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Popover
              show={showLeft}
              content={<PositionPopoverContent title="左侧" />}
              placement="left"
            >
              <TriggerButton onClick={() => handlePositionShow('左侧弹出框', setShowLeft)}>
                左侧弹出
              </TriggerButton>
            </Popover>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Popover
              show={showRight}
              content={<PositionPopoverContent title="右侧" />}
              placement="right"
            >
              <TriggerButton onClick={() => handlePositionShow('右侧弹出框', setShowRight)}>
                右侧弹出
              </TriggerButton>
            </Popover>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Popover
              show={showBottom}
              content={<PositionPopoverContent title="底部" />}
              placement="bottom"
            >
              <TriggerButton onClick={() => handlePositionShow('底部弹出框', setShowBottom)}>
                底部弹出
              </TriggerButton>
            </Popover>
          </div>
        </PopoverGrid>
        
        <CodeBlock>
{`// 不同的定位选项
<Popover placement="top" />      // 顶部
<Popover placement="bottom" />   // 底部  
<Popover placement="left" />     // 左侧
<Popover placement="right" />    // 右侧
<Popover placement="auto" />     // 自动选择最佳位置

// 更精确的定位
<Popover placement="top-start" />    // 顶部开始
<Popover placement="top-end" />      // 顶部结束
<Popover placement="bottom-start" /> // 底部开始
<Popover placement="bottom-end" />   // 底部结束`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>鼠标悬停触发</h3>
        <p>通过鼠标悬停事件触发弹出框</p>
        
        <DemoRow>
          <div className="demo-area">
            <Popover
              show={showHover}
              content={
                <PopoverContent>
                  <div className="popover-title">悬停提示</div>
                  <div className="popover-text">
                    鼠标悬停时显示的提示信息，移开鼠标时自动隐藏。
                  </div>
                </PopoverContent>
              }
              placement="top"
              onMouseEnter={() => {
                setShowHover(true)
                handleShow('悬停弹出框')
              }}
              onMouseLeave={() => {
                setShowHover(false)
                handleHide()
              }}
            >
              <SecondaryButton>
                悬停显示提示
              </SecondaryButton>
            </Popover>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">悬停触发</div>
              <div className="description">鼠标悬停时显示，移开时隐藏</div>
            </div>
            <div className="stats">
              <span>触发方式: hover</span>
              <span>状态: {showHover ? '显示中' : '隐藏'}</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`<Popover
  show={showHover}
  content={<div>悬停提示内容</div>}
  placement="top"
  onMouseEnter={() => setShowHover(true)}
  onMouseLeave={() => setShowHover(false)}
>
  <button>悬停显示</button>
</Popover>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义样式</h3>
        <p>自定义弹出框的样式和外观</p>
        
        <DemoRow>
          <div className="demo-area">
            <Popover
              show={showCustom}
              content={<CustomPopoverContent />}
              placement="bottom"
              popoverContainerStyle={{
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
              }}
              onClickOutside={() => {
                setShowCustom(false)
                handleHide()
              }}
            >
              <TriggerButton 
                onClick={() => {
                  setShowCustom(!showCustom)
                  if (!showCustom) {
                    handleShow('自定义样式弹出框')
                  } else {
                    handleHide()
                  }
                }}
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none'
                }}
              >
                自定义样式弹出框
              </TriggerButton>
            </Popover>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">自定义样式</div>
              <div className="description">自定义背景、颜色和阴影效果</div>
            </div>
            <div className="stats">
              <span>渐变背景: 是</span>
              <span>阴影效果: 是</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`<Popover
  show={show}
  content={
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      borderRadius: '12px',
      textAlign: 'center'
    }}>
      自定义样式内容
    </div>
  }
  popoverContainerStyle={{
    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
  }}
>
  <button>触发按钮</button>
</Popover>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>交互式弹出框</h3>
        <p>包含按钮和交互元素的弹出框</p>
        
        <DemoRow>
          <div className="demo-area">
            <Popover
              show={showActions}
              content={<ActionPopoverContent />}
              placement="top"
              onClickOutside={() => {
                setShowActions(false)
                handleHide()
              }}
            >
              <TriggerButton 
                onClick={() => {
                  setShowActions(!showActions)
                  if (!showActions) {
                    handleShow('交互式弹出框')
                  } else {
                    handleHide()
                  }
                }}
                style={{ background: '#ff4d4f' }}
              >
                删除操作
              </TriggerButton>
            </Popover>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">交互式弹出框</div>
              <div className="description">包含确认和取消按钮的操作确认框</div>
            </div>
            <div className="stats">
              <span>交互元素: 2个按钮</span>
              <span>操作类型: 危险操作</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`const ActionPopover = () => (
  <div style={{ padding: '15px', background: 'white', borderRadius: '8px' }}>
    <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>确认操作</div>
    <div style={{ marginBottom: '10px' }}>您确定要执行此操作吗？</div>
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <button onClick={() => setShow(false)}>取消</button>
      <button onClick={handleConfirm}>确认</button>
    </div>
  </div>
)

<Popover
  show={show}
  content={<ActionPopover />}
  onClickOutside={() => setShow(false)}
>
  <button>删除操作</button>
</Popover>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>偏移和定位调整</h3>
        <p>通过偏移量精确控制弹出框位置</p>
        
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          padding: '40px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '15px', color: 'inherit' }}>默认位置</h4>
            <Popover
              show={showTop}
              content={<div style={{ padding: '10px', background: 'white', borderRadius: '4px', color: 'black' }}>默认偏移</div>}
              placement="top"
            >
              <SecondaryButton onClick={() => handlePositionShow('默认位置', setShowTop)}>
                默认位置
              </SecondaryButton>
            </Popover>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '15px', color: 'inherit' }}>向上偏移</h4>
            <Popover
              show={showBottom}
              content={<div style={{ padding: '10px', background: 'white', borderRadius: '4px', color: 'black' }}>向上偏移10px</div>}
              placement="top"
              offsetTop={10}
            >
              <SecondaryButton onClick={() => handlePositionShow('向上偏移', setShowBottom)}>
                向上偏移
              </SecondaryButton>
            </Popover>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ marginBottom: '15px', color: 'inherit' }}>向左偏移</h4>
            <Popover
              show={showLeft}
              content={<div style={{ padding: '10px', background: 'white', borderRadius: '4px', color: 'black' }}>向左偏移15px</div>}
              placement="top"
              offsetLeft={-15}
            >
              <SecondaryButton onClick={() => handlePositionShow('向左偏移', setShowLeft)}>
                向左偏移
              </SecondaryButton>
            </Popover>
          </div>
        </div>
        
        <CodeBlock>
{`// 垂直偏移
<Popover
  placement="top"
  offsetTop={10}  // 向上偏移10px
/>

// 水平偏移  
<Popover
  placement="right"
  offsetLeft={-15}  // 向左偏移15px
/>

// 同时设置两个方向的偏移
<Popover
  placement="bottom"
  offsetTop={5}
  offsetLeft={10}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>使用统计</h3>
        <p>弹出框的使用统计信息</p>
        
        <StatusDisplay>
          <div className="status-item">
            <span className="label">总显示次数:</span>
            <span className="value">{popoverStats.totalShows}</span>
          </div>
          <div className="status-item">
            <span className="label">总隐藏次数:</span>
            <span className="value">{popoverStats.totalHides}</span>
          </div>
          <div className="status-item">
            <span className="label">最后触发:</span>
            <span className="value">{popoverStats.lastTrigger || '无'}</span>
          </div>
          <div className="status-item">
            <span className="label">当前显示数量:</span>
            <span className="value">{popoverStats.currentlyOpen}</span>
          </div>
          <div className="status-item">
            <span className="label">基础弹出框状态:</span>
            <span className="value">{showBasic ? '显示中' : '隐藏'}</span>
          </div>
        </StatusDisplay>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>
          Popover 组件支持的所有属性参数
        </p>
        
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          
          <PropsTableRow>
            <PropsTableCell type="prop">content</PropsTableCell>
            <PropsTableCell type="type">ReactNode</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">弹出框内容（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">show</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">是否显示弹出框（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">children</PropsTableCell>
            <PropsTableCell type="type">ReactNode</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">触发元素（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">placement</PropsTableCell>
            <PropsTableCell type="type">Placement</PropsTableCell>
            <PropsTableCell type="default">"auto"</PropsTableCell>
            <PropsTableCell type="desc">弹出位置</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">offsetTop</PropsTableCell>
            <PropsTableCell type="type">number</PropsTableCell>
            <PropsTableCell type="default">0</PropsTableCell>
            <PropsTableCell type="desc">垂直偏移量</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">offsetLeft</PropsTableCell>
            <PropsTableCell type="type">number</PropsTableCell>
            <PropsTableCell type="default">0</PropsTableCell>
            <PropsTableCell type="desc">水平偏移量</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">widthAuto</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">true</PropsTableCell>
            <PropsTableCell type="desc">是否自动宽度</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">showArrow</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">false</PropsTableCell>
            <PropsTableCell type="desc">是否显示箭头</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">onClickOutside</PropsTableCell>
            <PropsTableCell type="type">function</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">点击外部区域的回调</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">onMouseEnter</PropsTableCell>
            <PropsTableCell type="type">function</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">鼠标进入事件</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">onMouseLeave</PropsTableCell>
            <PropsTableCell type="type">function</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">鼠标离开事件</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">popoverContainerStyle</PropsTableCell>
            <PropsTableCell type="type">CSSProperties</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">容器自定义样式</PropsTableCell>
          </PropsTableRow>
        </PropsTable>
        
        <div style={{ marginTop: '20px' }}>
          <h3>Placement 选项</h3>
          <CodeBlock>
{`// 基础位置
"top" | "bottom" | "left" | "right" | "auto"

// 精确位置
"top-start" | "top-end"
"bottom-start" | "bottom-end"  
"left-start" | "left-end"
"right-start" | "right-end"

// 自动位置
"auto" | "auto-start" | "auto-end"`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
{`interface PopoverProps {
  content: ReactNode;                         // 必填：弹出内容
  show: boolean;                              // 必填：是否显示
  children: ReactNode;                        // 必填：触发元素
  placement?: Placement;                      // 可选：弹出位置，默认auto
  offsetTop?: number;                         // 可选：垂直偏移
  offsetLeft?: number;                        // 可选：水平偏移
  widthAuto?: boolean;                        // 可选：自动宽度，默认true
  showArrow?: boolean;                        // 可选：显示箭头，默认false
  onClickOutside?: () => void;                // 可选：点击外部回调
  onMouseEnter?: (e: MouseEvent) => void;     // 可选：鼠标进入
  onMouseLeave?: (e: MouseEvent) => void;     // 可选：鼠标离开
  popoverContainerStyle?: CSSProperties;      // 可选：容器样式
  arrowStyle?: CSSProperties;                 // 可选：箭头样式
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>智能定位</strong>：基于 @popperjs/core 的智能定位算法</li>
              <li><strong>防溢出</strong>：自动避免弹出框超出视窗边界</li>
              <li><strong>动画效果</strong>：丰富的进入和退出动画效果</li>
              <li><strong>Portal 渲染</strong>：使用 Portal 组件避免层级问题</li>
              <li><strong>点击外部关闭</strong>：支持点击外部区域自动关闭</li>
              <li><strong>多种触发方式</strong>：支持点击和悬停触发</li>
              <li><strong>响应式适配</strong>：自动适应不同屏幕尺寸</li>
              <li><strong>高度可定制</strong>：支持自定义样式和偏移量</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
{`// 基础使用
import Popover from 'components/Popover'

function BasicPopover() {
  const [show, setShow] = useState(false)
  
  return (
    <Popover
      show={show}
      content={<div>弹出框内容</div>}
      onClickOutside={() => setShow(false)}
    >
      <button onClick={() => setShow(!show)}>
        切换弹出框
      </button>
    </Popover>
  )
}

// 悬停触发
function HoverPopover() {
  const [show, setShow] = useState(false)
  
  return (
    <Popover
      show={show}
      content={<div>悬停提示内容</div>}
      placement="top"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span>悬停显示提示</span>
    </Popover>
  )
}

// 自定义样式
function CustomPopover() {
  const [show, setShow] = useState(false)
  
  return (
    <Popover
      show={show}
      content={
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '15px',
          borderRadius: '8px'
        }}>
          自定义样式内容
        </div>
      }
      placement="bottom"
      offsetTop={10}
      popoverContainerStyle={{
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
      }}
    >
      <button onClick={() => setShow(!show)}>
        自定义弹出框
      </button>
    </Popover>
  )
}

// 确认对话框
function ConfirmPopover({ onConfirm }) {
  const [show, setShow] = useState(false)
  
  const handleConfirm = () => {
    onConfirm()
    setShow(false)
  }
  
  return (
    <Popover
      show={show}
      content={
        <div style={{ padding: '15px', background: 'white', borderRadius: '8px' }}>
          <div style={{ marginBottom: '10px' }}>确定要删除吗？</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShow(false)}>取消</button>
            <button onClick={handleConfirm}>确定</button>
          </div>
        </div>
      }
      onClickOutside={() => setShow(false)}
    >
      <button onClick={() => setShow(true)}>删除</button>
    </Popover>
  )
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default PopoverDemo