import { memo } from 'react'
import { useIsShowStrategyMarket } from 'store/vaultsdetailcache/hooks'
import styled, { css } from 'styled-components'
import { ANI_DURATION } from 'constants/index'

const StrategyMarketWrapper = styled.div<{ $isShowStrategyMarket: boolean }>`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  transition: all ${ANI_DURATION}s;
  ${({ $isShowStrategyMarket }) =>
    !$isShowStrategyMarket &&
    css`
      width: 0;
      overflow: hidden;
    `}
`

export default memo(function StrategyMarket() {
  const [isShowStrategyMarket] = useIsShowStrategyMarket()
  return <StrategyMarketWrapper $isShowStrategyMarket={isShowStrategyMarket}></StrategyMarketWrapper>
})
