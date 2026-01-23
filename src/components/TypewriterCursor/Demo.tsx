import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import TypewriterCursor from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.black0};
  min-height: 100vh;
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

const DemoArea = styled.div`
  padding: 30px;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.black800};
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const CursorRow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 20px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black800};

  .label {
    font-size: 14px;
    color: ${({ theme }) => theme.black200};
    min-width: 100px;
  }

  .cursor-display {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: ${({ theme }) => theme.black0};
  }
`

const TypewriterEffect = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  color: ${({ theme }) => theme.black0};
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black800};
  min-height: 60px;
`

const ControlsArea = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: 8px 16px;
  background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL1)};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.black0)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.brand100 : theme.black800)};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL2)};
    border-color: ${({ theme }) => theme.brand100};
  }
`

const SizeControl = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  margin-bottom: 20px;

  label {
    font-size: 14px;
    color: ${({ theme }) => theme.black200};
    min-width: 60px;
  }

  input {
    width: 80px;
    padding: 6px 10px;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.black800};
    border-radius: 4px;
    color: ${({ theme }) => theme.black0};
    font-size: 14px;
  }

  .value {
    font-size: 14px;
    color: ${({ theme }) => theme.black100};
    font-family: monospace;
  }
`

const CodeBlock = styled.pre`
  background: ${({ theme }) => theme.bgL2};
  color: ${({ theme }) => theme.black0};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.5;
`

const TypewriterCursorDemo = () => {
  const [width, setWidth] = useState(8)
  const [height, setHeight] = useState(20)
  const [text, setText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const fullText = 'Hello, I am an AI assistant. How can I help you today?'

  // 打字机效果模拟
  useEffect(() => {
    if (!isTyping) return

    if (text.length < fullText.length) {
      const timer = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1))
      }, 80)
      return () => clearTimeout(timer)
    } else {
      // 打字完成后暂停一会儿再重新开始
      const timer = setTimeout(() => {
        setText('')
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [text, isTyping])

  const toggleTyping = () => {
    if (isTyping) {
      setIsTyping(false)
    } else {
      setIsTyping(true)
      setText('')
    }
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>TypewriterCursor 打字机光标组件</h2>
        <p>用于模拟打字机效果的闪烁光标组件，常用于 AI 对话、实时打字等场景。支持自定义光标尺寸，具有平滑的闪烁动画效果。</p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>光标会以 1 秒为周期进行闪烁动画，默认尺寸为 8x20 像素。</p>
        <DemoArea>
          <CursorRow>
            <span className='label'>默认光标:</span>
            <div className='cursor-display'>
              <span>正在输入</span>
              <TypewriterCursor />
            </div>
          </CursorRow>
        </DemoArea>
      </DemoSection>

      <DemoSection>
        <h3>自定义尺寸</h3>
        <p>通过 width 和 height 属性自定义光标大小，适配不同字号的文本。</p>

        <SizeControl>
          <label>宽度:</label>
          <input type='range' min='2' max='20' value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          <span className='value'>{width}px</span>

          <label style={{ marginLeft: 20 }}>高度:</label>
          <input type='range' min='10' max='40' value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          <span className='value'>{height}px</span>
        </SizeControl>

        <DemoArea>
          <CursorRow>
            <span className='label'>自定义光标:</span>
            <div className='cursor-display'>
              <span>自定义尺寸</span>
              <TypewriterCursor width={width} height={height} />
            </div>
          </CursorRow>

          <CursorRow>
            <span className='label'>小号 (4x14):</span>
            <div className='cursor-display' style={{ fontSize: 12 }}>
              <span>小号文字</span>
              <TypewriterCursor width={4} height={14} />
            </div>
          </CursorRow>

          <CursorRow>
            <span className='label'>中号 (8x20):</span>
            <div className='cursor-display' style={{ fontSize: 16 }}>
              <span>中号文字</span>
              <TypewriterCursor width={8} height={20} />
            </div>
          </CursorRow>

          <CursorRow>
            <span className='label'>大号 (12x28):</span>
            <div className='cursor-display' style={{ fontSize: 24 }}>
              <span>大号文字</span>
              <TypewriterCursor width={12} height={28} />
            </div>
          </CursorRow>
        </DemoArea>
      </DemoSection>

      <DemoSection>
        <h3>打字机效果演示</h3>
        <p>结合文字逐字显示，实现完整的打字机效果。</p>

        <ControlsArea>
          <ControlButton $active={isTyping} onClick={toggleTyping}>
            {isTyping ? '停止打字' : '开始打字'}
          </ControlButton>
          <ControlButton
            onClick={() => {
              setText('')
              setIsTyping(true)
            }}
          >
            重新开始
          </ControlButton>
        </ControlsArea>

        <DemoArea>
          <TypewriterEffect>
            <span>{text}</span>
            {(isTyping || text.length < fullText.length) && <TypewriterCursor width={8} height={20} />}
          </TypewriterEffect>
        </DemoArea>
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: 20,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              lineHeight: 1.6,
              fontSize: 14,
            }}
          >
            <li>
              <strong>闪烁动画</strong>：使用 CSS keyframes 实现平滑的闪烁效果，1 秒为周期
            </li>
            <li>
              <strong>自定义尺寸</strong>：支持通过 width 和 height 属性自定义光标大小
            </li>
            <li>
              <strong>主题适配</strong>：光标颜色使用主题的 brand100 色值，自动适配深色/浅色主题
            </li>
            <li>
              <strong>内联显示</strong>：使用 inline-block 布局，可与文字无缝配合
            </li>
            <li>
              <strong>轻量简洁</strong>：纯 CSS 动画，无需 JavaScript 控制
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import TypewriterCursor from 'components/TypewriterCursor'

// 基础用法 - 默认尺寸 (8x20)
<span>正在输入</span>
<TypewriterCursor />

// 自定义尺寸
<span>大号文字</span>
<TypewriterCursor width={12} height={28} />

// 打字机效果示例
const [text, setText] = useState('')

useEffect(() => {
  const timer = setTimeout(() => {
    setText(fullText.slice(0, text.length + 1))
  }, 80)
  return () => clearTimeout(timer)
}, [text])

<div>
  <span>{text}</span>
  <TypewriterCursor />
</div>`}</CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>Props 参数</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 8,
            padding: 20,
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: 15,
              marginBottom: 15,
              fontWeight: 'bold',
              fontSize: 14,
              paddingBottom: 10,
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </div>

          {[
            ['width', 'number', '8', '光标宽度（像素）'],
            ['height', 'number', '20', '光标高度（像素）'],
          ].map(([prop, type, defaultVal, desc], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: 15,
                padding: '10px 0',
                borderBottom: index < 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                fontSize: 14,
              }}
            >
              <div style={{ fontFamily: 'monospace', color: '#ff6b6b', fontWeight: 500 }}>{prop}</div>
              <div style={{ fontFamily: 'monospace', color: '#4ecdc4' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>

        <CodeBlock>
          {`interface TypewriterCursorProps {
  width?: number   // 可选：光标宽度，默认8px
  height?: number  // 可选：光标高度，默认20px
}`}
        </CodeBlock>
      </DemoSection>
    </DemoContainer>
  )
}

export default TypewriterCursorDemo
