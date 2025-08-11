import styled from 'styled-components'
import { memo, useState, useCallback } from 'react'
import { Skeleton, SkeletonAvatar, SkeletonText, SkeletonMultilineText, SkeletonImage } from './index'
import { useTheme } from 'styled-components'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;
  position: relative;

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

  h4 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 12px;
    font-size: 16px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 14px;
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

  h4 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 12px;
    font-size: 16px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 15px;
    line-height: 1.6;
    font-size: 14px;
  }
`

const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  margin-bottom: 20px;
`

const CardExample = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.lineDark8};
  margin-bottom: 20px;
`

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
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
  color: ${({ theme, $active }) => ($active ? 'white' : theme.textL1)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.brand100 : theme.lineDark8)};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL2)};
    border-color: ${({ theme }) => theme.brand100};
  }
`

const StatusBar = styled.div`
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  margin-bottom: 20px;

  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
    font-size: 14px;

    &:last-child {
      margin-bottom: 0;
    }

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

const GridLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`

const ListExample = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  padding: 16px;
`

const ListItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 6px;
`

const ListItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const FormExample = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  padding: 16px;
`

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TableExample = styled.div`
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  margin-bottom: 12px;
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 100px;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};

  &:last-child {
    border-bottom: none;
  }
`

export default memo(function SkeletonDemo() {
  const theme = useTheme()
  const [activeDemo, setActiveDemo] = useState('basic')

  const setDemo = useCallback((demo: string) => {
    setActiveDemo(demo)
  }, [])

  return (
    <DemoContainer>
      <DemoSection>
        <h2>Skeleton 骨架屏组件</h2>
        <p>
          用于在内容加载时显示占位符的骨架屏组件，提供流畅的加载体验。
          支持多种类型的骨架屏，包括基础矩形、圆形头像、文本和多行文本等， 并具有优雅的动画效果。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>基础类型</h3>
        <p>展示不同类型的骨架屏组件</p>

        <GridLayout>
          <SkeletonGroup>
            <h4>基础骨架屏</h4>
            <Skeleton width='100%' height='20px' />
            <Skeleton width='80%' height='16px' />
            <Skeleton width='60%' height='14px' />
          </SkeletonGroup>

          <SkeletonGroup>
            <h4>圆形骨架屏（头像）</h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <SkeletonAvatar size='40px' />
              <SkeletonAvatar size='60px' />
              <SkeletonAvatar size='80px' />
            </div>
          </SkeletonGroup>

          <SkeletonGroup>
            <h4>文本骨架屏</h4>
            <SkeletonText width='200px' height='16px' />
            <SkeletonText width='150px' height='14px' />
            <SkeletonText width='100px' height='12px' />
          </SkeletonGroup>

          <SkeletonGroup>
            <h4>多行文本骨架屏</h4>
            <SkeletonMultilineText lines={2} />
            <SkeletonMultilineText lines={3} />
          </SkeletonGroup>

          <SkeletonGroup>
            <h4>图片骨架屏</h4>
            <SkeletonImage width='200px' height='120px' />
            <SkeletonImage width='150px' height='150px' />
            <SkeletonImage width='100%' height='100px' />
          </SkeletonGroup>
        </GridLayout>
      </DemoSection>

      <DemoSection>
        <ControlsArea>
          <ControlButton $active={activeDemo === 'basic'} onClick={() => setDemo('basic')}>
            基础示例
          </ControlButton>
          <ControlButton $active={activeDemo === 'card'} onClick={() => setDemo('card')}>
            卡片示例
          </ControlButton>
          <ControlButton $active={activeDemo === 'list'} onClick={() => setDemo('list')}>
            列表示例
          </ControlButton>
          <ControlButton $active={activeDemo === 'form'} onClick={() => setDemo('form')}>
            表单示例
          </ControlButton>
          <ControlButton $active={activeDemo === 'table'} onClick={() => setDemo('table')}>
            表格示例
          </ControlButton>
          <ControlButton $active={activeDemo === 'image'} onClick={() => setDemo('image')}>
            图片示例
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>使用场景示例</h3>
        <p>在实际应用中的常见使用场景</p>

        {activeDemo === 'basic' && (
          <SkeletonGroup>
            <h4>基础内容加载</h4>
            <Skeleton width='100%' height='24px' />
            <Skeleton width='85%' height='18px' />
            <Skeleton width='70%' height='16px' />
          </SkeletonGroup>
        )}

        {activeDemo === 'card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <CardExample>
              <SkeletonAvatar size='60px' />
              <CardContent>
                <SkeletonText width='70%' height='20px' />
                <SkeletonMultilineText lines={3} />
                <CardBottom>
                  <SkeletonText width='80px' height='14px' />
                  <SkeletonText width='60px' height='14px' />
                </CardBottom>
              </CardContent>
            </CardExample>
            <CardExample>
              <SkeletonImage width='120px' height='80px' />
              <CardContent>
                <SkeletonText width='80%' height='18px' />
                <SkeletonMultilineText lines={2} />
                <CardBottom>
                  <SkeletonText width='90px' height='14px' />
                  <SkeletonText width='50px' height='14px' />
                </CardBottom>
              </CardContent>
            </CardExample>
          </div>
        )}

        {activeDemo === 'list' && (
          <ListExample>
            <h4>列表加载</h4>
            {Array.from({ length: 4 }).map((_, index) => (
              <ListItem key={index}>
                <SkeletonAvatar size='40px' />
                <ListItemContent>
                  <SkeletonText width='60%' height='16px' />
                  <SkeletonText width='40%' height='14px' />
                </ListItemContent>
                <SkeletonText width='80px' height='14px' />
              </ListItem>
            ))}
          </ListExample>
        )}

        {activeDemo === 'form' && (
          <FormExample>
            <h4>表单加载</h4>
            <FormRow>
              <SkeletonText width='80px' height='16px' />
              <Skeleton width='100%' height='40px' borderRadius='6px' />
            </FormRow>
            <FormRow>
              <SkeletonText width='100px' height='16px' />
              <Skeleton width='100%' height='40px' borderRadius='6px' />
            </FormRow>
            <FormRow>
              <SkeletonText width='60px' height='16px' />
              <Skeleton width='100%' height='80px' borderRadius='6px' />
            </FormRow>
          </FormExample>
        )}

        {activeDemo === 'table' && (
          <TableExample>
            <h3>表格骨架屏</h3>
            <TableHeader>
              <SkeletonText width='40px' height='16px' />
              <SkeletonText width='60px' height='16px' />
              <SkeletonText width='80px' height='16px' />
              <SkeletonText width='60px' height='16px' />
            </TableHeader>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <SkeletonAvatar size='32px' />
                <SkeletonText width='80%' height='14px' />
                <SkeletonText width='60%' height='14px' />
                <SkeletonText width='40%' height='14px' />
              </TableRow>
            ))}
          </TableExample>
        )}

        {activeDemo === 'image' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <SkeletonGroup>
              <h4>常规图片</h4>
              <SkeletonImage width='200px' height='120px' />
              <SkeletonImage width='180px' height='100px' />
            </SkeletonGroup>
            <SkeletonGroup>
              <h4>方形图片</h4>
              <SkeletonImage width='150px' height='150px' />
              <SkeletonImage width='120px' height='120px' />
            </SkeletonGroup>
            <SkeletonGroup>
              <h4>全宽图片</h4>
              <SkeletonImage width='100%' height='100px' />
              <SkeletonImage width='100%' height='80px' />
            </SkeletonGroup>
          </div>
        )}
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px',
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: '20px',
              lineHeight: 1.6,
              fontSize: '14px',
            }}
          >
            <li>
              <strong>多种类型</strong>：基础矩形、圆形头像、文本、多行文本、图片等类型
            </li>
            <li>
              <strong>流畅动画</strong>：优雅的渐变滚动动画效果
            </li>
            <li>
              <strong>响应式设计</strong>：自动适配移动端和桌面端
            </li>
            <li>
              <strong>灵活定制</strong>：支持自定义宽度、高度、圆角等属性
            </li>
            <li>
              <strong>性能优化</strong>：使用React.memo包装，避免不必要的重渲染
            </li>
            <li>
              <strong>主题适配</strong>：自动适配当前主题色彩
            </li>
            <li>
              <strong>组合灵活</strong>：可组合使用创建复杂的骨架屏布局
            </li>
            <li>
              <strong>加载体验</strong>：提供一致的加载占位符体验
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import { Skeleton, SkeletonAvatar, SkeletonText, SkeletonMultilineText, SkeletonImage } from 'components/Skeleton'

// 基础用法
const BasicExample = () => (
  <div>
    <Skeleton width="100%" height="20px" />
    <Skeleton width="80%" height="16px" />
    <Skeleton width="60%" height="14px" />
  </div>
)

// 头像骨架屏
const AvatarExample = () => (
  <div>
    <SkeletonAvatar size="40px" />
    <SkeletonAvatar size="60px" />
    <SkeletonAvatar size="80px" />
  </div>
)

// 文本骨架屏
const TextExample = () => (
  <div>
    <SkeletonText width="200px" height="16px" />
    <SkeletonText width="150px" height="14px" />
  </div>
)

// 多行文本骨架屏
const MultilineTextExample = () => (
  <div>
    <SkeletonMultilineText lines={2} />
    <SkeletonMultilineText lines={3} />
  </div>
)

// 图片骨架屏
const ImageExample = () => (
  <div>
    <SkeletonImage width="200px" height="120px" />
    <SkeletonImage width="150px" height="150px" />
    <SkeletonImage width="100%" height="100px" />
  </div>
)

// 卡片骨架屏
const CardExample = () => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <SkeletonAvatar size="60px" />
    <div style={{ flex: 1 }}>
      <SkeletonText width="70%" height="20px" />
      <SkeletonMultilineText lines={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SkeletonText width="80px" height="14px" />
        <SkeletonText width="60px" height="14px" />
      </div>
    </div>
  </div>
)

// 图片卡片骨架屏
const ImageCardExample = () => (
  <div style={{ display: 'flex', gap: '16px' }}>
    <SkeletonImage width="120px" height="80px" />
    <div style={{ flex: 1 }}>
      <SkeletonText width="80%" height="18px" />
      <SkeletonMultilineText lines={2} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SkeletonText width="90px" height="14px" />
        <SkeletonText width="50px" height="14px" />
      </div>
    </div>
  </div>
)

// 列表骨架屏
const ListExample = () => (
  <div>
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
        <SkeletonAvatar size="40px" />
        <div style={{ flex: 1 }}>
          <SkeletonText width="60%" height="16px" />
          <SkeletonText width="40%" height="14px" />
        </div>
        <SkeletonText width="80px" height="14px" />
      </div>
    ))}
  </div>
)`}</CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>组件参数</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <h4>Skeleton 参数</h4>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: '15px',
              marginBottom: '15px',
              fontWeight: 'bold',
              fontSize: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div>参数</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </div>

          {[
            ['width', 'string', '100%', '骨架屏宽度'],
            ['height', 'string', '20px', '骨架屏高度'],
            ['borderRadius', 'string', '4px', '圆角大小'],
            ['className', 'string', '-', '自定义类名'],
          ].map(([param, type, defaultVal, desc], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: '15px',
                padding: '10px 0',
                borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                fontSize: '13px',
              }}
            >
              <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
              <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>SkeletonAvatar 参数</h4>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: '15px',
                marginBottom: '15px',
                fontWeight: 'bold',
                fontSize: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div>参数</div>
              <div>类型</div>
              <div>默认值</div>
              <div>描述</div>
            </div>

            {[
              ['size', 'string', '40px', '头像大小（宽高相等）'],
              ['className', 'string', '-', '自定义类名'],
            ].map(([param, type, defaultVal, desc], index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 2fr',
                  gap: '15px',
                  padding: '10px 0',
                  borderBottom: index < 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
                <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
                <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
                <div>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>SkeletonText 参数</h4>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: '15px',
                marginBottom: '15px',
                fontWeight: 'bold',
                fontSize: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div>参数</div>
              <div>类型</div>
              <div>默认值</div>
              <div>描述</div>
            </div>

            {[
              ['width', 'string', '100%', '文本宽度'],
              ['height', 'string', '16px', '文本高度'],
              ['className', 'string', '-', '自定义类名'],
            ].map(([param, type, defaultVal, desc], index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 2fr',
                  gap: '15px',
                  padding: '10px 0',
                  borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
                <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
                <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
                <div>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>SkeletonMultilineText 参数</h4>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: '15px',
                marginBottom: '15px',
                fontWeight: 'bold',
                fontSize: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div>参数</div>
              <div>类型</div>
              <div>默认值</div>
              <div>描述</div>
            </div>

            {[
              ['lines', 'number', '2', '文本行数'],
              ['className', 'string', '-', '自定义类名'],
            ].map(([param, type, defaultVal, desc], index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 2fr',
                  gap: '15px',
                  padding: '10px 0',
                  borderBottom: index < 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
                <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
                <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
                <div>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: '20px' }}>
          <h4>SkeletonImage 参数</h4>
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: '15px',
                marginBottom: '15px',
                fontWeight: 'bold',
                fontSize: '14px',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <div>参数</div>
              <div>类型</div>
              <div>默认值</div>
              <div>描述</div>
            </div>

            {[
              ['width', 'string', '100%', '图片宽度'],
              ['height', 'string', '160px', '图片高度'],
              ['borderRadius', 'string', '12px', '圆角大小'],
              ['className', 'string', '-', '自定义类名'],
            ].map(([param, type, defaultVal, desc], index) => (
              <div
                key={index}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 2fr',
                  gap: '15px',
                  padding: '10px 0',
                  borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  fontSize: '13px',
                }}
              >
                <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{param}</div>
                <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
                <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
                <div>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>使用场景</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: '20px',
            borderRadius: '8px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 3fr',
              gap: '20px',
              fontSize: '14px',
              lineHeight: 1.6,
            }}
          >
            <div>
              <h4 style={{ marginTop: 0, marginBottom: '12px' }}>适用场景</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>页面初始化加载</li>
                <li>列表数据加载</li>
                <li>卡片内容加载</li>
                <li>表格数据加载</li>
                <li>表单字段加载</li>
                <li>用户头像加载</li>
                <li>文章内容加载</li>
                <li>图片占位显示</li>
                <li>媒体内容加载</li>
              </ul>
            </div>
            <div>
              <h4 style={{ marginTop: 0, marginBottom: '12px' }}>最佳实践</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li>保持骨架屏的形状和实际内容相似</li>
                <li>使用合适的动画速度，避免过快或过慢</li>
                <li>在数据加载完成后平滑过渡到实际内容</li>
                <li>避免骨架屏显示时间过长</li>
                <li>考虑不同设备的显示效果</li>
                <li>为重要内容区域优先显示骨架屏</li>
                <li>保持一致的视觉风格</li>
                <li>适当使用渐变和阴影增强视觉效果</li>
              </ul>
            </div>
          </div>
        </div>
      </DemoSection>
    </DemoContainer>
  )
})
