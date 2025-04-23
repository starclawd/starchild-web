import styled from 'styled-components'

const FooterWrapper = styled.div`
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

export default function Footer() {
  return <FooterWrapper>
    
  </FooterWrapper>
}
