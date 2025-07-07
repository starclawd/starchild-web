import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import MemoizedHighlight from './index'

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

const DemoRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 30px;
  padding: 20px;
  background: ${({theme}) => theme.bgL2};
  border-radius: 8px;
  
  .highlight-container {
    width: 100%;
    padding: 20px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    position: relative;
    overflow: auto;
  }
  
  .demo-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
    
    .label {
      font-weight: 600;
      color: ${({theme}) => theme.textL1};
    }
    
    .description {
      color: ${({theme}) => theme.textL3};
      font-size: 14px;
    }
    
    .stats {
      display: flex;
      gap: 15px;
      font-size: 12px;
      color: ${({theme}) => theme.textL3};
      font-family: monospace;
    }
  }
`

const LanguageSelector = styled.div`
  display: flex;
  gap: 10px;
  margin: 15px 0;
  flex-wrap: wrap;
`

const LanguageButton = styled.button<{ $active?: boolean }>`
  padding: 6px 12px;
  background: ${({theme, $active}) => $active ? theme.brand6 : theme.textL4};
  color: ${({theme, $active}) => $active ? theme.textDark98 : theme.textL1};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({theme}) => theme.brand6};
    color: ${({theme}) => theme.textDark98};
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
    color: ${({theme}) => theme.textL1};
    font-size: 14px;
    padding-bottom: 5px;
    border-bottom: 1px solid ${({theme}) => theme.lineDark8};
  }
  
  .code-input {
    width: 100%;
    min-height: 200px;
    padding: 15px;
    background: ${({theme}) => theme.bgL0};
    border: 1px solid ${({theme}) => theme.lineDark8};
    border-radius: 8px;
    color: ${({theme}) => theme.textL1};
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 14px;
    line-height: 1.5;
    resize: vertical;
    
    &::placeholder {
      color: ${({theme}) => theme.textL4};
    }
    
    &:focus {
      outline: none;
      border-color: ${({theme}) => theme.brand6};
    }
  }
`

const PerformanceIndicator = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  background: ${({theme}) => theme.brand6}20;
  border-radius: 4px;
  font-size: 10px;
  color: ${({theme}) => theme.brand6};
  font-family: monospace;
`

const ResizeIndicator = styled.div<{ $isResizing: boolean }>`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 8px;
  background: ${({theme, $isResizing}) => $isResizing ? '#faad14' : '#52c41a'}20;
  border-radius: 4px;
  font-size: 10px;
  color: ${({theme, $isResizing}) => $isResizing ? '#faad14' : '#52c41a'};
  font-family: monospace;
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

const MemoizedHighlightDemo = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript')
  const [customCode, setCustomCode] = useState(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`)
  const [renderCount, setRenderCount] = useState(0)
  const [isResizing, setIsResizing] = useState(false)

  // 模拟窗口大小变化检测
  useEffect(() => {
    const handleResize = () => {
      setIsResizing(true)
      setTimeout(() => setIsResizing(false), 200)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 统计渲染次数
  useEffect(() => {
    setRenderCount(prev => prev + 1)
  }, [])

  const codeExamples = {
    javascript: `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log('Fibonacci of 10:', result);

// 使用 ES6 语法
const fibonacciArrow = (n) => 
  n <= 1 ? n : fibonacciArrow(n - 1) + fibonacciArrow(n - 2);`,

    python: `def fibonacci(n):
    """计算斐波那契数列"""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# 使用列表推导式
fib_sequence = [fibonacci(i) for i in range(10)]
print(f"前10个斐波那契数: {fib_sequence}")

# 使用生成器优化
def fib_generator():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b`,

    typescript: `interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user
    };
    this.users.push(newUser);
    return newUser;
  }

  findActiveUsers(): User[] {
    return this.users.filter(user => user.active);
  }
}

// 使用泛型
function createArray<T>(length: number, value: T): T[] {
  return Array(length).fill(value);
}`,

    css: `.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
}

.card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .card {
    margin: 1rem;
    padding: 1rem;
  }
}`,

    json: `{
  "name": "my-app",
  "version": "1.0.0",
  "description": "A sample application",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "test": "jest",
    "build": "webpack --mode production"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "styled-components": "^5.3.6"
  },
  "devDependencies": {
    "jest": "^29.0.0",
    "nodemon": "^2.0.20",
    "webpack": "^5.74.0"
  }
}`
  }

  const languages = Object.keys(codeExamples)

  return (
    <DemoContainer>
      <DemoSection>
        <h2>MemoizedHighlight 代码高亮组件示例</h2>
        <p>
          MemoizedHighlight 是一个优化的代码高亮组件，基于 react-highlight 构建。
          具有性能优化、防抖机制和主题适配功能，适合显示各种编程语言的代码。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>支持多种编程语言的语法高亮</p>
        
        <LanguageSelector>
          {languages.map(lang => (
            <LanguageButton
              key={lang}
              $active={selectedLanguage === lang}
              onClick={() => setSelectedLanguage(lang)}
            >
              {lang.toUpperCase()}
            </LanguageButton>
          ))}
        </LanguageSelector>
        
        <DemoRow>
          <div className="highlight-container">
            <PerformanceIndicator>
              渲染次数: {renderCount}
            </PerformanceIndicator>
            <ResizeIndicator $isResizing={isResizing}>
              {isResizing ? '重绘中...' : '正常'}
            </ResizeIndicator>
            <MemoizedHighlight className={selectedLanguage}>
              {codeExamples[selectedLanguage as keyof typeof codeExamples]}
            </MemoizedHighlight>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">多语言代码高亮</div>
              <div className="description">切换不同编程语言查看高亮效果</div>
            </div>
            <div className="stats">
              <span>当前语言: {selectedLanguage}</span>
              <span>字符数: {codeExamples[selectedLanguage as keyof typeof codeExamples].length}</span>
            </div>
          </div>
        </DemoRow>
        
        <CodeBlock>
{`import MemoizedHighlight from 'components/MemoizedHighlight'

const code = \`function hello() {
  console.log("Hello World!");
}\`

<MemoizedHighlight className="javascript">
  {code}
</MemoizedHighlight>`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>JavaScript 代码示例</h3>
        <p>展示 JavaScript 的完整语法高亮支持</p>
        
        <DemoRow>
          <div className="highlight-container">
            <MemoizedHighlight className="javascript">
              {codeExamples.javascript}
            </MemoizedHighlight>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">JavaScript 高亮</div>
              <div className="description">支持 ES6+ 语法、函数、变量等</div>
            </div>
            <div className="stats">
              <span>包含: 函数、箭头函数、模板字符串</span>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>TypeScript 代码示例</h3>
        <p>TypeScript 的类型注解和接口定义高亮</p>
        
        <DemoRow>
          <div className="highlight-container">
            <MemoizedHighlight className="typescript">
              {codeExamples.typescript}
            </MemoizedHighlight>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">TypeScript 高亮</div>
              <div className="description">支持接口、类、泛型、类型注解</div>
            </div>
            <div className="stats">
              <span>包含: interface、class、泛型</span>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>Python 代码示例</h3>
        <p>Python 语法高亮，包括注释和文档字符串</p>
        
        <DemoRow>
          <div className="highlight-container">
            <MemoizedHighlight className="python">
              {codeExamples.python}
            </MemoizedHighlight>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">Python 高亮</div>
              <div className="description">支持函数、生成器、列表推导式</div>
            </div>
            <div className="stats">
              <span>包含: 函数、生成器、f-string</span>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>CSS 样式代码</h3>
        <p>CSS 样式代码的语法高亮</p>
        
        <DemoRow>
          <div className="highlight-container">
            <MemoizedHighlight className="css">
              {codeExamples.css}
            </MemoizedHighlight>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">CSS 高亮</div>
              <div className="description">支持选择器、属性、媒体查询</div>
            </div>
            <div className="stats">
              <span>包含: flexbox、动画、媒体查询</span>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>JSON 数据格式</h3>
        <p>JSON 配置文件的语法高亮</p>
        
        <DemoRow>
          <div className="highlight-container">
            <MemoizedHighlight className="json">
              {codeExamples.json}
            </MemoizedHighlight>
          </div>
          <div className="demo-info">
            <div>
              <div className="label">JSON 高亮</div>
              <div className="description">支持对象、数组、字符串、数字</div>
            </div>
            <div className="stats">
              <span>类型: package.json 配置文件</span>
            </div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>实时编辑器</h3>
        <p>在左侧编辑代码，右侧实时预览高亮效果</p>
        
        <SplitView>
          <div className="input-side">
            <div className="side-label">代码输入</div>
            <textarea
              className="code-input"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="在这里输入代码..."
            />
          </div>
          <div className="output-side">
            <div className="side-label">高亮预览</div>
            <div className="highlight-container">
              <MemoizedHighlight className="javascript">
                {customCode}
              </MemoizedHighlight>
            </div>
          </div>
        </SplitView>
        
        <CodeBlock>
{`const [code, setCode] = useState('')

// 实时渲染代码高亮
<MemoizedHighlight className="javascript">
  {code}
</MemoizedHighlight>

// 组件会自动处理性能优化和防抖`}
        </CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>性能优化特性</h3>
        <p>组件具有多种性能优化特性</p>
        
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.05)', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>React.memo 优化</strong>：只有当代码内容或语言类型改变时才重新渲染</li>
            <li><strong>窗口大小变化防抖</strong>：窗口调整时暂时显示简化版本，避免卡顿</li>
            <li><strong>内存泄漏防护</strong>：正确清理定时器和事件监听器</li>
            <li><strong>高亮缓存</strong>：相同代码不会重复进行语法分析</li>
          </ul>
        </div>
        
        <CodeBlock>
{`// 组件内部的性能优化
export default memo(({ className, children }) => {
  // 窗口大小变化时的防抖处理
  const [isResizing, setIsResizing] = useState(false)
  
  return isResizing ? (
    // 简化版本，避免卡顿
    <pre><code>{children}</code></pre>
  ) : (
    // 完整高亮版本
    <Highlight className={className}>{children}</Highlight>
  )
}, (prevProps, nextProps) => {
  // 自定义比较函数，只有内容变化才重新渲染
  return prevProps.children === nextProps.children && 
         prevProps.className === nextProps.className
})`}
        </CodeBlock>
      </DemoSection>

      {/* Props 参数表格 */}
      <div style={{ marginTop: '40px' }}>
        <h2>Props 参数</h2>
        <p>
          MemoizedHighlight 组件支持的所有属性参数
        </p>
        
        <PropsTable>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          
          <PropsTableRow>
            <PropsTableCell type="prop">className</PropsTableCell>
            <PropsTableCell type="type">string</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">编程语言类型（必填）</PropsTableCell>
          </PropsTableRow>
          
          <PropsTableRow>
            <PropsTableCell type="prop">children</PropsTableCell>
            <PropsTableCell type="type">string</PropsTableCell>
            <PropsTableCell type="default">-</PropsTableCell>
            <PropsTableCell type="desc">要高亮显示的代码内容（必填）</PropsTableCell>
          </PropsTableRow>
        </PropsTable>
        
        <div style={{ marginTop: '20px' }}>
          <h3>支持的语言类型</h3>
          <CodeBlock>
{`// 常用编程语言
"javascript"    // JavaScript
"typescript"    // TypeScript  
"python"        // Python
"java"          // Java
"cpp"           // C++
"csharp"        // C#
"php"           // PHP
"ruby"          // Ruby
"go"            // Go
"rust"          // Rust

// 标记语言
"html"          // HTML
"css"           // CSS
"scss"          // SCSS/Sass
"xml"           // XML
"json"          // JSON
"yaml"          // YAML
"markdown"      // Markdown

// 配置文件
"bash"          // Shell脚本
"sql"           // SQL
"dockerfile"    // Dockerfile
"nginx"         // Nginx配置`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>接口定义</h3>
          <CodeBlock>
{`interface MemoizedHighlightProps {
  className: string;                          // 必填：编程语言类型
  children: string;                           // 必填：代码内容
}`}
          </CodeBlock>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>特性说明</h3>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.6' }}>
              <li><strong>性能优化</strong>：使用 React.memo 避免不必要的重新渲染</li>
              <li><strong>防抖机制</strong>：窗口大小变化时暂时显示简化版本</li>
              <li><strong>语法高亮</strong>：基于 highlight.js 提供丰富的语言支持</li>
              <li><strong>主题适配</strong>：自动适配暗色主题，与应用风格一致</li>
              <li><strong>移动优化</strong>：响应式字体大小，移动端友好</li>
              <li><strong>自动换行</strong>：长代码行自动处理，避免水平滚动</li>
              <li><strong>内存安全</strong>：正确处理定时器和事件监听器清理</li>
              <li><strong>样式重置</strong>：确保代码块样式不受外部影响</li>
            </ul>
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h3>使用示例</h3>
          <CodeBlock>
{`// 基础使用
import MemoizedHighlight from 'components/MemoizedHighlight'

const code = \`function hello() {
  console.log("Hello World!");
}\`

function CodeBlock() {
  return (
    <MemoizedHighlight className="javascript">
      {code}
    </MemoizedHighlight>
  )
}

// 动态代码高亮
function InteractiveCodeEditor() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  
  return (
    <div>
      <select onChange={(e) => setLanguage(e.target.value)}>
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="css">CSS</option>
      </select>
      
      <textarea 
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      
      <MemoizedHighlight className={language}>
        {code}
      </MemoizedHighlight>
    </div>
  )
}`}
          </CodeBlock>
        </div>
      </div>
    </DemoContainer>
  )
}

export default MemoizedHighlightDemo