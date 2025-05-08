import { useDispatch, useSelector } from "react-redux"
import { updateAllNetworkWalletToken, updateCurrentWalletAddress, updateNetWorthList, updateWalletHistory } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"
import { Chain } from "constants/chainInfo"
import { AllNetworkWalletTokensDataType, NetWorthDataType, SolanaWalletHistoryDataType, WalletHistoryDataType } from "./portfolio.d"
import { useLazyGetAllNetworkWalletTokensQuery, useLazyGetNetWorthQuery, useLazyGetWalletHistoryQuery } from "api/wallet"

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

export function useGetWalletHistory() {
  const [, setWalletHistory] = useWalletHistory()
  const [triggerGetWalletHistory] = useLazyGetWalletHistoryQuery()
  return useCallback(async ({
    evmAddress,
    limit,
    chain,
  }: {
    evmAddress: string
    limit: number
    chain: Chain
  }) => {
    try {
      const data = await triggerGetWalletHistory({
        evmAddress,
        limit,
        chain,
      })
      setWalletHistory(data.data || [])
      return data
    } catch (error) {
      return error
    }
  }, [setWalletHistory, triggerGetWalletHistory])
}

export function useWalletHistory(): [(WalletHistoryDataType | SolanaWalletHistoryDataType)[], (walletHistory: (WalletHistoryDataType | SolanaWalletHistoryDataType)[]) => void] {
  const walletHistory = useSelector((state: RootState) => state.portfolio.walletHistory)
  const dispatch = useDispatch()
  const setWalletHistory = useCallback((walletHistory: (WalletHistoryDataType | SolanaWalletHistoryDataType)[]) => {
    dispatch(updateWalletHistory(walletHistory))
  }, [dispatch])
  return [walletHistory, setWalletHistory]
}


export function useGetWalletNetWorth() {
  const [, setNetWorthList] = useNetWorthList()
  const [triggerGetWalletNetWorth] = useLazyGetNetWorthQuery()
  return useCallback(async ({
    evmAddress,
    chains,
  }: {
    evmAddress: string
    chains: Chain[]
  }) => {
    try {
      const data = await triggerGetWalletNetWorth({
        evmAddress,
        chains,
      })
      setNetWorthList(data.data.chains)
      return data
    } catch (error) {
      return error
    }
  }, [setNetWorthList, triggerGetWalletNetWorth])
}

export function useNetWorthList(): [NetWorthDataType[], (netWorthList: NetWorthDataType[]) => void] {
  const netWorthList = useSelector((state: RootState) => state.portfolio.netWorthList)
  const dispatch = useDispatch()
  const setNetWorthList = useCallback((netWorthList: NetWorthDataType[]) => {
    dispatch(updateNetWorthList(netWorthList))
  }, [dispatch])
  return [netWorthList, setNetWorthList]
}

export function useGetAllNetworkWalletTokens() {
  const [, setAllNetworkWalletTokens] = useAllNetworkWalletTokens()
  const [triggerGetAllNetworkWalletTokens] = useLazyGetAllNetworkWalletTokensQuery()
  return useCallback(async ({
    evmAddress,
  }: {
    evmAddress: string
  }) => {
    try {
      const data = await triggerGetAllNetworkWalletTokens({
        evmAddress,
      })
      const list: AllNetworkWalletTokensDataType[] = []
      data.data.forEach((data: any) => {
        const chain = data.chain
        const result = data.result.map((item: AllNetworkWalletTokensDataType) => ({
          ...item,
          chain,
        }))
        list.push(...result)
      })
      list.sort((a, b) => Number(b.usd_value) - Number(a.usd_value))
      setAllNetworkWalletTokens(list.filter((item) => item.verified_contract && !item.possible_spam))
      return data
    } catch (error) {
      return error
    }
  }, [setAllNetworkWalletTokens, triggerGetAllNetworkWalletTokens])
}

export function useAllNetworkWalletTokens(): [AllNetworkWalletTokensDataType[], (allNetworkWalletTokens: AllNetworkWalletTokensDataType[]) => void] {
  const allNetworkWalletTokens = useSelector((state: RootState) => state.portfolio.allNetworkWalletTokens)
  const dispatch = useDispatch()
  const setAllNetworkWalletTokens = useCallback((allNetworkWalletTokens: AllNetworkWalletTokensDataType[]) => {
    dispatch(updateAllNetworkWalletToken(allNetworkWalletTokens))
  }, [dispatch])
  return [allNetworkWalletTokens, setAllNetworkWalletTokens]
}