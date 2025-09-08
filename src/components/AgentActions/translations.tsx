import React from 'react'
import { Trans } from '@lingui/react/macro'

// Helper function to render translated labels
export const renderLabel = (label: string) => {
  switch (label) {
    case 'Edit':
      return <Trans>Edit</Trans>
    case 'Pause':
      return <Trans>Pause</Trans>
    case 'Suspend':
      return <Trans>Suspend</Trans>
    case 'Delete':
      return <Trans>Delete</Trans>
    case 'Subscribe':
      return <Trans>Subscribe</Trans>
    case 'Unsubscribe':
      return <Trans>Unsubscribe</Trans>
    case 'Share':
      return <Trans>Share</Trans>
    case 'Copy link':
      return <Trans>Copy link</Trans>
    case 'Share image':
      return <Trans>Share image</Trans>
    default:
      return label
  }
}
