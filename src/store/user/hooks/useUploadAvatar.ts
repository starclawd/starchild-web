/**
 * 头像上传 Hook
 *
 * 封装头像上传的完整流程：
 * 1. 获取签名 URL
 * 2. 上传图片到 GCS
 * 3. 确认上传完成
 */

import { useCallback } from 'react'
import { useAvatarPresignMutation, useAvatarConfirmMutation } from 'api/user'
import { UploadAvatarResult } from '../user.d'

export function useUploadAvatar() {
  const [avatarPresign] = useAvatarPresignMutation()
  const [avatarConfirm] = useAvatarConfirmMutation()

  const uploadAvatar = useCallback(
    async (blob: Blob, contentType: string): Promise<UploadAvatarResult> => {
      try {
        // 1. 获取签名 URL
        const presignResult = await avatarPresign({
          contentType,
          fileSize: blob.size,
        }).unwrap()

        const { signedUrl, publicUrl } = presignResult

        // 2. 上传图片到 GCS
        const uploadResponse = await fetch(signedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': contentType,
          },
          body: blob,
        })

        if (!uploadResponse.ok) {
          return {
            isSuccess: false,
            error: 'Failed to upload image to storage',
          }
        }

        // 3. 确认上传完成
        const confirmResult = await avatarConfirm({
          avatarUrl: publicUrl,
        }).unwrap()

        return {
          isSuccess: true,
          avatarUrl: confirmResult.avatarUrl,
        }
      } catch (error: any) {
        console.error('Upload avatar error:', error)
        return {
          isSuccess: false,
          error: error?.data?.message || error?.message || 'Upload failed',
        }
      }
    },
    [avatarPresign, avatarConfirm],
  )

  return uploadAvatar
}
