import React, { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'
import useToast, { TOAST_STATUS, StyledToastContent } from './index'
import { vm } from 'pages/helper'
import { useTheme } from 'styled-components'
import { useIsMobile } from 'store/application/hooks'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;
  position: relative;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      min-height: auto;
    `}

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(20)};
        margin-bottom: ${vm(16)};
      `}
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(16)};
        margin-bottom: ${vm(12)};
      `}
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 14px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(14)};
        margin-bottom: ${vm(12)};
      `}
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(32)};
    `}

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
    font-size: 24px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(20)};
        margin-bottom: ${vm(16)};
      `}
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
    font-size: 18px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(16)};
        margin-bottom: ${vm(12)};
      `}
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 14px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        font-size: ${vm(14)};
        margin-bottom: ${vm(12)};
      `}
  }
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      grid-template-columns: 1fr;
      gap: ${vm(12)};
      margin-bottom: ${vm(24)};
    `}
`

const ToastButton = styled.button<{ $variant?: 'success' | 'error' | 'warning' | 'info' | 'loading' }>`
  padding: 12px 20px;
  border: 1px solid
    ${({ theme, $variant }) => {
      switch ($variant) {
        case 'success':
          return theme.jade10
        case 'error':
          return theme.ruby50
        case 'warning':
          return theme.brand100
        case 'info':
          return theme.brand100
        case 'loading':
          return theme.brand100
        default:
          return theme.lineDark8
      }
    }};
  background: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return `${theme.jade10}20`
      case 'error':
        return `${theme.ruby50}20`
      case 'warning':
        return `${theme.brand100}20`
      case 'info':
        return `${theme.brand100}20`
      case 'loading':
        return `${theme.brand100}20`
      default:
        return theme.bgL1
    }
  }};
  color: ${({ theme, $variant }) => {
    switch ($variant) {
      case 'success':
        return theme.jade10
      case 'error':
        return theme.ruby50
      case 'warning':
        return theme.brand100
      case 'info':
        return theme.brand100
      case 'loading':
        return theme.brand100
      default:
        return theme.textL1
    }
  }};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(14)} ${vm(20)};
      font-size: ${vm(16)};
      border-radius: ${vm(8)};
      min-height: ${vm(48)};
    `}

  &:hover {
    transform: translateY(-1px);
    opacity: 0.8;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        transform: none;
        opacity: 0.9;
      `}
  }

  &:active {
    transform: translateY(0);
  }
`

const StatusBar = styled.div`
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(16)};
      border-radius: ${vm(8)};
      margin-bottom: ${vm(16)};
    `}

  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        margin-bottom: ${vm(8)};
        font-size: ${vm(14)};
      `}

    &:last-child {
      margin-bottom: 0;
    }

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

const ControlsArea = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      margin-bottom: ${vm(16)};
    `}
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL1)};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.textL1)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.brand100 : theme.lineDark8)};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(12)} ${vm(16)};
      font-size: ${vm(14)};
      border-radius: ${vm(6)};
      min-height: ${vm(44)};
    `}

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL2)};
    border-color: ${({ theme }) => theme.brand100};
  }
`

const CustomInputArea = styled.div`
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(8)};
      padding: ${vm(16)};
      margin-bottom: ${vm(16)};
    `}

  .input-group {
    margin-bottom: 15px;

    ${({ theme }) =>
      theme.isMobile &&
      css`
        margin-bottom: ${vm(16)};
      `}

    &:last-child {
      margin-bottom: 0;
    }

    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      font-weight: 500;
      color: ${({ theme }) => theme.textL2};

      ${({ theme }) =>
        theme.isMobile &&
        css`
          margin-bottom: ${vm(8)};
          font-size: ${vm(14)};
        `}
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: 10px 12px;
      background: ${({ theme }) => theme.bgL1};
      border: 1px solid ${({ theme }) => theme.lineDark8};
      border-radius: 6px;
      color: ${({ theme }) => theme.textL1};
      font-size: 14px;

      ${({ theme }) =>
        theme.isMobile &&
        css`
          padding: ${vm(12)} ${vm(16)};
          border-radius: ${vm(6)};
          font-size: ${vm(16)};
          min-height: ${vm(44)};
        `}

      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.brand100};
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;

      ${({ theme }) =>
        theme.isMobile &&
        css`
          min-height: ${vm(80)};
        `}
    }
  }
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.textL1};
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(8)};
      padding: ${vm(12)};
      margin: ${vm(12)} 0;
      font-size: ${vm(12)};
    `}
`

const ToastDemo = () => {
  const toast = useToast()
  const theme = useTheme()
  const isMobile = useIsMobile()

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
      variant: 'success' as const,
    },
    {
      title: '操作失败',
      description: '操作执行失败，请稍后重试',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-chat-close',
      iconTheme: theme.ruby50,
      variant: 'error' as const,
    },
    {
      title: '警告提示',
      description: '请注意检查您的输入信息',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-chat-warning',
      iconTheme: theme.brand100,
      variant: 'warning' as const,
    },
    {
      title: '信息提示',
      description: '这是一条普通的信息提示',
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-notification',
      iconTheme: theme.brand100,
      variant: 'info' as const,
    },
    {
      title: '加载中',
      description: '正在处理您的请求，请稍候...',
      status: TOAST_STATUS.LOADING,
      typeIcon: 'icon-chat-loading',
      iconTheme: theme.brand100,
      variant: 'loading' as const,
    },
  ]

  // 显示预设Toast
  const showPresetToast = useCallback(
    (config: (typeof toastConfigs)[0]) => {
      toast({
        title: config.title,
        description: config.description,
        status: config.status,
        typeIcon: config.typeIcon,
        iconTheme: config.iconTheme,
        autoClose: 3000,
      })
      setToastCount((count) => count + 1)
    },
    [toast],
  )

  // 显示自定义Toast
  const showCustomToast = () => {
    toast({
      title: customTitle,
      description: customDescription,
      status: TOAST_STATUS.SUCCESS,
      typeIcon: customIcon,
      iconTheme: theme.brand100,
      autoClose: customDuration,
    })
    setToastCount((count) => count + 1)
  }

  // 显示长文本Toast
  const showLongTextToast = () => {
    toast({
      title: '这是一个很长的标题，用来测试Toast组件对长文本的处理能力',
      description:
        '这是一个很长的描述内容，用来演示当描述文本过长时Toast组件如何处理文本溢出和换行，以及整体的布局效果是否良好。在实际使用中，建议控制文本长度以确保最佳的用户体验。',
      status: TOAST_STATUS.SUCCESS,
      typeIcon: 'icon-chat-notification',
      iconTheme: theme.brand100,
      autoClose: 5000,
    })
    setToastCount((count) => count + 1)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Toast 消息提示组件</h2>
        <p>
          基于 react-toastify 封装的消息提示组件，支持成功、错误、警告、信息和加载等多种状态，
          提供丰富的自定义选项和流畅的动画效果。{isMobile ? '移动端' : '桌面端'}优化显示，
          {isMobile ? '在屏幕顶部居中显示' : '在右上角显示'}。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>使用统计</h3>
        <StatusBar>
          <div className='status-item'>
            <span className='label'>Toast 显示次数:</span>
            <span className='value'>{toastCount}</span>
          </div>
          <div className='status-item'>
            <span className='label'>当前设备:</span>
            <span className='value'>{isMobile ? '移动端' : '桌面端'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>显示位置:</span>
            <span className='value'>{isMobile ? '顶部居中' : '右上角'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>点击提示:</span>
            <span className='value'>点击下方按钮查看不同类型的Toast</span>
          </div>
        </StatusBar>
      </DemoSection>

      <DemoSection>
        <h3>基础类型</h3>
        <p>展示不同状态和类型的Toast消息提示</p>

        <ButtonGrid>
          {toastConfigs.map((config, index) => (
            <ToastButton key={index} $variant={config.variant} onClick={() => showPresetToast(config)}>
              {config.title}
            </ToastButton>
          ))}
        </ButtonGrid>
      </DemoSection>

      <DemoSection>
        <h3>特殊场景</h3>
        <ControlsArea>
          <ControlButton onClick={showLongTextToast}>长文本Toast</ControlButton>
          <ControlButton
            onClick={() => {
              // 连续显示多个Toast
              setTimeout(() => showPresetToast(toastConfigs[0]), 0)
              setTimeout(() => showPresetToast(toastConfigs[1]), 200)
              setTimeout(() => showPresetToast(toastConfigs[2]), 400)
            }}
          >
            连续显示
          </ControlButton>
          <ControlButton
            onClick={() => {
              // 显示自动关闭时间很长的Toast
              toast({
                title: '长时间显示',
                description: '这个Toast将显示10秒钟',
                status: TOAST_STATUS.SUCCESS,
                typeIcon: 'icon-chat-notification',
                iconTheme: theme.brand100,
                autoClose: 10000,
              })
              setToastCount((count) => count + 1)
            }}
          >
            长时间显示
          </ControlButton>
          <ControlButton
            onClick={() => {
              // 显示适合移动端的Toast
              toast({
                title: isMobile ? '移动端优化' : '桌面端优化',
                description: isMobile
                  ? '这个Toast针对移动端进行了优化，在顶部居中显示'
                  : '这个Toast针对桌面端进行了优化，在右上角显示',
                status: TOAST_STATUS.SUCCESS,
                typeIcon: 'icon-chat-notification',
                iconTheme: theme.brand100,
                autoClose: 4000,
              })
              setToastCount((count) => count + 1)
            }}
          >
            {isMobile ? '移动端优化' : '桌面端优化'}
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>自定义Toast</h3>
        <p>自定义Toast的标题、描述、图标和显示时间</p>

        <CustomInputArea>
          <div className='input-group'>
            <label>标题</label>
            <input
              type='text'
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder='输入Toast标题'
            />
          </div>

          <div className='input-group'>
            <label>描述</label>
            <textarea
              value={customDescription}
              onChange={(e) => setCustomDescription(e.target.value)}
              placeholder='输入Toast描述内容'
            />
          </div>

          <div className='input-group'>
            <label>图标类名</label>
            <select value={customIcon} onChange={(e) => setCustomIcon(e.target.value)}>
              <option value='icon-chat-notification'>icon-chat-notification</option>
              <option value='icon-chat-complete'>icon-chat-complete</option>
              <option value='icon-chat-close'>icon-chat-close</option>
              <option value='icon-chat-warning'>icon-chat-warning</option>
              <option value='icon-chat-loading'>icon-chat-loading</option>
            </select>
          </div>

          <div className='input-group'>
            <label>显示时间 (毫秒)</label>
            <input
              type='number'
              value={customDuration}
              onChange={(e) => setCustomDuration(parseInt(e.target.value) || 3000)}
              min='1000'
              max='10000'
              step='500'
            />
          </div>

          <ToastButton onClick={showCustomToast}>显示自定义Toast</ToastButton>
        </CustomInputArea>
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: isMobile ? vm(16) : 20,
            borderRadius: isMobile ? vm(8) : 8,
            marginBottom: isMobile ? vm(16) : 20,
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: isMobile ? vm(16) : 20,
              lineHeight: 1.6,
              fontSize: isMobile ? vm(14) : 14,
            }}
          >
            <li>
              <strong>多种状态</strong>：成功、错误、警告、信息、加载等状态支持
            </li>
            <li>
              <strong>响应式设计</strong>：自动适配移动端和桌面端显示位置
              {isMobile ? '（当前：移动端顶部居中）' : '（当前：桌面端右上角）'}
            </li>
            <li>
              <strong>自定义图标</strong>：支持自定义类型图标和主题色彩
            </li>
            <li>
              <strong>自动关闭</strong>：可配置自动关闭时间
            </li>
            <li>
              <strong>点击关闭</strong>：支持点击Toast进行关闭
            </li>
            <li>
              <strong>悬停暂停</strong>：鼠标悬停时暂停自动关闭
            </li>
            <li>
              <strong>优雅动画</strong>：流畅的进入和退出动画效果
            </li>
            <li>
              <strong>防重叠</strong>：多个Toast自动堆叠显示
            </li>
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
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: isMobile ? vm(16) : 20,
            borderRadius: isMobile ? vm(8) : 8,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 2fr',
              gap: isMobile ? vm(8) : 15,
              marginBottom: isMobile ? vm(12) : 15,
              fontWeight: 'bold',
              fontSize: isMobile ? vm(12) : 14,
              paddingBottom: isMobile ? vm(8) : 10,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div>参数</div>
            <div>类型</div>
            {!isMobile && <div>默认值</div>}
            {!isMobile && <div>描述</div>}
          </div>

          {[
            ['title', 'ReactNode', '-', 'Toast标题（必填）'],
            ['description', 'ReactNode', '-', 'Toast描述内容（必填）'],
            ['status', 'TOAST_STATUS', '-', '状态类型（必填）'],
            ['typeIcon', 'string', '-', '类型图标类名（必填）'],
            ['iconTheme', 'string', '-', '图标主题色（必填）'],
            ['autoClose', 'number', '3000', '自动关闭时间(ms)'],
          ].map(([param, type, defaultVal, desc], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr 1fr' : '1fr 1fr 1fr 2fr',
                gap: isMobile ? vm(8) : 15,
                padding: isMobile ? `${vm(8)} 0` : '10px 0',
                borderBottom: index < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                fontSize: isMobile ? vm(12) : 13,
              }}
            >
              <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
              <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
              {!isMobile && <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>}
              {!isMobile && <div>{desc}</div>}
              {isMobile && (
                <div style={{ gridColumn: '1 / -1', marginTop: vm(4), fontSize: vm(11), color: '#999' }}>
                  默认: {defaultVal} • {desc}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: isMobile ? vm(16) : 20 }}>
          <h4
            style={{
              fontSize: isMobile ? vm(14) : 16,
              marginBottom: isMobile ? vm(8) : 12,
              color: theme.textL2,
            }}
          >
            TOAST_STATUS 枚举
          </h4>
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
