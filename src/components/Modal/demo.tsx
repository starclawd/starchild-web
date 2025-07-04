import React, { useState } from 'react'
import styled from 'styled-components'
import Modal, { CloseWrapper } from './index'

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

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin: 20px 0;
`

const DemoButton = styled.button`
  padding: 12px 24px;
  background: ${({theme}) => theme.brand6};
  color: ${({theme}) => theme.textDark98};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({theme}) => theme.brand6};
    opacity: 0.8;
  }
  
  &:active {
    transform: translateY(1px);
  }
`

const SecondaryButton = styled(DemoButton)`
  background: ${({theme}) => theme.textL3};
  
  &:hover {
    background: ${({theme}) => theme.textL2};
  }
`

const DangerButton = styled(DemoButton)`
  background: #ff4d4f;
  
  &:hover {
    background: #ff7875;
  }
`

const ModalContent = styled.div`
  background: ${({theme}) => theme.bgL1};
  padding: 40px;
  border-radius: 12px;
  min-width: 300px;
  max-width: 500px;
  position: relative;
  
  h3 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: 15px;
    font-size: 20px;
  }
  
  p {
    color: ${({theme}) => theme.textL2};
    margin-bottom: 20px;
    line-height: 1.5;
  }
  
  .modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }
`

const LargeModalContent = styled(ModalContent)`
  min-width: 600px;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  
  .content-scroll {
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    background: ${({theme}) => theme.bgL2};
    border-radius: 8px;
    margin: 20px 0;
  }
`

const MobileModalContent = styled.div`
  background: ${({theme}) => theme.bgL1};
  padding: 30px 20px 20px;
  border-radius: 20px 20px 0 0;
  width: 100%;
  min-height: 50vh;
  max-height: 90vh;
  overflow-y: auto;
  
  h3 {
    color: ${({theme}) => theme.textL1};
    margin-bottom: 15px;
    font-size: 18px;
  }
  
  p {
    color: ${({theme}) => theme.textL2};
    margin-bottom: 15px;
    line-height: 1.5;
  }
`

const FormModalContent = styled(ModalContent)`
  .form-row {
    margin-bottom: 20px;
    
    label {
      display: block;
      margin-bottom: 5px;
      color: ${({theme}) => theme.textL1};
      font-weight: 500;
    }
    
    input, textarea {
      width: 100%;
      padding: 10px;
      background: ${({theme}) => theme.bgL2};
      border: 1px solid ${({theme}) => theme.lineDark8};
      border-radius: 6px;
      color: ${({theme}) => theme.textL1};
      
      &:focus {
        outline: none;
        border-color: ${({theme}) => theme.brand6};
      }
    }
    
    textarea {
      min-height: 80px;
      resize: vertical;
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

const ModalDemo = () => {
  const [basicModalOpen, setBasicModalOpen] = useState(false)
  const [noCloseModalOpen, setNoCloseModalOpen] = useState(false)
  const [largeModalOpen, setLargeModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [mobileModalOpen, setMobileModalOpen] = useState(false)
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const [noAnimationModalOpen, setNoAnimationModalOpen] = useState(false)
  const [dismissModalOpen, setDismissModalOpen] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  
  const [modalStats, setModalStats] = useState({
    openCount: 0,
    closeCount: 0,
    lastOpened: ''
  })

  const handleOpenModal = (type: string) => {
    setModalStats(prev => ({
      ...prev,
      openCount: prev.openCount + 1,
      lastOpened: type
    }))
  }

  const handleCloseModal = () => {
    setModalStats(prev => ({
      ...prev,
      closeCount: prev.closeCount + 1
    }))
  }

  const handleFormSubmit = () => {
    console.log('表单提交:', formData)
    setFormModalOpen(false)
    setFormData({ name: '', email: '', message: '' })
    handleCloseModal()
  }

  const longContent = Array.from({ length: 50 }, (_, i) => 
    `这是第 ${i + 1} 段内容。Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
  ).join('\n\n')

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Modal 弹窗组件示例</h2>
        <p>
          Modal 组件是基于 @reach/dialog 实现的弹窗组件，支持移动端和桌面端适配。
          提供丰富的自定义选项，包括动画、层级、关闭行为等功能。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最简单的弹窗使用方式</p>
        
        <ButtonGrid>
          <DemoButton 
            onClick={() => {
              setBasicModalOpen(true)
              handleOpenModal('基础弹窗')
            }}
          >
            基础弹窗
          </DemoButton>
        </ButtonGrid>
        
        <Modal
          isOpen={basicModalOpen}
          onDismiss={() => {
            setBasicModalOpen(false)
            handleCloseModal()
          }}
        >
          <ModalContent>
            <h3>基础弹窗示例</h3>
            <p>这是一个最基本的弹窗，包含标题、内容和操作按钮。</p>
            <p>您可以点击右上角的关闭按钮或者按 ESC 键来关闭弹窗。</p>
            <div className="modal-buttons">
              <SecondaryButton onClick={() => {
                setBasicModalOpen(false)
                handleCloseModal()
              }}>
                取消
              </SecondaryButton>
              <DemoButton onClick={() => {
                setBasicModalOpen(false)
                handleCloseModal()
              }}>
                确定
              </DemoButton>
            </div>
          </ModalContent>
        </Modal>
        
        <CodeBlock>
{`const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
>
  <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
    <h3>弹窗标题</h3>
    <p>弹窗内容</p>
    <button onClick={() => setIsOpen(false)}>关闭</button>
  </div>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>隐藏关闭按钮</h3>
        <p>隐藏默认的关闭按钮，需要自定义关闭操作</p>
        
        <ButtonGrid>
          <SecondaryButton 
            onClick={() => {
              setNoCloseModalOpen(true)
              handleOpenModal('无关闭按钮')
            }}
          >
            无关闭按钮弹窗
          </SecondaryButton>
        </ButtonGrid>
        
        <Modal
          isOpen={noCloseModalOpen}
          onDismiss={() => {
            setNoCloseModalOpen(false)
            handleCloseModal()
          }}
          hideClose
        >
          <ModalContent>
            <h3>无关闭按钮弹窗</h3>
            <p>这个弹窗隐藏了默认的关闭按钮，只能通过下面的按钮或按 ESC 键关闭。</p>
            <p>这种模式适合需要用户必须进行操作选择的场景。</p>
            <div className="modal-buttons">
              <DemoButton onClick={() => {
                setNoCloseModalOpen(false)
                handleCloseModal()
              }}>
                我知道了
              </DemoButton>
            </div>
          </ModalContent>
        </Modal>
        
        <CodeBlock>
{`<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  hideClose // 隐藏默认关闭按钮
>
  <ModalContent>
    <h3>自定义关闭</h3>
    <button onClick={() => setIsOpen(false)}>
      自定义关闭按钮
    </button>
  </ModalContent>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>大型内容弹窗</h3>
        <p>包含大量内容的弹窗，支持内容滚动</p>
        
        <ButtonGrid>
          <DemoButton 
            onClick={() => {
              setLargeModalOpen(true)
              handleOpenModal('大型内容')
            }}
          >
            大型内容弹窗
          </DemoButton>
        </ButtonGrid>
        
        <Modal
          isOpen={largeModalOpen}
          onDismiss={() => {
            setLargeModalOpen(false)
            handleCloseModal()
          }}
        >
          <LargeModalContent>
            <h3>大型内容弹窗</h3>
            <p>这个弹窗包含大量内容，演示了内容滚动功能。</p>
            
            <div className="content-scroll">
              {longContent.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="modal-buttons">
              <SecondaryButton onClick={() => {
                setLargeModalOpen(false)
                handleCloseModal()
              }}>
                关闭
              </SecondaryButton>
            </div>
          </LargeModalContent>
        </Modal>
        
        <CodeBlock>
{`<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
>
  <div style={{ 
    maxWidth: '800px', 
    maxHeight: '80vh', 
    overflow: 'auto',
    padding: '20px' 
  }}>
    <h3>大型内容</h3>
    <div style={{ maxHeight: '400px', overflow: 'auto' }}>
      {longContent}
    </div>
  </div>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>表单弹窗</h3>
        <p>包含表单输入的弹窗示例</p>
        
        <ButtonGrid>
          <DemoButton 
            onClick={() => {
              setFormModalOpen(true)
              handleOpenModal('表单弹窗')
            }}
          >
            表单弹窗
          </DemoButton>
        </ButtonGrid>
        
        <Modal
          isOpen={formModalOpen}
          onDismiss={() => {
            setFormModalOpen(false)
            handleCloseModal()
          }}
        >
          <FormModalContent>
            <h3>联系我们</h3>
            <p>请填写以下信息，我们会尽快与您联系。</p>
            
            <div className="form-row">
              <label>姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入您的姓名"
              />
            </div>
            
            <div className="form-row">
              <label>邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="请输入您的邮箱"
              />
            </div>
            
            <div className="form-row">
              <label>留言</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="请输入您的留言"
              />
            </div>
            
            <div className="modal-buttons">
              <SecondaryButton onClick={() => {
                setFormModalOpen(false)
                handleCloseModal()
              }}>
                取消
              </SecondaryButton>
              <DemoButton onClick={handleFormSubmit}>
                提交
              </DemoButton>
            </div>
          </FormModalContent>
        </Modal>
        
        <CodeBlock>
{`const [formData, setFormData] = useState({ name: '', email: '' })

<Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
  <div style={{ padding: '20px' }}>
    <h3>表单弹窗</h3>
    <input
      type="text"
      value={formData.name}
      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
      placeholder="姓名"
    />
    <input
      type="email"
      value={formData.email}
      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      placeholder="邮箱"
    />
  </div>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>移动端样式</h3>
        <p>移动端会自动适配为底部弹出样式</p>
        
        <ButtonGrid>
          <DemoButton 
            onClick={() => {
              setMobileModalOpen(true)
              handleOpenModal('移动端样式')
            }}
          >
            移动端样式 (在移动设备上查看)
          </DemoButton>
        </ButtonGrid>
        
        <Modal
          isOpen={mobileModalOpen}
          onDismiss={() => {
            setMobileModalOpen(false)
            handleCloseModal()
          }}
        >
          <MobileModalContent>
            <h3>移动端弹窗</h3>
            <p>在移动端设备上，弹窗会自动适配为从底部弹出的样式。</p>
            <p>这种设计更符合移动端的操作习惯。</p>
            <div style={{ marginTop: '20px' }}>
              <DemoButton onClick={() => {
                setMobileModalOpen(false)
                handleCloseModal()
              }}>
                关闭
              </DemoButton>
            </div>
          </MobileModalContent>
        </Modal>
        
        <CodeBlock>
{`// 组件会自动检测设备类型
// 移动端：底部弹出样式
// 桌面端：居中弹窗样式

<Modal isOpen={isOpen} onDismiss={() => setIsOpen(false)}>
  <div>移动端会自动适配底部弹出样式</div>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义样式和层级</h3>
        <p>自定义弹窗的层级和内容样式</p>
        
        <ButtonGrid>
          <DemoButton 
            onClick={() => {
              setCustomModalOpen(true)
              handleOpenModal('自定义样式')
            }}
          >
            自定义样式弹窗
          </DemoButton>
        </ButtonGrid>
        
        <Modal
          isOpen={customModalOpen}
          onDismiss={() => {
            setCustomModalOpen(false)
            handleCloseModal()
          }}
          zIndex={999}
          contentStyle={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <ModalContent style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <h3>自定义样式弹窗</h3>
            <p>这个弹窗使用了自定义的背景、毛玻璃效果和渐变色。</p>
            <p>zIndex 设置为 999，确保在其他元素之上显示。</p>
            <div className="modal-buttons">
              <button 
                style={{ 
                  padding: '8px 16px', 
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setCustomModalOpen(false)
                  handleCloseModal()
                }}
              >
                关闭
              </button>
            </div>
          </ModalContent>
        </Modal>
        
        <CodeBlock>
{`<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  zIndex={999}
  contentStyle={{
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }}
>
  <div style={{
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: '20px',
    borderRadius: '8px'
  }}>
    自定义样式内容
  </div>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>禁用动画</h3>
        <p>关闭弹窗的打开动画效果</p>
        
        <ButtonGrid>
          <DemoButton 
            onClick={() => {
              setNoAnimationModalOpen(true)
              handleOpenModal('无动画')
            }}
          >
            无动画弹窗
          </DemoButton>
        </ButtonGrid>
        
        <Modal
          isOpen={noAnimationModalOpen}
          onDismiss={() => {
            setNoAnimationModalOpen(false)
            handleCloseModal()
          }}
          openAnimation={false}
        >
          <ModalContent>
            <h3>无动画弹窗</h3>
            <p>这个弹窗禁用了打开动画，会立即显示。</p>
            <p>适合需要快速响应的场景。</p>
            <div className="modal-buttons">
              <DemoButton onClick={() => {
                setNoAnimationModalOpen(false)
                handleCloseModal()
              }}>
                关闭
              </DemoButton>
            </div>
          </ModalContent>
        </Modal>
        
        <CodeBlock>
{`<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  openAnimation={false} // 禁用打开动画
>
  <ModalContent>
    无动画弹窗内容
  </ModalContent>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>禁用点击空白处关闭</h3>
        <p>禁用点击遮罩层关闭弹窗的功能</p>
        
        <ButtonGrid>
          <DangerButton 
            onClick={() => {
              setDismissModalOpen(true)
              handleOpenModal('禁用点击关闭')
            }}
          >
            禁用点击空白处关闭
          </DangerButton>
        </ButtonGrid>
        
        <Modal
          isOpen={dismissModalOpen}
          onDismiss={() => {
            setDismissModalOpen(false)
            handleCloseModal()
          }}
          useDismiss={false}
        >
          <ModalContent>
            <h3>重要提示</h3>
            <p>这个弹窗禁用了点击空白处关闭的功能。</p>
            <p>用户必须点击关闭按钮或确定按钮才能关闭弹窗。</p>
            <p>适合重要提示或确认操作的场景。</p>
            <div className="modal-buttons">
              <DemoButton onClick={() => {
                setDismissModalOpen(false)
                handleCloseModal()
              }}>
                我已了解
              </DemoButton>
            </div>
          </ModalContent>
        </Modal>
        
        <CodeBlock>
{`<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  useDismiss={false} // 禁用点击空白处关闭
>
  <ModalContent>
    重要提示内容
    <button onClick={() => setIsOpen(false)}>
      必须点击这里关闭
    </button>
  </ModalContent>
</Modal>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>使用统计</h3>
        <p>弹窗打开和关闭的统计信息</p>
        
        <StatusDisplay>
          <div className="status-item">
            <span className="label">弹窗打开次数:</span>
            <span className="value">{modalStats.openCount}</span>
          </div>
          <div className="status-item">
            <span className="label">弹窗关闭次数:</span>
            <span className="value">{modalStats.closeCount}</span>
          </div>
          <div className="status-item">
            <span className="label">最后打开的弹窗:</span>
            <span className="value">{modalStats.lastOpened || '无'}</span>
          </div>
          <div className="status-item">
            <span className="label">当前表单数据:</span>
            <span className="value">{JSON.stringify(formData)}</span>
          </div>
        </StatusDisplay>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>
          Modal 组件支持的所有属性参数
        </p>
        
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          
          <PropsTableRow>
            <PropsTableCell type="prop">isOpen</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">是否显示弹窗（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">onDismiss</PropsTableCell>
            <PropsTableCell type="type">function</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">关闭弹窗的回调函数</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">children</PropsTableCell>
            <PropsTableCell type="type">ReactNode</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">弹窗内容</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">hideClose</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">false</PropsTableCell>
            <PropsTableCell type="desc">是否隐藏默认关闭按钮</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">forceWeb</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">false</PropsTableCell>
            <PropsTableCell type="desc">是否强制使用桌面端样式</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">useDismiss</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">true</PropsTableCell>
            <PropsTableCell type="desc">是否允许点击空白处关闭</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">openTouchMove</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">false</PropsTableCell>
            <PropsTableCell type="desc">是否允许触摸移动</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">zIndex</PropsTableCell>
            <PropsTableCell type="type">number</PropsTableCell>
            <PropsTableCell type="default">100</PropsTableCell>
            <PropsTableCell type="desc">弹窗层级</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">openAnimation</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">true</PropsTableCell>
            <PropsTableCell type="desc">是否启用打开动画</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">contentStyle</PropsTableCell>
            <PropsTableCell type="type">CSSProperties</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">内容容器自定义样式</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">cancelOverflow</PropsTableCell>
            <PropsTableCell type="type">boolean</PropsTableCell>
            <PropsTableCell type="default">false</PropsTableCell>
            <PropsTableCell type="desc">是否取消内容溢出滚动</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">onClick</PropsTableCell>
            <PropsTableCell type="type">function</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">弹窗点击事件处理</PropsTableCell>
          </PropsTableRow>
        </PropsTable>
        
        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
{`interface ModalProps {
  isOpen: boolean;                                    // 必填：是否显示弹窗
  onDismiss?: () => void;                            // 可选：关闭回调函数
  children?: ReactNode;                              // 可选：弹窗内容
  hideClose?: boolean;                               // 可选：是否隐藏关闭按钮
  forceWeb?: boolean;                                // 可选：是否强制桌面端样式
  useDismiss?: boolean;                              // 可选：是否允许点击空白处关闭
  openTouchMove?: boolean;                           // 可选：是否允许触摸移动
  zIndex?: number;                                   // 可选：层级，默认100
  openAnimation?: boolean;                           // 可选：是否启用动画，默认true
  contentStyle?: React.CSSProperties;               // 可选：内容样式
  cancelOverflow?: boolean;                          // 可选：是否取消溢出
  onClick?: (e: React.MouseEvent<HTMLElement>) => void; // 可选：点击事件
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>响应式设计</strong>：自动适配移动端和桌面端显示样式</li>
              <li><strong>键盘支持</strong>：支持 ESC 键关闭弹窗</li>
              <li><strong>无障碍访问</strong>：基于 @reach/dialog 提供完整的 a11y 支持</li>
              <li><strong>动画效果</strong>：支持自定义打开动画，移动端和桌面端不同效果</li>
              <li><strong>层级管理</strong>：可自定义 z-index 确保正确的层级关系</li>
              <li><strong>滚动控制</strong>：支持内容滚动和溢出控制</li>
              <li><strong>触摸优化</strong>：移动端触摸事件的专门优化</li>
              <li><strong>主题适配</strong>：完美适配暗色和亮色主题</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
{`// 基础使用
import Modal from 'components/Modal'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        打开弹窗
      </button>
      
      <Modal
        isOpen={isOpen}
        onDismiss={() => setIsOpen(false)}
      >
        <div style={{ 
          background: 'white', 
          padding: '20px', 
          borderRadius: '8px' 
        }}>
          <h3>弹窗标题</h3>
          <p>弹窗内容</p>
          <button onClick={() => setIsOpen(false)}>
            关闭
          </button>
        </div>
      </Modal>
    </>
  )
}

// 高级配置
<Modal
  isOpen={isOpen}
  onDismiss={() => setIsOpen(false)}
  hideClose          // 隐藏默认关闭按钮
  forceWeb           // 强制桌面端样式
  useDismiss={false} // 禁用点击空白处关闭
  openAnimation      // 启用动画
  zIndex={999}       // 自定义层级
  contentStyle={{    // 自定义容器样式
    backgroundColor: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  }}
>
  {/* 弹窗内容 */}
</Modal>`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default ModalDemo