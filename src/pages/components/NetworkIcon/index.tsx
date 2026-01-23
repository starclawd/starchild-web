import { memo } from 'react'
import styled from 'styled-components'
import { getChainInfo } from 'constants/chainInfo'
import ethIcon from 'assets/chains/ether.png' // 默认图标
import { Trans } from '@lingui/react/macro'
import { ButtonCommon } from 'components/Button'

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
      margin-left: -8px;
    }
  `}
`

const NetworkImage = styled.img<{ $size: number }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`

const UnsupportedButton = styled(ButtonCommon)`
  font-size: 10px;
  background: ${({ theme }) => theme.brand100};
  width: fit-content;
  height: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
`

const NetworkIcon = memo<NetworkIconProps>(({ networkId, size = 20, className, style, overlapped = false }) => {
  const chainId = parseInt(networkId)
  const chainInfo = getChainInfo(chainId)

  if (chainInfo === undefined) {
    return (
      <UnsupportedButton>
        <Trans>Unsupported Chain</Trans>
      </UnsupportedButton>
    )
  }

  // 使用链信息或默认值
  const iconSrc = chainInfo?.icon || ethIcon
  const networkName = chainInfo?.name || `Chain ${networkId}`

  return (
    <IconContainer className={className} style={style} $size={size} $networkId={networkId} $overlapped={overlapped}>
      <NetworkImage $size={size} src={iconSrc} alt={`${networkName} Network`} />
    </IconContainer>
  )
})

NetworkIcon.displayName = 'NetworkIcon'

export default NetworkIcon
