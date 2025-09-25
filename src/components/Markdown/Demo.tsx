import React, { useState } from 'react'
import styled from 'styled-components'
import Markdown from './index'

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
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .markdown-container {
    width: 100%;
    padding: 20px;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.lineDark8};
    border-radius: 8px;
    min-height: 100px;
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

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;

  .input-label {
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    font-size: 14px;
  }

  .markdown-input {
    width: 100%;
    min-height: 120px;
    padding: 15px;
    background: ${({ theme }) => theme.bgL0};
    border: 1px solid ${({ theme }) => theme.lineDark8};
    border-radius: 8px;
    color: ${({ theme }) => theme.textL1};
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;

    &::placeholder {
      color: ${({ theme }) => theme.textL4};
    }

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.brand100};
    }
  }
`

const SplitView = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  .input-side {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .output-side {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .side-label {
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    font-size: 14px;
    padding-bottom: 5px;
    border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  }
`

const PresetButton = styled.button`
  padding: 8px 16px;
  background: ${({ theme }) => theme.brand100};
  color: ${({ theme }) => theme.textDark98};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.brand100};
    opacity: 0.8;
  }
`

const PresetPanel = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
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

const MarkdownDemo = () => {
  const [customMarkdown, setCustomMarkdown] = useState(`# Hello Markdown

这是一个 **Markdown** 渲染示例。

## 功能特性

- 支持标准 Markdown 语法
- 链接会自动在新标签页打开
- 完美的主题适配
- 移动端优化

### 代码块示例

\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

### 链接示例

访问 [Anthropic](https://www.anthropic.com) 了解更多信息。

> 这是一个引用块示例。`)

  const basicExample = `# 基础 Markdown 示例

这是一个简单的段落。

**粗体文本**、*斜体文本* 和 ***总结高亮文本***。

- 列表项 1
- 列表项 2
- 列表项 3`

  const richExample = `# 丰富格式示例

## 标题层级

### 三级标题
#### 四级标题

## 文本格式

这是**粗体**，这是*斜体*，这是\`内联代码\`。

## 列表

### 无序列表
- 第一项
- 第二项
  - 嵌套项
  - 另一个嵌套项

### 有序列表
1. 首先
2. 然后
3. 最后

## 链接和引用

访问 [OpenAI](https://openai.com) 了解 AI 技术。

> 这是一个重要的引用。
> 可以包含多行内容。

## 代码块

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "Alice",
  age: 30
};
\`\`\``

  const linkExample = `# 链接测试

## 外部链接
- [Google](https://www.google.com)
- [GitHub](https://github.com)
- [Stack Overflow](https://stackoverflow.com)

## 说明
所有链接都会在新标签页中打开，并显示域名标签，提供双重点击方式。点击链接文本或域名标签都可以跳转。`

  const codeExample = `# 代码示例

## JavaScript
\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
\`\`\`

## Python
\`\`\`python
def hello_world():
    print("Hello, World!")
    
hello_world()
\`\`\`

## CSS
\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\``

  const tableExample = `# 表格示例

## 数据表格
| 名称 | 类型 | 价格 | 状态 |
|------|------|------|------|
| Bitcoin | 加密货币 | $45,230 | 上涨 |
| Ethereum | 智能合约 | $3,120 | 下跌 |
| Cardano | 区块链 | $1.20 | 稳定 |
| Solana | 高性能链 | $98.50 | 上涨 |

## 功能对比
| 功能 | 基础版 | 专业版 | 企业版 |
|------|--------|--------|--------|
| 用户数量 | 10 | 100 | 无限制 |
| 存储空间 | 1GB | 10GB | 100GB |
| API 调用 | 1000/月 | 10000/月 | 无限制 |
| 技术支持 | 邮件 | 邮件+电话 | 24/7专属 |

表格样式完全参考了 Table 组件的设计，包括：
- 圆角效果
- 悬停高亮
- 合适的间距
- 主题色彩适配`

  const fundingRateExample = `*Hourly Funding Rate Table Update (2025-09-08 15:41 UTC)*

Here's the latest snapshot of funding rates for perpetual contracts across major exchanges:

| Token | Binance  | Bybit | OKEx | Bitget | A very long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long long title|
|-------|---------|-------|------|--------|--------|
| BTC   |   –     |   *0.0055%*   |  *0.0055%*   | *0.0055%* | *0.0055%* |
| ETH   |   –     |   –   |  –   | *0.01%*   | *0.01%* |
| WOO   |   –     |   –   |  –   | *0.01%*   | *0.01%* |
| LINK  |   –     |   –   |  –   | *0.01%*   | *0.01%* |
| OKB   |   –     |   –   |  –   |    –     | *0.01%* |

Funding data was successfully retrieved from Bitget, while Binance, Bybit, and OKEx did not provide rates for these tokens during this check. The uniform 0.01% rate on Bitget for ETH, WOO, and LINK suggests a neutral-to-mildly-long bias, while BTC's 0.0055% is slightly positive, indicating a mild premium for longs. OKB currently has no available funding rate across all exchanges.

*Multi-angle analysis*: 
- *Liquidity Fragmentation*: Only Bitget is providing funding rates this hour, so cross-exchange arbitrage opportunities are limited.
- *Sentiment*: The positive funding rates imply traders are paying to hold long positions, hinting at a market bias toward bullishness for these assets.
- *Risk*: Absence of data from other major venues means this is not a full-market snapshot. If you rely on cross-exchange data for hedging or sentiment, use caution.

For historical comparisons or more details, please refer to your previous hourly reports.

\`BTC funding rate on Bitget: 0.0055%\``

  const presets = [
    { name: '基础示例', content: basicExample },
    { name: '丰富格式', content: richExample },
    { name: '链接测试', content: linkExample },
    { name: '代码示例', content: codeExample },
    { name: '表格示例', content: tableExample },
    { name: '资金费率表格', content: fundingRateExample },
  ]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Markdown 渲染组件示例</h2>
        <p>
          Markdown 组件基于 react-markdown 构建，支持标准 Markdown 语法渲染，
          提供了完善的样式定制和主题适配。所有外部链接会自动在新标签页打开，并显示域名标签。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>最简单的 Markdown 内容渲染</p>

        <DemoRow>
          <div className='markdown-container'>
            <Markdown>{basicExample}</Markdown>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>基础 Markdown 渲染</div>
              <div className='description'>支持标题、文本格式、列表等基础语法</div>
            </div>
            <div className='stats'>
              <span>字符数: {basicExample.length}</span>
              <span>行数: {basicExample.split('\n').length}</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`import Markdown from 'components/Markdown'

const content = \`# 标题
这是一个段落。

**粗体**、*斜体* 和 ***总结高亮文本***。

- 列表项 1
- 列表项 2\`

<Markdown>{content}</Markdown>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>丰富格式支持</h3>
        <p>支持标准 Markdown 的各种格式元素</p>

        <DemoRow>
          <div className='markdown-container'>
            <Markdown>{richExample}</Markdown>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>丰富格式示例</div>
              <div className='description'>标题、列表、引用、代码块等完整支持</div>
            </div>
            <div className='stats'>
              <span>包含元素: 标题、列表、引用、代码</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`// 支持的格式元素：
// - 标题 (H1-H6)
// - 粗体、斜体、内联代码
// - 有序和无序列表（支持嵌套）
// - 引用块
// - 代码块（支持语法高亮）
// - 链接（自动新标签页打开）

<Markdown>{richMarkdownContent}</Markdown>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>链接处理</h3>
        <p>外部链接自动在新标签页打开，并显示域名标签，提供双重跳转方式</p>

        <DemoRow>
          <div className='markdown-container'>
            <Markdown>{linkExample}</Markdown>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>增强链接处理</div>
              <div className='description'>链接文本和域名标签都可点击，新标签页打开</div>
            </div>
            <div className='stats'>
              <span>特性: 域名显示、双重点击、悬停效果</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`// 组件内部增强链接处理
components={{
  a: ({ node, ...props }) => {
    const domain = getDomain(props.href)

    const handleDomainClick = () => {
      if (props.href) {
        goOutPageDirect(props.href)
      }
    }

    return (
      <LinkWrapper>
        <a target='_blank' rel='noopener noreferrer' {...props} />
        {domain && <span onClick={handleDomainClick}>{domain}</span>}
      </LinkWrapper>
    )
  }
}}

// 用户只需要写标准 Markdown 链接
[Google](https://www.google.com)
// 会渲染为：Google [google.com] （两处都可点击）`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>代码块支持</h3>
        <p>支持代码块渲染，带有自定义滚动条样式</p>

        <DemoRow>
          <div className='markdown-container'>
            <Markdown>{codeExample}</Markdown>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>代码块渲染</div>
              <div className='description'>支持多种编程语言的代码高亮</div>
            </div>
            <div className='stats'>
              <span>支持语言: JavaScript、Python、CSS 等</span>
            </div>
          </div>
        </DemoRow>

        <CodeBlock>
          {`// 代码块使用三个反引号包围
\`\`\`javascript
function hello() {
  console.log("Hello World!");
}
\`\`\`

// 也支持内联代码
使用 \`console.log()\` 输出信息。`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>表格支持</h3>
        <p>表格样式完全参考 Table 组件设计，具备一致的视觉效果</p>

        <DemoRow>
          <div className='markdown-container'>
            <Markdown>{tableExample}</Markdown>
          </div>
          <div className='demo-info'>
            <div>
              <div className='label'>表格渲染</div>
              <div className='description'>具备圆角、悬停效果、间距等 Table 组件特性</div>
            </div>
            <div className='stats'>
              <span>特性: 圆角、悬停高亮、主题适配</span>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>实际案例测试 - 资金费率表格</h3>
        <p>这是一个真实的 Markdown 表格内容示例，展示添加 remark-gfm 插件后的表格渲染效果</p>

        <DemoRow>
          <div className='markdown-container'>
            <Markdown>{fundingRateExample}</Markdown>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>实时编辑器</h3>
        <p>在左侧编辑 Markdown，右侧实时预览效果</p>

        <SplitView>
          <div className='input-side'>
            <div className='side-label'>Markdown 输入</div>
            <textarea
              className='markdown-input'
              value={customMarkdown}
              onChange={(e) => setCustomMarkdown(e.target.value)}
              placeholder='在这里输入 Markdown 内容...'
            />
          </div>
          <div className='output-side'>
            <div className='side-label'>实时预览</div>
            <div className='markdown-container'>
              <Markdown>{customMarkdown}</Markdown>
            </div>
          </div>
        </SplitView>

        <PresetPanel>
          {presets.map((preset, index) => (
            <PresetButton key={index} onClick={() => setCustomMarkdown(preset.content)}>
              {preset.name}
            </PresetButton>
          ))}
        </PresetPanel>

        <CodeBlock>
          {`const [markdown, setMarkdown] = useState('')

// 受控组件，内容可以动态更新
<textarea 
  value={markdown}
  onChange={(e) => setMarkdown(e.target.value)}
/>

<Markdown>{markdown}</Markdown>`}
        </CodeBlock>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>Markdown 组件支持的所有属性参数</p>

        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>

          <PropsTableRow>
            <PropsTableCell type='prop'>children</PropsTableCell>
            <PropsTableCell type='type'>string</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>要渲染的 Markdown 内容（必填）</PropsTableCell>
          </PropsTableRow>

          <PropsTableRow>
            <PropsTableCell type='prop'>ref</PropsTableCell>
            <PropsTableCell type='type'>RefObject&lt;HTMLDivElement&gt;</PropsTableCell>
            <PropsTableCell type='default'>-</PropsTableCell>
            <PropsTableCell type='desc'>容器元素的引用</PropsTableCell>
          </PropsTableRow>
        </PropsTable>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
            {`interface MarkdownProps {
  children: string;                           // 必填：Markdown 内容
  ref?: RefObject<HTMLDivElement>;           // 可选：容器元素引用
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>
                <strong>标准语法</strong>：支持完整的 Markdown 标准语法
              </li>
              <li>
                <strong>增强链接</strong>：外部链接自动添加安全属性，新标签页打开，显示域名标签，提供双重点击方式
              </li>
              <li>
                <strong>代码高亮</strong>：支持多种编程语言的代码块
              </li>
              <li>
                <strong>GFM 支持</strong>：通过 remark-gfm 插件支持 GitHub Flavored Markdown 特性
              </li>
              <li>
                <strong>表格渲染</strong>：表格样式完全参考 Table 组件，具备圆角、悬停效果等特性
              </li>
              <li>
                <strong>主题适配</strong>：完美适配暗色和亮色主题
              </li>
              <li>
                <strong>移动优化</strong>：响应式设计，移动端友好
              </li>
              <li>
                <strong>自定义滚动条</strong>：代码块提供优雅的滚动体验
              </li>
              <li>
                <strong>样式重置</strong>：恢复列表等元素的原生样式
              </li>
              <li>
                <strong>灵活布局</strong>：宽度自适应，可嵌套在任意容器中
              </li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
            {`// 基础使用
import Markdown from 'components/Markdown'

const content = \`# 标题
这是一段文本内容。
\`

function MyComponent() {
  return <Markdown>{content}</Markdown>
}

// 带引用的使用
import { useRef } from 'react'

function MyComponent() {
  const markdownRef = useRef<HTMLDivElement>(null)
  
  return (
    <Markdown ref={markdownRef}>
      {\`# 带引用的示例
      
      可以通过 ref 访问容器元素。\`}
    </Markdown>
  )
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default MarkdownDemo
