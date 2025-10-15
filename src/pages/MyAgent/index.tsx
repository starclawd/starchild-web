import { useUserInfo } from 'store/login/hooks'
import MyAgentsOverview from './components/MyAgentsOverview'
import Pending from 'components/Pending'
export default function MyAgent() {
  const [{ telegramUserId }] = useUserInfo()

  // 如果没有 telegramUserId，显示加载状态
  if (!telegramUserId) {
    return <Pending isFetching />
  }

  return <MyAgentsOverview />
}
