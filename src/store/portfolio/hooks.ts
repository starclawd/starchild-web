import { useDispatch, useSelector } from "react-redux"
import { updateAllNetworkWalletToken, updateCurrentWalletAddress, updateNetWorthList, updateWalletHistory } from "./reducer"
import { useCallback } from "react"
import { RootState } from "store"
import { Chain } from "constants/chainInfo"
import { AllEvmWalletTokensDataType, AllSolanaWalletTokensDataType, NetWorthDataType, SolanaWalletHistoryDataType, WalletHistoryDataType } from "./portfolio.d"
import { useLazyGetAllNetworkWalletTokensQuery, useLazyGetNetWorthQuery, useLazyGetWalletHistoryQuery } from "api/wallet"
import { mul } from "utils/calc"

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
      const list: (AllEvmWalletTokensDataType | AllSolanaWalletTokensDataType)[] = []
      data.data.forEach((data: any) => {
        const chain = data.chain
        const result = data.result.map((item: AllEvmWalletTokensDataType) => ({
          ...item,
          chain,
        }))
        list.push(...result)
      })
      list.sort((a, b) => {
        if (a.chain === Chain.SOLANA) {
          const usdValueA = mul((a as AllSolanaWalletTokensDataType).amount, (a as AllSolanaWalletTokensDataType).tokenDetail?.usdPrice)
          const usdValueB = mul((b as AllSolanaWalletTokensDataType).amount, (b as AllSolanaWalletTokensDataType).tokenDetail?.usdPrice)
          return Number(usdValueB) - Number(usdValueA)
        } else {
          return Number((b as AllEvmWalletTokensDataType).usd_value) - Number((a as AllEvmWalletTokensDataType).usd_value)
        }
      })
      const filteredList = list.filter((item) => {
        if (item.chain !== Chain.SOLANA) {
          return  (item as AllEvmWalletTokensDataType).verified_contract && !(item as AllEvmWalletTokensDataType).possible_spam
        } else {
          return !(item as AllSolanaWalletTokensDataType).possibleSpam && !!(item as AllSolanaWalletTokensDataType).tokenDetail && (item as AllSolanaWalletTokensDataType).logo
        }
      })
      setAllNetworkWalletTokens(filteredList)
      return data
    } catch (error) {
      return error
    }
  }, [setAllNetworkWalletTokens, triggerGetAllNetworkWalletTokens])
}

export function useAllNetworkWalletTokens(): [(AllEvmWalletTokensDataType | AllSolanaWalletTokensDataType)[], (allNetworkWalletTokens: (AllEvmWalletTokensDataType | AllSolanaWalletTokensDataType)[]) => void] {
  const allNetworkWalletTokens = useSelector((state: RootState) => state.portfolio.allNetworkWalletTokens)
  const dispatch = useDispatch()
  const setAllNetworkWalletTokens = useCallback((allNetworkWalletTokens: (AllEvmWalletTokensDataType | AllSolanaWalletTokensDataType)[]) => {
    dispatch(updateAllNetworkWalletToken(allNetworkWalletTokens))
  }, [dispatch])
  return [allNetworkWalletTokens, setAllNetworkWalletTokens]
}