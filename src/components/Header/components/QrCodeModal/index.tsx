import { useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import Modal from 'components/Modal';
import { useModalOpen, useQrCodeModalToggle } from 'store/application/hooks';
import { ApplicationModal } from 'store/application/application.d';
import { useGetQrcodeId, useGetQrcodeStatus, useIsLogin } from 'store/login/hooks';
import { QRCODE_STATUS, QrCodeData } from 'store/login/login.d';
import { Trans } from '@lingui/react/macro';

// 轮询间隔（毫秒）
const POLL_INTERVAL = 2000;
// 二维码有效期（秒）
const QR_CODE_EXPIRE_TIME = 90;

const QrCodeModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 420px;
  border-radius: 36px;
  padding-bottom: 20px;
  background: ${({ theme }) => theme.bgL1};
  backdrop-filter: blur(8px);
`

const QrCodeTitle = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20px 20px 8px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  color: ${({ theme }) => theme.textL1};
`

const CountdownText = styled.span`
  margin-top: 16px;
  font-size: 14px;
  text-align: center;
  color: ${({ theme }) => theme.textL1};
`

const LoadingMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
`

const QrCodeContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  svg {
    border: 6px solid ${({ theme }) => theme.white};
  }
`

export function QrCodeModal() {
  const isLogin = useIsLogin()
  const [qrcodeData, setQrcodeData] = useState<QrCodeData>({} as QrCodeData)
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(QR_CODE_EXPIRE_TIME)
  const [qrCodeStatus, setQrCodeStatus] = useState<QRCODE_STATUS>(QRCODE_STATUS.PENDING)
  const countdownTimer = useRef<NodeJS.Timeout | null>(null)
  const pollTimer = useRef<NodeJS.Timeout | null>(null)
  
  const qrCodeModalOpen = useModalOpen(ApplicationModal.QR_CODE_MODAL)
  const toggleQrCodeModal = useQrCodeModalToggle()
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
  
  // 设置倒计时
  useEffect(() => {
    if (!qrCodeModalOpen) return
    
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
  }, [qrCodeModalOpen, getQrcodeId])
  
  // 设置倒计时和轮询
  useEffect(() => {
    if (!qrCodeModalOpen) return
    
    // 倒计时处理
    countdownTimer.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // 倒计时结束，刷新二维码
          getQrcodeId()
          return QR_CODE_EXPIRE_TIME
        }
        return prev - 1
      })
    }, 1000)
    
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
  }, [qrCodeModalOpen, getQrcodeId, checkQrcodeStatus])

  useEffect(() => {
    if (isLogin && qrCodeModalOpen) {
      toggleQrCodeModal()
    }
  }, [isLogin, qrCodeModalOpen, toggleQrCodeModal])

  return (
    <Modal
      useDismiss
      isOpen={qrCodeModalOpen}
      onDismiss={toggleQrCodeModal}
    >
      <QrCodeModalWrapper>
        <QrCodeTitle><Trans>Scan to login</Trans></QrCodeTitle>
        <QrCodeContainer>
          <QRCodeSVG size={200} value={JSON.stringify(qrcodeData)} />
          {isLoading && <LoadingMask>Loading...</LoadingMask>}
        </QrCodeContainer>
        <CountdownText>{countdown} seconds to refresh</CountdownText>
      </QrCodeModalWrapper>
    </Modal>
  );
};
