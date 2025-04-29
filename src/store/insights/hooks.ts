import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "store"
import { InsightsDataType, TokenListDataType } from "./insights.d"
import { useLazyGetAllInsightsQuery } from "api/insights"
import { updateAllInsightsData } from "./reducer"
import { PAGE_SIZE } from "constants/index"

export function useTokenList(): TokenListDataType[] {
  return useMemo(() => {
    return []
  }, [])
}

export function useGetAllInsights() {
  const [triggerGetAllInsights] = useLazyGetAllInsightsQuery()
  const dispatch = useDispatch()
  return useCallback(async ({
    pageIndex,
  }: {
    pageIndex: number
  }) => {
    try {
      const data = await triggerGetAllInsights({ pageIndex, pageSize: PAGE_SIZE })
      const list = (data.data as any).list || []
      const totalSize = (data.data as any).totalSize || 0
      dispatch(updateAllInsightsData({ list, totalSize }))
      return data
    } catch (error) {
      return error
    }
  }, [triggerGetAllInsights, dispatch])
}


// [
//   {
//     id: '1',
//     symbol: 'BTC',
//     isLong: true,
//     title: 'BTC is going to the moon',
//     content: 'BTC is going to the moon',
//   },
//   {
//     id: '2',
//     symbol: 'ETH',
//     isLong: true,
//     title: 'ETH is going to the moon',
//     content: 'ETH is going to the moon',
//   },
//   {
//     id: '3',
//     symbol: 'SOL',
//     isLong: false,
//     title: 'SOL is going to the moon',
//     content: 'SOL is going to the moon',
//   },
// ]
export function useAllInsightsData(): [InsightsDataType[], number] {
  const allInsightsData = useSelector((state: RootState) => state.insights.allInsightsData)
  return [allInsightsData.list, allInsightsData.totalSize]
}