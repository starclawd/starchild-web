import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'
import img1 from 'assets/tradeai/voice.png'
import img2 from 'assets/tradeai/voice.png'
import { useScrollbarClass } from 'hooks/useScrollbarClass'

const ImgItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`
const Content = styled.div`
  ${({ theme }) => theme.isMobile && css`
    font-size: .16rem;
    font-weight: 400;
    line-height: .22rem;
    color: ${theme.white};
  `}
`
const ImgList = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
    img {
      width: ${vm(60)};
      height: ${vm(60)};
      border-radius: ${vm(12)};
    }
  `}
`

export default function ImgItem() {
  const scrollRef = useScrollbarClass<HTMLDivElement>()
  const imgList = [img1, img2]
  return <ImgItemWrapper>
    <Content>test test test test test test test test test test test </Content>
    <ImgList ref={scrollRef} className="scroll-style">
      {imgList.map((item, index) => (
        <img key={index} src={item} alt="" />
      ))}
    </ImgList>
  </ImgItemWrapper>
}
