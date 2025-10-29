import { useCallback, useRef } from 'react'

export function useSleep() {
  const abortRef = useRef<(() => void) | null>(null)

  const sleep = useCallback((timeout: number) => {
    return new Promise<boolean>((resolve, reject) => {
      const timer = setTimeout(() => {
        abortRef.current = null
        resolve(true) // 正常完成
      }, timeout)

      // 保存abort函数
      abortRef.current = () => {
        clearTimeout(timer)
        abortRef.current = null
        reject(new Error('Sleep aborted'))
      }
    })
  }, [])

  const abort = useCallback(() => {
    if (abortRef.current) {
      abortRef.current()
    }
  }, [])

  return { sleep, abort }
}
