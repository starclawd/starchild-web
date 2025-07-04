import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import Portal from './index'

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

const PortalDemo = () => {
  const [showBodyPortal, setShowBodyPortal] = useState(false)
  const [showCustomPortal, setShowCustomPortal] = useState(false)
  const [customContainer, setCustomContainer] = useState<HTMLDivElement | null>(null)
  const customRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (customRef.current) {
      setCustomContainer(customRef.current)
    }
  }, [])

  const PortalContent = ({ title, onClose }: { title: string; onClose: () => void }) => (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
      color: 'black',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 9999,
      minWidth: '300px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: 'black' }}>{title}</h3>
      <p style={{ margin: '0 0 15px 0', color: '#666' }}>
        这个内容通过 Portal 组件渲染到了 {title === 'Body Portal' ? 'document.body' : '自定义容器'} 中
      </p>
      <button 
        onClick={onClose}
        style={{
          padding: '8px 16px',
          background: '#1890ff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        关闭
      </button>
    </div>
  )

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Portal 传送门组件示例</h2>
        <p>
          Portal 组件基于 React.createPortal 实现，用于将子组件渲染到指定的 DOM 节点中。
          常用于弹窗、提示框等需要脱离正常文档流的组件。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法 - 渲染到 Body</h3>
        <p>将内容传送到 document.body</p>
        
        <button 
          onClick={() => setShowBodyPortal(true)}
          style={{
            padding: '12px 24px',
            background: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          显示 Body Portal
        </button>

        {showBodyPortal && (
          <Portal>
            <PortalContent 
              title="Body Portal" 
              onClose={() => setShowBodyPortal(false)} 
            />
          </Portal>
        )}
      </DemoSection>

      <DemoSection>
        <h3>自定义容器</h3>
        <p>将内容传送到自定义的 DOM 容器</p>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
          <div>
            <button 
              onClick={() => setShowCustomPortal(true)}
              style={{
                padding: '12px 24px',
                background: '#52c41a',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '20px'
              }}
            >
              显示自定义 Portal
            </button>
          </div>
          
          <div 
            ref={customRef}
            style={{
              width: '300px',
              height: '200px',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)'
            }}
          >
            <span style={{ color: '#999', textAlign: 'center' }}>
              自定义容器<br/>
              Portal 内容将渲染在这里
            </span>
            
            {showCustomPortal && customContainer && (
              <Portal rootEl={customContainer}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  right: '10px',
                  bottom: '10px',
                  background: 'rgba(24, 144, 255, 0.1)',
                  border: '1px solid #1890ff',
                  borderRadius: '6px',
                  padding: '15px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                    Portal 内容
                  </div>
                  <div style={{ marginBottom: '10px', fontSize: '12px', textAlign: 'center' }}>
                    这个内容通过 Portal 渲染到了自定义容器中
                  </div>
                  <button 
                    onClick={() => setShowCustomPortal(false)}
                    style={{
                      padding: '4px 8px',
                      background: '#1890ff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    关闭
                  </button>
                </div>
              </Portal>
            )}
          </div>
        </div>
      </DemoSection>

      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '15px', marginBottom: '15px', fontWeight: 'bold' }}>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '15px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontFamily: 'monospace' }}>children</div>
            <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>ReactNode</div>
            <div>-</div>
            <div>需要传送的子组件（必填）</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '15px', paddingTop: '10px' }}>
            <div style={{ fontFamily: 'monospace' }}>rootEl</div>
            <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>HTMLDivElement</div>
            <div style={{ fontFamily: 'monospace' }}>document.body</div>
            <div>目标 DOM 节点</div>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用场景</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>弹窗和对话框</strong>：避免 z-index 层级问题</li>
              <li><strong>提示和通知</strong>：在页面顶层显示消息</li>
              <li><strong>下拉菜单</strong>：避免父容器 overflow 限制</li>
              <li><strong>工具提示</strong>：确保提示框不被遮挡</li>
              <li><strong>全屏组件</strong>：如图片预览、视频播放器</li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default PortalDemo