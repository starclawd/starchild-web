import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import PullUpRefresh from './index'
import { vm } from 'pages/helper'

const DemoContainer = styled.div`
  padding: 40px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 24px;
    font-size: 32px;
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 16px;
    font-size: 24px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 16px;
    line-height: 1.6;
    font-size: 16px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      max-width: 100%;
      margin: 0;

      h2 {
        margin-bottom: ${vm(20)};
        font-size: ${vm(24)};
      }

      h3 {
        margin-bottom: ${vm(15)};
        font-size: ${vm(18)};
      }

      p {
        margin-bottom: ${vm(15)};
        font-size: ${vm(14)};
      }
    `}
`

const DemoSection = styled.div`
  margin-bottom: 48px;

  h2 {
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 24px;
    font-size: 32px;
  }

  h3 {
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 16px;
    font-size: 24px;
  }

  p {
    color: ${({ theme }) => theme.textL3};
    margin-bottom: 16px;
    line-height: 1.6;
    font-size: 16px;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      margin-bottom: ${vm(40)};

      h2 {
        margin-bottom: ${vm(20)};
        font-size: ${vm(24)};
      }

      h3 {
        margin-bottom: ${vm(15)};
        font-size: ${vm(18)};
      }

      p {
        margin-bottom: ${vm(15)};
        font-size: ${vm(14)};
      }
    `}
`

const DemoArea = styled.div`
  height: 500px;
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(400)};
      border-radius: ${vm(8)};
      margin-bottom: ${vm(20)};
    `}
`

const ListItem = styled.div<{ $index: number }>`
  padding: 24px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 12px;
  margin: 12px 20px;
  border: 1px solid ${({ theme }) => theme.lineDark8};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 6px;
    background: ${({ theme, $index }) => {
      const colors = [theme.brand6, theme.jade10, theme.ruby50, theme.brand6, theme.brand6]
      return colors[$index % colors.length]
    }};
    border-radius: 6px 0 0 6px;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .item-title {
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
  }

  .item-id {
    font-size: 14px;
    color: ${({ theme }) => theme.textL4};
    font-family: monospace;
  }

  .item-content {
    font-size: 16px;
    color: ${({ theme }) => theme.textL3};
    line-height: 1.5;
    margin-bottom: 12px;
  }

  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-time {
    font-size: 14px;
    color: ${({ theme }) => theme.textL4};
  }

  .item-type {
    padding: 6px 12px;
    background: ${({ theme }) => theme.bgL2};
    border-radius: 16px;
    font-size: 12px;
    color: ${({ theme }) => theme.textL3};
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      border-radius: ${vm(8)};
      margin: ${vm(10)} ${vm(15)};

      &::before {
        width: ${vm(4)};
        border-radius: ${vm(4)} 0 0 ${vm(4)};
      }

      .item-header {
        margin-bottom: ${vm(8)};
      }

      .item-title {
        font-size: ${vm(16)};
      }

      .item-id {
        font-size: ${vm(12)};
      }

      .item-content {
        font-size: ${vm(14)};
        margin-bottom: ${vm(10)};
      }

      .item-time {
        font-size: ${vm(12)};
      }

      .item-type {
        padding: ${vm(4)} ${vm(8)};
        border-radius: ${vm(12)};
        font-size: ${vm(10)};
      }
    `}
`

const StatusBar = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 12px;
  margin-bottom: 24px;

  .status-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 16px;

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

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(15)};
      border-radius: ${vm(8)};
      margin-bottom: ${vm(20)};

      .status-item {
        margin-bottom: ${vm(8)};
        font-size: ${vm(14)};
      }
    `}
`

const ControlsArea = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      margin-bottom: ${vm(20)};
    `}
`

const ControlButton = styled.button<{ $active?: boolean }>`
  padding: 12px 20px;
  background: ${({ theme, $active }) => ($active ? theme.brand6 : theme.bgL1)};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.textL1)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.brand6 : theme.lineDark8)};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.brand6 : theme.bgL2)};
    border-color: ${({ theme }) => theme.brand6};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(16)};
      border-radius: ${vm(6)};
      font-size: ${vm(14)};
    `}
`

const CodeBlock = styled.pre`
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.4;
  color: #f8f8f2;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      border-radius: ${vm(6)};
      padding: ${vm(16)};
      margin: ${vm(16)} 0;
      font-size: ${vm(13)};
    `}
`

const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border-left: 4px solid ${({ theme }) => theme.brand6};

  .feature-title {
    font-weight: 600;
    font-size: 18px;
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 12px;
  }

  .feature-desc {
    font-size: 16px;
    color: ${({ theme }) => theme.textL3};
    line-height: 1.5;
  }

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      border-radius: ${vm(8)};
      margin-bottom: ${vm(20)};

      .feature-title {
        font-size: ${vm(16)};
        margin-bottom: ${vm(8)};
      }

      .feature-desc {
        font-size: ${vm(14)};
      }
    `}
`

const FeatureGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(15)};
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    `}
`

const PropsTableWrapper = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 32px;
  border-radius: 12px;
  margin-bottom: 32px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)};
      border-radius: ${vm(8)};
      margin-bottom: ${vm(20)};
    `}
`

const PropsTableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 24px;
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(15)};
      margin-bottom: ${vm(15)};
      font-size: ${vm(14)};
      padding-bottom: ${vm(10)};
    `}
`

const PropsTableRow = styled.div<{ $last?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr;
  gap: 24px;
  padding: 14px 0;
  border-bottom: ${({ $last }) => ($last ? 'none' : '1px solid rgba(255,255,255,0.05)')};
  font-size: 15px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(15)};
      padding: ${vm(10)} 0;
      font-size: ${vm(13)};
    `}
`

const PullUpRefreshDemo = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [disabledPull, setDisabledPull] = useState(false)
  const [enableWheel, setEnableWheel] = useState(true)
  const [wheelThreshold, setWheelThreshold] = useState(50)
  const [loadCount, setLoadCount] = useState(0)
  const [hasLoadMore, setHasLoadMore] = useState(true)
  const [listData, setListData] = useState([
    {
      id: 1,
      title: '初始数据 #1',
      content: '这是预加载的内容，支持移动端触摸和PC端滚轮操作',
      time: '1小时前',
      type: '系统',
    },
    {
      id: 2,
      title: '初始数据 #2',
      content: '演示上拉加载更多功能的示例内容，跨平台兼容',
      time: '2小时前',
      type: '通知',
    },
    { id: 3, title: '初始数据 #3', content: '当滚动到底部时继续向上滑动或滚轮触发加载', time: '3小时前', type: '消息' },
    {
      id: 4,
      title: '初始数据 #4',
      content: '支持阻尼效果和流畅的加载动画，PC端累积滚轮增量',
      time: '4小时前',
      type: '提醒',
    },
    {
      id: 5,
      title: '初始数据 #5',
      content: '可以通过 disabledPull 和 enableWheel 属性控制功能',
      time: '5小时前',
      type: '更新',
    },
  ])

  // 模拟加载更多数据
  const handleLoadMore = () => {
    setTimeout(() => {
      const newItems = Array.from({ length: 3 }, (_, index) => ({
        id: Date.now() + index,
        title: `新加载数据 #${loadCount * 3 + index + 1}`,
        content: `这是第 ${loadCount + 1} 次上拉加载获取的新内容，支持跨平台操作`,
        time: '刚刚',
        type: ['系统', '通知', '消息', '提醒', '更新'][Math.floor(Math.random() * 5)],
      }))
      setListData([...listData, ...newItems])
      setLoadCount(loadCount + 1)

      // 模拟数据加载完毕的情况（加载2次后）
      if (loadCount >= 2) {
        setHasLoadMore(false)
      }

      setIsRefreshing(false)
    }, 1000) // 模拟网络请求延迟
  }

  // 清空列表
  const clearList = () => {
    setListData([])
    setLoadCount(0)
    setHasLoadMore(true)
  }

  // 重置列表
  const resetList = () => {
    setListData([
      {
        id: 1,
        title: '初始数据 #1',
        content: '这是预加载的内容，支持移动端触摸和PC端滚轮操作',
        time: '1小时前',
        type: '系统',
      },
      {
        id: 2,
        title: '初始数据 #2',
        content: '演示上拉加载更多功能的示例内容，跨平台兼容',
        time: '2小时前',
        type: '通知',
      },
      {
        id: 3,
        title: '初始数据 #3',
        content: '当滚动到底部时继续向上滑动或滚轮触发加载',
        time: '3小时前',
        type: '消息',
      },
      {
        id: 4,
        title: '初始数据 #4',
        content: '支持阻尼效果和流畅的加载动画，PC端累积滚轮增量',
        time: '4小时前',
        type: '提醒',
      },
      {
        id: 5,
        title: '初始数据 #5',
        content: '可以通过 disabledPull 和 enableWheel 属性控制功能',
        time: '5小时前',
        type: '更新',
      },
    ])
    setLoadCount(0)
    setHasLoadMore(true)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>PullUpRefresh 上拉加载组件</h2>
        <p>
          跨平台的上拉加载更多组件，支持移动端触摸和PC端滚轮操作。
          当用户滚动到底部并继续向上拖拽或滚轮时，触发加载更多数据的功能，提供流畅的无限滚动体验。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>使用状态</h3>
        <StatusBar>
          <div className='status-item'>
            <span className='label'>加载状态:</span>
            <span className='value'>{isRefreshing ? '加载中...' : '待机'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>加载次数:</span>
            <span className='value'>{loadCount}</span>
          </div>
          <div className='status-item'>
            <span className='label'>列表项数:</span>
            <span className='value'>{listData.length}</span>
          </div>
          <div className='status-item'>
            <span className='label'>上拉功能:</span>
            <span className='value'>{disabledPull ? '已禁用' : '已启用'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>滚轮功能:</span>
            <span className='value'>{enableWheel ? '已启用' : '已禁用'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>滚轮阈值:</span>
            <span className='value'>{wheelThreshold}</span>
          </div>
          <div className='status-item'>
            <span className='label'>还有更多数据:</span>
            <span className='value'>{hasLoadMore ? '是' : '否'}</span>
          </div>
        </StatusBar>
      </DemoSection>

      <DemoSection>
        <h3>操作控制</h3>
        <ControlsArea>
          <ControlButton onClick={clearList}>清空列表</ControlButton>
          <ControlButton onClick={resetList}>重置列表</ControlButton>
          <ControlButton $active={disabledPull} onClick={() => setDisabledPull(!disabledPull)}>
            {disabledPull ? '启用上拉' : '禁用上拉'}
          </ControlButton>
          <ControlButton $active={enableWheel} onClick={() => setEnableWheel(!enableWheel)}>
            {enableWheel ? '禁用滚轮' : '启用滚轮'}
          </ControlButton>
          <ControlButton
            $active={isRefreshing}
            onClick={() => setIsRefreshing(true)}
            disabled={isRefreshing || disabledPull}
          >
            手动加载
          </ControlButton>
          <ControlButton $active={!hasLoadMore} onClick={() => setHasLoadMore(!hasLoadMore)}>
            {hasLoadMore ? '模拟无更多数据' : '恢复有更多数据'}
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>滚轮阈值设置</h3>
        <ControlsArea>
          <ControlButton
            onClick={() => setWheelThreshold(Math.max(10, wheelThreshold - 10))}
            disabled={wheelThreshold <= 10}
          >
            减少阈值 (-10)
          </ControlButton>
          <ControlButton onClick={() => setWheelThreshold(wheelThreshold + 10)}>增加阈值 (+10)</ControlButton>
          <ControlButton onClick={() => setWheelThreshold(50)}>重置阈值 (50)</ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>交互演示</h3>
        <p>
          📱 <strong>移动设备</strong>：滚动到列表底部，然后继续向上拖拽触发加载
          <br />
          🖥️ <strong>桌面设备</strong>：滚动到列表底部，然后继续向下滚轮触发加载（累积增量达到阈值）
          <br />
          🎮 <strong>通用操作</strong>：可以通过"手动加载"按钮模拟加载效果
        </p>

        <DemoArea onTouchMove={(e) => e.stopPropagation()}>
          <PullUpRefresh
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
            onRefresh={handleLoadMore}
            disabledPull={disabledPull}
            enableWheel={enableWheel}
            wheelThreshold={wheelThreshold}
            hasLoadMore={hasLoadMore}
          >
            {listData.length > 0 ? (
              listData.map((item, index) => (
                <ListItem key={item.id} $index={index}>
                  <div className='item-header'>
                    <div className='item-title'>{item.title}</div>
                    <div className='item-id'>ID: {item.id}</div>
                  </div>
                  <div className='item-content'>{item.content}</div>
                  <div className='item-footer'>
                    <div className='item-time'>{item.time}</div>
                    <div className='item-type'>{item.type}</div>
                  </div>
                </ListItem>
              ))
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: vm(60),
                  color: '#999',
                  fontSize: vm(14),
                }}
              >
                📭 暂无数据
                <br />
                可以点击"重置列表"获取初始数据
              </div>
            )}
          </PullUpRefresh>
        </DemoArea>
      </DemoSection>

      <DemoSection>
        <h3>功能特性</h3>
        <FeatureGrid>
          <FeatureCard>
            <div className='feature-title'>🔄 跨平台支持</div>
            <div className='feature-desc'>同时支持移动端触摸和PC端滚轮操作，提供统一的用户体验</div>
          </FeatureCard>

          <FeatureCard>
            <div className='feature-title'>📱 移动端触摸</div>
            <div className='feature-desc'>智能触发：只有滚动到底部时才响应上拉手势，提供阻尼效果和自然手感</div>
          </FeatureCard>

          <FeatureCard>
            <div className='feature-title'>🖥️ PC端滚轮</div>
            <div className='feature-desc'>累积滚轮增量：当滚动到底部时，累积滚轮增量达到阈值后触发加载</div>
          </FeatureCard>

          <FeatureCard>
            <div className='feature-title'>⚙️ 灵活配置</div>
            <div className='feature-desc'>支持独立控制触摸和滚轮功能，可自定义滚轮触发阈值</div>
          </FeatureCard>

          <FeatureCard>
            <div className='feature-title'>🎨 状态提示</div>
            <div className='feature-desc'>显示"加载中"和"上拉加载更多"状态，提供清晰的用户反馈</div>
          </FeatureCard>

          <FeatureCard>
            <div className='feature-title'>♾️ 无限滚动</div>
            <div className='feature-desc'>实现流畅的无限列表加载体验，与现有滚动容器完美兼容</div>
          </FeatureCard>
        </FeatureGrid>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import PullUpRefresh from 'components/PullUpRefresh'

const [isRefreshing, setIsRefreshing] = useState(false)
const [disabledPull, setDisabledPull] = useState(false)
const [enableWheel, setEnableWheel] = useState(true)
const [wheelThreshold, setWheelThreshold] = useState(50)
const [hasLoadMore, setHasLoadMore] = useState(true)

const handleLoadMore = () => {
  // 模拟网络请求
  setTimeout(() => {
    // 加载更多数据
    loadMoreData()
    
    // 检查是否还有更多数据
    if (noMoreData) {
      setHasLoadMore(false)
    }
    
    setIsRefreshing(false)
  }, 2000)
}

<PullUpRefresh
  isRefreshing={isRefreshing}
  setIsRefreshing={setIsRefreshing}
  onRefresh={handleLoadMore}
  disabledPull={disabledPull}
  enableWheel={enableWheel}
  wheelThreshold={wheelThreshold}
  hasLoadMore={hasLoadMore}
  extraHeight={0}
  childrenWrapperClassName="custom-list"
>
  {listData.map(item => (
    <div key={item.id}>
      {/* 列表项内容 */}
    </div>
  ))}
</PullUpRefresh>`}</CodeBlock>
      </DemoSection>

      <DemoSection>
        <h3>Props 参数</h3>
        <PropsTableWrapper>
          <PropsTableHeader>
            <div>属性</div>
            <div>类型</div>
            <div>默认值</div>
            <div>描述</div>
          </PropsTableHeader>
          {[
            ['children', 'ReactNode', '-', '内容区域（必填）'],
            ['isRefreshing', 'boolean', '-', '是否正在加载（必填）'],
            ['setIsRefreshing', 'Function', '-', '设置加载状态（必填）'],
            ['onRefresh', 'Function', '-', '加载更多回调函数（必填）'],
            ['disabledPull', 'boolean', '-', '是否禁用上拉加载（必填）'],
            ['hasLoadMore', 'boolean', 'false', '是否还有更多数据可以加载'],
            ['enableWheel', 'boolean', 'true', '是否启用PC端滚轮支持'],
            ['wheelThreshold', 'number', '50', 'PC端滚轮触发阈值'],
            ['onScroll', 'Function', '-', '滚动事件处理函数'],
            ['extraHeight', 'number', '0', '额外的高度调整值'],
            ['childrenWrapperClassName', 'string', '-', '子容器的自定义类名'],
            ['randomUpdate', 'any', '-', '触发组件更新的随机值'],
          ].map(([prop, type, defaultVal, desc], index, arr) => (
            <PropsTableRow key={index} $last={index === arr.length - 1}>
              <div style={{ fontFamily: 'monospace', fontWeight: 500 }}>{prop}</div>
              <div style={{ fontFamily: 'monospace', color: '#1890ff' }}>{type}</div>
              <div style={{ fontFamily: 'monospace', color: '#52c41a' }}>{defaultVal}</div>
              <div>{desc}</div>
            </PropsTableRow>
          ))}
        </PropsTableWrapper>
      </DemoSection>
    </DemoContainer>
  )
}

export default PullUpRefreshDemo
