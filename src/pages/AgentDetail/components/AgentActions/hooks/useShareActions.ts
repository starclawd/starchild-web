import { useCallback, useMemo, useRef, useState } from 'react'
import { useTheme } from 'styled-components'
import { useCopyImgAndText, useCopyText } from 'pages/AgentDetail/components/AgentShare'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import { ActionType, ActionConfig } from '../types'

export interface UseShareActionsProps {
  data: AgentDetailDataType
  onShare?: () => void
  onShareLink?: () => void
  onClose?: () => void
}

export interface UseShareActionsReturn {
  shareUrl: string
  shareDomRef: React.RefObject<HTMLDivElement | null>
  isCopyLoading: boolean
  handleShare: () => void
  handleShareLink: () => void
  shareActionConfigs: ActionConfig[]
  setIsCopyLoading: (isCopyLoading: boolean) => void
}

export function useShareActions({ data, onShare, onShareLink, onClose }: UseShareActionsProps): UseShareActionsReturn {
  const theme = useTheme()
  const toast = useToast()
  const [isCopyLoading, setIsCopyLoading] = useState(false)

  const shareDomRef = useRef<HTMLDivElement>(null)
  const copyImgAndText = useCopyImgAndText()
  const copyText = useCopyText()

  // 分享URL
  const shareUrl = useMemo(() => {
    return `${window.location.origin}/agentdetail?agentId=${data.id}`
  }, [data.id])

  const agentNotFound = useCallback(() => {
    toast({
      title: 'Error',
      description: 'Agent not found',
      status: TOAST_STATUS.ERROR,
      typeIcon: 'icon-close',
      iconTheme: theme.black0,
    })
  }, [toast, theme])

  const handleShare = useCallback(() => {
    if (onShare) {
      onShare()
    } else {
      if (data.id === 0) {
        agentNotFound()
        return
      }
      copyImgAndText({
        shareUrl,
        shareDomRef: shareDomRef as React.RefObject<HTMLDivElement>,
        setIsCopyLoading,
      })
    }
    onClose?.()
  }, [data.id, onShare, copyImgAndText, shareUrl, shareDomRef, onClose, agentNotFound])

  const handleShareLink = useCallback(() => {
    if (onShareLink) {
      onShareLink()
    } else {
      if (data.id === 0) {
        agentNotFound()
        return
      }
      copyText({
        shareUrl,
        setIsCopyLoading,
      })
    }
    onClose?.()
  }, [onShareLink, onClose, data.id, shareUrl, agentNotFound, copyText, setIsCopyLoading])

  const shareActionConfigs: ActionConfig[] = useMemo(() => {
    return [
      {
        type: ActionType.SHARE_LINK,
        icon: 'icon-copy',
        label: 'Copy link',
        onClick: handleShareLink,
        visible: true,
        loading: isCopyLoading,
      },
      {
        type: ActionType.SHARE_IMAGE,
        icon: 'icon-share-image',
        label: 'Share image',
        onClick: handleShare,
        visible: true,
        loading: isCopyLoading,
      },
    ]
  }, [handleShareLink, handleShare, isCopyLoading])

  return {
    shareUrl,
    shareDomRef,
    isCopyLoading,
    handleShare,
    handleShareLink,
    shareActionConfigs,
    setIsCopyLoading,
  }
}
