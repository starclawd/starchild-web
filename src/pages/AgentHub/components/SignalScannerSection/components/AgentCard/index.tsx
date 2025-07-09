import styled from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { IconBase } from 'components/Icons'
import { vm } from 'pages/helper'
import Avatar from 'components/Avatar'

const CardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  gap: 16px;
  padding: 20px;
  background: ${({ theme }) => theme.bgL1};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.bgL2};
    border-color: ${({ theme }) => theme.jade10};
  }

  ${({ theme }) =>
    theme.isMobile &&
    `
    padding: ${vm(16)};
    gap: ${vm(12)};
  `}
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    gap: ${vm(6)};
  `}
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.textL1};
  margin: 0;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(14)};
  `}
`

const Description = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.textL2};
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(12)};
  `}
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
`

const Creator = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(10)};
  `}
`

const UsageCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${({ theme }) => theme.textL3};

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(10)};
    gap: ${vm(2)};
  `}
`

const UsageIcon = styled(IconBase)`
  font-size: 12px;

  ${({ theme }) =>
    theme.isMobile &&
    `
    font-size: ${vm(10)};
  `}
`

interface AgentCardProps {
  title: string
  description: string
  creator: string
  usageCount: number
  avatar?: string
  onClick?: () => void
}

export default memo(function AgentCard({ title, description, creator, usageCount, avatar, onClick }: AgentCardProps) {
  return (
    <CardWrapper $borderRadius={12} $borderColor='transparent' onClick={onClick}>
      <Avatar name={creator} size={100} avatar={avatar} />
      <Content>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Footer>
          <Creator>Created by: {creator}</Creator>
          <UsageCount>
            <UsageIcon className='icon-user' />
            {usageCount.toLocaleString()}
          </UsageCount>
        </Footer>
      </Content>
    </CardWrapper>
  )
})
