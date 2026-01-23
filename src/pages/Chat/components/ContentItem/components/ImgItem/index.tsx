import { vm } from 'pages/helper'
import styled, { css } from 'styled-components'
import img1 from 'assets/chat/voice.png'
import img2 from 'assets/chat/voice.png'
import { useRef } from 'react'

const StyledImg = styled.img`
  flex-shrink: 0;
  border-radius: 12px;
`

const ImgItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) =>
    theme.isMobile &&
    css`
      gap: ${vm(8)};
    `}
`
const Content = styled.div`
  ${({ theme }) =>
    theme.isMobile &&
    css`
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.22rem;
      color: ${theme.white};
    `}
`
const ImgList = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`

export default function ImgItem() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const imgList = [img1, img2]
  return (
    <ImgItemWrapper>
      <Content>test test test test test test test test test test test </Content>
      <ImgList ref={scrollRef} className='scroll-style'>
        {imgList.map((item, index) => (
          <StyledImg key={index} src={item} alt='' width={60} height={60} />
        ))}
      </ImgList>
    </ImgItemWrapper>
  )
}
