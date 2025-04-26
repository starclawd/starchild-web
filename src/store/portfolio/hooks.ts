import { useDispatch, useSelector } from "react-redux"
import { updateCurrentWalletAddress, updateWalletHistory } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"
import { useLazyGetEvmDefiPositionsSummaryQuery, useLazyGetEvmWalletNetWorthQuery, useLazyGetEvmWalletProfitabilitySummaryQuery, useLazyGetEvmWalletTokenBalancesPriceQuery } from "api/evmmoralis"
import { useLazyGetSolPortfolioQuery, useLazyGetSolTokenBalancesQuery } from "api/solmoralis"
import { Chain } from "constants/chainInfo"
import { WalletHistoryDataType } from "./portfolio.d"
import { useLazyGetWalletHistoryQuery } from "api/wallet"

export function useCurrentWalletAddress(): [string, (newWalletAddress: string) => void] {
  const dispatch = useDispatch()
  // const currentWalletAddress = useSelector((state: RootState) => state.portfolio.currentWalletAddress)
  const currentWalletAddress = 'Bg7WtuwHKVZ4a63j8NEj14jqj2PdkLmtwReHUsqshbs'

  const setCurrentWalletAddress = useCallback(
    (newWalletAddress: string) => {
      dispatch(updateCurrentWalletAddress(newWalletAddress))
    },
    [dispatch]
  )

  return [currentWalletAddress, setCurrentWalletAddress]
}

export function useGetEvmWalletTokenBalancesPrice() {
  const [triggerGetEvmWalletTokenBalancesPrice] = useLazyGetEvmWalletTokenBalancesPriceQuery()
  return useCallback(async ({
    walletAddress,
    chain,
    cursor,
  }: {
    walletAddress: string
    chain: Chain
    cursor: string
  }) => {
    try {
      const data = await triggerGetEvmWalletTokenBalancesPrice({
        walletAddress,
        chain,
        cursor,
      })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetEvmWalletTokenBalancesPrice])
}

export function useGetEvmWalletNetWorth() {
  const [triggerGetEvmWalletNetWorth] = useLazyGetEvmWalletNetWorthQuery()
  return useCallback(async ({
    walletAddress,
    chains,
  }: {
    walletAddress: string
    chains: Chain[]
  }) => {
    try {
      const data = await triggerGetEvmWalletNetWorth({
        walletAddress,
        chains,
      })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetEvmWalletNetWorth])
}

export function useGetEvmWalletProfitabilitySummary() {
  const [triggerGetEvmWalletProfitabilitySummary] = useLazyGetEvmWalletProfitabilitySummaryQuery()
  return useCallback(async ({
    walletAddress,
    chain,
  }: {
    walletAddress: string
    chain: Chain
  }) => {
    try {
      const data = await triggerGetEvmWalletProfitabilitySummary({
        walletAddress,
        chain,
      })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetEvmWalletProfitabilitySummary])
}

export function useGetEvmDefiPositionsSummary() {
  const [triggerGetEvmDefiPositionsSummary] = useLazyGetEvmDefiPositionsSummaryQuery()
  return useCallback(async ({
    walletAddress,
    chain,
  }: {
    walletAddress: string
    chain: Chain
  }) => {
    try {
      const data = await triggerGetEvmDefiPositionsSummary({
        walletAddress,
        chain,
      })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetEvmDefiPositionsSummary])
}

export function useGetSolWalletTokenBalancesPrice() {
  const [triggerGetSolWalletTokenBalancesPrice] = useLazyGetSolTokenBalancesQuery()
  return useCallback(async ({
    walletAddress,
    network,
  }: {
    walletAddress: string
    network: string
  }) => {
    try {
      const data = await triggerGetSolWalletTokenBalancesPrice({
        walletAddress,
        network,
      })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetSolWalletTokenBalancesPrice])
}

export function useGetSolWalletPortfolio() {
  const [triggerGetSolWalletPortfolio] = useLazyGetSolPortfolioQuery()
  return useCallback(async ({
    walletAddress,
    network,
  }: {
    walletAddress: string
    network: string
  }) => {
    try {
      const data = await triggerGetSolWalletPortfolio({
        walletAddress,
        network,
      })
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetSolWalletPortfolio])
}



export function useGetWalletHistory() {
  const [, setWalletHistory] = useWalletHistory()
  const [triggerGetWalletHistory] = useLazyGetWalletHistoryQuery()
  return useCallback(async ({
    evmAddress,
    solanaAddress,
    limit,
    chain,
  }: {
    evmAddress?: string
    solanaAddress?: string
    limit: number
    chain: Chain
  }) => {
    try {
      const data = await triggerGetWalletHistory({
        evmAddress,
        solanaAddress,
        limit,
        chain,
      })
      setWalletHistory(data.data.result.map((item: WalletHistoryDataType) => ({
        ...item,
        chain,
      })))
      return data
    } catch (error) {
      return error
    }
  }, [setWalletHistory, triggerGetWalletHistory])
}

export function useWalletHistory(): [WalletHistoryDataType[], (walletHistory: WalletHistoryDataType[]) => void] {
  const walletHistory = useSelector((state: RootState) => state.portfolio.walletHistory)
  const dispatch = useDispatch()
  const setWalletHistory = useCallback((walletHistory: WalletHistoryDataType[]) => {
    dispatch(updateWalletHistory(walletHistory))
  }, [dispatch])
  return [walletHistory, setWalletHistory]
}