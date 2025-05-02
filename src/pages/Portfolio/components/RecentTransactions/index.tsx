import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
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
import { useUserInfo } from 'store/login/hooks'

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

const TransactionList = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 36px;
  padding-right: 4px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  transition: width ${ANI_DURATION}s;
  .transition-wrapper {
    padding-right: 4px;
  }
`

const InnerContent = styled.div<{ $currentShowTx: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  padding: 20px 16px 20px 20px;
  border-radius: 36px;
  .no-data-wrapper {
    background-color: transparent;
  }
  ${({ $currentShowTx }) => $currentShowTx && css`
    overflow: hidden;
  `}
`

export default memo(function RecentTransactions() {
  const innerContentRef = useRef<HTMLDivElement>(null)
  const { width } = useWindowSize()
  const [{ evmAddress }] = useUserInfo()
  const [walletHistory] = useWalletHistory()
  const [showRecentTransactions] = useShowRecentTransactions()
  const triggerGetWalletHistory = useGetWalletHistory()
  const [currentShowTxData, setCurrentShowTxData] = useState<WalletHistoryDataType | null>(null)
  const [isShowTxDetail, setIsShowTxDetail] = useState<boolean>(false)
  const showTxDetail = useCallback((data: WalletHistoryDataType) => {
    setCurrentShowTxData(data)
    setIsShowTxDetail(true)
  }, [])
  const hideTxDetail = useCallback(() => {
    setIsShowTxDetail(false)
  }, [])
  useEffect(() => {
    if (evmAddress) {
      triggerGetWalletHistory({
        evmAddress,
        limit: 10,
        chain: Chain.BASE,
      })
    }
  }, [triggerGetWalletHistory, evmAddress])
  return <RecentTransactionsWrapper>
    <ContentWrapper>
      <Transition
        key={width}
        transitionType="width"
        visible={showRecentTransactions}
      >
        <TransactionList
          className="transaction-list-wrapper"
        >
          <InnerContent
            className="scroll-style"
            ref={innerContentRef}
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
          </InnerContent>
          <Transition 
            visible={isShowTxDetail} 
            transitionType="transform" 
            direction="right"
          >
            {currentShowTxData
              ? <TransactionDetail hideTxDetail={hideTxDetail} data={currentShowTxData} />
              : <span />}
          </Transition>
        </TransactionList>
      </Transition>
    </ContentWrapper>
  </RecentTransactionsWrapper>
})
