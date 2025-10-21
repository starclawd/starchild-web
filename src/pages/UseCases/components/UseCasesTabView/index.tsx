import { memo } from 'react'
import styled from 'styled-components'
import { TAB_CONTENT_CONFIG, TabKey } from 'constants/useCases'
import { useActiveTab } from 'store/usecases/hooks'

const TabViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 400px;
`

const TabContent = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  width: 100%;
  height: 100%;
`

const ContentTitle = styled.h3`
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textL1};
`

const ContentDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.textL2};
`

// 渲染单个Tab内容的组件
const UseCasesTabContentComponent = memo(({ activeTab }: { activeTab: string }) => {
  const content = TAB_CONTENT_CONFIG[activeTab as TabKey]

  if (!content) return null

  return (
    <TabContent>
      <ContentTitle>{content.title}</ContentTitle>
      <ContentDescription>{content.description}</ContentDescription>
    </TabContent>
  )
})

UseCasesTabContentComponent.displayName = 'UseCasesTabContentComponent'

function UseCasesTabView() {
  const [activeTab] = useActiveTab()

  return (
    <TabViewContainer>
      <UseCasesTabContentComponent activeTab={activeTab} />
    </TabViewContainer>
  )
}

UseCasesTabView.displayName = 'UseCasesTabView'

export default memo(UseCasesTabView)
