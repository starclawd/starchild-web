import QrCode from "components/ShareModal/components/QrCode"
import styled from "styled-components"
const CustomerImgItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 640px;
  height: 360px;
  background-size: 100%;
  background-color: #1D2023;
  flex-shrink: 0;
  img {
    position: relative;
    left: -1px;
    width: 641px;
    height: 360px;
  }
  .qrcode-wrapper {
    position: absolute;
    left: 29px;
    bottom: 31px;
    z-index: 3;
  }
`
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 640px;
  height: 360px;
  padding: 44px 32px 0;
  z-index: 2;
  font-size: 28px;
  font-weight: 800;
  line-height: 36px;
  color: #FFF;
`
export default function CustomerImgItem({
  id,
  imgSouce,
}: {
  id: string
  imgSouce: string
}) {
  return (
    <CustomerImgItemWrapper id={id}>
      <QrCode />
      <img src={imgSouce} alt="" />
      <ContentWrapper>
        
      </ContentWrapper>
    </CustomerImgItemWrapper>
  )
}