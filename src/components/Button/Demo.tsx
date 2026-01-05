import React, { useState } from 'react'
import styled from 'styled-components'
import { BaseButton, ButtonCommon, ButtonBorder, IconButton } from './index'
import { IconBase } from 'components/Icons'
import Pending from 'components/Pending'

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
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .button-container {
    min-width: 200px;
  }

  .demo-info {
    flex: 1;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.black0};
      margin-bottom: 5px;
    }

    .description {
      color: ${({ theme }) => theme.black200};
      font-size: 14px;
    }
  }
`

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
`

const CustomButton = styled(BaseButton)<{
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
}>`
  height: 40px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;

  ${({ theme, variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.brand100};
          color: ${theme.black0};
          &:hover { background: ${theme.brand100}; }
        `
      case 'secondary':
        return `
          background: ${theme.black200};
          color: ${theme.black0};
          &:hover { background: ${theme.black100}; }
        `
      case 'success':
        return `
          background: #52c41a;
          color: white;
          &:hover { background: #73d13d; }
        `
      case 'warning':
        return `
          background: #faad14;
          color: white;
          &:hover { background: #ffc53d; }
        `
      case 'danger':
        return `
          background: #ff4d4f;
          color: white;
          &:hover { background: #ff7875; }
        `
      default:
        return `
          background: ${theme.bgL2};
          color: ${theme.black0};
          border: 1px solid ${theme.black800};
          &:hover { background: ${theme.bgL1}; }
        `
    }
  }}

  &:active {
    transform: translateY(1px);
  }
`

const SizeButton = styled(BaseButton)<{ size?: 'small' | 'medium' | 'large' }>`
  background: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.black0};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand100};
  }

  &:active {
    transform: translateY(1px);
  }

  ${({ size }) => {
    switch (size) {
      case 'small':
        return `
          height: 32px;
          padding: 4px 12px;
          font-size: 12px;
        `
      case 'large':
        return `
          height: 48px;
          padding: 12px 24px;
          font-size: 16px;
        `
      default:
        return `
          height: 40px;
          padding: 8px 16px;
          font-size: 14px;
        `
    }
  }}
`

const LoadingButton = styled(CustomButton)`
  position: relative;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 8px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.black0};
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
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.black800};
  padding-bottom: 10px;
  margin-bottom: 15px;
  color: ${({ theme }) => theme.black0};
`

const PropsTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 15px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.black800}10;

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
        return theme.black0
      case 'type':
        return theme.brand100
      case 'default':
        return theme.black200
      default:
        return theme.black100
    }
  }};
`

const ButtonDemo = () => {
  const [loading, setLoading] = useState(false)
  const [pending, setPending] = useState(false)

  const handleLoadingClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  const handlePendingClick = () => {
    setPending(true)
    setTimeout(() => setPending(false), 2000)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Button 按钮组件示例</h2>
        <p>按钮组件用于触发用户操作，支持多种样式、大小和状态。 包含基础按钮、通用按钮和边框按钮等不同变体。</p>
      </DemoSection>

      <DemoSection>
        <h3>基础按钮组件</h3>
        <p>最基础的 BaseButton 组件，可以作为其他按钮的基础</p>

        <DemoRow>
          <div className='button-container'>
            <BaseButton
              padding='12px 24px'
              width='auto'
              $borderRadius='8px'
              style={{
                background: '#1890ff',
                color: 'white',
                cursor: 'pointer',
              }}
              onClick={() => alert('BaseButton 被点击了！')}
            >
              基础按钮
            </BaseButton>
          </div>
          <div className='demo-info'>
            <div className='label'>BaseButton</div>
            <div className='description'>可自定义样式的基础按钮组件</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<BaseButton 
  padding="12px 24px" 
  width="auto" 
  $borderRadius="8px"
  style={{ 
    background: '#1890ff', 
    color: 'white',
    cursor: 'pointer'
  }}
  onClick={() => alert('BaseButton 被点击了！')}
>
  基础按钮
</BaseButton>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>通用按钮</h3>
        <p>ButtonCommon 是预设样式的通用按钮，适用于主要操作</p>

        <DemoRow>
          <div className='button-container'>
            <ButtonCommon onClick={() => alert('通用按钮被点击了！')}>通用按钮</ButtonCommon>
          </div>
          <div className='demo-info'>
            <div className='label'>ButtonCommon</div>
            <div className='description'>预设样式的主要按钮，通常用于重要操作</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<ButtonCommon onClick={() => alert('通用按钮被点击了！')}>
  通用按钮
</ButtonCommon>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>边框按钮</h3>
        <p>ButtonBorder 是带边框的次要按钮样式</p>

        <DemoRow>
          <div className='button-container'>
            <ButtonBorder onClick={() => alert('边框按钮被点击了！')}>边框按钮</ButtonBorder>
          </div>
          <div className='demo-info'>
            <div className='label'>ButtonBorder</div>
            <div className='description'>带边框的次要按钮，用于辅助操作</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<ButtonBorder onClick={() => alert('边框按钮被点击了！')}>
  边框按钮
</ButtonBorder>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>按钮状态</h3>
        <p>按钮支持禁用和加载状态</p>

        <ButtonGrid>
          <ButtonCommon onClick={handlePendingClick} $pending={pending}>
            {pending ? '处理中...' : '点击处理'}
          </ButtonCommon>

          <ButtonCommon $disabled>禁用按钮</ButtonCommon>

          <LoadingButton variant='primary' onClick={handleLoadingClick}>
            {loading && <div className='loading-spinner'></div>}
            {loading ? '加载中...' : '点击加载'}
          </LoadingButton>
        </ButtonGrid>

        <CodeBlock>
          {`// 处理中状态
<ButtonCommon $pending={pending}>
  {pending ? '处理中...' : '点击处理'}
</ButtonCommon>

// 禁用状态
<ButtonCommon $disabled>
  禁用按钮
</ButtonCommon>

// 加载状态
<LoadingButton onClick={handleLoadingClick} $disabled={loading}>
  {loading && <div className="loading-spinner"></div>}
  {loading ? '加载中...' : '点击加载'}
</LoadingButton>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>按钮变体</h3>
        <p>基于 BaseButton 扩展的不同样式按钮</p>

        <ButtonGrid>
          <CustomButton variant='primary' onClick={() => alert('主要按钮')}>
            主要按钮
          </CustomButton>

          <CustomButton variant='secondary' onClick={() => alert('次要按钮')}>
            次要按钮
          </CustomButton>

          <CustomButton variant='success' onClick={() => alert('成功按钮')}>
            成功按钮
          </CustomButton>

          <CustomButton variant='warning' onClick={() => alert('警告按钮')}>
            警告按钮
          </CustomButton>

          <CustomButton variant='danger' onClick={() => alert('危险按钮')}>
            危险按钮
          </CustomButton>

          <CustomButton onClick={() => alert('默认按钮')}>默认按钮</CustomButton>
        </ButtonGrid>

        <CodeBlock>
          {`// 不同变体的按钮
<CustomButton variant="primary">主要按钮</CustomButton>
<CustomButton variant="secondary">次要按钮</CustomButton>
<CustomButton variant="success">成功按钮</CustomButton>
<CustomButton variant="warning">警告按钮</CustomButton>
<CustomButton variant="danger">危险按钮</CustomButton>
<CustomButton>默认按钮</CustomButton>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>按钮尺寸</h3>
        <p>支持小、中、大三种尺寸</p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
          }}
        >
          <SizeButton size='small' onClick={() => alert('小按钮')}>
            小按钮
          </SizeButton>

          <SizeButton size='medium' onClick={() => alert('中按钮')}>
            中按钮
          </SizeButton>

          <SizeButton size='large' onClick={() => alert('大按钮')}>
            大按钮
          </SizeButton>
        </div>

        <CodeBlock>
          {`<SizeButton size="small">小按钮</SizeButton>
<SizeButton size="medium">中按钮</SizeButton>
<SizeButton size="large">大按钮</SizeButton>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>图标按钮</h3>
        <p>专门用于显示图标的按钮，支持自定义颜色、尺寸和加载状态</p>

        <h4>基本用法</h4>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
          }}
        >
          <IconButton icon='icon-chat-share' onClick={() => alert('分享')} />
          <IconButton icon='icon-chat-stop-play' onClick={() => alert('停止/播放')} />
          <IconButton icon='icon-chat-rubbish' color='#ff4444' onClick={() => alert('删除')} />
          <IconButton icon='icon-chat-upload' color='#44ff44' onClick={() => alert('添加')} />
          <IconButton icon='icon-chat-share' pending onClick={() => console.log('加载中...')} />
        </div>

        <h4>不同尺寸(待设计定义，目前统一Medium尺寸)</h4>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
          }}
        >
          <IconButton icon='icon-chat-share' size='small' onClick={() => alert('小尺寸')} />
          <IconButton icon='icon-chat-share' size='medium' onClick={() => alert('中尺寸')} />
          <IconButton icon='icon-chat-share' size='large' onClick={() => alert('大尺寸')} />
        </div>

        <h4>带状态的图标按钮</h4>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
          }}
        >
          <IconButton icon='icon-chat-share' disabled />
          <IconButton icon='icon-chat-share' pending />
        </div>

        <CodeBlock>
          {`// 基本用法
<IconButton icon='icon-chat-share' onClick={() => alert('分享')} />
<IconButton icon='icon-chat-stop-play' onClick={() => alert('停止/播放')} />
<IconButton icon='icon-chat-rubbish' color='#ff4444' onClick={() => alert('删除')} />

// 不同尺寸
<IconButton icon='icon-chat-share' size='small' onClick={() => alert('小尺寸')} />
<IconButton icon='icon-chat-share' size='medium' onClick={() => alert('中尺寸')} />
<IconButton icon='icon-chat-share' size='large' onClick={() => alert('大尺寸')} />

// 加载状态（pending 会自动显示 Pending 组件）
<IconButton icon='icon-chat-share' pending onClick={() => console.log('加载中...')} />

// 禁用状态
<IconButton icon='icon-chat-share' disabled />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义样式</h3>
        <p>BaseButton 支持完全自定义的样式和尺寸</p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '20px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
          }}
        >
          <BaseButton
            padding='6px 12px'
            width='auto'
            $borderRadius='4px'
            style={{
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => alert('渐变按钮')}
          >
            渐变按钮
          </BaseButton>

          <BaseButton
            padding='10px 20px'
            width='auto'
            $borderRadius='20px'
            style={{
              background: 'transparent',
              color: '#1890ff',
              border: '2px solid #1890ff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
            onClick={() => alert('圆角边框按钮')}
          >
            圆角边框按钮
          </BaseButton>

          <BaseButton
            padding='15px 30px'
            width='auto'
            $borderRadius='0'
            style={{
              background: '#000',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
            }}
            onClick={() => alert('方形按钮')}
          >
            方形按钮
          </BaseButton>
        </div>

        <CodeBlock>
          {`// 渐变按钮
<BaseButton 
  padding="6px 12px" 
  width="auto" 
  $borderRadius="4px"
  style={{ 
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)', 
    color: 'white',
    cursor: 'pointer'
  }}
>
  渐变按钮
</BaseButton>

// 圆角边框按钮
<BaseButton 
  padding="10px 20px" 
  width="auto" 
  $borderRadius="20px"
  style={{ 
    background: 'transparent', 
    color: '#1890ff',
    border: '2px solid #1890ff',
    cursor: 'pointer'
  }}
>
  圆角边框按钮
</BaseButton>`}
        </CodeBlock>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>Button 组件支持的所有属性参数</p>

        <h3>BaseButton Props</h3>
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>padding</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>"16px"</PropsTableCell>
            <PropsTableCell type='desc'>按钮内边距</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>width</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>"100%"</PropsTableCell>
            <PropsTableCell type='desc'>按钮宽度</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>$borderRadius</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>"20px"</PropsTableCell>
            <PropsTableCell type='desc'>按钮圆角大小</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>altDisabledStyle</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>替代的禁用样式</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <h3>ButtonCommon & ButtonBorder Props</h3>
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>pending</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否处于处理中状态</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>disabled</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否禁用按钮</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onClick</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>点击事件处理函数</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>children</PropsTableCell>
            <PropsTableCell type='type'>ReactNode</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>按钮内容</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <h3>IconButton Props</h3>
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>icon</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>图标类名（必需，如 'icon-chat-share'）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>size</PropsTableCell>
            <PropsTableCell type='type'>'small' | 'medium' | 'large'</PropsTableCell>
            <PropsTableCell type='default'>'medium'</PropsTableCell>
            <PropsTableCell type='desc'>按钮尺寸（目前样式相同，待后续定义）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>color</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>theme.black200</PropsTableCell>
            <PropsTableCell type='desc'>图标颜色</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>pending</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否处于处理中状态</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>disabled</PropsTableCell>
            <PropsTableCell type='type'>boolean</PropsTableCell>
            <PropsTableCell type='default'>false</PropsTableCell>
            <PropsTableCell type='desc'>是否禁用按钮</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>onClick</PropsTableCell>
            <PropsTableCell type='type'>function</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>点击事件处理函数</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>children</PropsTableCell>
            <PropsTableCell type='type'>ReactNode</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>图标内容（通常是 IconBase 组件）</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`// BaseButton 接口
interface BaseButtonProps {
  padding?: string;                         // 可选：内边距
  width?: string;                           // 可选：宽度
  $borderRadius?: string;                   // 可选：圆角大小
  altDisabledStyle?: boolean;               // 可选：替代禁用样式
  children?: ReactNode;                     // 可选：按钮内容
  onClick?: () => void;                     // 可选：点击事件
  style?: React.CSSProperties;              // 可选：自定义样式
}

// ButtonCommon & ButtonBorder 接口
interface ButtonProps extends BaseButtonProps {
  pending?: boolean;                        // 可选：处理中状态
  disabled?: boolean;                       // 可选：禁用状态
}

// IconButton 接口
interface IconButtonProps extends ButtonProps {
  icon: string;                              // 必需：图标类名（如 'icon-chat-share'）
  size?: 'small' | 'medium' | 'large';      // 可选：按钮尺寸（默认 medium）
  color?: string;                           // 可选：图标颜色
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default ButtonDemo
