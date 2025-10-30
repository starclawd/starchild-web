/**
 * Google 登录工具函数
 */

// Google 客户端 ID
export const GOOGLE_CLIENT_ID = '516958073559-braq349h8dflaktvuor76jc6i7so17ce.apps.googleusercontent.com'

// Google 登录响应类型
export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

// Google Accounts 接口
export interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (config: {
        client_id: string
        callback: (response: GoogleCredentialResponse) => void
        auto_select?: boolean
        cancel_on_tap_outside?: boolean
        use_fedcm_for_prompt?: boolean
      }) => void
      prompt: () => void
      renderButton: (
        parent: HTMLElement,
        options: {
          theme?: 'outline' | 'filled_blue' | 'filled_black'
          size?: 'large' | 'medium' | 'small'
          text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
          shape?: 'rectangular' | 'pill' | 'circle' | 'square'
          logo_alignment?: 'left' | 'center'
          width?: string | number
          locale?: string
        },
      ) => void
      disableAutoSelect: () => void
    }
  }
}

/**
 * 初始化 Google 登录
 * @param callback 登录成功回调函数
 * @returns Promise<void>
 */
export const initializeGoogleAuth = (callback: (credential: string) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查 Google SDK 是否已加载
    const google = window.google as GoogleAccounts | undefined
    if (!google) {
      reject(new Error('Google SDK not loaded'))
      return
    }

    try {
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: GoogleCredentialResponse) => {
          if (response.credential) {
            callback(response.credential)
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        // 注意：Google 将在未来强制使用 FedCM
        // 如果遇到 FedCM 相关问题，可以临时设置 use_fedcm_for_prompt: false
        // 但这只是临时方案，最终需要迁移到 FedCM
        // use_fedcm_for_prompt: false,
      })
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 触发 Google 登录弹窗
 */
export const triggerGoogleLogin = (callback: (credential: string) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    initializeGoogleAuth(callback)
      .then(() => {
        const google = window.google as GoogleAccounts | undefined
        if (google) {
          // 触发 Google One Tap 弹窗
          // 移除了 momentListener 回调以避免 FedCM 迁移警告
          google.accounts.id.prompt()
          resolve()
        } else {
          reject(new Error('Google SDK not loaded'))
        }
      })
      .catch(reject)
  })
}

/**
 * 使用 Google One Tap 登录
 * @param callback 登录成功回调函数
 */
export const googleOneTapLogin = async (callback: (credential: string) => void): Promise<void> => {
  try {
    await triggerGoogleLogin(callback)
  } catch (error) {
    console.error('Google login error:', error)
    throw error
  }
}
