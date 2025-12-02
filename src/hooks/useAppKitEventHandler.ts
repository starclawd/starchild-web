import { useEffect } from 'react'
import { useAppKit, useAppKitEvents } from '@reown/appkit/react'

export function useAppKitEventHandler() {
  const { close } = useAppKit()
  const {
    data: { event },
  } = useAppKitEvents()
  useEffect(() => {
    if (event === 'SWITCH_NETWORK') {
      close()
    }
  }, [event, close])
}
