import Modal from 'components/Modal'
import { memo, useMemo, useRef, useState, useCallback } from 'react'
import styled, { css } from 'styled-components'
import { useModalOpen, useShareStrategyModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import logo from 'assets/png/logo.png'
import { Trans } from '@lingui/react/macro'
import { useCurrentShareStrategyData } from 'store/vaultsdetail/hooks/useCurrentShareStrategyData'
import { QRCodeSVG } from 'qrcode.react'
import { starchildDomain } from 'utils/url'
import { ROUTER } from 'pages/router'
import { useTheme } from 'store/themecache/hooks'
import shareLeftBg from 'assets/vaults/share-left-bg.png'
import shareRightBg from 'assets/vaults/share-right-bg.png'
import { formatPercent, getStatValueColor, formatKMBNumber } from 'utils/format'
import { IconBase } from 'components/Icons'
import Divider from 'components/Divider'
import { ANI_DURATION } from 'constants/index'
import html2canvas from 'html2canvas'
import useToast, { TOAST_STATUS } from 'components/Toast'
import Pending from 'components/Pending'
import useCopyContent from 'hooks/useCopyContent'
import { t } from '@lingui/core/macro'

const ShareModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 640px;
`

const ShareContent = styled.div`
  display: flex;
  width: 100%;
  height: 400px;
  background: ${({ theme }) => theme.black900};
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 400px;
  height: 100%;
  padding: 20px;
  gap: 40px;
  background-size: 100%;
  background-repeat: no-repeat;
  .logo {
    width: 32px;
    height: 32px;
  }
`

const StrategyBaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const StrategyName = styled.div`
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px;
  color: ${({ theme }) => theme.black0};
`

const InfoList = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  > span:first-child {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black300};
  }
  > span:last-child {
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 26px;
    color: ${({ theme }) => theme.black0};
  }
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 240px;
  height: 100%;
  padding: 16px;
  background-size: 100%;
  background-repeat: no-repeat;
  .icon-ai-summary {
    font-size: 32px;
    color: ${({ theme }) => theme.black1000};
  }
`

const VibeText = styled.div<{ $length: number }>`
  font-style: italic;
  font-weight: 300;
  color: ${({ theme }) => theme.black1000};
  font-size: ${({ $length }) => ($length <= 50 ? '32px' : $length <= 100 ? '26px' : '20px')};
  line-height: ${({ $length }) => ($length <= 50 ? '40px' : $length <= 100 ? '34px' : '28px')};
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 82px;
`

const FooterContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.black800};
  background: ${({ theme }) => theme.black1000};
`

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
  width: 160px;
  height: 100%;
`

const DownLoadWrapper = styled.div<{ $isLoading: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px;
  transition: all ${ANI_DURATION}s;
  color: ${({ theme }) => theme.black100};
  cursor: pointer;
  .icon-loading {
    font-size: 24px;
  }
  i {
    font-size: 24px;
    transition: all ${ANI_DURATION}s;
    color: ${({ theme }) => theme.black100};
  }
  ${({ $isLoading }) =>
    !$isLoading &&
    css`
      &:hover {
        color: ${({ theme }) => theme.black0};
        i {
          color: ${({ theme }) => theme.black0};
        }
      }
    `}
`

const CopyWrapper = styled(DownLoadWrapper)``

const FooterRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 160px;
  height: 100%;
  span {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black100};
  }
`

const SocialWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  i {
    font-size: 32px;
    cursor: pointer;
    transition: all ${ANI_DURATION}s;
    &:hover {
      opacity: 0.7;
    }
  }
  .icon-telegram {
    color: rgba(54, 121, 209, 1);
  }
  .icon-x {
    color: ${({ theme }) => theme.black0};
  }
  .icon-discord {
    color: rgba(77, 57, 230, 1);
  }
`

const ShareQrCode = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 64px;
  z-index: 2;
`

const ShareText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  height: 100%;
  .share-text-title {
    font-size: 20px;
    font-style: normal;
    font-weight: 300;
    line-height: 120%; /* 24px */
    letter-spacing: 0.6px;
    font-family: 'PowerGrotesk';
    color: ${({ theme }) => theme.black0};
  }
  .share-text-content {
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black100};
  }
`

export default memo(function ShareModal() {
  const theme = useTheme()
  const toast = useToast()
  const { copyRawContent } = useCopyContent()
  const shareContentRef = useRef<HTMLDivElement>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const [currentShareStrategyData] = useCurrentShareStrategyData()
  const shareStrategyModalOpen = useModalOpen(ApplicationModal.SHARE_STRATEGY_MODAL)
  const toggleShareStrategyModal = useShareStrategyModalToggle()
  const vibe = currentShareStrategyData?.vibe || ''
  const strategyName = currentShareStrategyData?.strategy_name
  const shareUrl = useMemo(() => {
    return `${starchildDomain['frontendPageDomain']}${ROUTER.VAULT_DETAIL}?strategyId=${currentShareStrategyData?.strategy_id}`
  }, [currentShareStrategyData?.strategy_id])
  const infoList = useMemo(() => {
    return [
      {
        key: 'apr',
        text: <Trans>All time APR</Trans>,
        value: (
          <span style={{ color: getStatValueColor(currentShareStrategyData?.all_time_apr, true, theme) }}>
            {formatPercent({ value: currentShareStrategyData?.all_time_apr || 0, precision: 2 })}
          </span>
        ),
      },
      {
        key: 'TVF',
        text: <Trans>TVF</Trans>,
        value: `${currentShareStrategyData?.tvf ? formatKMBNumber(currentShareStrategyData?.tvf, 2, { showDollar: true }) : '0'}`,
      },
      {
        key: 'Followers',
        text: <Trans>Followers</Trans>,
        value: `${currentShareStrategyData?.followers || 0}`,
      },
    ]
  }, [currentShareStrategyData, theme])

  // 生成图片的通用方法
  const generateImage = useCallback((): Promise<HTMLCanvasElement | null> => {
    return new Promise((resolve) => {
      const shareContent = shareContentRef.current
      if (!shareContent) {
        resolve(null)
        return
      }
      const width = shareContent.offsetWidth
      const height = shareContent.offsetHeight
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) {
        resolve(null)
        return
      }
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
      html2canvas(shareContent, opts)
        .then((canvas) => {
          resolve(canvas)
        })
        .catch(() => {
          resolve(null)
        })
    })
  }, [])

  // 下载图片
  const handleDownload = useCallback(async () => {
    if (isDownloading) return
    setIsDownloading(true)
    try {
      const canvas = await generateImage()
      if (canvas) {
        const link = document.createElement('a')
        link.download = `starchild-strategy-${currentShareStrategyData?.strategy_id || 'share'}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
        toast({
          title: <Trans>Downloaded</Trans>,
          description: <Trans>Image saved successfully</Trans>,
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-download',
          iconTheme: theme.black0,
        })
      }
    } catch (error) {
      console.error('Download failed', error)
    } finally {
      setIsDownloading(false)
    }
  }, [isDownloading, generateImage, currentShareStrategyData?.strategy_id, toast, theme.black0])

  // 复制链接和图片
  const handleCopyLink = useCallback(async () => {
    if (isCopying) return
    setIsCopying(true)
    try {
      const canvas = await generateImage()
      if (canvas) {
        canvas.toBlob(async (blobData) => {
          if (blobData) {
            try {
              const textBlob = new Blob([shareUrl], { type: 'text/plain' })
              await navigator.clipboard.write([
                new ClipboardItem({
                  'text/plain': textBlob,
                  [blobData.type]: blobData,
                }),
              ])
              toast({
                title: <Trans>Copied</Trans>,
                description: shareUrl,
                status: TOAST_STATUS.SUCCESS,
                typeIcon: 'icon-copy',
                iconTheme: theme.black0,
              })
            } catch (error) {
              // 降级处理：只复制文本
              await navigator.clipboard.writeText(shareUrl)
              toast({
                title: <Trans>Copied</Trans>,
                description: shareUrl,
                status: TOAST_STATUS.SUCCESS,
                typeIcon: 'icon-copy',
                iconTheme: theme.black0,
              })
            }
          }
          setIsCopying(false)
        })
      } else {
        setIsCopying(false)
      }
    } catch (error) {
      console.error('Copy failed', error)
      setIsCopying(false)
    }
  }, [isCopying, generateImage, shareUrl, toast, theme.black0])

  // 分享到 Telegram
  const handleShareToTelegram = useCallback(() => {
    const shareText = t`Vibe more, earn more on Starchild.`
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
    window.open(telegramUrl, '_blank')
  }, [shareUrl])

  // 分享到 X (Twitter)
  const handleShareToX = useCallback(() => {
    const shareText = t`Vibe more, earn more on Starchild.`
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(xUrl, '_blank')
  }, [shareUrl])

  // 分享到 Discord (复制链接提示用户粘贴)
  const handleShareToDiscord = useCallback(() => {
    copyRawContent(shareUrl)
  }, [shareUrl, copyRawContent])
  if (!currentShareStrategyData) {
    return null
  }
  return (
    <Modal useDismiss hideClose isOpen={shareStrategyModalOpen} onDismiss={toggleShareStrategyModal}>
      <ShareModalWrapper>
        <ShareContent ref={shareContentRef}>
          <LeftSection style={{ backgroundImage: `url(${shareLeftBg})` }}>
            <img className='logo' src={logo} alt='logo' />
            <StrategyBaseInfo>
              <StrategyName>{strategyName}</StrategyName>
              <InfoList>
                {infoList.map((item) => (
                  <InfoItem key={item.key}>
                    <span>{item.text}</span>
                    <span>{item.value}</span>
                  </InfoItem>
                ))}
              </InfoList>
            </StrategyBaseInfo>
            <ShareQrCode>
              <QRCodeSVG size={64} bgColor={theme.black900} fgColor={theme.white} value={shareUrl} />
              <ShareText>
                <span className='share-text-title'>STARCHILD</span>
                <span className='share-text-content'>
                  <Trans>Vibe more, Earn more</Trans>
                </span>
              </ShareText>
            </ShareQrCode>
          </LeftSection>
          <RightSection style={{ backgroundImage: `url(${shareRightBg})` }}>
            <IconBase className='icon-ai-summary' />
            <VibeText $length={vibe.length}>{vibe}</VibeText>
          </RightSection>
        </ShareContent>
        <Footer>
          <FooterContent>
            <FooterLeft>
              <DownLoadWrapper $isLoading={isDownloading} onClick={handleDownload}>
                {isDownloading ? <Pending /> : <IconBase className='icon-download' />}
                <span>
                  <Trans>Download</Trans>
                </span>
              </DownLoadWrapper>
              <CopyWrapper $isLoading={isCopying} onClick={handleCopyLink}>
                {isCopying ? <Pending /> : <IconBase className='icon-copy' />}
                <span>
                  <Trans>Copy</Trans>
                </span>
              </CopyWrapper>
            </FooterLeft>
            <Divider vertical height={1} length={58} paddingHorizontal={20} />
            <FooterRight>
              <span>
                <Trans>Share to</Trans>
              </span>
              <SocialWrapper>
                <IconBase className='icon-telegram' onClick={handleShareToTelegram} />
                <IconBase className='icon-x' onClick={handleShareToX} />
                <IconBase className='icon-discord' onClick={handleShareToDiscord} />
              </SocialWrapper>
            </FooterRight>
          </FooterContent>
        </Footer>
      </ShareModalWrapper>
    </Modal>
  )
})
