import React from 'react'
import styled from 'styled-components'
import Avatar from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;
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

  .avatar-info {
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

const AvatarDemo = () => {
  return (
    <DemoContainer>
      <DemoSection>
        <h2>Avatar 头像组件示例</h2>
        <p>
          头像组件用于展示用户头像，支持自定义头像图片和生成式头像。
          当没有提供头像图片时，会基于用户名生成独特的几何图形头像。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基本用法</h3>
        <p>最基本的头像展示，使用默认大小(28px)和生成式头像</p>

        <DemoRow>
          <Avatar name='John Doe' />
          <div className='avatar-info'>
            <div className='label'>基本头像</div>
            <div className='description'>用户名: John Doe, 默认大小 28px</div>
          </div>
        </DemoRow>

        <CodeBlock>{`<Avatar name="John Doe" />`}</CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>不同大小</h3>
        <p>通过 size 属性设置头像大小</p>

        <DemoRow>
          <Avatar name='Alice Smith' size={24} />
          <div className='avatar-info'>
            <div className='label'>小尺寸头像</div>
            <div className='description'>24px</div>
          </div>
        </DemoRow>

        <DemoRow>
          <Avatar name='Bob Johnson' size={32} />
          <div className='avatar-info'>
            <div className='label'>中等尺寸头像</div>
            <div className='description'>32px</div>
          </div>
        </DemoRow>

        <DemoRow>
          <Avatar name='Charlie Brown' size={48} />
          <div className='avatar-info'>
            <div className='label'>大尺寸头像</div>
            <div className='description'>48px</div>
          </div>
        </DemoRow>

        <DemoRow>
          <Avatar name='Diana Prince' size={64} />
          <div className='avatar-info'>
            <div className='label'>超大尺寸头像</div>
            <div className='description'>64px</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Avatar name="Alice Smith" size={24} />
<Avatar name="Bob Johnson" size={32} />
<Avatar name="Charlie Brown" size={48} />
<Avatar name="Diana Prince" size={64} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义头像图片</h3>
        <p>使用 avatar 属性提供自定义头像图片 URL</p>

        <DemoRow>
          <Avatar name='Custom User' size={48} avatar='https://avatars.githubusercontent.com/u/1?v=4' />
          <div className='avatar-info'>
            <div className='label'>自定义头像</div>
            <div className='description'>使用外部图片作为头像</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Avatar 
  name="Custom User" 
  size={48}
  avatar="https://avatars.githubusercontent.com/u/1?v=4"
/>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>不同用户名的生成式头像</h3>
        <p>相同用户名生成相同的头像图案，不同用户名生成不同的图案</p>

        <DemoRow>
          <Avatar name='Alex Wang' size={40} />
          <div className='avatar-info'>
            <div className='label'>Alex Wang</div>
            <div className='description'>基于用户名生成的独特图案</div>
          </div>
        </DemoRow>

        <DemoRow>
          <Avatar name='Maria Garcia' size={40} />
          <div className='avatar-info'>
            <div className='label'>Maria Garcia</div>
            <div className='description'>基于用户名生成的独特图案</div>
          </div>
        </DemoRow>

        <DemoRow>
          <Avatar name='James Wilson' size={40} />
          <div className='avatar-info'>
            <div className='label'>James Wilson</div>
            <div className='description'>基于用户名生成的独特图案</div>
          </div>
        </DemoRow>

        <DemoRow>
          <Avatar name='Sarah Lee' size={40} />
          <div className='avatar-info'>
            <div className='label'>Sarah Lee</div>
            <div className='description'>基于用户名生成的独特图案</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`<Avatar name="Alex Wang" size={40} />
<Avatar name="Maria Garcia" size={40} />
<Avatar name="James Wilson" size={40} />
<Avatar name="Sarah Lee" size={40} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>主题适配</h3>
        <p>头像组件会自动适配当前主题(暗色/亮色模式)</p>

        <DemoRow>
          <Avatar name='Theme Test' size={40} />
          <div className='avatar-info'>
            <div className='label'>主题自适应</div>
            <div className='description'>根据当前主题自动调整颜色方案</div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`// 组件会自动根据主题切换颜色
<Avatar name="Theme Test" size={40} />`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>组合使用场景</h3>
        <p>在实际应用中的常见使用场景</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            <Avatar name='John Doe' size={32} />
            <div>
              <div style={{ fontWeight: 600 }}>John Doe</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>在线</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            <Avatar name='Alice Smith' size={32} />
            <div>
              <div style={{ fontWeight: 600 }}>Alice Smith</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>5分钟前</div>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
            }}
          >
            <Avatar name='Bob Johnson' size={32} avatar='https://avatars.githubusercontent.com/u/2?v=4' />
            <div>
              <div style={{ fontWeight: 600 }}>Bob Johnson</div>
              <div style={{ fontSize: '14px', opacity: 0.7 }}>离线</div>
            </div>
          </div>
        </div>

        <CodeBlock>
          {`// 用户列表场景
<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
  <Avatar name="John Doe" size={32} />
  <div>
    <div>John Doe</div>
    <div>在线</div>
  </div>
</div>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>Props 参数</h3>
        <p>Avatar 组件支持的所有属性参数</p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: '15px',
              fontWeight: 600,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '10px',
              marginBottom: '15px',
            }}
          >
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>name</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div style={{ fontFamily: 'monospace', color: '#95a5a6' }}>-</div>
            <div>用户名，用于生成默认头像和图片alt属性</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>size</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>number</div>
            <div style={{ fontFamily: 'monospace', color: '#95a5a6' }}>28</div>
            <div>头像大小，单位为像素(px)</div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: '15px',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            <div style={{ fontFamily: 'monospace', color: '#ff6b6b' }}>avatar</div>
            <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>string</div>
            <div style={{ fontFamily: 'monospace', color: '#95a5a6' }}>-</div>
            <div>自定义头像图片URL，如果提供则显示图片，否则显示生成式头像</div>
          </div>
        </div>

        <CodeBlock>
          {`interface AvatarProps {
  name: string        // 必填：用户名
  size?: number      // 可选：头像大小，默认28px
  avatar?: string    // 可选：自定义头像图片URL
}`}
        </CodeBlock>
      </DemoSection>
    </DemoContainer>
  )
}

export default AvatarDemo
