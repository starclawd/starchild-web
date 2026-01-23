import styled, { css } from 'styled-components'
import Modal, {
  CommonModalContent,
  CommonModalContentWrapper,
  CommonModalFooter,
  CommonModalHeader,
} from 'components/Modal'
import { useIsMobile, useModalOpen, useAvatarEditImageSrc, useCloseAvatarEditModal } from 'store/application/hooks'
import { ApplicationModal } from 'store/application/application.d'
import { ModalSafeAreaWrapper } from 'components/SafeAreaWrapper'
import { Trans } from '@lingui/react/macro'
import { vm } from 'pages/helper'
import BottomSheet from 'components/BottomSheet'
import { memo, useCallback, useState } from 'react'
import { ButtonBorder, ButtonCommon } from 'components/Button'
import Pending from 'components/Pending'
import useToast, { TOAST_STATUS } from 'components/Toast'
import { useTheme } from 'store/themecache/hooks'
import Cropper, { Area } from 'react-easy-crop'
import { useGetUserInfo } from 'store/login/hooks'
import { useUploadAvatar } from 'store/user/hooks'

const AccountManegeMobileWrapper = styled(ModalSafeAreaWrapper)`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: 100%;
  background: transparent;
`

const Content = styled(CommonModalContent)`
  gap: 20px;
`

const CropperContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.black800};
  border-radius: 8px;
  overflow: hidden;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      height: ${vm(300)};
      border-radius: ${vm(8)};
    `}
`

const ZoomSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 0 8px;
  > span {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    color: ${({ theme }) => theme.black200};
    white-space: nowrap;
  }
  input[type='range'] {
    flex: 1;
    height: 4px;
    appearance: none;
    background: ${({ theme }) => theme.black600};
    border-radius: 2px;
    cursor: pointer;
    &::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: ${({ theme }) => theme.black0};
      cursor: pointer;
    }
  }
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(12)};
      padding: 0 ${vm(8)};
      > span {
        font-size: 0.12rem;
        line-height: 0.18rem;
      }
      input[type='range'] {
        height: ${vm(4)};
        border-radius: ${vm(2)};
        &::-webkit-slider-thumb {
          width: ${vm(16)};
          height: ${vm(16)};
        }
      }
    `}
`

const GifNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  color: ${({ theme }) => theme.autumn50};
  background: ${({ theme }) => theme.black800};
  border-radius: 4px;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)} ${vm(12)};
      font-size: 0.12rem;
      line-height: 0.18rem;
      border-radius: ${vm(4)};
    `}
`

const ButtonCancel = styled(ButtonBorder)`
  width: 50%;
  border: 1px solid ${({ theme }) => theme.black600};
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

// 从 base64 数据获取 MIME 类型
function getContentTypeFromBase64(base64: string): string {
  const match = base64.match(/^data:([^;]+);base64,/)
  if (match) {
    return match[1]
  }
  return 'image/jpeg' // 默认
}

// 将 base64 转换为 Blob
function base64ToBlob(base64: string, contentType: string): Blob {
  const base64Data = base64.split(',')[1]
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: contentType })
}

// 创建裁剪后的图片（注意：GIF 会丢失动画，需要特殊处理）
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  contentType: string,
): Promise<{ blob: Blob; contentType: string } | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  // GIF 用 Canvas 处理会丢失动画，所以转为 PNG 输出
  const outputType = contentType === 'image/gif' ? 'image/png' : contentType

  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, contentType: outputType })
        } else {
          resolve(null)
        }
      },
      outputType,
      0.9,
    )
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })
}

export default memo(function AvatarEditModal() {
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const toast = useToast()
  const theme = useTheme()
  const triggerGetUserInfo = useGetUserInfo()
  const editAvatarModalOpen = useModalOpen(ApplicationModal.EDIT_AVATAR_MODAL)
  const imageSrc = useAvatarEditImageSrc()
  const closeAvatarEditModal = useCloseAvatarEditModal()
  const uploadAvatar = useUploadAvatar()

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleClose = useCallback(() => {
    closeAvatarEditModal()
    // 重置状态
    setTimeout(() => {
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setCroppedAreaPixels(null)
    }, 300)
  }, [closeAvatarEditModal])

  const handleConfirm = useCallback(async () => {
    if (isLoading || !imageSrc || !croppedAreaPixels) return

    setIsLoading(true)
    try {
      // 获取原始图片的 contentType
      const contentType = getContentTypeFromBase64(imageSrc)

      let uploadBlob: Blob
      let uploadContentType: string

      // GIF 图片直接使用原图上传，保留动画
      if (contentType === 'image/gif') {
        uploadBlob = base64ToBlob(imageSrc, contentType)
        uploadContentType = contentType
      } else {
        // 其他格式进行裁剪
        const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, contentType)
        if (!croppedImage) {
          throw new Error('Failed to crop image')
        }
        uploadBlob = croppedImage.blob
        uploadContentType = croppedImage.contentType
      }

      // 调用上传 API
      const result = await uploadAvatar(uploadBlob, uploadContentType)

      if (result.isSuccess) {
        await triggerGetUserInfo()
        toast({
          title: <Trans>Avatar updated successfully</Trans>,
          description: '',
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-account',
          iconTheme: theme.black0,
        })
        handleClose()
      } else {
        toast({
          title: <Trans>Failed to update avatar</Trans>,
          description: result.error || '',
          status: TOAST_STATUS.ERROR,
          typeIcon: 'icon-account',
          iconTheme: theme.black0,
        })
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: <Trans>Failed to update avatar</Trans>,
        description: '',
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-account',
        iconTheme: theme.black0,
      })
    }
    setIsLoading(false)
  }, [isLoading, imageSrc, croppedAreaPixels, uploadAvatar, triggerGetUserInfo, toast, theme.black0, handleClose])

  const renderContent = () => {
    if (!imageSrc) return null

    const contentType = getContentTypeFromBase64(imageSrc)
    const isGif = contentType === 'image/gif'

    return (
      <>
        <CommonModalHeader>
          <Trans>Change Avatar</Trans>
        </CommonModalHeader>
        <Content>
          <CropperContainer>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape='round'
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </CropperContainer>
          {isGif ? (
            <GifNotice>
              <Trans>GIF images will be uploaded as original to preserve animation</Trans>
            </GifNotice>
          ) : (
            <ZoomSlider>
              <span>
                <Trans>Zoom</Trans>
              </span>
              <input
                type='range'
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
              />
            </ZoomSlider>
          )}
        </Content>
        <CommonModalFooter>
          <ButtonCancel onClick={handleClose}>
            <Trans>Cancel</Trans>
          </ButtonCancel>
          <ButtonConfirm $disabled={isLoading} onClick={handleConfirm}>
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
      isOpen={editAvatarModalOpen}
      rootStyle={{ overflowY: 'hidden', height: `auto` }}
      onClose={handleClose}
    >
      <AccountManegeMobileWrapper>{renderContent()}</AccountManegeMobileWrapper>
    </BottomSheet>
  ) : (
    <Modal useDismiss isOpen={editAvatarModalOpen} onDismiss={handleClose}>
      <CommonModalContentWrapper>{renderContent()}</CommonModalContentWrapper>
    </Modal>
  )
})
