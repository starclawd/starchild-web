import styled from 'styled-components'
import { Trans } from '@lingui/react/macro';
import { useCallback, useEffect, useRef, useState } from 'react'
import { useGetQrcodeId, useGetQrcodeStatus, useIsLogin } from 'store/login/hooks';
import { QRCODE_STATUS, QrCodeData } from 'store/login/login'
import tgIcon from 'assets/media/telegram.png'
import homepage from 'assets/png/homepage.png'
import wallet from 'assets/png/wallet.png'
import scan from 'assets/png/scan.png'
import { ButtonCommon } from 'components/Button';
import { QRCodeSVG } from 'qrcode.react';
import { IconBase } from 'components/Icons';
import { TELEGRAM, goOutPageDirect, URL } from 'utils/url';
import { useCurrentRouter } from 'store/application/hooks';
import { ROUTER } from 'pages/router';

// 轮询间隔（毫秒）
const POLL_INTERVAL = 2000;
// 二维码有效期（秒）
const QR_CODE_EXPIRE_TIME = 90;

const ConnectWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`

const InnerContent = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 836px;
  height: 356px;
  padding: 38px 38px 32px;
  border-radius: 36px;
  border: 2px solid ${({ theme }) => theme.bgT30};
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  .wallet-bg {
    position: absolute;
    top: -23px;
    left: 35px;
    width: 236px;
    height: 45px;
    background-color: ${({ theme }) => theme.bgL0};
    
  }
  .wallet-img {
    position: absolute;
    top: -170px;
    left: 0;
    width: 300px;
    height: 300px;
  }
`

const LeftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  width: 370px;
  height: 100%;
  > span:first-child {
    font-size: 26px;
    font-weight: 700;
    line-height: 34px; 
    margin-bottom: 20px;
    color: ${({ theme }) => theme.textL1};
    span {
      color: ${({ theme }) => theme.jade10};
    }
  }
  > span:nth-child(2) {
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    margin-bottom: 46px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ButtonTg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: fit-content;
  height: 44px;
  padding: 10px;
  border-radius: 44px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px; 
  cursor: pointer;
  color: ${({ theme }) => theme.textL2};
  background-color: ${({ theme }) => theme.bgT20};
  img {
    width: 24px;
    height: 24px;
  }
`

const RightWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  > span:first-child {
    font-size: 18px;
    font-weight: 500;
    line-height: 26px; 
    margin-bottom: 20px;
    color: ${({ theme }) => theme.textDark98};
  }
`

const CenterWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40px;
  margin-bottom: 12px;
  > span:last-child {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 170px;
    height: 180px;
    border-radius: 24px 24px 0px 0px;
    background-color: rgba(255, 255, 255, 0.06);  
    .homepage-img {
      width: 158px;
      height: 174px;
      object-fit: cover;
    }
    .scan-img {
      position: absolute;
      top: 52px;
      right: -23px;
      width: 60px;
      height: 60px;
    }
  }
`

const QrWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 180px;
  height: 180px;
  border-radius: 24px;
  border: 1px solid ${({ theme }) => theme.bgT30};
  background-color: rgba(255, 255, 255, 0.06);
  svg {
    border: 4px solid ${({ theme }) => theme.white};
  }
`

const ExpiredWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 160px;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.36);
  backdrop-filter: blur(8px);
  color: ${({ theme }) => theme.textL2};
  cursor: pointer;
  .icon-chat-refresh {
    font-size: 32px;
    color: ${({ theme }) => theme.textL1};
  }
`

const ScanWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  span {
    font-size: 11px;
    font-weight: 400;
    line-height: 16px;
    color: ${({ theme }) => theme.textL3};
  }
`

const ScanIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 44px;
  background-color: ${({ theme }) => theme.bgT20};
  .icon-scan {
    font-size: 24px;
    color: ${({ theme }) => theme.textL1};
  }
`
export default function Connect() {
  const isLogin = useIsLogin()
  const [, setCurrentRouter] = useCurrentRouter()
  const [qrcodeData, setQrcodeData] = useState<QrCodeData>({} as QrCodeData)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(QR_CODE_EXPIRE_TIME)
  const [qrCodeStatus, setQrCodeStatus] = useState<QRCODE_STATUS>(QRCODE_STATUS.PENDING)
  const countdownTimer = useRef<NodeJS.Timeout | null>(null)
  const pollTimer = useRef<NodeJS.Timeout | null>(null)

  const triggerGetQrcodeId = useGetQrcodeId()
  const triggerGetQrcodeStatus = useGetQrcodeStatus()
  
  // 获取二维码ID
  const getQrcodeId = useCallback(async () => {
    setIsLoading(true)
    const data = await triggerGetQrcodeId()
    if (data.isSuccess) {
      setQrcodeData(data.data)
      // 重置倒计时
      setCountdown(QR_CODE_EXPIRE_TIME)
      // 重置二维码状态
      setQrCodeStatus(QRCODE_STATUS.PENDING)
      
      // 确保倒计时是开启的
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current)
      }
      countdownTimer.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            return 1
          }
          return prev - 1
        })
      }, 1000)
    }
    setIsLoading(false)
  }, [triggerGetQrcodeId])
  
  // 检查二维码状态
  const checkQrcodeStatus = useCallback(async () => {
    if (!qrcodeData.token) return
    try {
      const data = await triggerGetQrcodeStatus(qrcodeData.token)
      if (data.isSuccess) {
        const { status } = data.data
        setQrCodeStatus(status as QRCODE_STATUS)
        if (status === QRCODE_STATUS.PENDING) {
          pollTimer.current && clearTimeout(pollTimer.current)
          pollTimer.current = setTimeout(() => {
            checkQrcodeStatus()
          }, POLL_INTERVAL)
        }
      }
    } catch (error) {
      console.error('Check QR code status error:', error)
    }
  }, [qrcodeData.token, triggerGetQrcodeStatus])

  const goTelegramPage = useCallback(() => {
    goOutPageDirect(URL[TELEGRAM])
  }, [])
  
  // 设置倒计时
  useEffect(() => {
    // 初始获取二维码
    getQrcodeId()
    
    // 清理函数
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current)
      }
      if (pollTimer.current) {
        clearInterval(pollTimer.current)
      }
    }
  }, [getQrcodeId])
  
  // 设置倒计时和轮询
  useEffect(() => {
    // 倒计时处理
    if (qrCodeStatus !== QRCODE_STATUS.EXPIRED && qrCodeStatus !== QRCODE_STATUS.SCANNED) {
      countdownTimer.current = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // 倒计时结束，将状态设置为过期
            setQrCodeStatus(QRCODE_STATUS.EXPIRED)
            return 1
          }
          return prev - 1
        })
      }, 1000)
    } else if (countdownTimer.current) {
      // 如果是EXPIRED或SCANNED状态，清除倒计时
      clearInterval(countdownTimer.current)
      countdownTimer.current = null
    }
    
    // 轮询状态
    checkQrcodeStatus()
    
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current)
      }
      if (pollTimer.current) {
        clearInterval(pollTimer.current)
      }
    }
  }, [checkQrcodeStatus, qrCodeStatus])
  

  useEffect(() => {
    if (isLogin) {
      setCurrentRouter(ROUTER.INSIGHTS)
    }
  }, [isLogin, setCurrentRouter])


  return <ConnectWrapper>
    <InnerContent>
      <span className="wallet-bg"></span>
      <img className="wallet-img" src={wallet} alt="wallet" />
      <LeftWrapper>
        <span><Trans>Welcome to <span>Holominds</span></Trans></span>
        <span><Trans>Your Smart Crypto Companion<br /> Trade smarter. Move faster. Earn more.</Trans></span>
        <ButtonTg onClick={goTelegramPage}>
          <img src={tgIcon} alt="telegram" />
          <Trans>Try Holominds on telegram</Trans>
        </ButtonTg>
      </LeftWrapper>
      <RightWrapper>
        <span><Trans>Connect Your Wallet</Trans></span>
        <CenterWrapper>
          <QrWrapper>
            <QRCodeSVG size={132} value={JSON.stringify(qrcodeData)} />
            {
              (qrCodeStatus === QRCODE_STATUS.EXPIRED || qrCodeStatus === QRCODE_STATUS.SCANNED) && <ExpiredWrapper onClick={getQrcodeId}>
                <IconBase className="icon-chat-refresh" />
                <span>
                  {
                    qrCodeStatus === QRCODE_STATUS.EXPIRED ? <Trans>QR code expired</Trans> : <Trans>QR code scanned</Trans>
                  }
                </span>
              </ExpiredWrapper>
            }
          </QrWrapper>
          <span>
            <img className="homepage-img" src={homepage} alt="homepage" />
            <img className="scan-img" src={scan} alt="scan" />
          </span>
        </CenterWrapper>
        <ScanWrapper>
          <ScanIconWrapper>
            <IconBase className="icon-scan" />
          </ScanIconWrapper>
          <span><Trans>Open the Holomind app, tap the scan icon in the top-right corner, <br />then scan the QR code to connect your wallet instantly.</Trans></span>
        </ScanWrapper>
      </RightWrapper>
    </InnerContent>
  </ConnectWrapper>
}
