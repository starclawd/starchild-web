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

// 创建裁剪后的图片
async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<Blob | null> {
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

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg')
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
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)
      if (croppedImage) {
        // TODO: 调用上传 API
        // const formData = new FormData()
        // formData.append('avatar', croppedImage, 'avatar.jpg')
        // await uploadAvatar(formData)

        console.log('Cropped image blob:', croppedImage)

        await triggerGetUserInfo()
        toast({
          title: <Trans>Avatar updated successfully</Trans>,
          description: '',
          status: TOAST_STATUS.SUCCESS,
          typeIcon: 'icon-account',
          iconTheme: theme.black0,
        })
        handleClose()
      }
    } catch (error) {
      console.error('Error cropping image:', error)
      toast({
        title: <Trans>Failed to update avatar</Trans>,
        status: TOAST_STATUS.ERROR,
        typeIcon: 'icon-account',
        iconTheme: theme.black0,
        description: '',
      })
    }
    setIsLoading(false)
  }, [isLoading, imageSrc, croppedAreaPixels, triggerGetUserInfo, toast, theme.black0, handleClose])

  const renderContent = () => {
    if (!imageSrc) return null

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
