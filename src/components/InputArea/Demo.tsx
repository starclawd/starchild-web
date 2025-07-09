import React, { useState, useRef } from 'react'
import styled from 'styled-components'
import InputArea from './index'

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
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .textarea-container {
    width: 100%;
    min-height: 100px;
    padding: 15px;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.lineDark8};
    border-radius: 8px;
    position: relative;
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

const ControlPanel = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
`

const ControlButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.brand6};
  color: ${({ theme }) => theme.textDark98};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand6};
  }

  &:disabled {
    background: ${({ theme }) => theme.textL4};
    cursor: not-allowed;
  }
`

const SecondaryButton = styled(ControlButton)`
  background: ${({ theme }) => theme.textL3};

  &:hover {
    background: ${({ theme }) => theme.textL2};
  }
`

const DangerButton = styled(ControlButton)`
  background: #ff4d4f;

  &:hover {
    background: #ff7875;
  }
`

const LimitIndicator = styled.div<{ isNearLimit: boolean; isOverLimit: boolean }>`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 12px;
  font-family: monospace;
  color: ${({ theme, isNearLimit, isOverLimit }) => {
    if (isOverLimit) return '#ff4d4f'
    if (isNearLimit) return '#faad14'
    return theme.textL4
  }};
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
        return theme.brand6
      case 'default':
        return theme.textL3
      default:
        return theme.textL2
    }
  }};
`

const InputAreaDemo = () => {
  const [basicValue, setBasicValue] = useState('')
  const [limitedValue, setLimitedValue] = useState('')
  const [autoHeightValue, setAutoHeightValue] = useState('')
  const [disabledValue, setDisabledValue] = useState('这是一个禁用的多行输入框\n您无法编辑此内容')
  const [focusValue, setFocusValue] = useState('')
  const [enterValue, setEnterValue] = useState('')
  const [pasteValue, setPasteValue] = useState('')

  const [enterPressCount, setEnterPressCount] = useState(0)
  const [focusCount, setFocusCount] = useState(0)
  const [blurCount, setBlurCount] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleEnterConfirm = () => {
    setEnterPressCount((prev) => prev + 1)
    console.log('Enter 键被按下，内容:', enterValue)
  }

  const handleFocus = () => {
    setFocusCount((prev) => prev + 1)
  }

  const handleBlur = () => {
    setBlurCount((prev) => prev + 1)
  }

  const fillSampleText = () => {
    setAutoHeightValue(`这是一个自动调整高度的多行输入框示例。

当您输入更多内容时，输入框会自动增加高度以适应内容。

支持的功能包括：
1. 自动高度调整
2. 字符数限制
3. 粘贴内容验证
4. Enter 键确认
5. 焦点状态管理

您可以继续输入更多内容来测试高度调整功能...`)
  }

  const clearAllContent = () => {
    setBasicValue('')
    setLimitedValue('')
    setAutoHeightValue('')
    setFocusValue('')
    setEnterValue('')
    setPasteValue('')
  }

  const addLongText = () => {
    const longText = '这是一段很长的文本内容，用于测试字符数限制功能。'.repeat(10)
    setLimitedValue((prev) => prev + longText)
  }

  const isNearLimit = limitedValue.length > 80 // 接近限制
  const isOverLimit = limitedValue.length >= 100 // 超过限制

  return (
    <DemoContainer>
      <DemoSection>
        <h2>InputArea 多行输入框组件示例</h2>
        <p>
          多行输入框组件提供了丰富的文本输入功能，支持自动高度调整、字符数限制、
          Enter键确认、粘贴验证等特性。专为长文本输入和内容编辑场景设计。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最基本的多行输入框，支持自由输入和编辑</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea value={basicValue} setValue={setBasicValue} placeholder='请输入您的内容...' />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>基础多行输入</div>
              <div className='description'>支持多行文本输入和自动换行</div>
            </div>
            <div className='stats'>
              <span>字符数: {basicValue.length}</span>
              <span>行数: {basicValue.split('\n').length}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const [value, setValue] = useState('')

<InputArea
  value={value}
  setValue={setValue}
  placeholder="请输入您的内容..."
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>字符数限制</h3>
        <p>设置字符数限制，超过限制时无法继续输入</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea
              value={limitedValue}
              setValue={setLimitedValue}
              valueLimit={100}
              placeholder='最多可输入100个字符...'
            />
            <LimitIndicator isNearLimit={isNearLimit} isOverLimit={isOverLimit}>
              {limitedValue.length}/100
            </LimitIndicator>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>字符数限制</div>
              <div className='description'>超过100字符时无法继续输入</div>
            </div>
            <div className='stats'>
              <span>剩余: {100 - limitedValue.length}</span>
              <span>状态: {isOverLimit ? '已达限制' : isNearLimit ? '接近限制' : '正常'}</span>
            </div>
          </div>
        </DemoRow>

        <ControlPanel>
          <SecondaryButton onClick={addLongText}>添加长文本测试</SecondaryButton>
          <DangerButton onClick={() => setLimitedValue('')}>清空内容</DangerButton>
        </ControlPanel>

        <CodeBlock>
          {`<InputArea
  value={limitedValue}
  setValue={setLimitedValue}
  valueLimit={100}
  placeholder="最多可输入100个字符..."
/>

// 字符数限制会阻止超长输入和粘贴`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自动高度调整</h3>
        <p>根据内容自动调整高度，最大高度为240px，超出时显示滚动条</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea
              value={autoHeightValue}
              setValue={setAutoHeightValue}
              placeholder='输入内容查看自动高度调整...'
            />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>自动高度调整</div>
              <div className='description'>根据内容动态调整高度，最大240px</div>
            </div>
            <div className='stats'>
              <span>字符数: {autoHeightValue.length}</span>
              <span>行数: {autoHeightValue.split('\n').length}</span>
            </div>
          </div>
        </DemoRow>

        <ControlPanel>
          <ControlButton onClick={fillSampleText}>填充示例文本</ControlButton>
          <SecondaryButton onClick={() => setAutoHeightValue('')}>清空内容</SecondaryButton>
        </ControlPanel>

        <CodeBlock>
          {`<InputArea
  value={autoHeightValue}
  setValue={setAutoHeightValue}
  placeholder="输入内容查看自动高度调整..."
/>

// 组件会自动根据内容调整高度
// 最大高度为240px，超出时显示滚动条`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>禁用状态</h3>
        <p>禁用状态的多行输入框，用于显示不可编辑的内容</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea
              value={disabledValue}
              setValue={() => {}} // 禁用时不需要处理变化
              disabled
              placeholder='禁用状态'
            />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>禁用状态</div>
              <div className='description'>无法编辑，用于展示只读内容</div>
            </div>
            <div className='stats'>
              <span>状态: 禁用</span>
              <span>字符数: {disabledValue.length}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<InputArea
  value={disabledValue}
  setValue={() => {}} // 禁用时可以传空函数
  disabled
  placeholder="禁用状态"
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>Enter 键确认</h3>
        <p>在桌面端，按 Enter 键可触发确认回调（移动端不启用此功能）</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea
              value={enterValue}
              setValue={setEnterValue}
              placeholder='在桌面端按 Enter 键测试确认功能...'
              enterConfirmCallback={handleEnterConfirm}
            />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>Enter 键确认</div>
              <div className='description'>桌面端按 Enter 键触发确认（Shift+Enter 换行）</div>
            </div>
            <div className='stats'>
              <span>Enter 按下次数: {enterPressCount}</span>
              <span>字符数: {enterValue.length}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const handleEnterConfirm = () => {
  console.log('Enter 键被按下，内容:', enterValue)
  // 在这里处理确认逻辑，比如发送消息、提交表单等
}

<InputArea
  value={enterValue}
  setValue={setEnterValue}
  placeholder="按 Enter 键测试确认功能..."
  enterConfirmCallback={handleEnterConfirm}
/>

// 桌面端：Enter 确认，Shift+Enter 换行
// 移动端：Enter 正常换行`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>焦点事件处理</h3>
        <p>支持焦点获得和失去的事件处理</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea
              value={focusValue}
              setValue={setFocusValue}
              placeholder='点击获得焦点，点击外部失去焦点...'
              onFocus={handleFocus}
              onBlur={handleBlur}
              autoFocus
            />
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>焦点事件处理</div>
              <div className='description'>支持自动聚焦和焦点事件回调</div>
            </div>
            <div className='stats'>
              <span>获得焦点次数: {focusCount}</span>
              <span>失去焦点次数: {blurCount}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const handleFocus = () => {
  console.log('输入框获得焦点')
}

const handleBlur = () => {
  console.log('输入框失去焦点')
}

<InputArea
  value={focusValue}
  setValue={setFocusValue}
  placeholder="焦点事件测试..."
  onFocus={handleFocus}
  onBlur={handleBlur}
  autoFocus // 自动聚焦
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>粘贴验证</h3>
        <p>支持粘贴内容的长度验证，超过限制时阻止粘贴</p>

        <DemoRow>
          <div className='textarea-container'>
            <InputArea
              value={pasteValue}
              setValue={setPasteValue}
              valueLimit={50}
              placeholder='尝试粘贴超过50字符的内容...'
            />
            <LimitIndicator isNearLimit={pasteValue.length > 40} isOverLimit={pasteValue.length >= 50}>
              {pasteValue.length}/50
            </LimitIndicator>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>粘贴验证</div>
              <div className='description'>粘贴内容超过限制时会被阻止</div>
            </div>
            <div className='stats'>
              <span>剩余: {50 - pasteValue.length}</span>
              <span>字符数: {pasteValue.length}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<InputArea
  value={pasteValue}
  setValue={setPasteValue}
  valueLimit={50}
  placeholder="尝试粘贴超过50字符的内容..."
/>

// 组件会自动验证粘贴内容的长度
// 如果粘贴后总长度超过限制，会阻止粘贴操作`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>状态总览</h3>
        <p>所有输入框的实时状态信息</p>

        <StatusDisplay>
          <div className='status-item'>
            <span className='label'>基础输入框字符数:</span>
            <span className='value'>{basicValue.length}</span>
          </div>
          <div className='status-item'>
            <span className='label'>限制输入框字符数:</span>
            <span className='value'>{limitedValue.length}/100</span>
          </div>
          <div className='status-item'>
            <span className='label'>自动高度输入框行数:</span>
            <span className='value'>{autoHeightValue.split('\n').length}</span>
          </div>
          <div className='status-item'>
            <span className='label'>Enter 确认次数:</span>
            <span className='value'>{enterPressCount}</span>
          </div>
          <div className='status-item'>
            <span className='label'>焦点事件次数:</span>
            <span className='value'>
              获得 {focusCount} / 失去 {blurCount}
            </span>
          </div>
          <div className='status-item'>
            <span className='label'>粘贴验证输入框:</span>
            <span className='value'>{pasteValue.length}/50</span>
          </div>
        </StatusDisplay>

        <ControlPanel>
          <DangerButton onClick={clearAllContent}>清空所有内容</DangerButton>
          <ControlButton onClick={fillSampleText}>填充示例内容</ControlButton>
        </ControlPanel>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>InputArea 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>value</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>输入框的值（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>setValue</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>设置值的回调函数（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>id</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>输入框的 HTML id 属性</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>rows</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>1</PropsTableCell>
            <PropsTableCell type='desc'>初始行数</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>valueLimit</PropsTableCell>
            <PropsTableCell type='type'>number</PropsTableCell>
            <PropsTableCell type='default'>3000</PropsTableCell>
            <PropsTableCell type='desc'>字符数限制</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>disabled</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否禁用</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>placeholder</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>占位文本</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>autoFocus</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否自动聚焦</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>disabledUpdateHeight</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否禁用自动高度调整</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>ref</PropsTableCell>
            <PropsTableCell type='type'>RefObject</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>textarea 元素的引用</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>enterConfirmCallback</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>Enter 键确认回调（桌面端）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onFocus</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>获得焦点时的回调</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onBlur</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>失去焦点时的回调</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`interface InputAreaProps {
  // 必填属性
  value: string;                              // 输入框的值
  setValue: (value: string) => void;          // 设置值的回调函数
  
  // 可选属性
  id?: string;                                // HTML id 属性
  rows?: number;                              // 初始行数，默认1
  valueLimit?: number;                        // 字符数限制，默认3000
  disabled?: boolean;                         // 是否禁用，默认false
  placeholder?: string;                       // 占位文本
  autoFocus?: boolean;                        // 是否自动聚焦，默认false
  disabledUpdateHeight?: boolean;             // 是否禁用自动高度调整，默认false
  ref?: React.RefObject<HTMLTextAreaElement>; // textarea 元素引用
  
  // 事件回调
  enterConfirmCallback?: () => void;          // Enter 键确认回调（桌面端）
  onFocus?: () => void;                       // 获得焦点回调
  onBlur?: () => void;                        // 失去焦点回调
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>自动高度调整</strong>：根据内容动态调整高度，最大240px
              </li>
              <li>
                <strong>字符数限制</strong>：支持输入和粘贴的字符数限制
              </li>
              <li>
                <strong>Enter 键处理</strong>：桌面端 Enter 确认，Shift+Enter 换行
              </li>
              <li>
                <strong>移动端优化</strong>：移动端 Enter 键正常换行，无确认功能
              </li>
              <li>
                <strong>粘贴验证</strong>：自动验证粘贴内容长度，超限时阻止
              </li>
              <li>
                <strong>响应式设计</strong>：窗口大小变化时自动调整
              </li>
              <li>
                <strong>滚动条样式</strong>：内容超出时显示自定义样式滚动条
              </li>
              <li>
                <strong>主题适配</strong>：完美适配暗色和亮色主题
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default InputAreaDemo
