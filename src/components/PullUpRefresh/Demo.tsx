import React, { useState } from 'react'
import styled from 'styled-components'
import PullUpRefresh from './index'
import { vm } from 'pages/helper'

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
  height: ${vm(400)};
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: ${vm(8)};
  margin-bottom: ${vm(20)};
  overflow: hidden;
`

const ListItem = styled.div<{ $index: number }>`
  padding: ${vm(20)};
  background: ${({ theme }) => theme.bgL1};
  border-radius: ${vm(8)};
  margin: ${vm(10)} ${vm(15)};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${vm(4)};
    background: ${({ theme, $index }) => {
      const colors = [theme.brand6, theme.jade10, theme.ruby50, theme.brand6, theme.brand6]
      return colors[$index % colors.length]
    }};
    border-radius: ${vm(4)} 0 0 ${vm(4)};
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${vm(8)};
  }

  .item-title {
    font-weight: 600;
    font-size: ${vm(16)};
    color: ${({ theme }) => theme.textL1};
  }

  .item-id {
    font-size: ${vm(12)};
    color: ${({ theme }) => theme.textL4};
    font-family: monospace;
  }

  .item-content {
    font-size: ${vm(14)};
    color: ${({ theme }) => theme.textL3};
    line-height: 1.5;
    margin-bottom: ${vm(10)};
  }

  .item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .item-time {
    font-size: ${vm(12)};
    color: ${({ theme }) => theme.textL4};
  }

  .item-type {
    padding: ${vm(4)} ${vm(8)};
    background: ${({ theme }) => theme.bgL2};
    border-radius: ${vm(12)};
    font-size: ${vm(10)};
    color: ${({ theme }) => theme.textL3};
  }
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

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

const PullUpRefreshDemo = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [disabledPull, setDisabledPull] = useState(false)
  const [loadCount, setLoadCount] = useState(0)
  const [listData, setListData] = useState([
    { id: 1, title: '初始数据 #1', content: '这是预加载的内容，向上滑动加载更多数据', time: '1小时前', type: '系统' },
    { id: 2, title: '初始数据 #2', content: '演示上拉加载更多功能的示例内容', time: '2小时前', type: '通知' },
    { id: 3, title: '初始数据 #3', content: '当滚动到底部时继续向上滑动触发加载', time: '3小时前', type: '消息' },
    { id: 4, title: '初始数据 #4', content: '支持阻尼效果和流畅的加载动画', time: '4小时前', type: '提醒' },
    { id: 5, title: '初始数据 #5', content: '可以通过 disabledPull 属性禁用加载功能', time: '5小时前', type: '更新' },
  ])

  // 模拟加载更多数据
  const handleLoadMore = () => {
    setTimeout(() => {
      const newItems = Array.from({ length: 3 }, (_, index) => ({
        id: Date.now() + index,
        title: `新加载数据 #${loadCount * 3 + index + 1}`,
        content: `这是第 ${loadCount + 1} 次上拉加载获取的新内容`,
        time: '刚刚',
        type: ['系统', '通知', '消息', '提醒', '更新'][Math.floor(Math.random() * 5)],
      }))
      setListData([...listData, ...newItems])
      setLoadCount(loadCount + 1)
      setIsRefreshing(false)
    }, 2000) // 模拟网络请求延迟
  }

  // 清空列表
  const clearList = () => {
    setListData([])
    setLoadCount(0)
  }

  // 重置列表
  const resetList = () => {
    setListData([
      { id: 1, title: '初始数据 #1', content: '这是预加载的内容，向上滑动加载更多数据', time: '1小时前', type: '系统' },
      { id: 2, title: '初始数据 #2', content: '演示上拉加载更多功能的示例内容', time: '2小时前', type: '通知' },
      { id: 3, title: '初始数据 #3', content: '当滚动到底部时继续向上滑动触发加载', time: '3小时前', type: '消息' },
      { id: 4, title: '初始数据 #4', content: '支持阻尼效果和流畅的加载动画', time: '4小时前', type: '提醒' },
      { id: 5, title: '初始数据 #5', content: '可以通过 disabledPull 属性禁用加载功能', time: '5小时前', type: '更新' },
    ])
    setLoadCount(0)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>PullUpRefresh 上拉加载组件</h2>
        <p>
          专为移动端设计的上拉加载更多组件，当用户滚动到底部并继续向上拖拽时，
          触发加载更多数据的功能，提供流畅的无限滚动体验。
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
            <span className='label'>使用说明:</span>
            <span className='value'>滚动到底部后继续向上拖拽</span>
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
          <ControlButton
            $active={isRefreshing}
            onClick={() => setIsRefreshing(true)}
            disabled={isRefreshing || disabledPull}
          >
            手动加载
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>交互演示</h3>
        <p>
          📱 在移动设备上：滚动到列表底部，然后继续向上拖拽触发加载
          <br />
          🖥️ 在桌面设备上：可以通过"手动加载"按钮模拟加载效果
        </p>

        <DemoArea onTouchMove={(e) => e.stopPropagation()}>
          <PullUpRefresh
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
            onRefresh={handleLoadMore}
            disabledPull={disabledPull}
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
              <strong>智能触发</strong>：只有滚动到底部时才响应上拉手势
            </li>
            <li>
              <strong>阻尼效果</strong>：提供自然的拖拽手感和视觉反馈
            </li>
            <li>
              <strong>状态提示</strong>：显示"加载中"和"上拉加载更多"状态
            </li>
            <li>
              <strong>可禁用</strong>：支持动态禁用上拉加载功能
            </li>
            <li>
              <strong>无限滚动</strong>：实现流畅的无限列表加载体验
            </li>
            <li>
              <strong>滚动兼容</strong>：与现有滚动容器完美兼容
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import PullUpRefresh from 'components/PullUpRefresh'

const [isRefreshing, setIsRefreshing] = useState(false)
const [disabledPull, setDisabledPull] = useState(false)

const handleLoadMore = () => {
  // 模拟网络请求
  setTimeout(() => {
    // 加载更多数据
    loadMoreData()
    setIsRefreshing(false)
  }, 2000)
}

<PullUpRefresh
  isRefreshing={isRefreshing}
  setIsRefreshing={setIsRefreshing}
  onRefresh={handleLoadMore}
  disabledPull={disabledPull}
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
            ['children', 'ReactNode', '-', '内容区域（必填）'],
            ['isRefreshing', 'boolean', '-', '是否正在加载（必填）'],
            ['setIsRefreshing', 'Function', '-', '设置加载状态（必填）'],
            ['onRefresh', 'Function', '-', '加载更多回调函数（必填）'],
            ['disabledPull', 'boolean', '-', '是否禁用上拉加载（必填）'],
            ['onScroll', 'Function', '-', '滚动事件处理函数'],
            ['extraHeight', 'number', '0', '额外的高度调整值'],
            ['childrenWrapperClassName', 'string', '-', '子容器的自定义类名'],
            ['randomUpdate', 'any', '-', '触发组件更新的随机值'],
          ].map(([prop, type, defaultVal, desc], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: vm(15),
                padding: `${vm(10)} 0`,
                borderBottom: index < 8 ? '1px solid rgba(255,255,255,0.05)' : 'none',
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
    </DemoContainer>
  )
}

export default PullUpRefreshDemo
