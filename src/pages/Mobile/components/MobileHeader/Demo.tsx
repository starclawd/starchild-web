import React, { useState } from 'react'
import styled from 'styled-components'
import MobileHeader from './index'
import { vm } from 'pages/helper'
import { IconBase } from 'components/Icons'

const DemoContainer = styled.div`
  padding: ${vm(20)};
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: ${vm(20)};
    font-size: ${vm(24)};
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: ${vm(15)};
    font-size: ${vm(18)};
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: ${vm(15)};
    line-height: 1.6;
    font-size: ${vm(14)};
  }
`

const DemoSection = styled.div`
  margin-bottom: ${vm(40)};

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: ${vm(20)};
    font-size: ${vm(24)};
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: ${vm(15)};
    font-size: ${vm(18)};
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: ${vm(15)};
    line-height: 1.6;
    font-size: ${vm(14)};
  }
`

const DemoArea = styled.div`
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: ${vm(8)};
  margin-bottom: ${vm(20)};
  overflow: hidden;
`

const DemoItem = styled.div`
  margin-bottom: ${vm(15)};
  
  &:last-child {
    margin-bottom: 0;
  }
`

const DemoLabel = styled.div`
  font-size: ${vm(14)};
  color: ${({ theme }) => theme.textL2};
  margin-bottom: ${vm(8)};
  font-weight: 500;
`

const ControlsArea = styled.div`
  display: flex;
  gap: ${vm(12)};
  margin-bottom: ${vm(20)};
  flex-wrap: wrap;
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: ${vm(8)} ${vm(16)};
  background: ${({ theme, $active }) => ($active ? theme.brand6 : theme.bgL1)};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.textL1)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.brand6 : theme.lineDark8)};
  border-radius: ${vm(6)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${vm(14)};

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.brand6 : theme.bgL2)};
    border-color: ${({ theme }) => theme.brand6};
  }
`

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: ${vm(6)};
  padding: ${vm(16)};
  margin: ${vm(16)} 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: ${vm(13)};
  line-height: 1.4;
  color: #f8f8f2;
`

const StatusBar = styled.div`
  padding: ${vm(15)};
  background: ${({ theme }) => theme.bgL2};
  border-radius: ${vm(8)};
  margin-bottom: ${vm(20)};

  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${vm(8)};
    font-size: ${vm(14)};

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

const RightActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${vm(32)};
  height: ${vm(32)};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: ${vm(6)};
  cursor: pointer;
  transition: all 0.2s ease;
  
  .icon {
    font-size: ${vm(18)};
    color: ${({ theme }) => theme.textL2};
  }

  &:hover {
    background: ${({ theme }) => theme.bgL2};
    border-color: ${({ theme }) => theme.brand6};
    
    .icon {
      color: ${({ theme }) => theme.brand6};
    }
  }
`

const MultiActionWrapper = styled.div`
  display: flex;
  gap: ${vm(8)};
  align-items: center;
`

type DemoType = 'basic' | 'withAction' | 'multiActions' | 'longTitle'

const MobileHeaderDemo = () => {
  const [currentDemo, setCurrentDemo] = useState<DemoType>('basic')

  const demoConfigs = {
    basic: {
      title: '基础标题',
      rightSection: null,
      description: '最简单的移动端头部，只包含标题和菜单按钮'
    },
    withAction: {
      title: '带操作按钮',
      rightSection: (
        <RightActionButton>
          <IconBase className="icon icon-more" />
        </RightActionButton>
      ),
      description: '头部右侧包含一个操作按钮'
    },
    multiActions: {
      title: '多个操作',
      rightSection: (
        <MultiActionWrapper>
          <RightActionButton>
            <IconBase className="icon icon-search" />
          </RightActionButton>
          <RightActionButton>
            <IconBase className="icon icon-more" />
          </RightActionButton>
        </MultiActionWrapper>
      ),
      description: '头部右侧包含多个操作按钮'
    },
    longTitle: {
      title: '这是一个非常长的标题用来测试文本溢出处理',
      rightSection: (
        <RightActionButton>
          <IconBase className="icon icon-share" />
        </RightActionButton>
      ),
      description: '测试长标题的显示效果'
    }
  }

  const currentConfig = demoConfigs[currentDemo]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>MobileHeader 移动端头部组件</h2>
        <p>
          专为移动端设计的头部组件，提供标题显示、左侧菜单按钮和右侧操作区域。
          支持灵活的自定义内容和响应式设计。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>当前配置</h3>
        <StatusBar>
          <div className='status-item'>
            <span className='label'>演示类型:</span>
            <span className='value'>{currentDemo}</span>
          </div>
          <div className='status-item'>
            <span className='label'>标题:</span>
            <span className='value'>{currentConfig.title}</span>
          </div>
          <div className='status-item'>
            <span className='label'>右侧操作:</span>
            <span className='value'>{currentConfig.rightSection ? '有' : '无'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>描述:</span>
            <span className='value'>{currentConfig.description}</span>
          </div>
        </StatusBar>
      </DemoSection>

      <DemoSection>
        <h3>切换演示</h3>
        <ControlsArea>
          <ControlButton 
            $active={currentDemo === 'basic'} 
            onClick={() => setCurrentDemo('basic')}
          >
            基础模式
          </ControlButton>
          <ControlButton 
            $active={currentDemo === 'withAction'} 
            onClick={() => setCurrentDemo('withAction')}
          >
            带操作按钮
          </ControlButton>
          <ControlButton 
            $active={currentDemo === 'multiActions'} 
            onClick={() => setCurrentDemo('multiActions')}
          >
            多个操作
          </ControlButton>
          <ControlButton 
            $active={currentDemo === 'longTitle'} 
            onClick={() => setCurrentDemo('longTitle')}
          >
            长标题测试
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>交互演示</h3>
        <DemoArea>
          <MobileHeader 
            title={currentConfig.title}
            rightSection={currentConfig.rightSection}
          />
        </DemoArea>
        <p style={{ fontSize: vm(12), color: '#999', marginTop: vm(10) }}>
          💡 点击左侧菜单按钮可以打开/关闭菜单，右侧按钮可以触发对应操作
        </p>
      </DemoSection>

      <DemoSection>
        <h3>组件特性</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: vm(20),
            borderRadius: vm(8),
            marginBottom: vm(20),
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: vm(20),
              lineHeight: 1.6,
              fontSize: vm(14),
            }}
          >
            <li>
              <strong>响应式设计</strong>：适配各种移动设备尺寸
            </li>
            <li>
              <strong>灵活布局</strong>：左侧菜单、中间标题、右侧操作区域
            </li>
            <li>
              <strong>自定义内容</strong>：支持自定义标题和右侧操作按钮
            </li>
            <li>
              <strong>主题适配</strong>：自动适配明暗主题
            </li>
            <li>
              <strong>移动优化</strong>：专为移动端触摸操作优化
            </li>
            <li>
              <strong>国际化支持</strong>：支持多语言文本显示
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import MobileHeader from 'pages/Mobile/components/MobileHeader'

// 基础用法
<MobileHeader title="页面标题" />

// 带右侧操作按钮
<MobileHeader 
  title="页面标题"
  rightSection={
    <button>
      <IconBase className="icon-more" />
    </button>
  }
/>

// 多个操作按钮
<MobileHeader 
  title="页面标题"
  rightSection={
    <div style={{ display: 'flex', gap: '8px' }}>
      <button><IconBase className="icon-search" /></button>
      <button><IconBase className="icon-more" /></button>
    </div>
  }
/>

// 自定义标题内容
<MobileHeader 
  title={
    <div>
      <span>主标题</span>
      <small>副标题</small>
    </div>
  }
/>`}</CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>Props 参数</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: vm(20),
            borderRadius: vm(8),
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 2fr',
              gap: vm(15),
              marginBottom: vm(15),
              fontWeight: 'bold',
              fontSize: vm(14),
              paddingBottom: vm(10),
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </div>

          {[
            ['title', 'React.ReactNode', '-', '标题内容（必填）'],
            ['rightSection', 'React.ReactNode', '-', '右侧操作区域内容（可选）'],
          ].map(([prop, type, defaultVal, desc], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: vm(15),
                padding: `${vm(10)} 0`,
                borderBottom: index < 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                fontSize: vm(13),
              }}
            >
              <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{prop}</div>
              <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
              <div>{desc}</div>
            </div>
          ))}
        </div>
      </DemoSection>

      <DemoSection>
        <h3>样式定制</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: vm(20),
            borderRadius: vm(8),
            marginBottom: vm(20),
          }}
        >
          <p style={{ marginBottom: vm(15) }}>组件使用 styled-components 构建，支持主题定制：</p>
          <ul
            style={{
              margin: 0,
              paddingLeft: vm(20),
              lineHeight: 1.6,
              fontSize: vm(14),
            }}
          >
            <li>
              <strong>高度</strong>：${vm(44)} - 适合移动端的触摸操作
            </li>
            <li>
              <strong>内边距</strong>：水平 ${vm(12)} - 提供适当的边距
            </li>
            <li>
              <strong>字体</strong>：16px/500 - 清晰易读的标题字体
            </li>
            <li>
              <strong>颜色</strong>：theme.textDark98 - 主题色彩适配
            </li>
            <li>
              <strong>布局</strong>：flex + absolute 定位 - 响应式布局
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>最佳实践</h3>
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            padding: vm(20),
            borderRadius: vm(8),
          }}
        >
          <ul
            style={{
              margin: 0,
              paddingLeft: vm(20),
              lineHeight: 1.6,
              fontSize: vm(14),
            }}
          >
            <li>
              <strong>标题长度</strong>：建议标题长度控制在 10-15 个字符内
            </li>
            <li>
              <strong>操作按钮</strong>：右侧操作按钮数量建议不超过 3 个
            </li>
            <li>
              <strong>触摸区域</strong>：确保按钮触摸区域不小于 44px
            </li>
            <li>
              <strong>视觉层级</strong>：标题使用中等字重，操作按钮使用图标
            </li>
            <li>
              <strong>状态反馈</strong>：为操作按钮添加 hover 和 active 状态
            </li>
          </ul>
        </div>
      </DemoSection>
    </DemoContainer>
  )
}

export default MobileHeaderDemo