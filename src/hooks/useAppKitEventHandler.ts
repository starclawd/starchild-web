import { useEffect } from 'react'
import { useAppKit, useAppKitEvents } from '@reown/appkit/react'
import { useModalOpen, useSwitchChainModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application'

export function useAppKitEventHandler() {
  const { close } = useAppKit()
  const switchChainModalOpen = useModalOpen(ApplicationModal.SWITCH_CHAIN_MODAL)
  const toggleSwitchChainModal = useSwitchChainModalToggle()
  const {
    data: { event },
  } = useAppKitEvents()
  useEffect(() => {
    if (event === 'SWITCH_NETWORK') {
      close()
      if (switchChainModalOpen) {
        toggleSwitchChainModal()
      }
    }
  }, [event, close, switchChainModalOpen, toggleSwitchChainModal])
}
