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
import logo from 'assets/png/logo.png'
import { isTelegramWebApp } from 'utils/telegramWebApp'
import LazyImage from 'components/LazyImage'

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
  .logo {
    position: relative;
    z-index: 2;
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
  .markdown-wrapper {
    color: ${({ theme }) => theme.black0};
  }
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
  color: ${({ theme }) => theme.black200};
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
    color: ${({ theme }) => theme.black200};
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
    color: ${({ theme }) => theme.black100};
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
  color: ${({ theme }) => theme.black0};
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
  background-color: ${({ theme }) => theme.black800};
`

const UpdateTime = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.black100};
`

const ItemTitle = styled.div`
  margin-bottom: 16px;
  .markdown-wrapper {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black200};
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
    color: ${({ theme }) => theme.black0};
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
      height: auto;
      flex-direction: column;
    `}
`

const ShareText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  height: 100%;
  .share-text-title {
    font-size: 24px;
    font-weight: 200;
    line-height: 32px;
    letter-spacing: 0.72px;
    font-family: 'PowerGrotesk';
    color: ${({ theme }) => theme.black0};
  }
  .share-text-content {
    display: flex;
    flex-direction: column;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: ${({ theme }) => theme.black100};
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: 0;
      .share-text-title {
        text-align: center;
        font-size: 20px;
        font-weight: 200;
        line-height: 28px;
        letter-spacing: 0.6px;
        margin-bottom: 4px;
      }
      .share-text-content {
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        line-height: 18px;
      }
    `}
`

export function useCopyText() {
  const toast = useToast()
  const theme = useTheme()

  return useCallback(
    async ({
      shareUrl,
      setIsCopyLoading,
    }: {
      shareUrl: string
      setIsCopyLoading: (isCopyLoading: boolean) => void
    }) => {
      try {
        await navigator.clipboard.writeText(shareUrl)
        setTimeout(() => {
          toast({
            title: <Trans>Copied</Trans>,
            description: shareUrl,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-copy',
            iconTheme: theme.black0,
            autoClose: 2000,
          })
          setIsCopyLoading(false)
        }, 300)
      } catch (error) {
        // 降级处理：使用传统方法
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
          toast({
            title: <Trans>Copied</Trans>,
            description: shareUrl,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-copy',
            iconTheme: theme.black0,
            autoClose: 2000,
          })
        } catch (err) {
          console.error('Copy text failed', err)
        }
        document.body.removeChild(textarea)
        setIsCopyLoading(false)
      }
    },
    [toast, theme.black0],
  )
}

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
      try {
        // 使用兼容性函数尝试复制图片和文本
        const textBlob = new Blob([shareUrl], { type: 'text/plain' })
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': textBlob,
            [blobDataOrSrc.type]: blobDataOrSrc,
          }),
        ])
        setTimeout(() => {
          toast({
            title: <Trans>Copied</Trans>,
            description: shareUrl,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-copy',
            iconTheme: theme.black0,
            autoClose: 2000,
          })
          setIsCopyLoading(false)
        }, 300)
      } catch (error) {
        setIsCopyLoading(false)
      }
    },
    [toast, theme.black0],
  )
  if (isTelegramWebApp()) {
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
        const textarea = document.createElement('textarea')
        textarea.value = shareUrl
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy')
          toast({
            title: <Trans>Copied</Trans>,
            description: shareUrl,
            status: TOAST_STATUS.SUCCESS,
            typeIcon: 'icon-copy',
            iconTheme: theme.black0,
            autoClose: 2000,
          })
        } catch (err) {
          console.error('Fallback copy failed', err)
        }
        document.body.removeChild(textarea)
        setIsCopyLoading(false)
      },
      [theme.black0, toast],
    )
  }
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
  const { description, user_name, trigger_history, title, subscription_user_count } = agentDetailData
  const list = useMemo(() => {
    // 严格检查trigger_history是不是数组，如果不是则返回空list
    if (!Array.isArray(trigger_history)) {
      return []
    }
    return [...trigger_history]
      .sort((a, b) => b.trigger_time - a.trigger_time)
      .slice(0, 2)
      .map((item: AgentDetailDataType['trigger_history'][number]) => {
        return {
          updateTime: item?.trigger_time || 0,
          content: item?.message || item?.error || '',
        }
      })
  }, [trigger_history])

  return (
    <AgentShareWrapper ref={ref}>
      {!isMobile && (
        <LazyImage
          src={shareBgTop}
          alt='share-bg'
          className='share-bg-top'
          width='100%'
          height='auto'
          objectFit='contain'
          eager
          showSkeleton={false}
        />
      )}
      {!isMobile && (
        <LazyImage
          src={shareBgBottom}
          alt='share-bg'
          className='share-bg-bottom'
          width='100%'
          height='auto'
          objectFit='contain'
          eager
          showSkeleton={false}
        />
      )}
      {isMobile && (
        <LazyImage
          src={mobileShareBgTop}
          alt='share-bg'
          className='share-bg-top'
          width='100%'
          height='auto'
          objectFit='contain'
          eager
          showSkeleton={false}
        />
      )}
      {isMobile && (
        <LazyImage
          src={mobileShareBgBottom}
          alt='share-bg'
          className='share-bg-bottom'
          width='100%'
          height='auto'
          objectFit='contain'
          eager
          showSkeleton={false}
        />
      )}
      <LazyImage
        src={logo}
        alt='logo'
        className='logo'
        width='44px'
        height='44px'
        borderRadius='50%'
        eager
        showSkeleton={false}
      />
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
          <span>{user_name}</span>
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
        <QRCodeSVG size={isMobile ? 72 : 84} bgColor={theme.black800} fgColor={theme.white} value={shareUrl} />
        <ShareText>
          <span className='share-text-title'>STARCHILD</span>
          <span className='share-text-content'>
            <span>
              <Trans>Stop staring at charts. Deploy agents instead.</Trans>
            </span>
            <span>
              <Trans>✦ Your AI trading copilot • Powered by WOO</Trans>
            </span>
          </span>
        </ShareText>
      </ShareQrCode>
    </AgentShareWrapper>
  )
}
