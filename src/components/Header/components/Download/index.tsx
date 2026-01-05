import { Trans } from '@lingui/react/macro'
import { ANI_DURATION } from 'constants/index'
import { ROUTER } from 'pages/router'
import { QRCodeSVG } from 'qrcode.react'
import { useMemo } from 'react'
import { useTheme } from 'store/themecache/hooks'
import styled from 'styled-components'
import { fadeInDown } from 'styles/animationStyled'

const DownLoadWrapper = styled.div`
  position: absolute;
  top: 56px;
  right: 0;
  display: none;
  flex-direction: column;
  align-items: center;
  width: 320px;
  height: 376px;
  padding: 20px;
  gap: 20px;
  border-radius: 36px;
  background-color: ${({ theme }) => theme.bgL1};
  z-index: 2;
  animation: ${fadeInDown} ${ANI_DURATION}s;
`

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  span:first-child {
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    color: ${({ theme }) => theme.black0};
  }
  span:last-child {
    font-size: 12px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    color: ${({ theme }) => theme.black200};
  }
`

const QrcodeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 240px;
  height: 240px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.black600};
`

export default function Download() {
  const theme = useTheme()
  const url = useMemo(() => {
    const origin = window.location.origin
    return `${origin}${ROUTER.DOWNLOAD}`
  }, [])
  return (
    <DownLoadWrapper className='download-wrapper'>
      <TitleWrapper>
        <span>
          <Trans>Download Mobile APP</Trans>
        </span>
        <span>
          <Trans>Access Your Smart Crypto Companion anytime, anywhere.</Trans>
        </span>
      </TitleWrapper>
      <QrcodeWrapper>
        <QRCodeSVG value={url} size={200} bgColor={theme.bgL1} fgColor={theme.white} />
      </QrcodeWrapper>
    </DownLoadWrapper>
  )
}
