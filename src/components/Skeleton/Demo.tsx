import styled from 'styled-components'
import { memo } from 'react'
import { Skeleton, SkeletonAvatar, SkeletonText, SkeletonMultilineText } from './index'

const DemoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL0};
  min-height: 100vh;
`

const DemoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`

const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 8px;
`

const CardExample = styled.div`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.bgL2};
`

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const CardBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`

export default memo(function SkeletonDemo() {
  return (
    <DemoContainer>
      <SectionTitle>骨架屏组件演示</SectionTitle>

      <DemoSection>
        <SectionTitle>基础骨架屏</SectionTitle>
        <SkeletonGroup>
          <Skeleton width='100%' height='20px' />
          <Skeleton width='80%' height='16px' />
          <Skeleton width='60%' height='14px' />
        </SkeletonGroup>
      </DemoSection>

      <DemoSection>
        <SectionTitle>圆形骨架屏（头像）</SectionTitle>
        <SkeletonGroup>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <SkeletonAvatar size='40px' />
            <SkeletonAvatar size='60px' />
            <SkeletonAvatar size='80px' />
          </div>
        </SkeletonGroup>
      </DemoSection>

      <DemoSection>
        <SectionTitle>文本骨架屏</SectionTitle>
        <SkeletonGroup>
          <SkeletonText width='200px' height='16px' />
          <SkeletonText width='150px' height='14px' />
          <SkeletonText width='100px' height='12px' />
        </SkeletonGroup>
      </DemoSection>

      <DemoSection>
        <SectionTitle>多行文本骨架屏</SectionTitle>
        <SkeletonGroup>
          <SkeletonMultilineText lines={2} />
          <SkeletonMultilineText lines={3} />
        </SkeletonGroup>
      </DemoSection>

      <DemoSection>
        <SectionTitle>卡片骨架屏示例</SectionTitle>
        <CardExample>
          <SkeletonAvatar size='40px' />
          <CardContent>
            <SkeletonText width='70%' height='20px' />
            <SkeletonMultilineText lines={2} />
            <CardBottom>
              <SkeletonText width='80px' height='14px' />
              <SkeletonText width='60px' height='14px' />
            </CardBottom>
          </CardContent>
        </CardExample>
      </DemoSection>
    </DemoContainer>
  )
})
