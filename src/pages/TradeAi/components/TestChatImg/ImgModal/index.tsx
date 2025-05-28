import { memo } from 'react'
import styled, { css } from "styled-components"
import Modal from "components/Modal"
import { useIsMobile } from 'store/application/hooks'
import { ModalSafeAreaWrapper } from "components/SafeAreaWrapper"
import { vm } from 'pages/helper'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import copy from 'copy-to-clipboard'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'


const AddQuestionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: 36px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
  ${({ theme }) => !theme.isMobile && css`
    padding-bottom: 20px;
  `}
`

const AddQuestionMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)} ${vm(20)} ${vm(8)};
    font-size: 0.20rem;
    font-weight: 500;
    line-height: 0.28rem;
  `}
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  ${({ theme }) => theme.isMobile && css`
    padding: ${vm(20)};
  `}
`

const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textL1};
`

const ImgItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
  .icon-chat-copy {
    font-size: 16px;
    color: ${({ theme }) => theme.textL1};
  }
`

export default memo(function ImgModal({
  imgList,
  isShowModal,
  toggleTestChatImgModal,
}: {
  imgList: string[]
  isShowModal: boolean
  toggleTestChatImgModal: () => void
}) {
  const toast = useToast()
  const theme = useTheme()
  const isMobile = useIsMobile()
  const Wrapper = isMobile ? AddQuestionMobileWrapper : AddQuestionWrapper
  return (
    <Modal
      useDismiss
      isOpen={isShowModal}
      onDismiss={toggleTestChatImgModal}
    >
      <Wrapper>
        <Header>
          <span><Trans>Img List</Trans></span>
        </Header>
        <Content>
          <ImgWrapper>
            {imgList.map((item: any, index: number) => {
              return <ImgItem key={index} onClick={() => {
                copy(item)
                toast({
                  title: <Trans>Copied</Trans>,
                  description: item,
                  status: TOAST_STATUS.SUCCESS,
                  typeIcon: 'icon-chat-copy',
                  iconTheme: theme.textL1,
                })
              }}>
                <span>{item}</span>
                <IconBase className="icon-chat-copy"/>
              </ImgItem>
            })}
          </ImgWrapper>
        </Content>
      </Wrapper>
    </Modal>
  ) 
})
   