import { Trans } from '@lingui/react/macro'
import { IconBase } from 'components/Icons'
import styled from 'styled-components'

const FooterWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 102px;
  padding: 20px;
  gap: 20px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background: ${({ theme }) => theme.bgT20};
  backdrop-filter: blur(6px);
`

const TopContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  >span:last-child {
    display: flex;
    align-items: center;
    gap: 8px;
    i {
      font-size: 20px;
      color: ${({ theme }) => theme.textL3};
    }
  }
`

const BottomContent = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px; 
  color: ${({ theme }) => theme.textL3};
`

export default function Footer() {
  return <FooterWrapper>
    <TopContent>
      <span></span>
      <span>
        <IconBase className="icon-twitter" />
        <IconBase className="icon-discord" />
        <IconBase className="icon-github" />
        <IconBase className="icon-coinmarketcap" />
      </span>
    </TopContent>
    <BottomContent>
      <Trans>Copyright 2025 WOO. All Rights Reserved</Trans>
    </BottomContent>
  </FooterWrapper>
}
