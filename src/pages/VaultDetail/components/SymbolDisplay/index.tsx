import { memo } from 'react'
import styled from 'styled-components'
import LazyImage from 'components/LazyImage'
import { getSymbolDisplayText } from 'store/vaults/hooks'

const SymbolContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const SideBar = styled.div<{ $isLong: boolean }>`
  width: 4px;
  height: 24px;
  background: ${({ theme, $isLong }) => ($isLong ? theme.green100 : theme.red100)};
`

const SymbolText = styled.div<{ $isLong?: boolean }>`
  font-weight: 400;
  color: ${({ theme, $isLong }) => ($isLong === undefined ? theme.black100 : $isLong ? theme.green100 : theme.red100)};
`

export interface SymbolDisplayProps {
  /** 原始 symbol，用于判断新旧格式 */
  symbol: string
  /** 显示的 symbol 文本 */
  displaySymbol: string
  /** token 名称，用于 logo alt */
  token: string
  /** logo URL */
  logoUrl: string
  /** Position 方向：long/short */
  positionSide?: 'long' | 'short'
  /** Order 方向：BUY/SELL */
  orderSide?: 'BUY' | 'SELL'
  /** 交易类型：spot/perp */
  type?: 'spot' | 'perp'
  /** 杠杆倍数 */
  leverage?: number
}

/**
 * 统一的 Symbol 显示组件
 * 用于 Positions、OpenOrders、OrderHistory 等表格中的 Symbol 列
 */
const SymbolDisplay = memo<SymbolDisplayProps>(
  ({ symbol, displaySymbol, token, logoUrl, positionSide, orderSide, type, leverage }) => {
    // 计算是否为多头（long/BUY）
    const isLong = positionSide ? positionSide === 'long' : orderSide ? orderSide === 'BUY' : undefined
    // 是否显示侧边栏指示器
    const showSideBar = positionSide !== undefined || orderSide !== undefined
    // 生成显示文本
    const symbolDisplayText = getSymbolDisplayText(symbol, displaySymbol, type, leverage)

    return (
      <SymbolContainer>
        <LazyImage src={logoUrl} alt={token} width={24} height={24} borderRadius='50%' />
        {showSideBar && <SideBar $isLong={isLong!} />}
        <SymbolText $isLong={isLong}>{symbolDisplayText}</SymbolText>
      </SymbolContainer>
    )
  },
)

SymbolDisplay.displayName = 'SymbolDisplay'

export default SymbolDisplay
