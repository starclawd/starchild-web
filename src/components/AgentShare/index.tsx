import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import { Ref, RefObject, useCallback, useMemo } from 'react'
import { AgentDetailDataType } from 'store/agentdetail/agentdetail'
import styled, { css } from 'styled-components'
import dayjs from 'dayjs'
import { useTimezone } from 'store/timezonecache/hooks'
import Markdown from 'components/Markdown'
import { QRCodeSVG } from 'qrcode.react'
import { useTheme } from 'store/themecache/hooks'
import shareBgTop from 'assets/agent/share-bg-top.svg'
import shareBgBottom from 'assets/agent/share-bg-bottom.svg'
import mobileShareBgTop from 'assets/agent/mobile-share-bg-top.svg'
import mobileShareBgBottom from 'assets/agent/mobile-share-bg-bottom.svg'
import { useIsMobile } from 'store/application/hooks'
import useToast, { TOAST_STATUS } from 'components/Toast'
import html2canvas from 'html2canvas'

const AgentShareWrapper = styled.div`
  position: fixed;
  left: -9999px;
  display: flex;
  flex-direction: column;
  width: 580px;
  height: auto;
  padding: 20px;
  gap: 24px;
  border-radius: 24px;
  background-color: ${({ theme }) => theme.black800};
  overflow: hidden;
  z-index: -1;
  .icon-logo-big {
    position: relative;
    z-index: 2;
    line-height: 20px;
    font-size: 74px;
    color: ${({ theme }) => theme.textL1};
  }
  .share-bg-top {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
    flex-shrink: 0;
  }
  .share-bg-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    flex-shrink: 0;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      width: 320px;
      padding: 20px;
      gap: 20px;
      .share-bg-top {
        width: 100%;
        height: auto;
      }
      .share-bg-bottom {
        font-size: 67px;
        line-height: 18px;
      }
    `}
`

const TopContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.div`
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 18px;
      font-weight: 400;
      line-height: 26px;
    `}
`

const Description = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL3};
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
    `}
`

const SubCount = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span:first-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
    .icon-subscription {
      font-size: 19px;
    }
  }
  > span:last-child {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.textL2};
    img {
      width: 18px;
      height: 18px;
      border-radius: 50%;
    }
  }
`

const RecentChat = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const ChatTitle = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: ${({ theme }) => theme.textL1};
`

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ChatItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.bgT20};
`

const UpdateTime = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.textL2};
`

const ItemTitle = styled.div`
  margin-bottom: 16px;
  .markdown-wrapper {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
    `}
`

const Content = styled.div`
  .markdown-wrapper {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL3};
    display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
    `}
`

const ShareQrCode = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 84px;
  z-index: 2;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: 72px;
    `}
`

const ShareText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding-top: 4px;
  > span {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.textL2};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      > span {
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    `}
`

export function useCopyImgAndText() {
  const toast = useToast()
  const theme = useTheme()
  const copyImgAndText = useCallback(
    async ({
      shareUrl,
      blobDataOrSrc,
      setIsCopyLoading,
    }: {
      shareUrl: string
      blobDataOrSrc: Blob
      setIsCopyLoading: (isCopyLoading: boolean) => void
    }) => {
      const text = new Blob([`${shareUrl}\nTrade smarter with Starchild real-time AI insights.`], {
        type: 'text/plain',
      })
      if (navigator?.clipboard?.write) {
        try {
          await navigator.clipboard?.write([
            new ClipboardItem({
              'text/plain': text,
              [blobDataOrSrc.type]: blobDataOrSrc,
            }),
          ])
          setTimeout(() => {
            toast({
              title: <Trans>Copy Successful</Trans>,
              description: shareUrl,
              status: TOAST_STATUS.SUCCESS,
              typeIcon: 'icon-chat-copy',
              iconTheme: theme.jade10,
              autoClose: 2000,
            })
            setIsCopyLoading(false)
          }, 300)
        } catch (error) {
          setIsCopyLoading(false)
        }
      }
    },
    [toast, theme.jade10],
  )
  return useCallback(
    ({
      shareUrl,
      shareDomRef,
      setIsCopyLoading,
    }: {
      shareUrl: string
      shareDomRef: RefObject<HTMLDivElement>
      setIsCopyLoading: (isCopyLoading: boolean) => void
    }) => {
      setIsCopyLoading(true)
      const contestPoster: HTMLDivElement | null = shareDomRef.current
      if (!contestPoster) return
      contestPoster.style.borderRadius = '0'
      const width = contestPoster.offsetWidth // 获取(原生）dom 宽度
      const height = contestPoster.offsetHeight // 获取(原生）dom 高
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return
      const scaleBy = 2
      canvas.width = width * scaleBy
      canvas.height = height * scaleBy
      context.scale(scaleBy, scaleBy)
      const opts = {
        useCORS: true,
        allowTaint: true,
        tainttest: true,
        scale: 1,
        canvas,
        logging: false,
        width,
        height,
      }
      html2canvas(contestPoster, opts)
        .then((canvas) => {
          contestPoster.style.borderRadius = '16px'
          canvas.toBlob((blobData) => {
            if (blobData) {
              copyImgAndText({
                shareUrl,
                blobDataOrSrc: blobData,
                setIsCopyLoading,
              })
            }
          })
        })
        .catch((error) => {
          setIsCopyLoading(false)
        })
    },
    [copyImgAndText],
  )
}

export default function AgentShare({
  agentDetailData,
  ref,
  shareUrl,
}: {
  agentDetailData: AgentDetailDataType
  ref: Ref<HTMLDivElement>
  shareUrl: string
}) {
  const theme = useTheme()
  const isMobile = useIsMobile()
  const [timezone] = useTimezone()
  const { description, user_name, trigger_history, title, user_avatar, subscription_user_count } = agentDetailData
  const list = useMemo(() => {
    return trigger_history.slice(0, 2).map((item: any) => {
      return {
        updateTime: item.trigger_time,
        content: item.message || item.error,
      }
    })
  }, [trigger_history])

  return (
    <AgentShareWrapper ref={ref}>
      {!isMobile && <img src={shareBgTop} alt='share-bg' className='share-bg-top' />}
      {!isMobile && <img src={shareBgBottom} alt='share-bg' className='share-bg-bottom' />}
      {isMobile && <img src={mobileShareBgTop} alt='share-bg' className='share-bg-top' />}
      {isMobile && <img src={mobileShareBgBottom} alt='share-bg' className='share-bg-bottom' />}
      <IconBase className='icon-logo-big' />
      <TopContent>
        <Title>
          <Markdown>{title}</Markdown>
        </Title>
        <Description>{description}</Description>
        <SubCount>
          <span>
            <IconBase className='icon-subscription' />
            {subscription_user_count}
          </span>
          <span>
            {user_avatar && <img src={user_avatar} alt='user-avatar' />}
            {user_name}
          </span>
        </SubCount>
      </TopContent>
      <RecentChat>
        <ChatTitle>
          <Trans>Recent chats:</Trans>
        </ChatTitle>
        <ChatList>
          {list.map((item, index) => {
            const { updateTime, content } = item
            const splitContent = content.split('\n\n')
            const title = splitContent[0]
            const messageContent = splitContent.slice(1).join('\n\n')
            const formatTime = dayjs.tz(updateTime, timezone).format('YYYY-MM-DD HH:mm:ss')
            return (
              <ChatItem key={index}>
                <UpdateTime>
                  <Trans>{formatTime}</Trans>
                </UpdateTime>
                <ItemTitle>
                  <Markdown>{title}</Markdown>
                </ItemTitle>
                <Content>
                  <Markdown>{messageContent}</Markdown>
                </Content>
              </ChatItem>
            )
          })}
        </ChatList>
      </RecentChat>
      <ShareQrCode>
        <QRCodeSVG size={84} bgColor={theme.black800} fgColor={theme.white} value={shareUrl} />
        <ShareText>
          <IconBase className='icon-logo-big' />
          <span>
            <span>
              <Trans>AI knows before you do.</Trans>
            </span>
            <span>
              <Trans>Scan to Try AI-powered signal</Trans>
            </span>
          </span>
        </ShareText>
      </ShareQrCode>
    </AgentShareWrapper>
  )
}
