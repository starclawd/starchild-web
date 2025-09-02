import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import { updateCurrentKolInfo, updateCurrentTokenInfo } from '../reducer'
import { KolInfo, TokenInfo } from '../agenthub'

/**
 * 当前KOL信息状态管理
 */
export function useCurrentKolInfo(): [KolInfo | null, (kolInfo: KolInfo | null) => void] {
  const currentKolInfo = useSelector((state: RootState) => state.agentHub.currentKolInfo)
  const dispatch = useDispatch()
  const setCurrentKolInfo = useCallback(
    (kolInfo: KolInfo | null) => {
      dispatch(updateCurrentKolInfo(kolInfo))
    },
    [dispatch],
  )
  return [currentKolInfo, setCurrentKolInfo]
}

/**
 * 当前Token信息状态管理
 */
export function useCurrentTokenInfo(): [TokenInfo | null, (tokenInfo: TokenInfo | null) => void] {
  const currentTokenInfo = useSelector((state: RootState) => state.agentHub.currentTokenInfo)
  const dispatch = useDispatch()
  const setCurrentTokenInfo = useCallback(
    (tokenInfo: TokenInfo | null) => {
      dispatch(updateCurrentTokenInfo(tokenInfo))
    },
    [dispatch],
  )
  return [currentTokenInfo, setCurrentTokenInfo]
}
