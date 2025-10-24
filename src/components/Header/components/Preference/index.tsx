import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
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
import WalletManagement from './components/WalletManagement'
import PersonalProfile from './components/PersonalProfile'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import { useScrollbarClass } from 'hooks/useScrollbarClass'
import BottomSheet from 'components/BottomSheet'
import { useGetPreference, usePreferenceData, useUpdatePreference } from 'store/perference/hooks'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'

const PerferenceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 580px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const PerferenceMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  padding: 0 ${vm(20)};
  background: transparent;
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} ${vm(20)} ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  padding: 20px 0;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding: ${vm(20)} 0;
    `}
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
    padding: 8px 12px;
    font-size: 13px;
    font-weight: 400;
    line-height: 20px;
    white-space: nowrap;
    color: ${({ theme }) => theme.textL2};
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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;
  padding: 8px 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      padding: ${vm(8)} 0 ${vm(20)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  width: 50%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
    `}
`

const ButtonConfirm = styled(ButtonCommon)`
  width: 50%;
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
  const [walletManagementText, setWalletManagementText] = useState<string>('')
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
        addresses: walletManagementText
          .split(',')
          .map((addr) => addr.trim())
          .filter((addr) => addr.length > 0),
      })
      if ((data as any).isSuccess) {
        if ((data as any).data.status === 'success') {
          await triggerGetPreference()
          toast({
            title: <Trans>Preference Modified</Trans>,
            description: <Trans>Preference modified</Trans>,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-preference',
            iconTheme: theme.textL2,
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
            typeIcon: 'icon-chat-close',
            iconTheme: theme.ruby50,
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
    walletManagementText,
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
    setWalletManagementText(preferenceData.addresses.join(', '))
    setPersonalProfileText(preferenceData.personalProfile)
  }, [preferenceData])

  const renderContent = () => {
    return (
      <>
        <Header>
          <Trans>Preferences</Trans>
        </Header>
        <Content ref={contentRef} className='scroll-style'>
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
          <WatchListWrapper>
            <span className='title'>
              <Trans>Wallet Management</Trans>
            </span>
            <WalletManagement
              walletManagementText={walletManagementText}
              setWalletManagementText={setWalletManagementText}
            />
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
        </Content>
        <ButtonWrapper>
          <ButtonCancel onClick={togglePreferenceModal}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm onClick={handleUpdatePreference}>
            {isLoading ? <Pending /> : <Trans>Confirm</Trans>}
          </ButtonConfirm>
        </ButtonWrapper>
      </>
    )
  }

  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={preferenceModalOpen}
      rootStyle={{ overflowY: 'hidden', maxHeight: `100vh` }}
      onClose={togglePreferenceModal}
    >
      <PerferenceMobileWrapper>{renderContent()}</PerferenceMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={preferenceModalOpen} onDismiss={togglePreferenceModal}>
      <PerferenceWrapper>{renderContent()}</PerferenceWrapper>
    </Modal>
  )
}
