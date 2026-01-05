import React, { useState } from 'react'
import styled from 'styled-components'
import Select, { TriggerMethod, DataType } from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.black0};
  min-height: 100vh;

  h2 {
    color: ${({ theme }) => theme.black0};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.black100};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.black200};
    margin-bottom: 15px;
    line-height: 1.6;
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;

  h2 {
    color: ${({ theme }) => theme.black0};
    margin-bottom: 20px;
    font-size: 24px;
  }

  h3 {
    color: ${({ theme }) => theme.black100};
    margin-bottom: 15px;
    font-size: 18px;
  }

  p {
    color: ${({ theme }) => theme.black200};
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
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .demo-area {
    min-height: 120px;
    padding: 30px;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.black800};
    border-radius: 8px;
    display: flex;
    gap: 20px;
    align-items: flex-start;
    flex-wrap: wrap;

    /* 移动端适配 */
    @media (max-width: 768px) {
      padding: 20px;
      gap: 15px;

      /* Grid 布局在移动端改为单列 */
      & > div[style*='grid'] {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
      }
    }
  }

  .demo-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.black0};
    }

    .description {
      color: ${({ theme }) => theme.black200};
      font-size: 14px;
    }

    /* 移动端适配 */
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 5px;
    }
  }
`

const SelectButton = styled.div<{ $isSelected?: boolean }>`
  color: ${({ theme }) => theme.black0};
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  /* 选中状态样式 */
  ${({ $isSelected, theme }) =>
    $isSelected &&
    `
    border-color: ${theme.brand100};
    background: ${theme.bgL2};
  `}

  .select-text {
    flex: 1;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon-chat-expand {
    margin-left: 8px;
    font-size: 14px;
    color: ${({ theme }) => theme.black100};
    transition:
      transform 0.2s ease,
      color 0.2s ease;
  }

  /* 当 Select 组件展开时的样式 */
  .select-wrapper.show & {
    border-color: ${({ theme }) => theme.brand100};

    .icon-chat-expand {
      transform: rotate(180deg);
      color: ${({ theme }) => theme.brand100};
    }
  }
`

const PropsTable = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
`

const PropsHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  margin-bottom: 15px;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const PropsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

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

const SelectDemo = () => {
  const [selectedValue1, setSelectedValue1] = useState('option1')
  const [selectedValue2, setSelectedValue2] = useState('apple')
  const [selectedValue3, setSelectedValue3] = useState('china')
  const [selectedValue4, setSelectedValue4] = useState('red')
  const [selectedValue5, setSelectedValue5] = useState('small')
  const [selectedValueWidth1, setSelectedValueWidth1] = useState('small')
  const [selectedValueWidth2, setSelectedValueWidth2] = useState('small')
  const [selectedValueWidth3, setSelectedValueWidth3] = useState('small')

  // 基础选项数据
  const basicOptions: DataType[] = [
    { text: '选项一', value: 'option1', clickCallback: (value) => setSelectedValue1(value) },
    { text: '选项二', value: 'option2', clickCallback: (value) => setSelectedValue1(value) },
    { text: '选项三', value: 'option3', clickCallback: (value) => setSelectedValue1(value) },
    { text: '选项四', value: 'option4', clickCallback: (value) => setSelectedValue1(value) },
  ]

  // 水果选项数据（带搜索）
  const fruitOptions: DataType[] = [
    { text: '🍎 苹果', value: 'apple', searchKey: 'apple 苹果', clickCallback: (value) => setSelectedValue2(value) },
    { text: '🍌 香蕉', value: 'banana', searchKey: 'banana 香蕉', clickCallback: (value) => setSelectedValue2(value) },
    { text: '🍊 橙子', value: 'orange', searchKey: 'orange 橙子', clickCallback: (value) => setSelectedValue2(value) },
    { text: '🍇 葡萄', value: 'grape', searchKey: 'grape 葡萄', clickCallback: (value) => setSelectedValue2(value) },
    { text: '🥝 猕猴桃', value: 'kiwi', searchKey: 'kiwi 猕猴桃', clickCallback: (value) => setSelectedValue2(value) },
    {
      text: '🍓 草莓',
      value: 'strawberry',
      searchKey: 'strawberry 草莓',
      clickCallback: (value) => setSelectedValue2(value),
    },
  ]

  // 国家选项数据
  const countryOptions: DataType[] = [
    { text: '🇨🇳 中国', value: 'china', clickCallback: (value) => setSelectedValue3(value) },
    { text: '🇺🇸 美国', value: 'usa', clickCallback: (value) => setSelectedValue3(value) },
    { text: '🇯🇵 日本', value: 'japan', clickCallback: (value) => setSelectedValue3(value) },
    { text: '🇬🇧 英国', value: 'uk', clickCallback: (value) => setSelectedValue3(value) },
    { text: '🇩🇪 德国', value: 'germany', clickCallback: (value) => setSelectedValue3(value) },
  ]

  // 颜色选项数据（自定义样式）
  const colorOptions: DataType[] = [
    { text: '红色', value: 'red', clickCallback: (value) => setSelectedValue4(value) },
    { text: '蓝色', value: 'blue', clickCallback: (value) => setSelectedValue4(value) },
    { text: '绿色', value: 'green', clickCallback: (value) => setSelectedValue4(value) },
    { text: '黄色', value: 'yellow', clickCallback: (value) => setSelectedValue4(value) },
    { text: '紫色', value: 'purple', clickCallback: (value) => setSelectedValue4(value) },
  ]

  // 尺寸选项数据（宽度对齐演示）
  const sizeOptions: DataType[] = [
    { text: '小号', value: 'small', clickCallback: (value) => setSelectedValue5(value) },
    { text: '中号', value: 'medium', clickCallback: (value) => setSelectedValue5(value) },
    { text: '大号', value: 'large', clickCallback: (value) => setSelectedValue5(value) },
    { text: '超大号', value: 'xlarge', clickCallback: (value) => setSelectedValue5(value) },
  ]

  // 宽度演示选项数据（独立状态）
  const widthOptions1: DataType[] = [
    { text: '小号', value: 'small', clickCallback: (value) => setSelectedValueWidth1(value) },
    { text: '中号', value: 'medium', clickCallback: (value) => setSelectedValueWidth1(value) },
    { text: '大号', value: 'large', clickCallback: (value) => setSelectedValueWidth1(value) },
  ]

  const widthOptions2: DataType[] = [
    { text: '小号选项', value: 'small', clickCallback: (value) => setSelectedValueWidth2(value) },
    { text: '中号选项', value: 'medium', clickCallback: (value) => setSelectedValueWidth2(value) },
    { text: '大号选项', value: 'large', clickCallback: (value) => setSelectedValueWidth2(value) },
  ]

  const widthOptions3: DataType[] = [
    { text: '小号产品规格', value: 'small', clickCallback: (value) => setSelectedValueWidth3(value) },
    { text: '中号产品规格', value: 'medium', clickCallback: (value) => setSelectedValueWidth3(value) },
    { text: '大号产品规格', value: 'large', clickCallback: (value) => setSelectedValueWidth3(value) },
  ]

  const getSelectedText = (value: string, options: DataType[]) => {
    const option = options.find((opt) => opt.value === value)
    return option?.text || '请选择'
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Select 下拉选择组件示例</h2>
        <p>
          Select 是一个基于 Popper.js 实现的高度可定制下拉选择组件，支持点击和悬浮两种触发方式， 具有搜索过滤、Portal
          渲染、自定义样式等丰富功能。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法 - 点击触发</h3>
        <p>点击触发的基础下拉选择器</p>

        <DemoRow>
          <div className='demo-info'>
            <span className='label'>基础选择器</span>
            <span className='description'>点击展开选项列表</span>
          </div>
          <div className='demo-area'>
            <Select
              value={selectedValue1}
              dataList={basicOptions}
              triggerMethod={TriggerMethod.CLICK}
              placement='bottom-start'
            >
              <SelectButton>
                <span className='select-text'>{getSelectedText(selectedValue1, basicOptions)}</span>
              </SelectButton>
            </Select>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>搜索功能</h3>
        <p>支持搜索过滤的下拉选择器</p>

        <DemoRow>
          <div className='demo-info'>
            <span className='label'>搜索选择器</span>
            <span className='description'>支持输入关键词搜索选项</span>
          </div>
          <div className='demo-area'>
            <Select
              value={selectedValue2}
              dataList={fruitOptions}
              triggerMethod={TriggerMethod.CLICK}
              useSearch={true}
              placement='bottom-start'
            >
              <SelectButton>
                <span className='select-text'>{getSelectedText(selectedValue2, fruitOptions)}</span>
              </SelectButton>
            </Select>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>悬浮触发</h3>
        <p>鼠标悬浮触发的下拉选择器</p>

        <DemoRow>
          <div className='demo-info'>
            <span className='label'>悬浮选择器</span>
            <span className='description'>鼠标悬浮时自动展开</span>
          </div>
          <div className='demo-area'>
            <Select
              value={selectedValue3}
              dataList={countryOptions}
              triggerMethod={TriggerMethod.HOVER}
              placement='bottom-start'
            >
              <SelectButton>
                <span className='select-text'>{getSelectedText(selectedValue3, countryOptions)}</span>
              </SelectButton>
            </Select>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>Portal 渲染模式</h3>
        <p>使用 Portal 将下拉框渲染到 document.body</p>

        <DemoRow>
          <div className='demo-info'>
            <span className='label'>Portal 选择器</span>
            <span className='description'>避免 z-index 层级问题</span>
          </div>
          <div className='demo-area'>
            <Select
              value={selectedValue4}
              dataList={colorOptions}
              triggerMethod={TriggerMethod.CLICK}
              usePortal={true}
              placement='bottom-start'
            >
              <SelectButton>
                <span className='select-text'>{getSelectedText(selectedValue4, colorOptions)}</span>
              </SelectButton>
            </Select>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>弹出框宽度对齐</h3>
        <p>使用 alignPopWidth 属性让弹出框宽度与选择器宽度保持一致</p>

        {/* 对比演示 */}
        <DemoRow>
          <div className='demo-info'>
            <span className='label'>对比演示</span>
            <span className='description'>左侧默认样式，右侧启用宽度对齐</span>
          </div>
          <div className='demo-area' style={{ justifyContent: 'center', gap: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <p style={{ fontSize: '14px', margin: 0, color: '#999' }}>默认样式（固定宽度）</p>
              <div style={{ width: '220px' }}>
                <Select
                  value={selectedValue5}
                  dataList={sizeOptions}
                  triggerMethod={TriggerMethod.CLICK}
                  usePortal={true}
                  placement='bottom-start'
                >
                  <SelectButton>
                    <span className='select-text'>{getSelectedText(selectedValue5, sizeOptions)}</span>
                  </SelectButton>
                </Select>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <p style={{ fontSize: '14px', margin: 0, color: '#999' }}>启用宽度对齐</p>
              <div style={{ width: '220px' }}>
                <Select
                  value={selectedValue5}
                  dataList={sizeOptions}
                  triggerMethod={TriggerMethod.CLICK}
                  alignPopWidth={true}
                  usePortal={true}
                  placement='bottom-start'
                >
                  <SelectButton>
                    <span className='select-text'>{getSelectedText(selectedValue5, sizeOptions)}</span>
                  </SelectButton>
                </Select>
              </div>
            </div>
          </div>
        </DemoRow>

        {/* 不同宽度演示 */}
        <DemoRow>
          <div className='demo-info'>
            <span className='label'>不同宽度演示</span>
            <span className='description'>弹出框宽度自动对齐到选择器宽度</span>
          </div>
          <div className='demo-area' style={{ flexDirection: 'column', gap: '20px', alignItems: 'stretch' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#999' }}>标准宽度（200px）</p>
                <div style={{ width: '200px' }}>
                  <Select
                    value={selectedValueWidth1}
                    dataList={widthOptions1}
                    triggerMethod={TriggerMethod.CLICK}
                    alignPopWidth={true}
                    usePortal={true}
                    placement='bottom-start'
                  >
                    <SelectButton>
                      <span className='select-text'>{getSelectedText(selectedValueWidth1, widthOptions1)}</span>
                    </SelectButton>
                  </Select>
                </div>
              </div>

              <div>
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#999' }}>中等宽度（280px）</p>
                <div style={{ width: '280px' }}>
                  <Select
                    value={selectedValueWidth2}
                    dataList={widthOptions2}
                    triggerMethod={TriggerMethod.CLICK}
                    alignPopWidth={true}
                    usePortal={true}
                    placement='bottom-start'
                  >
                    <SelectButton>
                      <span className='select-text'>{getSelectedText(selectedValueWidth2, widthOptions2)}</span>
                    </SelectButton>
                  </Select>
                </div>
              </div>

              <div>
                <p style={{ marginBottom: '8px', fontSize: '14px', color: '#999' }}>较宽宽度（360px）</p>
                <div style={{ width: '360px' }}>
                  <Select
                    value={selectedValueWidth3}
                    dataList={widthOptions3}
                    triggerMethod={TriggerMethod.CLICK}
                    alignPopWidth={true}
                    usePortal={true}
                    placement='bottom-start'
                  >
                    <SelectButton>
                      <span className='select-text'>{getSelectedText(selectedValueWidth3, widthOptions3)}</span>
                    </SelectButton>
                  </Select>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: '15px',
                padding: '12px 16px',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '8px',
              }}
            >
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>
                💡 <strong>提示：</strong>当{' '}
                <code
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '13px',
                  }}
                >
                  alignPopWidth=true
                </code>{' '}
                时，弹出框会自动调整宽度与选择器保持一致，即使在 usePortal 模式下也能正确工作。
              </p>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>不同弹出位置</h3>
        <p>支持多种弹出位置配置</p>

        <DemoRow>
          <div className='demo-info'>
            <span className='label'>位置演示</span>
            <span className='description'>top、bottom、left、right 及其组合</span>
          </div>
          <div className='demo-area' style={{ justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Select
                usePortal
                alignPopWidth
                value='top'
                dataList={[
                  { text: '顶部弹出', value: 'top', clickCallback: () => {} },
                  { text: '示例选项', value: 'demo', clickCallback: () => {} },
                ]}
                triggerMethod={TriggerMethod.HOVER}
                placement='top'
              >
                <SelectButton>
                  <span className='select-text'>顶部</span>
                </SelectButton>
              </Select>
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>placement="top"</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Select
                usePortal
                alignPopWidth
                value='right'
                dataList={[
                  { text: '右侧弹出', value: 'right', clickCallback: () => {} },
                  { text: '示例选项', value: 'demo', clickCallback: () => {} },
                ]}
                triggerMethod={TriggerMethod.HOVER}
                placement='right'
              >
                <SelectButton>
                  <span className='select-text'>右侧</span>
                </SelectButton>
              </Select>
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>placement="right"</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Select
                usePortal
                alignPopWidth
                value='left'
                dataList={[
                  { text: '左侧弹出', value: 'left', clickCallback: () => {} },
                  { text: '示例选项', value: 'demo', clickCallback: () => {} },
                ]}
                triggerMethod={TriggerMethod.HOVER}
                placement='left'
              >
                <SelectButton>
                  <span className='select-text'>左侧</span>
                </SelectButton>
              </Select>
              <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>placement="left"</p>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import Select, { TriggerMethod, DataType } from './Select'

// 准备选项数据
const options: DataType[] = [
  { text: '选项一', value: 'option1', clickCallback: (value) => setValue(value) },
  { text: '选项二', value: 'option2', clickCallback: (value) => setValue(value) },
]

// 基础使用
<Select
  value={selectedValue}
  dataList={options}
  triggerMethod={TriggerMethod.CLICK}
  placement="bottom-start"
>
  <SelectButton>{selectedText}</SelectButton>
</Select>

// 带搜索功能
<Select
  value={selectedValue}
  dataList={options}
  useSearch={true}
  triggerMethod={TriggerMethod.CLICK}
>
  <SelectButton>{selectedText}</SelectButton>
</Select>

// Portal 模式
<Select
  value={selectedValue}
  dataList={options}
  usePortal={true}
  popStyle={{ background: 'white', borderRadius: '8px' }}
>
  <SelectButton>{selectedText}</SelectButton>
</Select>

// 弹出框宽度对齐
<Select
  value={selectedValue}
  dataList={options}
  alignPopWidth={true}
  usePortal={true}
>
  <SelectButton>{selectedText}</SelectButton>
</Select>`}</CodeBlock>
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
            <div className='prop-name'>value</div>
            <div className='prop-type'>any</div>
            <div className='prop-default'>-</div>
            <div>当前选中的值（必填）</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>dataList</div>
            <div className='prop-type'>DataType[]</div>
            <div className='prop-default'>-</div>
            <div>选项数据列表</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>triggerMethod</div>
            <div className='prop-type'>TriggerMethod</div>
            <div className='prop-default'>HOVER</div>
            <div>触发方式：CLICK 或 HOVER</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>useSearch</div>
            <div className='prop-type'>boolean</div>
            <div className='prop-default'>false</div>
            <div>是否启用搜索功能</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>usePortal</div>
            <div className='prop-type'>boolean</div>
            <div className='prop-default'>false</div>
            <div>是否使用 Portal 渲染到 body</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>alignPopWidth</div>
            <div className='prop-type'>boolean</div>
            <div className='prop-default'>false</div>
            <div>是否对齐弹出框宽度与选择器宽度一致</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>placement</div>
            <div className='prop-type'>Placement</div>
            <div className='prop-default'>'auto'</div>
            <div>弹出位置：top、bottom、left、right 等</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>disabled</div>
            <div className='prop-type'>boolean</div>
            <div className='prop-default'>false</div>
            <div>是否禁用</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>hideExpand</div>
            <div className='prop-type'>boolean</div>
            <div className='prop-default'>false</div>
            <div>是否隐藏展开图标</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>popStyle</div>
            <div className='prop-type'>CSSProperties</div>
            <div className='prop-default'>{}</div>
            <div>弹出框自定义样式</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>popClass</div>
            <div className='prop-type'>string</div>
            <div className='prop-default'>-</div>
            <div>弹出框自定义类名</div>
          </PropsRow>
          <PropsRow>
            <div className='prop-name'>popItemHoverBg</div>
            <div className='prop-type'>string</div>
            <div className='prop-default'>-</div>
            <div>选项悬浮时的背景色</div>
          </PropsRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>DataType 接口</h3>
          <PropsTable>
            <PropsHeader>
              <div>属性</div>
              <div>类型</div>
              <div>默认值</div>
              <div>描述</div>
            </PropsHeader>
            <PropsRow>
              <div className='prop-name'>text</div>
              <div className='prop-type'>ReactNode</div>
              <div className='prop-default'>-</div>
              <div>显示文本（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className='prop-name'>value</div>
              <div className='prop-type'>any</div>
              <div className='prop-default'>-</div>
              <div>选项值（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className='prop-name'>clickCallback</div>
              <div className='prop-type'>Function</div>
              <div className='prop-default'>-</div>
              <div>点击回调函数（必填）</div>
            </PropsRow>
            <PropsRow>
              <div className='prop-name'>searchKey</div>
              <div className='prop-type'>string</div>
              <div className='prop-default'>-</div>
              <div>搜索关键字</div>
            </PropsRow>
            <PropsRow>
              <div className='prop-name'>key</div>
              <div className='prop-type'>string</div>
              <div className='prop-default'>-</div>
              <div>选项唯一标识</div>
            </PropsRow>
          </PropsTable>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>智能定位</strong>：基于 Popper.js 实现智能弹出位置
              </li>
              <li>
                <strong>搜索过滤</strong>：支持输入关键词实时过滤选项
              </li>
              <li>
                <strong>Portal 渲染</strong>：可选择渲染到 document.body 避免层级问题
              </li>
              <li>
                <strong>触发方式</strong>：支持点击和悬浮两种触发方式
              </li>
              <li>
                <strong>自定义样式</strong>：丰富的样式定制选项
              </li>
              <li>
                <strong>移动端适配</strong>：自动适配移动端操作体验
              </li>
              <li>
                <strong>动画效果</strong>：流畅的展开收起动画
              </li>
            </ul>
          </div>
        </div>
      </div>
    </DemoContainer>
  )
}

export default SelectDemo
