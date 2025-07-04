import React, { useState } from 'react'
import styled from 'styled-components'
import { CommonTooltip, MobileTooltip } from './index'

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
    min-height: 150px;
    padding: 40px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: center;
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

const TooltipButton = styled.div`
  padding: 12px 20px;
  background: ${({theme}) => theme.brand6};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  user-select: none;
  
  &:hover {
    background: ${({theme}) => theme.brand6};
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
`

const IconButton = styled.div`
  width: 40px;
  height: 40px;
  background: ${({theme}) => theme.bgL1};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({theme}) => theme.bgL2};
    border-color: ${({theme}) => theme.brand6};
  }
  
  .icon {
    font-size: 18px;
    color: ${({theme}) => theme.textL2};
  }
`

const ClickableItem = styled.div`
  padding: 12px 16px;
  background: ${({theme}) => theme.bgL1};
  border: 1px solid ${({theme}) => theme.lineDark8};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: ${({theme}) => theme.bgL2};
    border-color: ${({theme}) => theme.brand6};
  }
  
  .text {
    color: ${({theme}) => theme.textL1};
    font-size: 14px;
  }
  
  .arrow {
    color: ${({theme}) => theme.textL3};
    font-size: 12px;
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

const TooltipDemo = () => {
  const [clickShow, setClickShow] = useState(false)
  
  const richContent = (
    <div style={{ padding: '8px' }}>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>提示标题</div>
      <div style={{ color: '#999', fontSize: '12px', marginBottom: '8px' }}>
        这是一个包含丰富内容的提示框
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <button style={{ 
          padding: '4px 8px', 
          background: '#1890ff', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          操作
        </button>
        <button style={{ 
          padding: '4px 8px', 
          background: 'transparent', 
          color: '#1890ff', 
          border: '1px solid #1890ff', 
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}>
          取消
        </button>
      </div>
    </div>
  )

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Tooltip 提示组件示例</h2>
        <p>
          Tooltip 是一个功能丰富的气泡提示组件，提供 PC 端和移动端的不同实现，
          支持悬浮显示、点击交互、多种定位方式和丰富的自定义选项。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>鼠标悬浮时显示简单的提示信息</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">基础提示</span>
            <span className="description">悬浮时显示提示文本</span>
          </div>
          <div className="demo-area">
            <CommonTooltip content="这是一个基础的提示信息">
              <TooltipButton>悬浮查看提示</TooltipButton>
            </CommonTooltip>
            
            <CommonTooltip content="这是一个较长的提示信息，用于演示提示框的自动换行和最大宽度限制">
              <TooltipButton>长文本提示</TooltipButton>
            </CommonTooltip>
            
            <CommonTooltip content="简短提示">
              <IconButton>
                <span className="icon">?</span>
              </IconButton>
            </CommonTooltip>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>不同位置</h3>
        <p>支持多种提示框显示位置</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">位置演示</span>
            <span className="description">top、bottom、left、right 四个方向</span>
          </div>
          <div className="demo-area" style={{ gap: '20px', flexDirection: 'column' }}>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <CommonTooltip content="顶部提示" placement="top">
                <TooltipButton>顶部</TooltipButton>
              </CommonTooltip>
            </div>
            
            <div style={{ display: 'flex', gap: '60px', justifyContent: 'center', alignItems: 'center' }}>
              <CommonTooltip content="左侧提示" placement="left">
                <TooltipButton>左侧</TooltipButton>
              </CommonTooltip>
              
              <CommonTooltip content="右侧提示" placement="right">
                <TooltipButton>右侧</TooltipButton>
              </CommonTooltip>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <CommonTooltip content="底部提示" placement="bottom">
                <TooltipButton>底部</TooltipButton>
              </CommonTooltip>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>丰富内容</h3>
        <p>提示框可以包含复杂的内容结构</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">富文本提示</span>
            <span className="description">支持自定义内容和交互元素</span>
          </div>
          <div className="demo-area">
            <CommonTooltip 
              content={richContent}
              canOperator={true}
              widthAuto={false}
              contentStyle={{ width: '200px' }}
            >
              <TooltipButton>富文本内容</TooltipButton>
            </CommonTooltip>
            
            <CommonTooltip 
              content={
                <div style={{ textAlign: 'center' }}>
                  <div style={{ marginBottom: '8px' }}>📊</div>
                  <div style={{ fontWeight: 'bold' }}>数据统计</div>
                  <div style={{ fontSize: '12px', color: '#999' }}>点击查看详情</div>
                </div>
              }
              placement="top"
            >
              <IconButton>
                <span className="icon">📊</span>
              </IconButton>
            </CommonTooltip>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>点击控制</h3>
        <p>通过外部状态控制提示框的显示和隐藏</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">手动控制</span>
            <span className="description">使用 outShow 和 outSetShow 控制显示状态</span>
          </div>
          <div className="demo-area">
            <CommonTooltip
              content="这是一个点击控制的提示框"
              useOutShow={true}
              outShow={clickShow}
              outSetShow={setClickShow}
              placement="top"
              disabledDisappearAni={true}
            >
              <ClickableItem onClick={() => setClickShow(!clickShow)}>
                <span className="text">点击切换提示</span>
                <span className="arrow">{clickShow ? '▲' : '▼'}</span>
              </ClickableItem>
            </CommonTooltip>
            
            <TooltipButton onClick={() => setClickShow(false)}>
              关闭提示
            </TooltipButton>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>移动端提示</h3>
        <p>专门为移动端优化的提示组件</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">移动端适配</span>
            <span className="description">使用 MobileTooltip 组件</span>
          </div>
          <div className="demo-area">
            <MobileTooltip content="移动端优化的提示信息">
              <TooltipButton>移动端提示</TooltipButton>
            </MobileTooltip>
            
            <MobileTooltip 
              content="这是一个较长的移动端提示信息，针对触屏设备进行了优化"
              placement="top"
            >
              <TooltipButton>长文本移动端提示</TooltipButton>
            </MobileTooltip>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>特殊配置</h3>
        <p>演示一些特殊的配置选项</p>
        
        <DemoRow>
          <div className="demo-info">
            <span className="label">配置选项</span>
            <span className="description">禁用动画、自定义样式等</span>
          </div>
          <div className="demo-area">
            <CommonTooltip 
              content="无动画提示"
              disabledDisappearAni={true}
            >
              <TooltipButton>无动画</TooltipButton>
            </CommonTooltip>
            
            <CommonTooltip 
              content="自定义样式提示"
              contentStyle={{
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px'
              }}
              contentClass="custom-tooltip"
            >
              <TooltipButton>自定义样式</TooltipButton>
            </CommonTooltip>
            
            <CommonTooltip 
              content=""
              showTooltipWrapper={false}
            >
              <TooltipButton>禁用提示</TooltipButton>
            </CommonTooltip>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import { CommonTooltip, MobileTooltip } from './Tooltip'

// 基础用法
<CommonTooltip content="提示信息">
  <button>悬浮查看</button>
</CommonTooltip>

// 不同位置
<CommonTooltip content="顶部提示" placement="top">
  <button>顶部提示</button>
</CommonTooltip>

// 富文本内容
<CommonTooltip 
  content={<div>自定义内容</div>}
  canOperator={true}
>
  <button>富文本</button>
</CommonTooltip>

// 手动控制
<CommonTooltip
  content="手动控制的提示"
  useOutShow={true}
  outShow={show}
  outSetShow={setShow}
>
  <button onClick={() => setShow(!show)}>
    点击控制
  </button>
</CommonTooltip>

// 移动端提示
<MobileTooltip content="移动端提示">
  <button>移动端提示</button>
</MobileTooltip>`}</CodeBlock>
      </DemoSection>

      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <h3>CommonTooltip</h3>
        <PropsTable>
          <PropsHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsHeader>
          <PropsRow>
            <div className="prop-name">content</div>
            <div className="prop-type">ReactNode</div>
            <div className="prop-default">-</div>
            <div>提示内容（必填）</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">children</div>
            <div className="prop-type">ReactNode</div>
            <div className="prop-default">-</div>
            <div>触发提示的子元素（必填）</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">placement</div>
            <div className="prop-type">Placement</div>
            <div className="prop-default">'bottom'</div>
            <div>提示框位置：top、bottom、left、right</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">canOperator</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>是否允许在提示框内操作</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">widthAuto</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">true</div>
            <div>是否自动调整宽度</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">contentStyle</div>
            <div className="prop-type">CSSProperties</div>
            <div className="prop-default">{}</div>
            <div>提示内容自定义样式</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">contentClass</div>
            <div className="prop-type">string</div>
            <div className="prop-default">-</div>
            <div>提示内容自定义类名</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">useOutShow</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>是否使用外部控制显示状态</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">outShow</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>外部控制的显示状态</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">outSetShow</div>
            <div className="prop-type">Function</div>
            <div className="prop-default">-</div>
            <div>外部控制显示状态的设置函数</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">disabledDisappearAni</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">false</div>
            <div>是否禁用消失动画</div>
          </PropsRow>
          <PropsRow>
            <div className="prop-name">showTooltipWrapper</div>
            <div className="prop-type">boolean</div>
            <div className="prop-default">true</div>
            <div>是否显示提示包装器</div>
          </PropsRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>智能定位</strong>：基于 Popper.js 的智能位置调整</li>
              <li><strong>PC/移动端适配</strong>：提供专门的移动端组件</li>
              <li><strong>丰富内容</strong>：支持文本、HTML、React 组件</li>
              <li><strong>交互控制</strong>：支持悬浮和点击两种触发方式</li>
              <li><strong>动画效果</strong>：平滑的显示隐藏动画</li>
              <li><strong>自定义样式</strong>：灵活的样式定制选项</li>
              <li><strong>外部控制</strong>：支持外部状态控制显示</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用场景</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>帮助提示</strong>：为表单字段、按钮等提供说明</li>
              <li><strong>功能介绍</strong>：解释复杂功能的使用方法</li>
              <li><strong>状态说明</strong>：显示当前状态或操作结果</li>
              <li><strong>快速预览</strong>：鼠标悬浮显示详细信息</li>
              <li><strong>操作引导</strong>：引导用户完成特定操作</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default TooltipDemo