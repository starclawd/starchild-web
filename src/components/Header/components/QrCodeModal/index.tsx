import { useCallback, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { QRCodeSVG } from 'qrcode.react';
import Modal from 'components/Modal';
import { useModalOpen, useQrCodeModalToggle } from 'store/application/hooks';
import { ApplicationModal } from 'store/application/application.d';
import { useGetQrcodeId, useGetQrcodeStatus } from 'store/login/hooks';

// 轮询间隔（毫秒）
const POLL_INTERVAL = 2000;
// 二维码有效期（秒）
const QR_CODE_EXPIRE_TIME = 90;

const QrCodeModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background-color: ${({ theme }) => theme.bg2 || '#fff'};
`

const QrCodeTitle = styled.h2`
  margin-bottom: 24px;
  font-size: 18px;
  color: ${({ theme }) => theme.text1 || '#333'};
`

const CountdownText = styled.span`
  margin-top: 16px;
  font-size: 14px;
  color: ${({ theme }) => theme.text2 || '#666'};
`

const LoadingMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: ${({ theme }) => theme.text1 || '#333'};
`

const QrCodeContainer = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const QrCodeModal = () => {
  const [qrcodeId, setQrcodeId] = useState('')
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(QR_CODE_EXPIRE_TIME)
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
      setUrl(data.data.url) // 假设返回的是 {url: string, qrcodeId: string}
      setQrcodeId(data.data.qrcodeId)
      // 重置倒计时
      setCountdown(QR_CODE_EXPIRE_TIME)
    }
    setIsLoading(false)
  }, [triggerGetQrcodeId])
  
  // 检查二维码状态
  const checkQrcodeStatus = useCallback(async () => {
    if (!qrcodeId) return
    
    try {
      const data = await triggerGetQrcodeStatus(qrcodeId)
      if (data.isSuccess) {
        // 假设返回的状态码字段是 status，1 表示已扫码并成功登录
        if (data.data.status === 1) {
          // 扫码成功且登录成功，关闭弹窗
          toggleQrCodeModal()
        }
      }
    } catch (error) {
      console.error('Check QR code status error:', error)
    }
  }, [qrcodeId, triggerGetQrcodeStatus, toggleQrCodeModal])
  
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
    pollTimer.current = setInterval(() => {
      checkQrcodeStatus()
    }, POLL_INTERVAL)
    
    return () => {
      if (countdownTimer.current) {
        clearInterval(countdownTimer.current)
      }
      if (pollTimer.current) {
        clearInterval(pollTimer.current)
      }
    }
  }, [qrCodeModalOpen, getQrcodeId, checkQrcodeStatus])

  return (
    <Modal 
      useDismiss
      isOpen={qrCodeModalOpen}
      onDismiss={toggleQrCodeModal}
    >
      <QrCodeModalWrapper>
        <QrCodeTitle>扫码登录</QrCodeTitle>
        <QrCodeContainer>
          <QRCodeSVG size={200} value={url} />
          {isLoading && <LoadingMask>加载中...</LoadingMask>}
        </QrCodeContainer>
        <CountdownText>{countdown}秒后刷新</CountdownText>
      </QrCodeModalWrapper>
    </Modal>
  );
};
