import { useUserInfo } from 'store/login/hooks'
import MyAgentsOverview from './components/MyAgentsOverview'
import Pending from 'components/Pending'
export default function MyAgent() {
  const [{ userInfoId }] = useUserInfo()

  // 如果没有登录，显示加载状态
  if (!userInfoId) {
    return <Pending isFetching />
  }

  return <MyAgentsOverview />
}
