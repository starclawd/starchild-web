/**
 * Google authentication utility functions
 */

import { isPro } from './url'

// Google Client ID
export const GOOGLE_CLIENT_ID = isPro
  ? '516958073559-6pu3i413a093rot0lf8va2m8r1m5r3kp.apps.googleusercontent.com'
  : '516958073559-braq349h8dflaktvuor76jc6i7so17ce.apps.googleusercontent.com'

// Google credential response type
export interface GoogleCredentialResponse {
  credential: string
  select_by: string
}

// Google login error types
export enum GoogleLoginErrorType {
  BLOCKED = 'BLOCKED', // Third-party login blocked by user/browser
  SDK_NOT_LOADED = 'SDK_NOT_LOADED', // SDK not loaded
  NETWORK_ERROR = 'NETWORK_ERROR', // Network error
  USER_CANCELLED = 'USER_CANCELLED', // User cancelled
  UNKNOWN = 'UNKNOWN', // Unknown error
}

// Google login error class
export class GoogleLoginError extends Error {
  type: GoogleLoginErrorType
  originalError?: any

  constructor(type: GoogleLoginErrorType, message: string, originalError?: any) {
    super(message)
    this.name = 'GoogleLoginError'
    this.type = type
    this.originalError = originalError
  }
}

// Google Moment Notification interface
export interface GoogleMomentNotification {
  isDisplayed: () => boolean
  isNotDisplayed: () => boolean
  isSkippedMoment: () => boolean
  isDismissedMoment: () => boolean
  getNotDisplayedReason: () => string
  getSkippedReason: () => string
  getDismissedReason: () => string
}

// Google Accounts interface
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
      prompt: (momentListener?: (notification: GoogleMomentNotification) => void) => void
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
 * Initialize Google authentication
 * @param callback Callback function when login succeeds
 * @returns Promise<void>
 */
export const initializeGoogleAuth = (callback: (credential: string) => void): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if Google SDK was loaded
    const google = window.google as GoogleAccounts | undefined
    if (!google) {
      reject(
        new GoogleLoginError(
          GoogleLoginErrorType.SDK_NOT_LOADED,
          'Google SDK not loaded, please refresh the page and try again',
        ),
      )
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
      })
      resolve()
    } catch (error) {
      reject(new GoogleLoginError(GoogleLoginErrorType.UNKNOWN, 'Failed to initialize Google authentication', error))
    }
  })
}

/**
 * Trigger Google One Tap login popup
 * @param callback Callback function when login succeeds
 * @returns Promise<void>
 */
export const triggerGoogleLogin = (callback: (credential: string) => void | Promise<void>): Promise<void> => {
  return new Promise((resolve, reject) => {
    let isLoginSuccessful = false

    // 包装 callback，用于追踪登录是否成功
    const wrappedCallback = async (credential: string) => {
      isLoginSuccessful = true
      await callback(credential)
      resolve()
    }

    initializeGoogleAuth(wrappedCallback)
      .then(() => {
        const google = window.google as GoogleAccounts | undefined
        if (google) {
          // Trigger Google One Tap popup and listen for status
          google.accounts.id.prompt((notification: GoogleMomentNotification) => {
            // Check if popup was blocked
            if (notification.isNotDisplayed()) {
              const reason = notification.getNotDisplayedReason()
              console.warn('Google One Tap not displayed, reason:', reason)

              // Check if it's due to third-party cookies being disabled
              if (
                reason === 'suppressed_by_user' ||
                reason === 'opt_out_or_no_session' ||
                reason === 'browser_not_supported'
              ) {
                reject(
                  new GoogleLoginError(
                    GoogleLoginErrorType.BLOCKED,
                    'Third-party login has been blocked by the browser. Please enable third-party cookies in your browser settings, or use another login method.',
                  ),
                )
                return
              }
            }

            // Check if user skipped/cancelled (只在未登录成功时才 reject)
            if (notification.isSkippedMoment() && !isLoginSuccessful) {
              const reason = notification.getSkippedReason()
              console.log('User skipped login, reason:', reason)
              reject(new GoogleLoginError(GoogleLoginErrorType.USER_CANCELLED, 'Login cancelled'))
              return
            }

            // Check if user dismissed popup (只在未登录成功时才 reject)
            if (notification.isDismissedMoment() && !isLoginSuccessful) {
              const reason = notification.getDismissedReason()
              console.log('User dismissed the popup, reason:', reason)
              reject(new GoogleLoginError(GoogleLoginErrorType.USER_CANCELLED, 'Login cancelled'))
              return
            }

            // If displayed normally, don't resolve here
            // The callback will handle resolve when login succeeds
            if (notification.isDisplayed()) {
              console.log('Google One Tap displayed')
            }
          })
        } else {
          reject(new GoogleLoginError(GoogleLoginErrorType.SDK_NOT_LOADED, 'Google SDK not loaded'))
        }
      })
      .catch(reject)
  })
}

/**
 * Use Google One Tap login
 * @param callback Callback function when login succeeds (supports async)
 * @throws {GoogleLoginError} Throws detailed error information
 */
export const googleOneTapLogin = async (callback: (credential: string) => void | Promise<void>): Promise<void> => {
  try {
    await triggerGoogleLogin(callback)
  } catch (error) {
    // If error is already GoogleLoginError, rethrow
    if (error instanceof GoogleLoginError) {
      throw error
    }

    // Handle network errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase()
      if (errorMessage.includes('network') || errorMessage.includes('cors') || errorMessage.includes('failed')) {
        throw new GoogleLoginError(
          GoogleLoginErrorType.NETWORK_ERROR,
          'Network connection failed. Please check your network and try again.',
          error,
        )
      }
    }

    // Other unknown errors
    console.error('Google login error:', error)
    throw new GoogleLoginError(GoogleLoginErrorType.UNKNOWN, 'Google login failed. Please try again later.', error)
  }
}
