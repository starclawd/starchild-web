import { useMemo } from 'react'
import { useAppKitAccount } from '@reown/appkit/react'
import { useUserInfo } from 'store/login/hooks'

export default function useValidVaultWalletAddress(): [boolean, string | undefined] {
  const { address } = useAppKitAccount()
  const [userInfo] = useUserInfo()

  const result = useMemo<[boolean, string | undefined]>(() => {
    // 如果没有连接钱包或没有用户信息，返回 false 和 address
    if (!address || !userInfo) {
      return [false, address]
    }

    // 判断当前连接的地址是否匹配用户的主钱包地址或次要钱包地址
    const isValidWallet =
      address.toLocaleLowerCase() === userInfo.walletAddress.toLocaleLowerCase() ||
      address.toLocaleLowerCase() === userInfo.secondaryWalletAddress.toLocaleLowerCase()
    return [isValidWallet, address]
  }, [address, userInfo])

  return result
}
