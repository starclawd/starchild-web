import React from 'react'
import styled, { useTheme } from 'styled-components'
import Divider from './index'

const DemoContainer = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  color: ${({ theme }) => theme.textL1};
  min-height: 100vh;

  h2 {
    font-size: 24px;
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    margin-bottom: 20px;
  }

  h3 {
    font-size: 18px;
    font-weight: 500;
    color: ${({ theme }) => theme.textL2};
    margin-bottom: 15px;
  }
`

const DemoSection = styled.div`
  margin-bottom: 40px;
  background-color: ${({ theme }) => theme.bgL2};
  border-radius: 12px;
  padding: 20px;
`

const DemoRow = styled.div`
  .demo-info {
    .label {
      font-weight: 500;
      color: ${({ theme }) => theme.textL2};
      margin-bottom: 10px;
      font-size: 14px;
    }

    .description {
      color: ${({ theme }) => theme.textL3};
      font-size: 13px;
      margin-bottom: 15px;
    }
  }
`

const ContentBlock = styled.div`
  height: 60px;
  background-color: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.textL2};
  font-size: 14px;
  font-weight: 500;
`

export default function DividerDemo() {
  const theme = useTheme()

  return (
    <DemoContainer>
      <h2>Divider 组件演示</h2>

      <DemoSection>
        <h3>基础用法</h3>
        <DemoRow>
          <div className='demo-info'>
            <div className='label'>默认样式</div>
            <div className='description'>高度1px，上下padding 0px，左右padding 0px</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider />
        <ContentBlock>内容区域 2</ContentBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义高度</h3>
        <DemoRow>
          <div className='demo-info'>
            <div className='label'>2px 高度</div>
            <div className='description'>通过 height 属性设置分隔线高度</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider height={2} />
        <ContentBlock>内容区域 2</ContentBlock>

        <DemoRow style={{ marginTop: '30px' }}>
          <div className='demo-info'>
            <div className='label'>4px 高度</div>
            <div className='description'>更粗的分隔线</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider height={4} />
        <ContentBlock>内容区域 2</ContentBlock>
      </DemoSection>

      <DemoSection>
        <h3>垂直间距</h3>
        <DemoRow>
          <div className='demo-info'>
            <div className='label'>紧凑间距</div>
            <div className='description'>上下padding 20px，适合内容较密集的场景</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider paddingVertical={20} />
        <ContentBlock>内容区域 2</ContentBlock>

        <DemoRow style={{ marginTop: '30px' }}>
          <div className='demo-info'>
            <div className='label'>宽松间距</div>
            <div className='description'>上下padding 60px，适合模块之间的分隔</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider paddingVertical={60} />
        <ContentBlock>内容区域 2</ContentBlock>
      </DemoSection>

      <DemoSection>
        <h3>水平间距</h3>
        <DemoRow>
          <div className='demo-info'>
            <div className='label'>两侧留白</div>
            <div className='description'>左右padding 20px，分隔线不贴边</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider paddingHorizontal={20} />
        <ContentBlock>内容区域 2</ContentBlock>

        <DemoRow style={{ marginTop: '30px' }}>
          <div className='demo-info'>
            <div className='label'>更大留白</div>
            <div className='description'>左右padding 40px，视觉上更居中</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider paddingHorizontal={40} />
        <ContentBlock>内容区域 2</ContentBlock>
      </DemoSection>

      <DemoSection>
        <h3>自定义颜色</h3>
        <DemoRow>
          <div className='demo-info'>
            <div className='label'>使用主题颜色</div>
            <div className='description'>使用主题中的 brand6 颜色</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider color={theme.brand6} height={2} paddingVertical={20} />
        <ContentBlock>内容区域 2</ContentBlock>

        <DemoRow style={{ marginTop: '30px' }}>
          <div className='demo-info'>
            <div className='label'>透明度调整</div>
            <div className='description'>使用主题颜色并调整透明度</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider color={`${theme.textL3}50`} paddingVertical={20} />
        <ContentBlock>内容区域 2</ContentBlock>

        <DemoRow style={{ marginTop: '30px' }}>
          <div className='demo-info'>
            <div className='label'>自定义颜色</div>
            <div className='description'>传入任意颜色值，如 rgba</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider color='rgba(99, 102, 241, 0.3)' paddingVertical={20} />
        <ContentBlock>内容区域 2</ContentBlock>
      </DemoSection>

      <DemoSection>
        <h3>组合使用</h3>
        <DemoRow>
          <div className='demo-info'>
            <div className='label'>自定义组合</div>
            <div className='description'>高度3px，上下padding 30px，左右padding 24px</div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider height={3} paddingVertical={30} paddingHorizontal={24} />
        <ContentBlock>内容区域 2</ContentBlock>

        <DemoRow style={{ marginTop: '30px' }}>
          <div className='demo-info'>
            <div className='label'>字符串值</div>
            <div className='description'>
              支持传入CSS字符串：height="0.5px" paddingVertical="2rem" paddingHorizontal="10%"
            </div>
          </div>
        </DemoRow>
        <ContentBlock>内容区域 1</ContentBlock>
        <Divider height='0.5px' paddingVertical='2rem' paddingHorizontal='10%' />
        <ContentBlock>内容区域 2</ContentBlock>
      </DemoSection>
    </DemoContainer>
  )
}
