import styled from 'styled-components'
import { memo } from 'react'
import { vm } from 'pages/helper'
import { BorderAllSide1PxBox } from 'styles/borderStyled'

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  
  ${({ theme }) => theme.isMobile && `
    gap: ${vm(16)};
  `}
`

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(20)};
    padding: 0 ${vm(16)};
  `}
`

const PlaceholderCard = styled(BorderAllSide1PxBox)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background: ${({ theme }) => theme.bgL1};
  
  ${({ theme }) => theme.isMobile && `
    min-height: ${vm(150)};
    margin: 0 ${vm(16)};
  `}
`

const PlaceholderText = styled.p`
  font-size: 16px;
  color: ${({ theme }) => theme.textL3};
  margin: 0;
  text-align: center;
  
  ${({ theme }) => theme.isMobile && `
    font-size: ${vm(14)};
  `}
`

interface PlaceholderSectionProps {
  id: string
  title: string
}

export default memo(function PlaceholderSection({ id, title }: PlaceholderSectionProps) {
  return (
    <SectionWrapper id={id}>
      <SectionTitle>{title}</SectionTitle>
      <PlaceholderCard
        $borderRadius={12}
        $borderColor="transparent"
      >
        <PlaceholderText>Coming soon...</PlaceholderText>
      </PlaceholderCard>
    </SectionWrapper>
  )
}) 