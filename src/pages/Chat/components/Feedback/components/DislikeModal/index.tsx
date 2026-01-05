import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import Modal from 'components/Modal'
import { useIsMobile } from 'store/application/hooks'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { IconBase } from 'components/Icons'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'
import { useChatFeedback, useGetAiBotChatContents } from 'store/chat/hooks'
import { useCurrentAiThreadId } from 'store/chatcache/hooks'
import { TempAiContentDataType } from 'store/chat/chat'
import { useUserInfo } from 'store/login/hooks'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import BottomSheet from 'components/BottomSheet'
import { ANI_DURATION } from 'constants/index'

const DislikeModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  max-height: calc(100vh - 40px);
  border-radius: 24px;
  padding: 0 20px;
  background: ${({ theme }) => theme.black800};
  backdrop-filter: blur(8px);
`

const DislikeModalMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 ${vm(20)};
  background: ${({ theme }) => theme.black700};
`

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 0 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(20)} 0 ${vm(8)};
      font-size: 0.2rem;
      line-height: 0.28rem;
    `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 20px;
  &.content-other-wrapper {
    padding: 20px 0;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(20)};
      padding: ${vm(20)} 0;
    `}
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
  color: ${({ theme }) => theme.black200};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.13rem;
      line-height: 0.2rem;
    `}
`

const OtherTextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 12px;
  span:first-child {
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    text-align: center;
    color: ${({ theme }) => theme.black0};
  }
  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
    text-align: center;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      span:first-child {
        font-size: 0.16rem;
        font-weight: 500;
        line-height: 0.24rem;
        color: ${theme.black0};
        text-align: center;
      }
      span:last-child {
        font-size: 0.12rem;
        font-weight: 400;
        line-height: 0.18rem;
        color: ${theme.black200};
        text-align: center;
      }
    `}
`

const InputWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.black700};
  textarea {
    min-height: 120px;
    max-height: 120px;
    padding: 12px 16px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black0};
    background-color: transparent;
    &::placeholder {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: ${({ theme }) => theme.black300};
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      textarea {
        min-height: ${vm(120)};
        max-height: ${vm(120)};
        padding: ${vm(12)} ${vm(16)};
        font-size: 0.14rem;
        font-weight: 400;
        line-height: 0.2rem;
        color: ${({ theme }) => theme.black0};
        background-color: transparent;
        &::placeholder {
          font-size: 0.14rem;
          font-weight: 400;
          line-height: 0.2rem;
        }
      }
    `}
`

const FeedBackList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`

const FeedBackItem = styled(BorderAllSide1PxBox)<{ $isOtherFeedback: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
  width: 108px;
  height: 62px;
  transition: all ${ANI_DURATION}s;
  background-color: ${({ theme }) => theme.black700};
  color: ${({ theme }) => theme.black100};
  border-radius: 12px;
  i {
    font-size: 20px;
    color: ${({ theme }) => theme.black100};
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
  }
  ${({ theme }) =>
    theme.isMobile
      ? css`
          width: ${vm(93)};
          gap: ${vm(4)};
          height: ${vm(62)};
          padding: ${vm(8)};
          font-size: 0.12rem;
          font-weight: 400;
          line-height: 0.18rem;
          background-color: ${theme.black600};
          i {
            font-size: 0.2rem;
            color: ${theme.black100};
          }
        `
      : css`
          cursor: pointer;
          &:hover {
            background-color: ${theme.black600};
          }
        `}

  ${({ theme, $isOtherFeedback }) =>
    $isOtherFeedback &&
    css`
      background-color: transparent;
      &:hover {
        background-color: ${theme.black800};
      }
    `}
`

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0 20px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} 0 ${vm(20)};
    `}
`

const BorderWrapper = styled(BorderAllSide1PxBox)`
  width: 100%;
`

const ButtonRemove = styled(ButtonCommon)`
  width: 100%;
  background-color: transparent;
  color: ${({ theme }) => theme.red100};
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  line-height: 26px;
  i {
    font-size: 24px;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
      background-color: transparent;
      .icon-chat-dislike-fill {
        font-size: 0.24rem;
      }
    `}
`

const ButtonSendFeedback = styled(ButtonCommon)`
  width: 100%;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(40)};
      font-size: 0.14rem;
      font-weight: 500;
      line-height: 0.2rem;
    `}
`

export default memo(function DislikeModal({
  data,
  isShowDislikeModal,
  setIsShowDislikeModal,
}: {
  data: TempAiContentDataType
  isShowDislikeModal: boolean
  setIsShowDislikeModal: (isShowDislikeModal: boolean) => void
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const toast = useToast()
  const { id, content } = data
  const [value, setValue] = useState('')
  const triggerChatFeedback = useChatFeedback()
  const [currentAiThreadId] = useCurrentAiThreadId()
  const [isDislikeLoading, setIsDislikeLoading] = useState(false)
  const [currentDislikeReason, setCurrentDislikeReason] = useState('')
  const [otherFeedback, setOtherFeedback] = useState(false)
  const triggerGetAiBotChatContents = useGetAiBotChatContents()
  const feedBackList = useMemo(() => {
    return [
      {
        key: 'Inaccurate',
        text: <Trans>Inaccurate</Trans>,
        value: 'Inaccurate',
        icon: 'icon-chat-border-close',
      },
      // {
      //   key: 'Offensive',
      //   text: <Trans>Offensive</Trans>,
      //   value: 'Offensive',
      //   icon: 'icon-chat-hammer',
      // },
      {
        key: 'Useless',
        text: <Trans>Useless</Trans>,
        value: 'Useless',
        icon: 'icon-chat-useless',
      },
      {
        key: 'Other',
        text: <Trans>Other</Trans>,
        value: 'Other',
        icon: 'icon-chat-other',
      },
    ]
  }, [])
  const confirmInputDislikeContent = useCallback(
    (value: string) => {
      return async () => {
        try {
          if (isDislikeLoading) return
          setIsDislikeLoading(true)
          setCurrentDislikeReason(value)
          await triggerChatFeedback({
            chatId: currentAiThreadId,
            messageId: id,
            feedbackType: 'dislike',
            dislikeReason: value,
            originalMessage: content,
          })
          await triggerGetAiBotChatContents({
            threadId: currentAiThreadId,
          })
          if (isShowDislikeModal) {
            setIsShowDislikeModal(false)
          }
          toast({
            title: <Trans>Feedback Received</Trans>,
            description: (
              <Trans>
                Thank you for your feedback. We've received your submission and will use it to improve our service.
              </Trans>
            ),
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-feedback',
            iconTheme: theme.black100,
          })
          setCurrentDislikeReason('')
          setIsDislikeLoading(false)
        } catch (error) {
          setIsDislikeLoading(false)
          setCurrentDislikeReason('')
        }
      }
    },
    [
      id,
      content,
      isDislikeLoading,
      currentAiThreadId,
      isShowDislikeModal,
      theme.black100,
      toast,
      setIsShowDislikeModal,
      triggerChatFeedback,
      triggerGetAiBotChatContents,
    ],
  )
  const changeOtherStatus = useCallback(() => {
    setOtherFeedback(true)
  }, [])
  const sendFeedback = useCallback(() => {
    if (!value.trim()) return
    confirmInputDislikeContent(value)()
  }, [value, confirmInputDislikeContent])
  const renderContent = () => (
    <>
      <Header>
        <span>
          <Trans>Feedback</Trans>
        </span>
      </Header>
      {otherFeedback ? (
        <Content className='content-other-wrapper'>
          <OtherTextContent>
            <span>
              <Trans>We sincerely apologize.</Trans>
            </span>
            <span>
              <Trans>
                Could you please tell us why you dislike this information?
                <br />
                Your feedback will help us improve our AI.
              </Trans>
            </span>
          </OtherTextContent>
          <InputWrapper $borderRadius={12} $borderColor={theme.black600}>
            <InputArea value={value} placeholder={t`Please enter your feedback`} setValue={setValue} />
          </InputWrapper>
        </Content>
      ) : (
        <Content>
          <TextContent>
            <Trans>
              Please tell us why you dislike this information.
              <br />
              Your feedback will help us improve our AI.
            </Trans>
          </TextContent>
          <FeedBackList>
            {feedBackList.map((item) => {
              const { key, text, value, icon } = item
              const isOtherFeedback = key === 'Other'
              return (
                <FeedBackItem
                  key={key}
                  $borderRadius={12}
                  $borderColor={theme.black600}
                  $hideBorder={!isOtherFeedback}
                  $isOtherFeedback={isOtherFeedback}
                  onClick={!isOtherFeedback ? confirmInputDislikeContent(value) : changeOtherStatus}
                >
                  {isDislikeLoading && currentDislikeReason === value ? (
                    <Pending />
                  ) : (
                    <>
                      <IconBase className={icon} />
                      <span>{text}</span>
                    </>
                  )}
                </FeedBackItem>
              )
            })}
          </FeedBackList>
        </Content>
      )}
      {otherFeedback && (
        <ButtonWrapper>
          <ButtonSendFeedback $disabled={!value.trim()} onClick={sendFeedback}>
            {isDislikeLoading ? (
              <Pending />
            ) : (
              <span>
                <Trans>Send Feedback</Trans>
              </span>
            )}
          </ButtonSendFeedback>
        </ButtonWrapper>
      )}
    </>
  )
  return isMobile ? (
    <BottomSheet
      placement='mobile'
      hideClose={false}
      hideDragHandle
      isOpen={isShowDislikeModal}
      rootStyle={{ height: 'fit-content' }}
      onClose={() => setIsShowDislikeModal(false)}
    >
      <DislikeModalMobileWrapper>{renderContent()}</DislikeModalMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={isShowDislikeModal} onDismiss={() => setIsShowDislikeModal(false)}>
      <DislikeModalWrapper>{renderContent()}</DislikeModalWrapper>
    </Modal>
  )
})
