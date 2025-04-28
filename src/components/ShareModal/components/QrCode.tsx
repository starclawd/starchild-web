/**
 * 二维码组件
 * 基于qrcode.react实现的二维码展示
 * 用于在分享图片中展示带Logo的二维码和引导文案
 */

import styled from "styled-components"
import { QRCodeSVG } from 'qrcode.react'
import { useShareUrl } from "store/application/hooks"
// import { IconLogo } from "components/Icons"
import { Trans } from "@lingui/react/macro"

/**
 * 二维码容器样式组件
 */
const QrCodeWrapper = styled.div`
  display: flex;
  width: 266px;
  height: 75px;
`

/**
 * 二维码图片容器样式组件
 */
const QrCodeImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 75px;
  height: 75px;
  background-color: ${({ theme }) => theme.white};
`

/**
 * 二维码文本区域样式组件
 */
const QrText = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  margin-left: 8px;
  .icon-logo {
    color: ${({ theme }) => theme.white};
    cursor: default;
    font-size: 90px;
    line-height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    color: ${({ theme }) => theme.white};
    white-space: nowrap;
    margin-top: 7px;
  }
`

/**
 * 二维码组件
 * 展示分享链接的二维码、Logo和引导文案
 */
export default function QrCode() {
  // 获取分享链接
  const shareUrl = useShareUrl()

  return (
    <QrCodeWrapper className="qrcode-wrapper">
      <QrCodeImg>
        <QRCodeSVG
          size={72}
          value={shareUrl}
        />
      </QrCodeImg>
      <QrText>
        {/* <IconLogo className="icon-logo" /> */}
        <span><Trans>Scan the QRcode and join us</Trans></span>
      </QrText>
    </QrCodeWrapper>
  )
}