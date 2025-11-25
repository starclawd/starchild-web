import React from 'react'
import styled from 'styled-components'
import NetworkIcon, { getNetworkName } from './index'

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
`

const DemoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;

  .icon-container {
    min-width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .demo-info {
    flex: 1;

    .label {
      font-weight: 600;
      color: ${({ theme }) => theme.textL1};
      margin-bottom: 5px;
    }

    .description {
      color: ${({ theme }) => theme.textL3};
      font-size: 14px;
    }
  }
`

const IconGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`

const IconShowcase = styled.div`
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
  text-align: center;

  .network-name {
    font-weight: 600;
    color: ${({ theme }) => theme.textL1};
    margin-top: 10px;
  }

  .network-id {
    font-size: 12px;
    color: ${({ theme }) => theme.textL3};
  }
`

const OverlappedDemo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL2};
  border-radius: 8px;
`

const NetworkIconDemo = () => {
  const supportedNetworks = [
    { id: '1', name: 'Ethereum' },
    { id: '8453', name: 'Base' },
    { id: '42161', name: 'Arbitrum' },
    { id: '137', name: 'Polygon' },
    { id: '10', name: 'Optimism' },
    { id: '56', name: 'BSC' },
    { id: 'solana', name: 'Solana' },
  ]

  return (
    <DemoContainer>
      <DemoSection>
        <h2>NetworkIcon 网络图标组件演示</h2>
        <p>通用的网络图标组件，显示各区块链网络的官方图标，适用于钱包连接、表格展示等场景。</p>
      </DemoSection>

      <DemoSection>
        <h3>基础用法</h3>
        <p>显示网络的官方图标，支持自定义尺寸和重叠显示</p>

        <DemoRow>
          <div className='icon-container'>
            <NetworkIcon networkId='1' size={24} />
          </div>
          <div className='demo-info'>
            <div className='label'>网络图标</div>
            <div className='description'>显示网络的官方图标，自动适配不同的区块链网络</div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>支持的网络</h3>
        <p>展示所有支持的网络及其对应的图标</p>

        <IconGrid>
          {supportedNetworks.map((network) => (
            <IconShowcase key={network.id}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <NetworkIcon networkId={network.id} size={32} />
              </div>
              <div className='network-name'>{getNetworkName(network.id)}</div>
              <div className='network-id'>ID: {network.id}</div>
            </IconShowcase>
          ))}
        </IconGrid>
      </DemoSection>

      <DemoSection>
        <h3>重叠显示</h3>
        <p>表格中多网络的重叠显示效果，适用于显示支持多链的 Vault</p>

        <OverlappedDemo>
          <div>多网络重叠显示：</div>
          <div style={{ display: 'flex' }}>
            {['1', '8453', '42161'].map((networkId) => (
              <NetworkIcon key={networkId} networkId={networkId} size={20} overlapped={true} />
            ))}
          </div>
          <div>+2</div>
        </OverlappedDemo>
      </DemoSection>

      <DemoSection>
        <h3>不同尺寸</h3>
        <p>支持自定义尺寸，适应不同场景需求</p>

        <DemoRow>
          <div className='icon-container' style={{ gap: '10px' }}>
            <NetworkIcon networkId='1' size={16} />
            <NetworkIcon networkId='1' size={20} />
            <NetworkIcon networkId='1' size={24} />
            <NetworkIcon networkId='1' size={32} />
          </div>
          <div className='demo-info'>
            <div className='label'>不同尺寸</div>
            <div className='description'>16px, 20px, 24px, 32px</div>
          </div>
        </DemoRow>
      </DemoSection>

      <DemoSection>
        <h3>工具函数</h3>
        <p>组件提供了实用的工具函数</p>

        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <p>
            <strong>getNetworkName('1'):</strong> {getNetworkName('1')}
          </p>
          <p>
            <strong>getNetworkName('8453'):</strong> {getNetworkName('8453')}
          </p>
          <p>
            <strong>getNetworkName('42161'):</strong> {getNetworkName('42161')}
          </p>
          <p>
            <strong>getNetworkName('56'):</strong> {getNetworkName('56')}
          </p>
        </div>
      </DemoSection>

      <DemoSection>
        <h3>API 接口</h3>
        <div
          style={{
            padding: '20px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '8px',
            fontFamily: 'monospace',
            fontSize: '14px',
          }}
        >
          <div>interface NetworkIconProps &#123;</div>
          <div style={{ paddingLeft: '20px' }}>
            <div>networkId: string // 必需：网络ID</div>
            <div>size?: number // 可选：图标尺寸（默认20px）</div>
            <div>overlapped?: boolean // 可选：是否重叠显示（默认false）</div>
            <div>className?: string // 可选：自定义CSS类名</div>
            <div>style?: React.CSSProperties // 可选：自定义样式</div>
          </div>
          <div>&#125;</div>
        </div>
      </DemoSection>
    </DemoContainer>
  )
}

export default NetworkIconDemo
