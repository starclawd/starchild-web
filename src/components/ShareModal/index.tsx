/**
 * 分享弹窗组件
 * 用于展示分享内容，支持图片分享、链接复制、社交媒体分享等功能
 * 支持移动端和PC端不同展示形式
 */
import Modal from "components/Modal"
import { useIsMobile, useModalOpen, useShareModalToggle } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { Dispatch, memo, ReactNode, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import Portal from 'components/Portal'
import html2canvas from 'html2canvas'
import { goOutPageDirect } from 'utils/url'
import { ImgListType } from 'store/application/application.d'
import { useShareUrl } from 'store/application/hooks'
import ButtonLoading, { BUTTON_LOADING_TYPE } from 'components/ButtonLoading'
import copy from 'copy-to-clipboard'
import { ShareWrapper, ShareMobileWrapper, Header, PortalWrapper, OperatorWrapper, Item, ItemIcon } from './styles'
import ImageMobileWrapperCom from './components/ImageMobileWrapper'
import ImageWrapperCom from './components/ImageWrapper'

/**
 * ShareModal组件属性接口
 */
interface ShareModalProps {
  useOutShow?: boolean             // 是否使用外部控制显示状态
  outShow?: boolean               // 外部控制的显示状态
  outSetShow?: Dispatch<SetStateAction<boolean>>  // 外部控制显示状态的设置函数
  shareText: string               // 分享文本内容
  headerTitle?: ReactNode         // 弹窗标题
  imgList: ImgListType[]         // 分享图片列表
  showReferralId?: boolean       // 是否显示推荐ID
}

/**
 * ShareModal组件
 * 提供多种分享方式：
 * 1. 图片分享：支持下载和预览
 * 2. 链接分享：支持复制分享链接
 * 3. 社交媒体分享：支持Twitter、Discord、Telegram等平台
 */
export default memo(function ShareModal({
  useOutShow,
  outShow,
  outSetShow,
  imgList,
  shareText,
  headerTitle,
  showReferralId,
}: ShareModalProps) {
  const isMobile = useIsMobile()
  const shareUrl = useShareUrl()
  const [isCopyLoading, setIsCopyLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imgIndex, setImgIndex] = useState<number>(0)
  const shareModalOpen = useModalOpen(ApplicationModal.SHARE)
  const toggleShareModal = useShareModalToggle()
  const isShowModal = useOutShow ? !!outShow : shareModalOpen
  const closeShareModal = useCallback(() => {
    if (useOutShow) { 
      outSetShow?.(false)
    } else {
      toggleShareModal()
    }
  }, [toggleShareModal, useOutShow, outSetShow])
  const downLoadImg = useCallback((url: string, fileName: string) => {
    const style = {
      position: 'absolute',
      top: '0',
      left: '0',
      visibility: 'hidden',
      height: '0',
      opacity: '0',
      overflow: 'hidden'
    }
    const downloadBtn = document.createElement('a')
    for (const key in style) {
      downloadBtn.style[key as keyof typeof style] = style[key as keyof typeof style]
    }
    downloadBtn.setAttribute('download', fileName)
    downloadBtn.setAttribute('rel', 'nofollow')
    downloadBtn.setAttribute('href', url)
    document.body.appendChild(downloadBtn)
    downloadBtn.click()
    document.body.removeChild(downloadBtn)
  }, [])
  const copyImgAndText = useCallback(async (blobDataOrSrc: Blob) => {
    const text = new Blob([shareUrl], {type: 'text/plain'})
    if (navigator?.clipboard?.write) {
      try {
        await navigator.clipboard?.write([
          new ClipboardItem({
            'text/plain': text,
            [blobDataOrSrc.type]: blobDataOrSrc
          })
        ])
        setTimeout(() => {
          setIsCopyLoading(false)
        }, 300)
      } catch (error) {
        setIsCopyLoading(false)
        // promptInfo(PromptInfoType.ERROR, handleError(error).message)
      }
    }
  }, [shareUrl])
  const canvasTransfer = useCallback((isCopy = false) => {
    if (!isCopy) {
      setIsLoading(true)
    } else {
      setIsCopyLoading(true)
    }
    // 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
    const id = imgList[imgIndex].id
    const contestPoster: HTMLDivElement | null = document.querySelector(`#${id}`)
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
      allowTaint: true, // 允许加载跨域的图片
      tainttest: true, // 检测每张图片都已经加载完成
      scale: 1, // 添加的scale 参数
      canvas, // 自定义 canvas
      logging: true, // 日志开关，发布的时候记得改成false
      width, // dom 原始宽度
      height // dom 原始高度
    }
    html2canvas(contestPoster, opts).then((canvas) => {
      contestPoster.style.borderRadius = '16px'
      if (isCopy) {
        canvas.toBlob((blobData) => {
          if (blobData) {
            copyImgAndText(blobData)
          }
        })
      } else {
        const posterBase64Img = canvas.toDataURL('image/jpeg')
        downLoadImg(posterBase64Img, 'jojo_referral')
      }
    }).catch((error) => {
      setIsLoading(false)
      setIsCopyLoading(false)
    })
  }, [isMobile, imgList, imgIndex, copyImgAndText])
  const url = useMemo(() => {
    return `${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
  }, [shareText, shareUrl])
  const copyUrl = useCallback(() => {
    if (!!navigator?.clipboard?.write && !isMobile) {
      if (!isCopyLoading) {
        canvasTransfer(true)
      }
    } else {
      copy(shareUrl)
      // promptInfo(PromptInfoType.SUCCESS, <Trans>Copy Successful</Trans>)
    }
  }, [isMobile, shareUrl, isCopyLoading, canvasTransfer])
  const shareToTwitter = useCallback(() => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${url}`
    goOutPageDirect(twitterUrl)
  }, [url])
  const shareToIns = useCallback(() => {
    copyUrl()
    const insUrl = 'https://www.instagram.com/'
    goOutPageDirect(insUrl)
  }, [copyUrl])
  const shareToTelegram = useCallback(() => {
    const telegramUrl = `https://t.me/share/url?text=${url}`
    goOutPageDirect(telegramUrl)
  }, [url])
  const shareToDiscord = useCallback(() => {
    copyUrl()
    const discordUrl = 'https://discord.com/channels/@me'
    goOutPageDirect(discordUrl)
  }, [copyUrl])
  const mediaList = useMemo(() => {
    if (isMobile) {
      return [
        {
          key: 'Copy',
          value: <Trans>Copy</Trans>,
          icon: isCopyLoading ? <ButtonLoading type={BUTTON_LOADING_TYPE.TRANSPARENT_BUTTON} /> : <IconBase className="icon-mobile-copy" />,
          onClick: copyUrl,
        },
        {
          key: 'Download',
          value: <Trans>Download</Trans>,
          icon: isLoading ? <ButtonLoading type={BUTTON_LOADING_TYPE.TRANSPARENT_BUTTON} /> : <IconBase className="icon-share-download" />,
          onClick: () => canvasTransfer(false),
        },
      ]
    }
    return [
      {
        key: 'Twitter',
        value: <Trans>Twitter</Trans>,
        icon: <IconBase className="icon-twitter" />,
        onClick: shareToTwitter,
      },
      {
        key: 'Instagram',
        value: <Trans>Instagram</Trans>,
        icon: <IconBase className="icon-ins" />,
        onClick: shareToIns,
      },
      {
        key: 'Telegram',
        value: <Trans>Telegram</Trans>,
        icon: <IconBase className="icon-telegram" />,
        onClick: shareToTelegram,
      },
      {
        key: 'Discord',
        value: <Trans>Discord</Trans>,
        icon: <IconBase className="icon-discord" />,
        onClick: shareToDiscord,
      },
      {
        key: 'Copy',
        value: <Trans>Copy</Trans>,
        icon: isCopyLoading ? <ButtonLoading type={BUTTON_LOADING_TYPE.TRANSPARENT_BUTTON} /> : <IconBase className="icon-mobile-copy" />,
        onClick: copyUrl,
      },
      {
        key: 'Download',
        value: <Trans>Download</Trans>,
        icon: isLoading ? <ButtonLoading type={BUTTON_LOADING_TYPE.TRANSPARENT_BUTTON} /> : <IconBase className="icon-share-download" />,
        onClick: () => canvasTransfer(false),
      },
    ]
  }, [isMobile, isLoading, isCopyLoading, copyUrl, canvasTransfer, shareToTwitter, shareToIns, shareToTelegram, shareToDiscord])
  const imgLength = useMemo(() => {
    return imgList.length
  }, [imgList])
  
  const Wrapper = isMobile ? ShareMobileWrapper : ShareWrapper
  return (
    <Modal useDismiss isOpen={isShowModal} onDismiss={closeShareModal}>
      <Wrapper imgLength={imgLength}>
        <Header>
          {isMobile
            ? <Trans>Share to</Trans>
            : headerTitle
              ? headerTitle
              : <Trans>Share with friends</Trans>}
          
        </Header>
        {isMobile
          ? <Portal>
            <PortalWrapper length={imgList.length}>
              <ImageMobileWrapperCom setImgIndex={setImgIndex} imgList={imgList} />
            </PortalWrapper>
          </Portal>
          : <ImageWrapperCom
            imgList={imgList}
            imgIndex={imgIndex}
            imgLength={imgLength}
            setImgIndex={setImgIndex}
          />
        }
        <OperatorWrapper>
          {mediaList.map((data) => {
            const { key, value, icon, onClick } = data
            return <Item key={key} onClick={onClick as any}>
              <ItemIcon className="icon">{icon}</ItemIcon>
              <span className="title">{value}</span>
            </Item>
          })}
        </OperatorWrapper>
      </Wrapper>
    </Modal>
  ) 
})
   