import { useEffect } from 'react'
import { isAndroid, isIos } from 'utils/userAgent'

export default function Download() {
  useEffect(() => {
    // 检测用户设备是 iOS 还是 Android
    const detectUserAgent = () => {
      // 推特应用链接
      const iosAppLink = 'https://apps.apple.com/us/app/twitter/id333903271'
      const androidAppLink = 'https://play.google.com/store/apps/details?id=com.twitter.android'
      
      // 根据设备类型重定向
      if (isIos) {
        window.location.href = iosAppLink
      } else if (isAndroid) {
        window.location.href = androidAppLink
      } else {
        // 如果不是移动设备，可以显示两个下载选项或重定向到网站主页
        console.log('not mobile')
      }
    }

    detectUserAgent()
  }, [])

  // 返回 null，因为页面会立即重定向
  return null
}
