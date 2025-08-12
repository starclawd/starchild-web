import React, { useState } from 'react'
import styled from 'styled-components'
import { vm } from 'pages/helper'
import PullDownRefreshDemo from 'components/PullDownRefresh/Demo'
import PullUpRefreshDemo from 'components/PullUpRefresh/Demo'
import ToastDemo from 'components/Toast/Demo'
import MobileHeaderDemo from 'pages/Mobile/components/MobileHeader/Demo'

const MobileDemoPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.bgL1};
  overflow: hidden;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${vm(16)} ${vm(20)};
  background: ${({ theme }) => theme.bgL2};
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  flex-shrink: 0;

  h1 {
    font-size: 0.2rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    margin: 0;
  }

  .subtitle {
    font-size: 0.12rem;
    color: ${({ theme }) => theme.textL3};
    margin-top: ${vm(4)};
  }
`

const TabBar = styled.div`
  display: flex;
  background: ${({ theme }) => theme.bgL2};
  border-bottom: 1px solid ${({ theme }) => theme.lineDark8};
  flex-shrink: 0;
  overflow-x: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`

const TabItem = styled.div<{ $active: boolean }>`
  flex-shrink: 0;
  padding: ${vm(12)} ${vm(20)};
  font-size: 0.14rem;
  font-weight: 500;
  color: ${({ theme, $active }) => ($active ? theme.brand100 : theme.textL2)};
  background: ${({ theme, $active }) => ($active ? `${theme.brand100}15` : 'transparent')};
  border-bottom: ${vm(2)} solid ${({ theme, $active }) => ($active ? theme.brand100 : 'transparent')};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    color: ${({ theme }) => theme.brand100};
    background: ${({ theme }) => `${theme.brand100}10`};
  }
`

const ContentArea = styled.div`
  height: 100%;
  flex: 1;
  overflow: hidden;
  position: relative;
`

const ComponentContent = styled.div<{ $show: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
  transform: translateX(${({ $show }) => ($show ? '0' : '20px')});
  overflow-y: auto;

  /* 移动端滚动优化 */
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
`

const WelcomeScreen = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100%;
  padding: ${vm(40)} ${vm(20)};
  text-align: center;

  .welcome-icon {
    font-size: 0.6rem;
    margin-bottom: ${vm(20)};
  }

  .welcome-title {
    font-size: 0.24rem;
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    margin-bottom: ${vm(12)};
  }

  .welcome-desc {
    font-size: 0.16rem;
    color: ${({ theme }) => theme.textL3};
    line-height: 1.6;
    margin-bottom: ${vm(30)};
  }

  .feature-list {
    text-align: left;
    max-width: ${vm(300)};

    .feature-item {
      display: flex;
      align-items: center;
      margin-bottom: ${vm(15)};
      font-size: 0.14rem;
      color: ${({ theme }) => theme.textL2};

      .feature-icon {
        margin-right: ${vm(12)};
        font-size: 0.16rem;
      }
    }
  }

  .start-button {
    padding: ${vm(12)} ${vm(24)};
    background: ${({ theme }) => theme.brand100};
    color: white;
    border: none;
    border-radius: ${vm(8)};
    font-size: 0.16rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: ${vm(20)};

    &:hover {
      background: ${({ theme }) => theme.brand100};
      transform: translateY(-${vm(1)});
    }

    &:active {
      transform: translateY(0);
    }
  }
`

const BackButton = styled.button`
  padding: ${vm(8)} ${vm(12)};
  background: transparent;
  color: ${({ theme }) => theme.textL2};
  border: 1px solid ${({ theme }) => theme.lineDark8};
  border-radius: ${vm(6)};
  font-size: 0.12rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.brand100};
    border-color: ${({ theme }) => theme.brand100};
  }
`

type ComponentType = 'welcome' | 'pullDownRefresh' | 'pullUpRefresh' | 'toast' | 'mobileHeader'

interface ComponentConfig {
  id: ComponentType
  name: string
  desc: string
  component: React.ComponentType
}

const components: ComponentConfig[] = [
  {
    id: 'mobileHeader',
    name: 'MobileHeader',
    desc: '移动端头部组件',
    component: MobileHeaderDemo,
  },
  {
    id: 'pullDownRefresh',
    name: 'PullDownRefresh',
    desc: '下拉刷新组件',
    component: PullDownRefreshDemo,
  },
  {
    id: 'pullUpRefresh',
    name: 'PullUpRefresh',
    desc: '上拉加载组件',
    component: PullUpRefreshDemo,
  },
  {
    id: 'toast',
    name: 'Toast',
    desc: '消息提示组件',
    component: ToastDemo,
  },
]

export default function MobileDemoPage() {
  const [activeComponent, setActiveComponent] = useState<ComponentType>('welcome')

  const currentComponent = components.find((c) => c.id === activeComponent)

  const handleTabClick = (componentId: ComponentType) => {
    setActiveComponent(componentId)
  }

  const handleBackToWelcome = () => {
    setActiveComponent('welcome')
  }

  return (
    <MobileDemoPageWrapper>
      <Header>
        <div>
          <h1>移动端组件库</h1>
          <div className='subtitle'>
            {activeComponent === 'welcome' ? 'Holomind Web Mobile Components' : currentComponent?.desc || '组件演示'}
          </div>
        </div>
        {activeComponent !== 'welcome' && <BackButton onClick={handleBackToWelcome}>返回首页</BackButton>}
      </Header>

      {activeComponent !== 'welcome' && (
        <TabBar>
          {components.map((component) => (
            <TabItem
              key={component.id}
              $active={activeComponent === component.id}
              onClick={() => handleTabClick(component.id)}
            >
              {component.name}
            </TabItem>
          ))}
        </TabBar>
      )}

      <ContentArea>
        {/* 欢迎页面 */}
        <ComponentContent $show={activeComponent === 'welcome'}>
          <WelcomeScreen>
            <div className='welcome-icon'>📱</div>
            <div className='welcome-title'>移动端组件演示</div>
            <div className='welcome-desc'>专为移动设备优化的交互组件集合，提供流畅的触摸体验和优雅的动画效果</div>

            <div className='feature-list'>
              <div className='feature-item'>
                <span className='feature-icon'>📱</span>
                移动端头部 - 响应式头部组件
              </div>
              <div className='feature-item'>
                <span className='feature-icon'>⬇️</span>
                下拉刷新 - 触摸拖拽刷新数据
              </div>
              <div className='feature-item'>
                <span className='feature-icon'>⬆️</span>
                上拉加载 - 无限滚动加载更多
              </div>
              <div className='feature-item'>
                <span className='feature-icon'>💬</span>
                消息提示 - 优雅的通知反馈
              </div>
            </div>

            <button className='start-button' onClick={() => setActiveComponent('mobileHeader')}>
              开始体验
            </button>
          </WelcomeScreen>
        </ComponentContent>

        {/* 组件演示页面 */}
        {components.map((component) => {
          const Component = component.component
          return (
            <ComponentContent key={component.id} $show={activeComponent === component.id}>
              <Component />
            </ComponentContent>
          )
        })}
      </ContentArea>
    </MobileDemoPageWrapper>
  )
}
