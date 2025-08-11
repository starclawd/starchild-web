import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import BottomSheet from './index'

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
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .demo-info {
    flex: 1;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.textL1};
      margin-bottom: 5px;
    }

    .description {
      color: ${({ theme }) => theme.textL3};
      font-size: 14px;
    }
  }
`

const Button = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.textDark98};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand100};
  }

  &:active {
    transform: translateY(1px);
  }
`

const PositionButton = styled(Button)`
  margin-bottom: 10px;
`

const SheetContent = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL0};

  h4 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 10px;
    line-height: 1.5;
  }

  .action-buttons {
    display: flex;
    gap: 10px;
    margin-top: 20px;
  }
`

const SheetButton = styled(Button)`
  background: ${({ theme }) => theme.textL3};
  color: ${({ theme }) => theme.textDark98};

  &:hover {
    background: ${({ theme }) => theme.textL2};
  }
`

const SheetPrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.brand100};

  &:hover {
    background: ${({ theme }) => theme.brand100};
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

const BottomSheetDemo = () => {
  const [basicSheetOpen, setBasicSheetOpen] = useState(false)
  const [noDragSheetOpen, setNoDragSheetOpen] = useState(false)
  const [positionSheetOpen, setPositionSheetOpen] = useState(false)
  const [customContentOpen, setCustomContentOpen] = useState(false)

  const positionRef = useRef<HTMLButtonElement>(null)

  return (
    <DemoContainer>
      <DemoSection>
        <h2>BottomSheet 底部弹层组件示例</h2>
        <p>
          底部弹层组件是一个从屏幕底部滑出的模态层，支持触摸拖拽关闭、点击遮罩关闭等交互方式。
          常用于移动端的操作选择、信息展示等场景。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基本用法</h3>
        <p>最基本的底部弹层，从底部滑出，支持拖拽句柄和点击遮罩关闭</p>

        <DemoRow>
          <Button onClick={() => setBasicSheetOpen(true)}>打开基本弹层</Button>
          <div className='demo-info'>
            <div className='label'>基本底部弹层</div>
            <div className='description'>包含拖拽句柄，支持向下拖拽关闭</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const [isOpen, setIsOpen] = useState(false)

<Button onClick={() => setIsOpen(true)}>
  打开弹层
</Button>

<BottomSheet 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  <div style={{ padding: '20px' }}>
    <h4>弹层内容</h4>
    <p>这里是弹层的内容区域</p>
  </div>
</BottomSheet>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>隐藏拖拽句柄</h3>
        <p>通过 hideDragHandle 属性可以隐藏顶部的拖拽句柄</p>

        <DemoRow>
          <Button onClick={() => setNoDragSheetOpen(true)}>无拖拽句柄弹层</Button>
          <div className='demo-info'>
            <div className='label'>隐藏拖拽句柄</div>
            <div className='description'>不显示顶部拖拽条，只能通过点击遮罩关闭</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<BottomSheet 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  hideDragHandle={true}
>
  <div style={{ padding: '20px' }}>
    <h4>无拖拽句柄的弹层</h4>
    <p>这个弹层没有顶部的拖拽句柄</p>
  </div>
</BottomSheet>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>相对定位弹层</h3>
        <p>通过 positionRef 和 showFromBottom={false} 可以让弹层相对于特定元素显示</p>

        <DemoRow>
          <PositionButton ref={positionRef} onClick={() => setPositionSheetOpen(true)}>
            相对定位弹层
          </PositionButton>
          <div className='demo-info'>
            <div className='label'>相对定位</div>
            <div className='description'>弹层会基于按钮位置显示，而不是从底部</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const positionRef = useRef<HTMLButtonElement>(null)

<button 
  ref={positionRef} 
  onClick={() => setIsOpen(true)}
>
  触发按钮
</button>

<BottomSheet 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  positionRef={positionRef}
  showFromBottom={false}
>
  <div style={{ padding: '20px' }}>
    <p>相对于按钮位置显示的弹层</p>
  </div>
</BottomSheet>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义内容弹层</h3>
        <p>可以在弹层中放置任何自定义内容，如表单、列表、操作按钮等</p>

        <DemoRow>
          <Button onClick={() => setCustomContentOpen(true)}>自定义内容弹层</Button>
          <div className='demo-info'>
            <div className='label'>丰富内容</div>
            <div className='description'>包含标题、描述文本和操作按钮的完整弹层</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<BottomSheet 
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
>
  <SheetContent>
    <h4>确认操作</h4>
    <p>您确定要执行此操作吗？此操作不可撤销。</p>
    <p>请仔细确认后再进行操作。</p>
    <div className="action-buttons">
      <SheetButton onClick={() => setIsOpen(false)}>
        取消
      </SheetButton>
      <SheetPrimaryButton onClick={() => {
        alert('操作已确认')
        setIsOpen(false)
      }}>
        确认
      </SheetPrimaryButton>
    </div>
  </SheetContent>
</BottomSheet>`}
        </CodeBlock>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>BottomSheet 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>isOpen</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>是否显示弹层</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onClose</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>关闭弹层的回调函数</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>children</PropsTableCell>
            <PropsTableCell type='type'>ReactNode</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>弹层内容</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>positionRef</PropsTableCell>
            <PropsTableCell type='type'>RefObject</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>定位参考元素的 ref</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>showFromBottom</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>true</PropsTableCell>
            <PropsTableCell type='desc'>是否从底部显示</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>rootStyle</PropsTableCell>
            <PropsTableCell type='type'>CSSProperties</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>弹层容器的自定义样式</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>hideDragHandle</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否隐藏拖拽句柄</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`interface BottomSheetProps {
  isOpen: boolean;                          // 必填：是否显示弹层
  onClose: () => void;                      // 必填：关闭回调函数
  children: ReactNode;                      // 必填：弹层内容
  positionRef?: RefObject<HTMLElement>;     // 可选：定位参考元素
  showFromBottom?: boolean;                 // 可选：是否从底部显示
  rootStyle?: React.CSSProperties;          // 可选：自定义样式
  hideDragHandle?: boolean;                 // 可选：是否隐藏拖拽句柄
}`}
          </CodeBlock>
        </div>
      </div>

      {/* 实际的弹层组件 */}
      <BottomSheet isOpen={basicSheetOpen} onClose={() => setBasicSheetOpen(false)}>
        <SheetContent>
          <h4>基本弹层</h4>
          <p>这是一个基本的底部弹层示例。</p>
          <p>您可以向下拖拽顶部的句柄来关闭弹层，或者点击遮罩区域关闭。</p>
          <div className='action-buttons'>
            <SheetButton onClick={() => setBasicSheetOpen(false)}>关闭</SheetButton>
          </div>
        </SheetContent>
      </BottomSheet>

      <BottomSheet isOpen={noDragSheetOpen} onClose={() => setNoDragSheetOpen(false)} hideDragHandle={true}>
        <SheetContent>
          <h4>无拖拽句柄弹层</h4>
          <p>这个弹层没有顶部的拖拽句柄。</p>
          <p>只能通过点击遮罩区域或下方的关闭按钮来关闭。</p>
          <div className='action-buttons'>
            <SheetButton onClick={() => setNoDragSheetOpen(false)}>关闭</SheetButton>
          </div>
        </SheetContent>
      </BottomSheet>

      <BottomSheet isOpen={positionSheetOpen} onClose={() => setPositionSheetOpen(false)} positionRef={positionRef}>
        <SheetContent>
          <h4>相对定位弹层</h4>
          <p>这个弹层基于按钮位置显示，而不是从屏幕底部滑出。</p>
          <div className='action-buttons'>
            <SheetButton onClick={() => setPositionSheetOpen(false)}>关闭</SheetButton>
          </div>
        </SheetContent>
      </BottomSheet>

      <BottomSheet isOpen={customContentOpen} onClose={() => setCustomContentOpen(false)}>
        <SheetContent>
          <h4>确认操作</h4>
          <p>您确定要执行此操作吗？此操作不可撤销。</p>
          <p>请仔细确认后再进行操作。</p>
          <div className='action-buttons'>
            <SheetButton onClick={() => setCustomContentOpen(false)}>取消</SheetButton>
            <SheetPrimaryButton
              onClick={() => {
                alert('操作已确认')
                setCustomContentOpen(false)
              }}
            >
              确认
            </SheetPrimaryButton>
          </div>
        </SheetContent>
      </BottomSheet>
    </DemoContainer>
  )
}

export default BottomSheetDemo
