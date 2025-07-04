import React, { useCallback, useState } from 'react'
import styled from 'styled-components'
import useToast, { TOAST_STATUS, StyledToastContent } from './index'
import { vm } from 'pages/helper'
import { useTheme } from 'styled-components'

const DemoContainer = styled.div`
  padding: ${vm(20)};
  background: ${({theme}) => theme.bgL1};
  color: ${({theme}) => theme.textL1};
  min-height: 100vh;
  position: relative;
  
  h2 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: ${vm(20)};
    font-size: ${vm(24)};
  }
  
  h3 {
    color: ${({theme}) => theme.textL2};
    margin-bottom: ${vm(15)};
    font-size: ${vm(18)};
  }
  
  p {
    color: ${({theme}) => theme.textL3};
    margin-bottom: ${vm(15)};
    line-height: 1.6;
    font-size: ${vm(14)};
  }
`

const DemoSection = styled.div`
  margin-bottom: ${vm(40)};
  
  h2 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: ${vm(20)};
    font-size: ${vm(24)};
  }
  
  h3 {
    color: ${({theme}) => theme.textL2};
    margin-bottom: ${vm(15)};
    font-size: ${vm(18)};
  }
  
  p {
    color: ${({theme}) => theme.textL3};
    margin-bottom: ${vm(15)};
    line-height: 1.6;
    font-size: ${vm(14)};
  }
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${vm(200)}, 1fr));
  gap: ${vm(15)};
  margin-bottom: ${vm(30)};
`

const ToastButton = styled.button<{ $variant?: 'success' | 'error' | 'warning' | 'info' | 'loading' }>`
  padding: ${vm(12)} ${vm(20)};
  border: 1px solid ${({theme, $variant}) => {
    switch($variant) {
      case 'success': return theme.jade10;
      case 'error': return theme.ruby50;
      case 'warning': return theme.brand6;
      case 'info': return theme.brand6;
      case 'loading': return theme.brand6;
      default: return theme.lineDark8;
    }
  }};
  background: ${({theme, $variant}) => {
    switch($variant) {
      case 'success': return `${theme.jade10}20`;
      case 'error': return `${theme.ruby50}20`;
      case 'warning': return `${theme.brand6}20`;
      case 'info': return `${theme.brand6}20`;
      case 'loading': return `${theme.brand6}20`;
      default: return theme.bgL1;
    }
  }};
  color: ${({theme, $variant}) => {
    switch($variant) {
      case 'success': return theme.jade10;
      case 'error': return theme.ruby50;
      case 'warning': return theme.brand6;
      case 'info': return theme.brand6;
      case 'loading': return theme.brand6;
      default: return theme.textL1;
    }
  }};
  border-radius: ${vm(8)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${vm(14)};
  font-weight: 500;
  
  &:hover {
    transform: translateY(-${vm(1)});
    opacity: 0.8;
  }
  
  &:active {
    transform: translateY(0);
  }
`

const StatusBar = styled.div`
  padding: ${vm(15)};
  background: ${({theme}) => theme.bgL2};
  border-radius: ${vm(8)};
  margin-bottom: ${vm(20)};
  
  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${vm(8)};
    font-size: ${vm(14)};
    
    &:last-child {
      margin-bottom: 0;
    }
    
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

const ControlsArea = styled.div`
  display: flex;
  gap: ${vm(12)};
  margin-bottom: ${vm(20)};
  flex-wrap: wrap;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: ${vm(8)} ${vm(16)};
  background: ${({theme, $active}) => $active ? theme.brand6 : theme.bgL1};
  color: ${({theme, $active}) => $active ? 'white' : theme.textL1};
  border: 1px solid ${({theme, $active}) => $active ? theme.brand6 : theme.lineDark8};
  border-radius: ${vm(6)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${vm(14)};
  
  &:hover {
    background: ${({theme, $active}) => $active ? theme.brand6 : theme.bgL2};
    border-color: ${({theme}) => theme.brand6};
  }
`

const CustomInputArea = styled.div`
  background: ${({theme}) => theme.bgL2};
  border-radius: ${vm(8)};
  padding: ${vm(20)};
  margin-bottom: ${vm(20)};
  
  .input-group {
    margin-bottom: ${vm(15)};
    
    &:last-child {
      margin-bottom: 0;
    }
    
    label {
      display: block;
      margin-bottom: ${vm(8)};
      font-size: ${vm(14)};
      font-weight: 500;
      color: ${({theme}) => theme.textL2};
    }
    
    input, textarea, select {
      width: 100%;
      padding: ${vm(10)} ${vm(12)};
      background: ${({theme}) => theme.bgL1};
      border: 1px solid ${({theme}) => theme.lineDark8};
      border-radius: ${vm(6)};
      color: ${({theme}) => theme.textL1};
      font-size: ${vm(14)};
      
      &:focus {
        outline: none;
        border-color: ${({theme}) => theme.brand6};
      }
    }
    
    textarea {
      resize: vertical;
      min-height: ${vm(80)};
    }
  }
`

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${vm(6)};
  padding: ${vm(16)};
  margin: ${vm(16)} 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${vm(13)};
  line-height: 1.4;
  color: #f8f8f2;
`

const ToastDemo = () => {
  const toast = useToast()
  const theme = useTheme()
  
  const [toastCount, setToastCount] = useState(0)
  const [customTitle, setCustomTitle] = useState('自定义标题')
  const [customDescription, setCustomDescription] = useState('这是自定义的描述内容')
  const [customIcon, setCustomIcon] = useState('icon-chat-notification')
  const [customDuration, setCustomDuration] = useState(3000)
  
  // 预设的Toast配置
  const toastConfigs = [
    {
      title: '操作成功',
      description: '您的操作已成功完成',
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-complete',
      iconTheme: theme.jade10,
      variant: 'success' as const
    },
    {
      title: '操作失败',
      description: '操作执行失败，请稍后重试',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-chat-close',
      iconTheme: theme.ruby50,
      variant: 'error' as const
    },
    {
      title: '警告提示',
      description: '请注意检查您的输入信息',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-chat-warning',
      iconTheme: theme.brand6,
      variant: 'warning' as const
    },
    {
      title: '信息提示',
      description: '这是一条普通的信息提示',
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-notification',
      iconTheme: theme.brand6,
      variant: 'info' as const
    },
    {
      title: '加载中',
      description: '正在处理您的请求，请稍候...',
      status: TOAST_STATUS.LOADING,
      typeIcon: 'icon-chat-loading',
      iconTheme: theme.brand6,
      variant: 'loading' as const
    }
  ]
  
  // 显示预设Toast
  const showPresetToast = useCallback((config: typeof toastConfigs[0]) => {
    toast({
      title: config.title,
      description: config.description,
      status: config.status,
      typeIcon: config.typeIcon,
      iconTheme: config.iconTheme,
      autoClose: 3000
    })
    setToastCount(count => count + 1)
  }, [toast])
  
  // 显示自定义Toast
  const showCustomToast = () => {
    toast({
      title: customTitle,
      description: customDescription,
      status: TOAST_STATUS.SUCCESS,
      typeIcon: customIcon,
      iconTheme: theme.brand6,
      autoClose: customDuration
    })
    setToastCount(count => count + 1)
  }
  
  // 显示长文本Toast
  const showLongTextToast = () => {
    toast({
      title: '这是一个很长的标题，用来测试Toast组件对长文本的处理能力',
      description: '这是一个很长的描述内容，用来演示当描述文本过长时Toast组件如何处理文本溢出和换行，以及整体的布局效果是否良好。在实际使用中，建议控制文本长度以确保最佳的用户体验。',
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-notification',
      iconTheme: theme.brand6,
      autoClose: 5000
    })
    setToastCount(count => count + 1)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Toast 消息提示组件</h2>
        <p>
          基于 react-toastify 封装的消息提示组件，支持成功、错误、警告、信息和加载等多种状态，
          提供丰富的自定义选项和流畅的动画效果，适配移动端和桌面端。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>使用统计</h3>
        <StatusBar>
          <div className="status-item">
            <span className="label">Toast 显示次数:</span>
            <span className="value">{toastCount}</span>
          </div>
          <div className="status-item">
            <span className="label">当前设备:</span>
            <span className="value">{theme.isMobile ? '移动端' : '桌面端'}</span>
          </div>
          <div className="status-item">
            <span className="label">显示位置:</span>
            <span className="value">{theme.isMobile ? '顶部居中' : '右上角'}</span>
          </div>
          <div className="status-item">
            <span className="label">点击提示:</span>
            <span className="value">点击下方按钮查看不同类型的Toast</span>
          </div>
        </StatusBar>
      </DemoSection>

      <DemoSection>
        <h3>基础类型</h3>
        <p>展示不同状态和类型的Toast消息提示</p>
        
        <ButtonGrid>
          {toastConfigs.map((config, index) => (
            <ToastButton
              key={index}
              $variant={config.variant}
              onClick={() => showPresetToast(config)}
            >
              {config.title}
            </ToastButton>
          ))}
        </ButtonGrid>
      </DemoSection>

      <DemoSection>
        <h3>特殊场景</h3>
        <ControlsArea>
          <ControlButton onClick={showLongTextToast}>
            长文本Toast
          </ControlButton>
          <ControlButton onClick={() => {
            // 连续显示多个Toast
            setTimeout(() => showPresetToast(toastConfigs[0]), 0)
            setTimeout(() => showPresetToast(toastConfigs[1]), 200)
            setTimeout(() => showPresetToast(toastConfigs[2]), 400)
          }}>
            连续显示
          </ControlButton>
          <ControlButton onClick={() => {
            // 显示自动关闭时间很长的Toast
            toast({
              title: '长时间显示',
              description: '这个Toast将显示10秒钟',
              status: TOAST_STATUS.SUCCESS,
              typeIcon: 'icon-chat-notification',
              iconTheme: theme.brand6,
              autoClose: 10000
            })
            setToastCount(count => count + 1)
          }}>
            长时间显示
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>自定义Toast</h3>
        <p>自定义Toast的标题、描述、图标和显示时间</p>
        
        <CustomInputArea>
          <div className="input-group">
            <label>标题</label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="输入Toast标题"
            />
          </div>
          
          <div className="input-group">
            <label>描述</label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder="输入Toast描述内容"
            />
          </div>
          
          <div className="input-group">
            <label>图标类名</label>
            <select
              value={customIcon}
              onChange={(e) => setCustomIcon(e.target.value)}
            >
              <option value="icon-chat-notification">icon-chat-notification</option>
              <option value="icon-chat-complete">icon-chat-complete</option>
              <option value="icon-chat-close">icon-chat-close</option>
              <option value="icon-chat-warning">icon-chat-warning</option>
              <option value="icon-chat-loading">icon-chat-loading</option>
            </select>
          </div>
          
          <div className="input-group">
            <label>显示时间 (毫秒)</label>
            <input
              type="number"
              value={customDuration}
              onChange={(e) => setCustomDuration(parseInt(e.target.value) || 3000)}
              min="1000"
              max="10000"
              step="500"
            />
          </div>
          
          <ToastButton onClick={showCustomToast}>
            显示自定义Toast
          </ToastButton>
        </CustomInputArea>
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: vm(20), 
          borderRadius: vm(8),
          marginBottom: vm(20)
        }}>
          <ul style={{ 
            margin: 0, 
            paddingLeft: vm(20), 
            lineHeight: 1.6,
            fontSize: vm(14)
          }}>
            <li><strong>多种状态</strong>：成功、错误、警告、信息、加载等状态支持</li>
            <li><strong>响应式设计</strong>：自动适配移动端和桌面端显示位置</li>
            <li><strong>自定义图标</strong>：支持自定义类型图标和主题色彩</li>
            <li><strong>自动关闭</strong>：可配置自动关闭时间</li>
            <li><strong>点击关闭</strong>：支持点击Toast进行关闭</li>
            <li><strong>悬停暂停</strong>：鼠标悬停时暂停自动关闭</li>
            <li><strong>优雅动画</strong>：流畅的进入和退出动画效果</li>
            <li><strong>防重叠</strong>：多个Toast自动堆叠显示</li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import useToast, { TOAST_STATUS } from 'components/Toast'

const Component = () => {
  const toast = useToast()
  
  const showSuccess = () => {
    toast({
      title: '操作成功',
      description: '您的操作已成功完成',
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-complete',
      iconTheme: '#52c41a',
      autoClose: 3000
    })
  }
  
  const showError = () => {
    toast({
      title: '操作失败',
      description: '操作执行失败，请稍后重试',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-chat-close',
      iconTheme: '#ff4d4f',
      autoClose: 3000
    })
  }
  
  const showLoading = () => {
    toast({
      title: '加载中',
      description: '正在处理您的请求...',
      status: TOAST_STATUS.LOADING,
      typeIcon: 'icon-chat-loading',
      iconTheme: '#1890ff',
      autoClose: false // 不自动关闭
    })
  }
  
  return (
    <div>
      <button onClick={showSuccess}>成功提示</button>
      <button onClick={showError}>错误提示</button>
      <button onClick={showLoading}>加载提示</button>
    </div>
  )
}`}</CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>Toast参数</h3>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: vm(20), 
          borderRadius: vm(8)
        }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr 1fr 2fr', 
            gap: vm(15), 
            marginBottom: vm(15), 
            fontWeight: 'bold',
            fontSize: vm(14),
            paddingBottom: vm(10),
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div>参数</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </div>
          
          {[
            ['title', 'ReactNode', '-', 'Toast标题（必填）'],
            ['description', 'ReactNode', '-', 'Toast描述内容（必填）'],
            ['status', 'TOAST_STATUS', '-', '状态类型（必填）'],
            ['typeIcon', 'string', '-', '类型图标类名（必填）'],
            ['iconTheme', 'string', '-', '图标主题色（必填）'],
            ['autoClose', 'number', '3000', '自动关闭时间(ms)'],
          ].map(([param, type, defaultVal, desc], index) => (
            <div key={index} style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr 1fr 2fr', 
              gap: vm(15), 
              padding: `${vm(10)} 0`,
              borderBottom: index < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              fontSize: vm(13)
            }}>
              <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
              <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: vm(20) }}>
          <h4>TOAST_STATUS 枚举</h4>
          <CodeBlock>{`enum TOAST_STATUS {
  SUCCESS = 'SUCCESS',  // 成功状态
  ERROR = 'ERROR',      // 错误状态  
  LOADING = 'LOADING'   // 加载状态
}`}</CodeBlock>
        </div>
      </DemoSection>
    </DemoContainer>
  )
}

export default ToastDemo