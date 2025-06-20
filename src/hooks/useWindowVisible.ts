/**
 * 页面是否在可视内
 */
import { useCallback, useEffect, useState } from 'react'
import { useIsWindowVisible } from 'store/application/hooks'

function isVisibilityStateSupported() {
  return 'visibilityState' in document
}

function getIsWindowVisible() {
  return !isVisibilityStateSupported() || document.visibilityState !== 'hidden'
}

/**
 * Returns whether the window is currently visible to the user.
 */
export default function useWindowVisible() {
  const [, setIsWindowVisible] = useIsWindowVisible()
  const listener = useCallback(() => {
    setIsWindowVisible(getIsWindowVisible())
  }, [setIsWindowVisible])

  useEffect(() => {
    if (!isVisibilityStateSupported()) return undefined

    document.addEventListener('visibilitychange', listener)
    return () => {
      document.removeEventListener('visibilitychange', listener)
    }
  }, [listener])
}
