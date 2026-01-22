/**
 * 用户相关类型定义
 */

// 头像上传结果
export interface UploadAvatarResult {
  isSuccess: boolean
  avatarUrl?: string
  error?: string
}
