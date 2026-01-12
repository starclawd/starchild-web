/**
 * 访客用户数据类型
 */
export interface GuestUserData {
  user_info_id: number
  guest_uuid: string
  is_temp: boolean
  message: string
  account_api_key: string
}
