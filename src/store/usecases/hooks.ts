import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'store/index'
import { useCasesActions } from './reducer'
import { TabKey } from 'constants/useCases'

export const useActiveTab = () => {
  const activeTab = useSelector((state: RootState) => state.usecases.activeTab)
  const dispatch = useDispatch()

  const setActiveTab = (tab: TabKey) => {
    dispatch(useCasesActions.setActiveTab(tab))
  }

  return [activeTab, setActiveTab] as const
}
