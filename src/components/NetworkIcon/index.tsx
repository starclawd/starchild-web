import { memo } from 'react'
import styled from 'styled-components'

// 导入网络图标
import arbitrumIcon from 'assets/chains/arbitrum-icon.png'
import baseIcon from 'assets/chains/base-icon.png'
import etherIcon from 'assets/chains/ether-icon.png'
import bnbIcon from 'assets/chains/bnb-icon.png'
import solanaIcon from 'assets/chains/solana-icon.png'

// 网络ID到图标的映射
export const getNetworkIcon = (networkId: string): string => {
  switch (networkId) {
    case '1':
      return etherIcon // Ethereum
    case '56':
      return bnbIcon // BNB Chain
    case '42161':
      return arbitrumIcon // Arbitrum
    case '8453':
      return baseIcon // Base
    case 'solana':
      return solanaIcon // Solana
    case '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp':
      return solanaIcon // Solana
    default:
      return etherIcon // 默认使用以太坊图标
  }
}

// 网络ID到名称的映射
export const getNetworkName = (networkId: string): string => {
  const networks: Record<string, string> = {
    '1': 'Ethereum',
    '8453': 'Base',
    '42161': 'Arbitrum',
    '137': 'Polygon',
    '10': 'Optimism',
    '56': 'BSC',
    '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp': 'Solana',
    solana: 'Solana',
  }
  return networks[networkId] || `Chain ${networkId}`
}

interface NetworkIconProps {
  networkId: string
  size?: number
  className?: string
  style?: React.CSSProperties
  overlapped?: boolean // 是否用于重叠显示（如表格中的多网络显示）
}

const IconContainer = styled.div<{
  $size: number
  $networkId: string
  $overlapped: boolean
}>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ $overlapped }) =>
    $overlapped &&
    `
    &:not(:first-child) {
      margin-left: -6px;
    }
  `}
`

const NetworkImage = styled.img<{ $size: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

const NetworkIcon = memo<NetworkIconProps>(({ networkId, size = 20, className, style, overlapped = false }) => {
  const iconSrc = getNetworkIcon(networkId)
  const networkName = getNetworkName(networkId)
  console.log('networkId', networkId, iconSrc, networkName)

  return (
    <IconContainer className={className} style={style} $size={size} $networkId={networkId} $overlapped={overlapped}>
      <NetworkImage $size={size} src={iconSrc} alt={`${networkName} Network`} />
    </IconContainer>
  )
})

NetworkIcon.displayName = 'NetworkIcon'

export default NetworkIcon
