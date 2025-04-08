import { useCallback } from "react"

export function useSleep() {
  return useCallback((timeout: number) => {
    return new Promise((resolve)=>{
      setTimeout(()=>{
        resolve(null)
      }, timeout)
    })
  }, [])
}