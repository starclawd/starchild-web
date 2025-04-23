import { memo, useCallback, useMemo, useState } from 'react'
import styled, { css } from "styled-components"
import Modal from "components/Modal"
import { useDislikeModalToggle, useIsMobile, useModalOpen } from 'store/application/hooks'
import { ModalContentWrapper } from "components/ModalWrapper"
import { ApplicationModal } from 'store/application/application.d'
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { t } from '@lingui/core/macro'
import { ButtonCommon } from 'components/Button'
import InputArea from 'components/InputArea'
import { IconBase } from 'components/Icons'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { useTheme } from 'store/themecache/hooks'


const DislikeModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 704px;
  padding: 8px 32px 0;
  background-color: ${({ theme }) => theme.bg3};
`

const DislikeModalMobileWrapper = styled(ModalContentWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: rgba(25, 27, 31, 0.85);
  backdrop-filter: blur(8px);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)} ${vm(20)} ${vm(8)};
    font-size: 0.20rem;
    font-weight: 500;
    line-height: 0.28rem;
    color: ${theme.textL1};
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(20)};
    padding: ${vm(20)};
    > span:first-child {
      font-size: 0.12rem;
      font-weight: 400;
      line-height: 0.18rem;
      color: ${theme.textL3};
      text-align: center;
    }
  `}
`

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(12)};
    span:first-child {
      font-size: 0.16rem;
      font-weight: 500;
      line-height: 0.24rem;
      color: ${theme.textL1};
      text-align: center;
    }
    span:last-child {
      font-size: 0.12rem;
      font-weight: 400;
      line-height: 0.18rem;
      color: ${theme.textL3};
      text-align: center;
    }
  `}
`

const InputWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    min-height: ${vm(60)};
    max-height: ${vm(264)};
    padding: ${vm(12)} ${vm(16)};
    textarea {
      height: ${vm(24)};
      min-height: ${vm(24)};
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.24rem;
      color: ${({ theme }) => theme.textL1};
      background-color: transparent;
      &::placeholder {
        color: ${({ theme }) => theme.textL4};
      }
    }
  `}
`

const FeedBackList = styled.div`
  display: flex;
  align-items: center;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    padding: 0 ${vm(20)};
  `}
`

const FeedBackItem = styled(BorderAllSide1PxBox)<{ $isOtherFeedback: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  ${({ theme, $isOtherFeedback }) => theme.isMobile && css`
    width: 25%;
    gap: ${vm(6)};
    height: ${vm(62)};
    padding: ${vm(8)};
    background-color: ${theme.sfC1};
    font-size: .12rem;
    font-weight: 400;
    line-height: .18rem; 
    color: ${theme.textL2};
    i {
      font-size: 0.20rem;
      color: ${theme.textL2};
    }
    ${$isOtherFeedback && css`
      background-color: transparent;
    `}
  `}
`


const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(8)} ${vm(20)};
  `}
`

const BorderWrapper = styled(BorderAllSide1PxBox)`
  width: 100%;
`

const ButtonRemove = styled(ButtonCommon)`
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    color: ${theme.ruby50};
    gap: ${vm(8)};
    height: ${vm(60)};
    background-color: transparent;
    .icon-chat-dislike-fill {
      font-size: 0.24rem;
    }
  `}
`

const ButtonSendFeedback = styled(ButtonCommon)`
  width: 100%;
`

export default memo(function DislikeModal() {
  const theme = useTheme()
  const [isFocused, setIsFocused] = useState(false)
  const isMobile = useIsMobile()
  const [value, setValue] = useState('')
  const [otherFeedback, setOtherFeedback] = useState(false)
  const dislikeModalOpen = useModalOpen(ApplicationModal.DISLIKE_MODAL)
  const toggleDislikeModal = useDislikeModalToggle()
  const feedBackList = useMemo(() => {
    return [
      {
        key: 'Inaccurate',
        text: t`Inaccurate`,
        value: 'Inaccurate',
        icon: 'icon-chat-border-close',
      },
      {
        key: 'Offensive',
        text: t`Offensive`,
        value: 'Offensive',
        icon: 'icon-chat-hammer',
      },
      {
        key: 'Useless',
        text: t`Useless`,
        value: 'Useless',
        icon: 'icon-chat-useless',
      },
      {
        key: 'Other',
        text: t`Other`,
        value: 'Other',
        icon: 'icon-chat-other',
      },
    ]
  }, [])
  const confirmInputDislikeContent = useCallback((value: string) => {
    return () => {
      console.log('confirmInputDislikeContent')
    }
  }, [])
  const changeOtherStatus = useCallback(() => {
    setOtherFeedback(true)
  }, [])
  const sendFeedback = useCallback(() => {
    console.log('sendFeedback', value)
  }, [value])
  const onFocus = useCallback(() => {
    setIsFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    setIsFocused(false)
  }, [])
  const removeDislikeFeedback = useCallback(() => {
    console.log('removeDislikeFeedback')
  }, [])
  const Wrapper = isMobile ? DislikeModalMobileWrapper : DislikeModalWrapper
  return (
    <Modal
      useDismiss
      isOpen={dislikeModalOpen}
      onDismiss={toggleDislikeModal}
    >
      <Wrapper>
        <Header>
          <span>Feedback</span>
        </Header>
        {
          otherFeedback
            ? <Content>
              <TextContent>
                <span><Trans>We sincerely apologize.</Trans></span>
                <span><Trans>Could you please tell us why you dislike this information?<br />Your feedback will help us improve our AI.</Trans></span>
              </TextContent>
              <InputWrapper
                $borderRadius={vm(24)}
                $borderColor={isFocused ? theme.jade10 : theme.textL5}
              >
                <InputArea
                  value={value}
                  placeholder={t`Please enter your feedback`}
                  setValue={setValue}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </InputWrapper>
            </Content>
            : <Content>
              <span><Trans>Please tell us why you dislike this information.<br/>Your feedback will help us improve our AI.</Trans></span>
              <FeedBackList>
                {
                  feedBackList.map((item) => {
                    const { key, text, value, icon } = item
                    const isOtherFeedback = key === 'Other'
                    return (
                      <FeedBackItem
                        key={key}
                        $borderRadius={12}
                        $borderColor={theme.bgT30}
                        $hideBorder={!isOtherFeedback}
                        $isOtherFeedback={isOtherFeedback}
                        onClick={!isOtherFeedback ? confirmInputDislikeContent(value) : changeOtherStatus}>
                        <IconBase className={icon} />
                        <span>{text}</span>
                      </FeedBackItem>
                    )
                  })
                }
              </FeedBackList>
            </Content>
        }
        <ButtonWrapper>
          {
            otherFeedback ? (
              <ButtonSendFeedback disabled={!value} onClick={sendFeedback}>
                <span><Trans>Send Feedback</Trans></span>
              </ButtonSendFeedback>
            ) : (
              <BorderWrapper
                $borderRadius={60}
                $borderColor={theme.bgT30}
              >
                <ButtonRemove disabled={!value} onClick={removeDislikeFeedback}>
                  <span><Trans>Remove</Trans></span>
                  <IconBase className="icon-chat-dislike-fill" />
                </ButtonRemove>
              </BorderWrapper>
            )
          }
        </ButtonWrapper>
      </Wrapper>
    </Modal>
  ) 
})
   