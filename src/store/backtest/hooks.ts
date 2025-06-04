import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { updateIsShowPrice, updateKlineSubData } from './reducer';
import { KlineSubDataType, KlineSubInnerDataType } from 'store/insights/insights.d';

export function useIsShowPrice(): [boolean, (isShow: boolean) => void] {
  const isShowPrice = useSelector((state: RootState) => state.backTest.isShowPrice)
  const dispatch = useDispatch()
  const setIsShowPrice = useCallback((isShow: boolean) => {
    dispatch(updateIsShowPrice(isShow))
  }, [dispatch])
  return [isShowPrice, setIsShowPrice]
}

export function useKlineSubData(): [KlineSubInnerDataType, (data: KlineSubDataType | null) => void] {
  const klineSubData = useSelector((state: RootState) => state.backTest.klineSubData)
  const dispatch = useDispatch()
  const setKlineSubData = useCallback((data: KlineSubDataType | null) => {
    dispatch(updateKlineSubData(data))
  }, [dispatch])
  return [klineSubData?.data as KlineSubInnerDataType, setKlineSubData]
}