import styled, { css } from 'styled-components'
import { memo } from 'react'
import { BorderAllSide1PxBox } from 'styles/borderStyled'
import { vm } from 'pages/helper'
import { KolInfo } from 'store/agenthub/agenthub'
import AdaptiveTextContent from 'pages/AgentHub/components/AdaptiveTextContent'
import Avatar from 'components/Avatar'
import { useCurrentRouter, useIsMobile } from 'store/application/hooks'
import { useCurrentKolInfo } from 'store/agenthub/hooks'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'

const KolCardWrapper = styled(BorderAllSide1PxBox)`
  display: flex;
  gap: 16px;
  padding: 8px;
  background: ${({ theme }) => theme.bgL1};
  cursor: pointer;
  transition: all ${ANI_DURATION}s ease;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      padding: ${vm(8)};
    `}
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(6)};
    `}
`

export default memo(function KolCard({ id, name, description, avatar }: KolInfo) {
  const isMobile = useIsMobile()
  const [, setCurrentKolInfo] = useCurrentKolInfo()
  const [, setCurrentRouter] = useCurrentRouter()

  const onClick = () => {
    // Set current kol info and navigate to kol-radar page
    setCurrentKolInfo({ id, name, description, avatar })
    setCurrentRouter(ROUTER.AGENT_HUB_KOL)
  }

  return (
    <KolCardWrapper $borderRadius={12} $borderColor='transparent' onClick={onClick}>
      <Avatar name={name} size={isMobile ? 44 : 100} avatar={avatar} />
      <Content>
        <AdaptiveTextContent
          title={name}
          description={description}
          titleStyle={{ fontSize: isMobile ? vm(14) : '18px', lineHeight: isMobile ? vm(20) : '26px' }}
          descriptionStyle={{ fontSize: isMobile ? vm(12) : '14px', lineHeight: isMobile ? vm(18) : '20px' }}
        />
      </Content>
    </KolCardWrapper>
  )
})
