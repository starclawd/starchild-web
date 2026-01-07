import styled from 'styled-components'
import PaperTradingTabs from './components/PaperTradingTabs'
import PaperTradingFullScreen from './components/PaperTradingFullScreen'
import { useIsShowExpandPaperTrading } from 'store/createstrategy/hooks/usePaperTrading'
import useParsedQueryString from 'hooks/useParsedQueryString'
import Pending from 'components/Pending'
import { usePaperTradingPublic } from 'store/vaultsdetail/hooks/usePaperTradingPublic'

const PaperTradingWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

export default function PaperTrading() {
  const { strategyId } = useParsedQueryString()
  const [isShowExpandPaperTrading] = useIsShowExpandPaperTrading()
  const { paperTradingPublicData } = usePaperTradingPublic({
    strategyId: strategyId || '',
  })

  // 如果有Paper Trading数据，说明正在运行，根据全屏状态显示不同视图
  if (paperTradingPublicData) {
    return (
      <PaperTradingWrapper>
        {isShowExpandPaperTrading ? <PaperTradingFullScreen /> : <PaperTradingTabs />}
      </PaperTradingWrapper>
    )
  }
  return (
    <PaperTradingWrapper>
      <Pending isNotButtonLoading />
    </PaperTradingWrapper>
  )
}
