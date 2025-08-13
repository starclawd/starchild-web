import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  useLazyBindNftQuery,
  useLazyCollectWhitelistQuery,
  useLazyGetCandidateStatusQuery,
  useLazyMintNftQuery,
} from 'api/home'
import { updateCandidateStatus } from './reducer'
import { useUserInfo } from 'store/login/hooks'
import { CandidateStatusDataType } from './home'
import { RootState } from 'store'
import { handleSignature } from 'utils'

export function useGetSignatureText() {
  const [{ telegramUserName }] = useUserInfo()
  return useCallback(
    (action: string) => {
      const time = Date.now()
      const hostname = window.location.hostname
      return `Starchild\nDomain: ${hostname}\nAction: ${action}\nChain Name: BASE\nTelegram User Name: ${telegramUserName}\n${time}\n`
    },
    [telegramUserName],
  )
}

export function useGetCandidateStatus() {
  const [triggerGetCandidateStatus] = useLazyGetCandidateStatusQuery()
  const [, setCandidateStatus] = useCandidateStatus()

  return useCallback(
    async (account: string) => {
      try {
        const data = await triggerGetCandidateStatus({ account })
        if (data.isSuccess) {
          setCandidateStatus(data.data)
        }
        return data
      } catch (error) {
        return error
      }
    },
    [triggerGetCandidateStatus, setCandidateStatus],
  )
}

export function useMintNft() {
  const [triggerMintNft] = useLazyMintNftQuery()

  return useCallback(
    async ({ account, message, signature }: { account: string; message: string; signature: string }) => {
      const data = await triggerMintNft({ account, message, signature: handleSignature(signature) })
      return data
    },
    [triggerMintNft],
  )
}

export function useBindNft() {
  const [triggerBindNft] = useLazyBindNftQuery()

  return useCallback(
    async ({ account, message, signature }: { account: string; message: string; signature: string }) => {
      const data = await triggerBindNft({ account, message, signature: handleSignature(signature) })
      return data
    },
    [triggerBindNft],
  )
}

export function useCollectWhitelist() {
  const [triggerCollectWhitelist] = useLazyCollectWhitelistQuery()

  return useCallback(
    async ({ account, telegramUserName }: { account: string; telegramUserName: string }) => {
      const data = await triggerCollectWhitelist({ account, telegramUserName })
      return data
    },
    [triggerCollectWhitelist],
  )
}

export function useCandidateStatus(): [CandidateStatusDataType, (data: CandidateStatusDataType) => void] {
  const candidateStatus = useSelector((state: RootState) => state.home.candidateStatus)
  const dispatch = useDispatch()
  const setCandidateStatus = useCallback(
    (data: CandidateStatusDataType) => {
      dispatch(updateCandidateStatus(data))
    },
    [dispatch],
  )

  return [
    candidateStatus || {
      burnAt: '',
      hasMinted: false,
      inWhitelist: false,
      inWaitList: false,
      burnNftIconUrl: '',
      nftIconUrl: '',
    },
    setCandidateStatus,
  ]
}
