import { Trans } from '@lingui/react/macro'
import useToast, { TOAST_STATUS } from 'components/Toast'
import copy from 'copy-to-clipboard'
import { useCallback } from 'react'
import { useTheme } from 'store/themecache/hooks'

export type CopyMode = 'element' | 'raw' | 'custom'

export interface UseCopyContentOptions {
  mode?: CopyMode
  customProcessor?: (content: string) => string
  maxDescriptionLength?: number
}

export default function useCopyContent(options: UseCopyContentOptions = {}) {
  const theme = useTheme()
  const toast = useToast()
  const { mode = 'raw', customProcessor, maxDescriptionLength = 100 } = options

  const copyFromElement = useCallback(
    (element: HTMLElement) => {
      const textContent = element.innerText || element.textContent || ''
      copy(textContent)

      const description =
        textContent.length > maxDescriptionLength ? textContent.substring(0, maxDescriptionLength) + '...' : textContent

      toast({
        title: <Trans>Copied</Trans>,
        description,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-copy',
        iconTheme: theme.jade10,
      })

      return textContent
    },
    [toast, theme.jade10, maxDescriptionLength],
  )

  const copyRawContent = useCallback(
    (content: string) => {
      copy(content)

      const description =
        content.length > maxDescriptionLength ? content.substring(0, maxDescriptionLength) + '...' : content

      toast({
        title: <Trans>Copied</Trans>,
        description,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-copy',
        iconTheme: theme.jade10,
      })

      return content
    },
    [toast, theme.jade10, maxDescriptionLength],
  )

  const copyWithCustomProcessor = useCallback(
    (content: string) => {
      if (!customProcessor) {
        throw new Error('Custom processor is required when mode is "custom"')
      }

      const processedContent = customProcessor(content)
      copy(processedContent)

      const description =
        processedContent.length > maxDescriptionLength
          ? processedContent.substring(0, maxDescriptionLength) + '...'
          : processedContent

      toast({
        title: <Trans>Copied</Trans>,
        description,
        status: TOAST_STATUS.SUCCESS,
        typeIcon: 'icon-copy',
        iconTheme: theme.black0,
      })

      return processedContent
    },
    [customProcessor, toast, theme.black0, maxDescriptionLength],
  )

  const copyContent = useCallback(
    (contentOrElement: string | HTMLElement) => {
      switch (mode) {
        case 'element':
          if (typeof contentOrElement === 'string') {
            throw new Error('Element mode requires HTMLElement, got string')
          }
          return copyFromElement(contentOrElement)

        case 'raw':
          if (typeof contentOrElement !== 'string') {
            throw new Error('Raw mode requires string, got HTMLElement')
          }
          return copyRawContent(contentOrElement)

        case 'custom':
          if (typeof contentOrElement !== 'string') {
            throw new Error('Custom mode requires string, got HTMLElement')
          }
          return copyWithCustomProcessor(contentOrElement)

        default:
          throw new Error(`Unknown copy mode: ${mode}`)
      }
    },
    [mode, copyFromElement, copyRawContent, copyWithCustomProcessor],
  )

  return {
    copyContent,
    copyFromElement,
    copyRawContent,
    copyWithCustomProcessor,
  }
}
