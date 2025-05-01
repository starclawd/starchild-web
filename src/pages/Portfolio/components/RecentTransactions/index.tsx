import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useState } from 'react'
import TransactionItem from '../TransactionItem'
import TransactionDetail from '../TransactionDetail'
import Transition from 'components/TransitionWrapper'
import { useGetWalletHistory, useWalletHistory } from 'store/portfolio/hooks'
import { WalletHistoryDataType } from 'store/portfolio/portfolio.d'
import { Chain } from 'constants/chainInfo'
import { useShowRecentTransactions } from 'store/portfoliocache/hooks'
import { ANI_DURATION } from 'constants/index'
import { useWindowSize } from 'hooks/useWindowSize'
import NoData from 'components/NoData'

const RecentTransactionsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  padding: 84px 0 0;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: 12px;
  .transition-wrapper {
    flex: 1;
  }
`

const TransactionList = styled.div<{ $currentShowTx: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 20px;
  border-radius: 36px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  transition: width ${ANI_DURATION}s;
  ${({ $currentShowTx }) => $currentShowTx && css`
    overflow: hidden;
  `}
`

export default memo(function RecentTransactions() {
  const { width } = useWindowSize()
  const [walletHistory] = useWalletHistory()
  const [showRecentTransactions] = useShowRecentTransactions()
  const triggerGetWalletHistory = useGetWalletHistory()
  const [currentShowTxData, setCurrentShowTxData] = useState<WalletHistoryDataType | null>(null)
  const showTxDetail = useCallback((data: WalletHistoryDataType) => {
    setCurrentShowTxData(data)
  }, [])
  const hideTxDetail = useCallback(() => {
    setCurrentShowTxData(null)
  }, [])
  useEffect(() => {
    triggerGetWalletHistory({
      evmAddress: '0x59bB31474352724583bEB030210c7B96E9D0d8e9',
      limit: 10,
      chain: Chain.BASE,
    })
  }, [triggerGetWalletHistory])
  return <RecentTransactionsWrapper>
    <ContentWrapper>
      <Transition
        key={width}
        transitionType="width"
        visible={showRecentTransactions}
      >
        <TransactionList
          className="scroll-style transaction-list-wrapper"
          $currentShowTx={!!currentShowTxData}
        >
          {walletHistory.length > 0
            ? walletHistory.map((item, index) => (
              <TransactionItem
                key={index}
                data={item}
                onClick={showTxDetail}
              />
            ))
            : <NoData />
          }
          {currentShowTxData && <Transition 
            visible={!!currentShowTxData} 
            transitionType="transform" 
            direction="right"
          >
            <TransactionDetail hideTxDetail={hideTxDetail} data={currentShowTxData as WalletHistoryDataType} />
          </Transition>}
        </TransactionList>
      </Transition>
    </ContentWrapper>
  </RecentTransactionsWrapper>
})
