import React, { useState } from 'react'
import styled from 'styled-components'
import Input, { InputType } from './index'

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

  .input-container {
    min-width: 300px;
    max-width: 400px;
  }

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

    .value {
      color: ${({ theme }) => theme.textL2};
      font-size: 12px;
      margin-top: 4px;
      font-family: monospace;
    }
  }
`

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
`

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  .input-label {
    font-size: 14px;
    color: ${({ theme }) => theme.textL2};
    font-weight: 500;
  }

  .input-value {
    font-size: 12px;
    color: ${({ theme }) => theme.textL3};
    font-family: monospace;
    margin-top: 4px;
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
  padding: 6px 12px;
  background: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.textDark98};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand100};
  }

  &:disabled {
    background: ${({ theme }) => theme.textL4};
    cursor: not-allowed;
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

const InputDemo = () => {
  const [textValue, setTextValue] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [emailValue, setEmailValue] = useState('')
  const [numberValue, setNumberValue] = useState('')
  const [passwordValue, setPasswordValue] = useState('')
  const [disabledValue, setDisabledValue] = useState('禁用状态输入框')
  const [errorInput, setErrorInput] = useState('')
  const [showError, setShowError] = useState(false)
  const [autoFocusInput, setAutoFocusInput] = useState('')

  const handleSearchReset = () => {
    setSearchValue('')
  }

  const handleErrorTest = () => {
    setShowError(true)
    setTimeout(() => setShowError(false), 3000)
  }

  const handleClearError = () => {
    setShowError(false)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Input 输入框组件示例</h2>
        <p>
          输入框组件提供了丰富的输入功能，支持文本输入、搜索、邮箱、数字等多种类型。
          包含错误处理、自动聚焦、移动端优化等特性。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最基本的文本输入框</p>

        <DemoRow>
          <div className='input-container'>
            <Input
              placeholder='请输入文本'
              inputValue={textValue}
              onChange={(e: any) => setTextValue(e.target.value)}
            />
          </div>
          <div className='demo-info'>
            <div className='label'>基础文本输入</div>
            <div className='description'>普通的文本输入框</div>
            <div className='value'>值: {textValue || '(空)'}</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`const [value, setValue] = useState('')

<Input
  placeholder="请输入文本"
  inputValue={value}
  onChange={(e) => setValue(e.target.value)}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>搜索输入框</h3>
        <p>带搜索图标和清除功能的输入框</p>

        <DemoRow>
          <div className='input-container'>
            <Input
              inputType={InputType.SEARCH}
              placeholder='搜索内容'
              inputValue={searchValue}
              onChange={(e: any) => setSearchValue(e.target.value)}
              onResetValue={handleSearchReset}
            />
          </div>
          <div className='demo-info'>
            <div className='label'>搜索输入框</div>
            <div className='description'>带搜索图标和清除按钮</div>
            <div className='value'>值: {searchValue || '(空)'}</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Input
  inputType={InputType.SEARCH}
  placeholder="搜索内容"
  inputValue={searchValue}
  onChange={(e) => setSearchValue(e.target.value)}
  onResetValue={() => setSearchValue('')}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>不同输入类型</h3>
        <p>支持多种 HTML 输入类型和输入模式</p>

        <InputGrid>
          <InputRow>
            <div className='input-label'>邮箱输入</div>
            <Input
              type='email'
              inputMode='email'
              placeholder='请输入邮箱'
              inputValue={emailValue}
              onChange={(e: any) => setEmailValue(e.target.value)}
            />
            <div className='input-value'>值: {emailValue || '(空)'}</div>
          </InputRow>

          <InputRow>
            <div className='input-label'>数字输入</div>
            <Input
              type='number'
              inputMode='numeric'
              placeholder='请输入数字'
              inputValue={numberValue}
              onChange={(e: any) => setNumberValue(e.target.value)}
            />
            <div className='input-value'>值: {numberValue || '(空)'}</div>
          </InputRow>

          <InputRow>
            <div className='input-label'>密码输入</div>
            <Input
              type='password'
              placeholder='请输入密码'
              inputValue={passwordValue}
              onChange={(e: any) => setPasswordValue(e.target.value)}
            />
            <div className='input-value'>长度: {passwordValue.length}</div>
          </InputRow>

          <InputRow>
            <div className='input-label'>禁用状态</div>
            <Input placeholder='禁用的输入框' inputValue={disabledValue} disabled />
            <div className='input-value'>状态: 禁用</div>
          </InputRow>
        </InputGrid>

        <CodeBlock>
          {`// 邮箱输入
<Input
  type="email"
  inputMode="email"
  placeholder="请输入邮箱"
  inputValue={emailValue}
  onChange={(e) => setEmailValue(e.target.value)}
/>

// 数字输入
<Input
  type="number"
  inputMode="numeric"
  placeholder="请输入数字"
  inputValue={numberValue}
  onChange={(e) => setNumberValue(e.target.value)}
/>

// 密码输入
<Input
  type="password"
  placeholder="请输入密码"
  inputValue={passwordValue}
  onChange={(e) => setPasswordValue(e.target.value)}
/>

// 禁用状态
<Input
  placeholder="禁用的输入框"
  inputValue={disabledValue}
  disabled
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>错误处理</h3>
        <p>输入框的错误状态处理和自动聚焦</p>

        <DemoRow>
          <div className='input-container'>
            <Input
              placeholder='测试错误状态'
              inputValue={errorInput}
              showError={showError}
              onChange={(e: any) => setErrorInput(e.target.value)}
              clearError={handleClearError}
            />
          </div>
          <div className='demo-info'>
            <div className='label'>错误状态输入框</div>
            <div className='description'>测试错误状态和自动聚焦</div>
            <div className='value'>错误状态: {showError ? '是' : '否'}</div>
          </div>
        </DemoRow>

        <ControlPanel>
          <ControlButton onClick={handleErrorTest}>触发错误状态</ControlButton>
          <ControlButton onClick={handleClearError}>清除错误状态</ControlButton>
        </ControlPanel>

        <CodeBlock>
          {`const [showError, setShowError] = useState(false)

<Input
  placeholder="测试错误状态"
  inputValue={errorInput}
  showError={showError}
  onChange={(e) => setErrorInput(e.target.value)}
  clearError={() => setShowError(false)}
/>

// 触发错误状态时会自动聚焦到输入框`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自动聚焦</h3>
        <p>支持页面加载时自动聚焦到输入框</p>

        <DemoRow>
          <div className='input-container'>
            <Input
              placeholder='自动聚焦输入框'
              inputValue={autoFocusInput}
              autoFocus
              onChange={(e: any) => setAutoFocusInput(e.target.value)}
            />
          </div>
          <div className='demo-info'>
            <div className='label'>自动聚焦</div>
            <div className='description'>页面加载时自动获得焦点</div>
            <div className='value'>值: {autoFocusInput || '(空)'}</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Input
  placeholder="自动聚焦输入框"
  inputValue={autoFocusInput}
  autoFocus
  onChange={(e) => setAutoFocusInput(e.target.value)}
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>事件处理</h3>
        <p>完整的事件处理示例</p>

        <StatusDisplay>
          <div className='status-item'>
            <span className='label'>文本输入值:</span>
            <span className='value'>{textValue || '(空)'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>搜索输入值:</span>
            <span className='value'>{searchValue || '(空)'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>邮箱输入值:</span>
            <span className='value'>{emailValue || '(空)'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>数字输入值:</span>
            <span className='value'>{numberValue || '(空)'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>错误状态:</span>
            <span className='value'>{showError ? '激活' : '正常'}</span>
          </div>
        </StatusDisplay>

        <CodeBlock>
          {`const handleFocus = (e) => {
  console.log('输入框获得焦点', e.target.value)
}

const handleBlur = (e) => {
  console.log('输入框失去焦点', e.target.value)
}

const handleKeyUp = (e) => {
  if (e.key === 'Enter') {
    console.log('按下回车键', e.target.value)
  }
}

<Input
  placeholder="事件处理示例"
  inputValue={value}
  onChange={(e) => setValue(e.target.value)}
  onFocus={handleFocus}
  onBlur={handleBlur}
  onKeyUp={handleKeyUp}
/>`}
        </CodeBlock>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>Input 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>type</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>"text"</PropsTableCell>
            <PropsTableCell type='desc'>HTML input 类型</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>inputType</PropsTableCell>
            <PropsTableCell type='type'>InputType</PropsTableCell>
            <PropsTableCell type='default'>TEXT</PropsTableCell>
            <PropsTableCell type='desc'>输入框类型（TEXT | SEARCH）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>placeholder</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>占位文本</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>inputValue</PropsTableCell>
            <PropsTableCell type='type'>string | number</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>输入框的值</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>disabled</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否禁用</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>showError</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否显示错误状态</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>autoFocus</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否自动聚焦</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>scrollIntoView</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>移动端聚焦时是否滚动到视图</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>inputMode</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>"decimal"</PropsTableCell>
            <PropsTableCell type='desc'>移动端键盘类型</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onChange</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>值改变时的回调</PropsTableCell>
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

          <PropsTableRow>
            <PropsTableCell type='prop'>onKeyUp</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>键盘抬起时的回调</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onResetValue</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>搜索框清除值的回调</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>clearError</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>清除错误状态的回调</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>inputStyle</PropsTableCell>
            <PropsTableCell type='type'>CSSProperties</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>输入框自定义样式</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>rootStyle</PropsTableCell>
            <PropsTableCell type='type'>CSSProperties</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>根容器自定义样式</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>inputClass</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>输入框自定义类名</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>InputType 枚举</h3>
          <CodeBlock>
            {`enum InputType {
  SEARCH = 'SEARCH',  // 搜索输入框
  TEXT = 'TEXT'       // 普通文本输入框
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`interface InputProps {
  type?: string;                              // 可选：HTML input 类型
  inputType?: InputType;                      // 可选：输入框类型
  placeholder?: string;                       // 可选：占位文本
  inputValue?: string | number;               // 可选：输入值
  disabled?: boolean;                         // 可选：是否禁用
  showError?: boolean;                        // 可选：是否显示错误
  autoFocus?: boolean;                        // 可选：是否自动聚焦
  scrollIntoView?: boolean;                   // 可选：是否滚动到视图
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;     // 可选：值改变回调
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;       // 可选：聚焦回调
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;        // 可选：失焦回调
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;    // 可选：键盘抬起回调
  onResetValue?: () => void;                  // 可选：重置值回调
  clearError?: () => void;                    // 可选：清除错误回调
  inputStyle?: React.CSSProperties;           // 可选：输入框样式
  rootStyle?: React.CSSProperties;            // 可选：根容器样式
  inputClass?: string;                        // 可选：输入框类名
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>移动端优化</strong>：支持不同的 inputMode，优化移动端键盘体验
              </li>
              <li>
                <strong>搜索功能</strong>：SEARCH 类型提供搜索图标和清除按钮
              </li>
              <li>
                <strong>错误处理</strong>：showError 状态下自动聚焦，便于用户修正
              </li>
              <li>
                <strong>自动聚焦</strong>：支持页面加载时自动聚焦到输入框
              </li>
              <li>
                <strong>滚动视图</strong>：移动端聚焦时可选择滚动到视图中心
              </li>
              <li>
                <strong>主题适配</strong>：自动适配暗色和亮色主题
              </li>
              <li>
                <strong>完整事件</strong>：支持 focus、blur、change、keyup 等完整事件
              </li>
              <li>
                <strong>灵活定制</strong>：支持自定义样式和类名
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default InputDemo
