import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'store';
import { updateIsShowPrice } from './reducer';

export function useIsShowPrice(): [boolean, (isShow: boolean) => void] {
  const isShowPrice = useSelector((state: RootState) => state.backTest.isShowPrice)
  const dispatch = useDispatch()
  const setIsShowPrice = useCallback((isShow: boolean) => {
    dispatch(updateIsShowPrice(isShow))
  }, [dispatch])
  return [isShowPrice, setIsShowPrice]
}
