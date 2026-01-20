import styled, { css } from 'styled-components'
import Modal, {
  CommonModalContent,
  CommonModalContentWrapper,
  CommonModalFooter,
  CommonModalHeader,
} from 'components/Modal'
import { useIsMobile, useModalOpen, usePreferenceModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import Timezone from './components/Timezone'
import { useCallback, useEffect, useState } from 'react'
import TradingExperience from './components/TradingExperience'
import AiExperience from './components/AiExperience'
import WatchList from './components/WatchList'
import PersonalProfile from './components/PersonalProfile'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import BottomSheet from 'components/BottomSheet'
import { useGetPreference, usePreferenceData, useUpdatePreference } from 'store/perference/hooks'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'

const PerferenceMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  padding: 0 ${vm(20)};
  background: transparent;
`

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
    `}
`

const SelectItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  .title {
    padding: 8px 0;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    color: ${({ theme }) => theme.black100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      .title {
        padding: ${vm(8)} ${vm(12)};
        font-size: 0.13rem;
        line-height: 0.2rem;
      }
    `}
`

const WatchListWrapper = styled(SelectItem)`
  width: 100%;
`

const PersonalProfileWrapper = styled(SelectItem)`
  width: 100%;
`

const ButtonCancel = styled(ButtonBorder)`
  width: 50%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  border: 1px solid ${({ theme }) => theme.black600};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
    `}
`

const ButtonConfirm = styled(ButtonCommon)`
  width: 50%;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
    `}
`

export default function Preference() {
  const theme = useTheme()
  const toast = useToast()
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const contentRef = useScrollbarClass<HTMLDivElement>()
  const [timezone, setTimezone] = useState<string>('')
  const [tradingExperience, setTradingExperience] = useState<string>('')
  const [aiExperience, setAiExperience] = useState<string>('')
  const [watchlistText, setWatchlistText] = useState<string>('')
  const [personalProfileText, setPersonalProfileText] = useState<string>('')
  const [preferenceData] = usePreferenceData()
  const preferenceModalOpen = useModalOpen(ApplicationModal.PREFERENCE_MODAL)
  const togglePreferenceModal = usePreferenceModalToggle()
  const triggerUpdatePreference = useUpdatePreference()
  const triggerGetPreference = useGetPreference()

  const handleUpdatePreference = useCallback(async () => {
    try {
      if (isLoading) return
      setIsLoading(true)
      const data = await triggerUpdatePreference({
        timezone,
        tradingExperience,
        aiExperience,
        watchlist: watchlistText,
        personalProfile: personalProfileText,
      })
      if ((data as any).isSuccess) {
        if ((data as any).data.status === 'success') {
          await triggerGetPreference()
          toast({
            title: <Trans>Preferences updated</Trans>,
            description: <Trans>Preferences updated</Trans>,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-preference',
            iconTheme: theme.black0,
          })
          if (preferenceModalOpen) {
            togglePreferenceModal()
          }
        } else {
          const error = (data as any).data?.error.split(': ')
          const errorTitle = error.length > 1 ? error[0] : <Trans>Preference modification failed</Trans>
          const errorDescription = error.length > 1 ? error[1] : error[0]

          toast({
            title: errorTitle,
            description: errorDescription,
            status: TOAST_STATUS.ERROR,
            typeIcon: 'icon-close',
            iconTheme: theme.black0,
          })
        }
      }
      setIsLoading(false)
    } catch (error) {
      console.error(error)
    }
  }, [
    isLoading,
    timezone,
    tradingExperience,
    aiExperience,
    watchlistText,
    preferenceModalOpen,
    personalProfileText,
    theme,
    toast,
    togglePreferenceModal,
    triggerGetPreference,
    triggerUpdatePreference,
  ])

  useEffect(() => {
    setTimezone(preferenceData.timezone)
    setTradingExperience(preferenceData.tradingExperience)
    setAiExperience(preferenceData.aiExperience)
    setWatchlistText(preferenceData.watchlist)
    setPersonalProfileText(preferenceData.personalProfile)
  }, [preferenceData])

  const renderContent = () => {
    return (
      <>
        <CommonModalHeader>
          <Trans>Preferences</Trans>
        </CommonModalHeader>
        <CommonModalContent ref={contentRef} className='scroll-style'>
          <SelectWrapper>
            <SelectItem style={{ width: '100%' }}>
              <span className='title'>
                <Trans>Time zone</Trans>
              </span>
              <Timezone timezoneValue={timezone} setTimezoneValue={setTimezone} />
            </SelectItem>
          </SelectWrapper>
          <SelectWrapper>
            <SelectItem>
              <span className='title'>
                <Trans>Trading experience</Trans>
              </span>
              <TradingExperience
                tradingExperienceValue={tradingExperience}
                setTradingExperienceValue={setTradingExperience}
              />
            </SelectItem>
            <SelectItem>
              <span className='title'>
                <Trans>AI experience</Trans>
              </span>
              <AiExperience aiExperienceValue={aiExperience} setAiExperienceValue={setAiExperience} />
            </SelectItem>
          </SelectWrapper>
          <WatchListWrapper>
            <span className='title'>
              <Trans>Watchlist</Trans>
            </span>
            <WatchList watchlistText={watchlistText} setWatchlistText={setWatchlistText} />
          </WatchListWrapper>
          <PersonalProfileWrapper>
            <span className='title'>
              <Trans>Personal Profile</Trans>
            </span>
            <PersonalProfile
              personalProfileText={personalProfileText}
              setPersonalProfileText={setPersonalProfileText}
            />
          </PersonalProfileWrapper>
        </CommonModalContent>
        <CommonModalFooter>
          <ButtonCancel onClick={togglePreferenceModal}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm $disabled={isLoading} onClick={handleUpdatePreference}>
            {isLoading ? <Pending /> : <Trans>Confirm</Trans>}
          </ButtonConfirm>
        </CommonModalFooter>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={preferenceModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `calc(100vh - ${vm(44)})` }}
      onClose={togglePreferenceModal}
    >
      <PerferenceMobileWrapper>{renderContent()}</PerferenceMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={preferenceModalOpen} onDismiss={togglePreferenceModal}>
      <CommonModalContentWrapper>{renderContent()}</CommonModalContentWrapper>
    </Modal>
  )
}
