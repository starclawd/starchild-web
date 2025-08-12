import React, { useState } from 'react'
import styled from 'styled-components'
import PullDownRefresh from './index'
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
  height: ${vm(300)};
  background: ${({ theme }) => theme.bgL0};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: ${vm(8)};
  margin-bottom: ${vm(20)};
  overflow: hidden;
`

const ListContainer = styled.div`
  padding: ${vm(20)};
  height: 100%;
  overflow-y: auto;
`

const ListItem = styled.div`
  padding: ${vm(15)} ${vm(20)};
  background: ${({ theme }) => theme.bgL1};
  border-radius: ${vm(8)};
  margin-bottom: ${vm(10)};
  border: 1px solid ${({ theme }) => theme.lineDark8};

  .item-title {
    font-weight: 600;
    font-size: ${vm(16)};
    color: ${({ theme }) => theme.textL1};
    margin-bottom: ${vm(5)};
  }

  .item-content {
    font-size: ${vm(14)};
    color: ${({ theme }) => theme.textL3};
    line-height: 1.4;
  }

  .item-time {
    font-size: ${vm(12)};
    color: ${({ theme }) => theme.textL4};
    margin-top: ${vm(8)};
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
  background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL1)};
  color: ${({ theme, $active }) => ($active ? 'white' : theme.textL1)};
  border: 1px solid ${({ theme, $active }) => ($active ? theme.brand100 : theme.lineDark8)};
  border-radius: ${vm(6)};
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: ${vm(14)};

  &:hover {
    background: ${({ theme, $active }) => ($active ? theme.brand100 : theme.bgL2)};
    border-color: ${({ theme }) => theme.brand100};
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

const PullDownRefreshDemo = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [listData, setListData] = useState([
    { id: 1, title: '消息通知', content: '您有新的系统通知，请及时查看', time: '2分钟前' },
    { id: 2, title: '交易提醒', content: 'BTC 价格达到预设警戒线', time: '5分钟前' },
    { id: 3, title: '行情分析', content: '市场出现异常波动，建议关注', time: '10分钟前' },
    { id: 4, title: '账户安全', content: '检测到异地登录，请确认账户安全', time: '15分钟前' },
    { id: 5, title: '投资建议', content: 'AI 分析建议：当前适合定投', time: '20分钟前' },
  ])
  const [refreshCount, setRefreshCount] = useState(0)

  // 模拟刷新数据
  const handleRefresh = () => {
    setTimeout(() => {
      const newItems = [
        { id: Date.now(), title: '最新消息', content: `刷新获取的新数据 #${refreshCount + 1}`, time: '刚刚' },
        { id: Date.now() + 1, title: '实时更新', content: '下拉刷新成功，数据已更新', time: '刚刚' },
      ]
      setListData([...newItems, ...listData])
      setRefreshCount(refreshCount + 1)
      setIsRefreshing(false)
    }, 1500) // 模拟网络请求延迟
  }

  // 清空列表
  const clearList = () => {
    setListData([])
  }

  // 重置列表
  const resetList = () => {
    setListData([
      { id: 1, title: '消息通知', content: '您有新的系统通知，请及时查看', time: '2分钟前' },
      { id: 2, title: '交易提醒', content: 'BTC 价格达到预设警戒线', time: '5分钟前' },
      { id: 3, title: '行情分析', content: '市场出现异常波动，建议关注', time: '10分钟前' },
      { id: 4, title: '账户安全', content: '检测到异地登录，请确认账户安全', time: '15分钟前' },
      { id: 5, title: '投资建议', content: 'AI 分析建议：当前适合定投', time: '20分钟前' },
    ])
    setRefreshCount(0)
  }

  return (
    <DemoContainer>
      <DemoSection>
        <h2>PullDownRefresh 下拉刷新组件</h2>
        <p>
          专为移动端设计的下拉刷新组件，支持自定义刷新动画、阻尼效果，
          提供流畅的用户体验。在移动设备上向下拖拽即可触发刷新。
        </p>
      </DemoSection>

      <DemoSection>
        <h3>使用状态</h3>
        <StatusBar>
          <div className='status-item'>
            <span className='label'>刷新状态:</span>
            <span className='value'>{isRefreshing ? '刷新中...' : '待机'}</span>
          </div>
          <div className='status-item'>
            <span className='label'>刷新次数:</span>
            <span className='value'>{refreshCount}</span>
          </div>
          <div className='status-item'>
            <span className='label'>列表项数:</span>
            <span className='value'>{listData.length}</span>
          </div>
          <div className='status-item'>
            <span className='label'>使用说明:</span>
            <span className='value'>在下方区域向下拖拽触发刷新</span>
          </div>
        </StatusBar>
      </DemoSection>

      <DemoSection>
        <h3>操作控制</h3>
        <ControlsArea>
          <ControlButton onClick={clearList}>清空列表</ControlButton>
          <ControlButton onClick={resetList}>重置列表</ControlButton>
          <ControlButton $active={isRefreshing} onClick={() => setIsRefreshing(true)} disabled={isRefreshing}>
            手动刷新
          </ControlButton>
        </ControlsArea>
      </DemoSection>

      <DemoSection>
        <h3>交互演示</h3>
        <p>
          📱 在移动设备上：向下拖拽列表区域即可触发下拉刷新
          <br />
          🖥️ 在桌面设备上：可以通过"手动刷新"按钮模拟刷新效果
        </p>

        <DemoArea onTouchMove={(e) => e.stopPropagation()}>
          <PullDownRefresh
            isRefreshing={isRefreshing}
            setIsRefreshing={setIsRefreshing}
            onRefresh={handleRefresh}
            pullDownAreaHeight='60px'
          >
            <ListContainer>
              {listData.length > 0 ? (
                listData.map((item) => (
                  <ListItem key={item.id}>
                    <div className='item-title'>{item.title}</div>
                    <div className='item-content'>{item.content}</div>
                    <div className='item-time'>{item.time}</div>
                  </ListItem>
                ))
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: vm(40),
                    color: '#999',
                    fontSize: vm(14),
                  }}
                >
                  📭 暂无数据，可以点击"重置列表"或下拉刷新获取数据
                </div>
              )}
            </ListContainer>
          </PullDownRefresh>
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
              <strong>触摸交互</strong>：响应移动端触摸手势，支持自然的下拉操作
            </li>
            <li>
              <strong>阻尼效果</strong>：提供物理阻尼感，增强用户体验
            </li>
            <li>
              <strong>旋转动画</strong>：刷新图标根据下拉距离旋转，刷新时无限旋转
            </li>
            <li>
              <strong>状态管理</strong>：完善的刷新状态控制和回调机制
            </li>
            <li>
              <strong>自定义高度</strong>：支持自定义下拉区域高度
            </li>
            <li>
              <strong>滚动兼容</strong>：与滚动容器完美兼容，支持指定滚动容器ID
            </li>
          </ul>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>代码示例</h3>
        <CodeBlock>{`import PullDownRefresh from 'components/PullDownRefresh'

const [isRefreshing, setIsRefreshing] = useState(false)

const handleRefresh = () => {
  // 模拟网络请求
  setTimeout(() => {
    // 更新数据
    updateData()
    setIsRefreshing(false)
  }, 1500)
}

<PullDownRefresh
  isRefreshing={isRefreshing}
  setIsRefreshing={setIsRefreshing}
  onRefresh={handleRefresh}
  pullDownAreaHeight="60px"
  scrollContainerId="#scroll-container"
>
  <div>
    {/* 你的内容 */}
    <div>可刷新的内容区域</div>
  </div>
</PullDownRefresh>`}</CodeBlock>
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
            ['isRefreshing', 'boolean', '-', '是否正在刷新（必填）'],
            ['setIsRefreshing', 'Function', '-', '设置刷新状态（必填）'],
            ['onRefresh', 'Function', '-', '刷新回调函数'],
            ['pullDownAreaHeight', 'string', "'50px'", '下拉区域高度'],
            ['scrollContainerId', 'string', '-', '滚动容器选择器'],
          ].map(([prop, type, defaultVal, desc], index) => (
            <div
              key={index}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 2fr',
                gap: vm(15),
                padding: `${vm(10)} 0`,
                borderBottom: index < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none',
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

export default PullDownRefreshDemo
