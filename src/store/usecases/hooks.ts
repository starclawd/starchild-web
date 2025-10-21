import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/index'
import { setActiveTab } from './reducer'
import { TabKey } from 'constants/useCases'

export const useActiveTab = () => {
  const activeTab = useSelector((state: RootState) => state.usecases.activeTab)
  const dispatch = useDispatch()

  const setActiveTabAction = (tab: TabKey) => {
    dispatch(setActiveTab(tab))
  }

  return [activeTab, setActiveTabAction] as const
}
