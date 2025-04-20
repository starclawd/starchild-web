import styled, { css } from 'styled-components'
import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { useCloseStream, useFileList, useInputValue, useIsFocus, useIsLoadingData, useIsRenderingData, useSendAiContent } from 'store/tradeai/hooks'
import { IconBase } from 'components/Icons'
import CloseWrapper from 'components/Close'
import { Trans } from '@lingui/react/macro'
import { useTheme } from 'store/theme/hooks'
import InputArea from 'components/InputArea'
import { vm } from 'pages/helper'
import { ANI_DURATION } from 'constants/index'
import { BorderBox } from 'styles/theme'
import Shortcuts from '../Shortcuts'
import voiceImg from 'assets/tradeai/voice.png'

const AiInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const AiInputOutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 ${vm(12)};
`

const AiInputContentWrapper = styled(BorderBox)<{ $value: string, $isHandleRecording: boolean }>`
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 14px;
  transition: border-color ${ANI_DURATION}s;
  ${({ theme, $isHandleRecording }) => theme.isMobile && css`
    padding: ${vm(16)} ${vm(110)} ${vm(16)} ${vm(16)};
    min-height: ${vm(60)};
    background: ${({ theme }) => theme.bgL1};
    backdrop-filter: blur(8px);
    #waveform {
      width: ${vm(164)};
      height: ${vm(24)};
    }
    ${$isHandleRecording && css`
      padding: 0;
    `}
  `}
`

const RecordingWrapper = styled.div`
  align-items: center;
  width: 100%;
  height: 60px;
  ${({ theme }) => theme.isMobile && css`
    height: ${vm(60)};
    padding: ${vm(8)};
    gap: ${vm(34)};
    .voice-img {
      width: ${vm(44)};
      height: ${vm(44)};
    }
    .result-voice-img {
      width: ${vm(164)};
      height: ${vm(24)};
    }
    span {
      font-size: .16rem;
      font-weight: 500;
      line-height: .24rem;
      color: ${({ theme }) => theme.jade10};
    }
  `}
`

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 1;
`
const PlaceholderWrapper = styled.div`
  position: absolute;
  bottom: 1px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap;
  color: ${({ theme }) => theme.textL4};
  ${({ theme }) => theme.isMobile && css`
    font-size: 0.16rem;
    line-height: 0.24rem;
    bottom: ${vm(1)};
  `}
`
const ImgList = styled.div`
  display: flex;
  width: 100%;
  height: auto;
  padding-top: 10px;
  gap: 8px;
`

const ImgItem = styled.div`
  position: relative;
  display: flex;
  flex-shrink: 0;
  .fake-close-wrapper {
    width: 20px;
    height: 20px;
    top: -10px;
    right: -10px;
    .close-wrapper {
      width: 20px;
      height: 20px;
      .icon-close {
        font-size: 10px;
      }
    }
  }
  img {
    width: 56px;
    height: 56px;
    border-radius: 8px;
  }
`

const Handle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: absolute;
  bottom: ${vm(8)};
  right: ${vm(8)};
  .line {
    width: 1px;
    height: 16px;
    background-color: ${({ theme }) => theme.line1};
  }
  .model-select-value {
    cursor: pointer;
  }
  ${({ theme }) => theme.isMobile && css`
    gap: ${vm(8)};
  `}
`

const ChatFileButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.isMobile && css`
    width: ${vm(44)};
    height: ${vm(44)};
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid ${({ theme }) => theme.bgT30};
    .icon-chat-file {
      font-size: ${vm(18)};
      color: ${({ theme }) => theme.textL2};
    }
  `}
`

const ChatVoiceButton = styled(ChatFileButton)<{ $isRecording: boolean }>`
  transition: all ${ANI_DURATION}s;
  ${({ theme, $isRecording }) => theme.isMobile && css`
    .icon-chat-voice {
      font-size: ${vm(18)};
      color: ${({ theme }) => theme.textL2};
    }
    ${$isRecording && css`
      border: none;
      background-color: ${({ theme }) => theme.jade10};
      .icon-chat-voice {
        color: #000000;
      }
    `}
  `}
`

const SendButton = styled(ChatFileButton)`
  cursor: pointer;
  ${({ theme }) => theme.isMobile && css`
    border: none;
    background-color: ${({ theme }) => theme.jade10};
    .icon-chat-send {
      font-size: ${vm(18)};
    }
  `}
`

const FileUpload = styled.input`
  display: none;
  position: absolute;
`

export default memo(function AiInput() {
  const theme = useTheme()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sendAiContent = useSendAiContent()
  const [, setIsFocus] = useIsFocus()
  const closeStream = useCloseStream()
  const inputContentWrapperRef = useRef<HTMLDivElement>(null)
  const [isRenderingData, setIsRenderingData] = useIsRenderingData()
  const [isHandleRecording, setIsHandleRecording] = useState(false)
  const [value, setValue] = useInputValue()
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [fileList, setFileList] = useFileList()
  const [audioDuration, setAudioDuration] = useState(0)
  const [resultVoiceImg, setResultVoiceImg] = useState('')
  const [recordingTimer, setRecordingTimer] = useState<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onFocus = useCallback(() => {
    setIsFocus(true)
  }, [setIsFocus])
  const onBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocus(false)
    }, 200)
  }, [setIsFocus])
  const deleteImg = useCallback((deleteIndex: number) => {
    return () => {
      const list = fileList.filter((data, index) => index !== deleteIndex)
      setFileList(list)
    }
  }, [fileList, setFileList])
  const requestStream = useCallback(async() => {
    sendAiContent({
      value,
      inputRef,
    })
  }, [value, sendAiContent])
  const handleImageChange = useCallback((e: any) => {
    const files = [...e.target.files]
    const validFiles = files.filter(
      (file) => file.type.startsWith('image/') && file.type !== 'image/gif'
    )
    if (validFiles.length !== files.length) {
      // promptInfo(PromptInfoType.ERROR, <Trans>GIF images are not allowed.</Trans>)
    }
    const list = [
      ...fileList,
      ...validFiles,
    ]
    setFileList(list)
  }, [fileList, setFileList])
  const uploadImg = useCallback(() => {
    fileInputRef.current?.click()
  }, [])
  const stopRecording = useCallback(() => {
    mediaRecorder?.stop()
    setIsRecording(false)
    
    // 停止计时器
    if (recordingTimer) {
      clearInterval(recordingTimer)
      setRecordingTimer(null)
    }
    
    // 保存canvas波形图为图片
    const canvas = document.getElementById('waveform') as HTMLCanvasElement
    if (canvas) {
      try {
        const base64Image = canvas.toDataURL('image/png')
        setResultVoiceImg(base64Image)
      } catch (error) {
        console.error('Failed to capture waveform image:', error)
      }
    }
  }, [mediaRecorder, recordingTimer])
  const formatDuration = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])
  const monitorVolume = useCallback((stream: MediaStream) => {
    const canvas = document.getElementById('waveform') as HTMLCanvasElement
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    if (ctx) {
      // 使用canvas的原始尺寸，避免修改已设置的宽高
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;
      const ratio = 3
      // 清晰线条设置
      ctx.lineWidth = 1 * ratio;
      
      const BAR_WIDTH = 2 * ratio;
      const GAP = 4 * ratio;
      const BAR_STEP = BAR_WIDTH + GAP;
      const BAR_COUNT = Math.floor(WIDTH / BAR_STEP);
      // 设置最小和最大高度，增加对比度
      const MIN_HEIGHT = 2 * ratio;
      const MAX_HEIGHT = 22 * ratio; // 增加最大高度，使波形更明显

      // 限制已录制bar的最大比例为全部
      const MAX_RECORDED_RATIO = 1;
      const MAX_RECORDED_BARS = Math.floor(BAR_COUNT * MAX_RECORDED_RATIO);
      
      // 初始化波形数据
      const waveformData = new Array(BAR_COUNT).fill(MIN_HEIGHT);
      // 已录制bar固定为设定比例
      const recordedBars = MAX_RECORDED_BARS;
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256; // 增加FFT大小，提高频率分辨率
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      // 用于控制波形移动速度的计数器
      let frameCounter = 0;
      // 每隔多少帧更新一次波形，数值越大移动越慢
      const frameUpdateRate = 8; // 增大帧率，大幅减慢移动速度
      
      // 记录前几帧的音量，用于创造趋势变化
      const volumeHistory = new Array(5).fill(0);

      function draw() {
        requestAnimationFrame(draw);
        
        analyser.getByteFrequencyData(dataArray);

        // 分析不同频率范围，创造更多变化
        const bassRange = dataArray.slice(0, 8);
        const midRange = dataArray.slice(8, 24);
        const highRange = dataArray.slice(24, 40);
        
        const bassAvg = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
        const midAvg = midRange.reduce((a, b) => a + b, 0) / midRange.length;
        const highAvg = highRange.reduce((a, b) => a + b, 0) / highRange.length;
        
        // 增加低频的权重，使波形对人声更敏感
        const weightedAvg = (bassAvg * 0.6) + (midAvg * 0.3) + (highAvg * 0.1);
        
        // 更新历史音量队列
        volumeHistory.unshift(weightedAvg);
        volumeHistory.pop();
        
        // 只在特定帧更新波形，减慢移动速度
        frameCounter++;
        if (frameCounter >= frameUpdateRate) {
          frameCounter = 0;
          
          // 计算音量趋势
          const trendFactor = volumeHistory[0] > volumeHistory[4] ? 1.2 : 0.9;
          
          // 增加随机因子，使波形更有跌宕起伏
          const randomFactor = 0.7 + (Math.random() * 0.6);
          
          // 周期性变化，增加波形律动感
          const pulseFactor = 1 + 0.3 * Math.sin(Date.now() / 300);
          
          // 整合所有因子
          let barHeight = MIN_HEIGHT + (weightedAvg / 255) * (MAX_HEIGHT - MIN_HEIGHT) * randomFactor * trendFactor * pulseFactor;
          
          // 突发性波峰，模拟语音的突然变化
          if (Math.random() > 0.8) {
            barHeight *= 1.4 + Math.random() * 0.3;
          }
          
          // 限制高度
          barHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, barHeight));
          
          // 插入数据队列 - 从后面添加，实现从右往左移动
          waveformData.push(barHeight);
          if (waveformData.length > BAR_COUNT) {
            waveformData.shift();
          }
        }

        // 完全清除画布
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        for (let i = 0; i < BAR_COUNT; i++) {
          // 计算精确的像素位置，避免小数点引起的模糊
          const x = Math.floor(i * BAR_STEP);
          
          // 判断是否为已录制区域，已录制区域始终在左侧
          const isRecordedArea = i < recordedBars;
          
          if (isRecordedArea) {
            // 已录制的bar使用白色，显示在左侧
            ctx.fillStyle = theme.textL1;
            ctx.globalAlpha = 0.66;
            const h = Math.max(1, Math.floor(waveformData[i])); // 确保高度至少为1像素，并取整
            const y = Math.floor((HEIGHT - h) / 2); // 居中计算，取整
            
            // 对于宽bar，仍然使用圆角效果
            const radius = 3;
            const r = Math.min(radius, Math.floor(h / 2), Math.floor(BAR_WIDTH / 2));
            
            ctx.beginPath();
            ctx.moveTo(x, y + r);
            ctx.arcTo(x, y, x + BAR_WIDTH, y, r);
            ctx.arcTo(x + BAR_WIDTH, y, x + BAR_WIDTH, y + h, r);
            ctx.arcTo(x + BAR_WIDTH, y + h, x, y + h, r);
            ctx.arcTo(x, y + h, x, y, r);
            ctx.closePath();
            ctx.fill();
          } else {
            // 未录制的bar使用暗灰色，显示在右侧
            ctx.fillStyle = '#444444';
            const initialHeight = MIN_HEIGHT;
            const y = Math.floor((HEIGHT - initialHeight) / 2); // 取整
            
            // 直接使用矩形绘制未录制部分
            ctx.fillRect(x, y, BAR_WIDTH, initialHeight);
          }
        }
      }

      draw();
    }
  }, [theme.textL1])
  const startRecording = useCallback(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && !isHandleRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const recorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)
        recorder.start()
        setIsRecording(true)
        setIsHandleRecording(true)
        
        // 重置录音时长和图片
        setAudioDuration(0)
        setResultVoiceImg('')
        
        // 启动计时器
        const timer = setInterval(() => {
          setAudioDuration(prevDuration => prevDuration + 1)
        }, 1000)
        setRecordingTimer(timer)
        
        const chunks: Blob[] = []
        recorder.ondataavailable = (event) => {
          chunks.push(event.data)
        }
        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: 'audio/wav' })
          // const audioURL = window.URL.createObjectURL(audioBlob)
          // console.log('audioURL', audioURL)
          // uploadAudio(audioBlob)
          console.log('audioBlob', audioBlob)
          stream.getTracks().forEach(track => track.stop())
        }
        monitorVolume(stream)

        // 保存canvas引用
        canvasRef.current = document.getElementById('waveform') as HTMLCanvasElement
      } catch (error) {
        // promptInfo(PromptInfoType.ERROR, handleError(error).message)
      }
    } else {
      // promptInfo(PromptInfoType.ERROR, <Trans>Your browser does not support audio recording.</Trans>)
    }
  }, [isHandleRecording, monitorVolume])
  const stopLoadingMessage = useCallback(() => {
    if (isRenderingData) {
      closeStream()
      setIsRenderingData(false)
      stopRecording()
      window.abortController?.abort()
    }
  }, [isRenderingData, setIsRenderingData, stopRecording, closeStream])
  useEffect(() => {
    return () => {
      if (recordingTimer) {
        clearInterval(recordingTimer)
      }
      setFileList([])
      setValue('')
      setIsFocus(false)
    }
  }, [setIsFocus, setValue, setFileList, setIsRenderingData, recordingTimer])
  return <AiInputWrapper>
    <Shortcuts />
    <AiInputOutWrapper>
      <AiInputContentWrapper
        $borderTop
        $borderBottom
        $borderLeft
        $borderRight
        $value={value}
        $isHandleRecording={isHandleRecording}
        $borderColor={value ? theme.jade10 : theme.bgT30}
        $borderRadius={36}
        ref={inputContentWrapperRef as any}
      >
        <RecordingWrapper style={{ display: isHandleRecording ? 'flex' : 'none' }}>
          <img className="voice-img" src={voiceImg} alt="" />
          <canvas id="waveform" width="492" height="72" style={{ background: 'transparent', display: isRecording ? 'block' : 'none' }} />
          {isHandleRecording && !isRecording && <img className="result-voice-img" src={resultVoiceImg} alt="" />}
          <span>{formatDuration(audioDuration)}</span>
        </RecordingWrapper>
        {
          !isHandleRecording && 
            <InputWrapper>
              {fileList.length > 0 && <ImgList className="scroll-style">
                {fileList.map((file, index) => {
                  const { lastModified } = file
                  const src = URL.createObjectURL(file)
                  return <ImgItem key={String(lastModified)}>
                    <CloseWrapper onClick={deleteImg(index)} />
                    <img src={src} alt="" />
                  </ImgItem>
                })}
              </ImgList>}
              <InputArea
                value={value}
                setValue={setValue}
                onFocus={onFocus}
                onBlur={onBlur}
                enterConfirmCallback={requestStream}
              />
              {!value && <PlaceholderWrapper>
                {isRecording
                  ? <Trans>Recording</Trans>
                  : <Trans>Type your message...</Trans>}
              </PlaceholderWrapper>}
            </InputWrapper>

        }
        <Handle>
          {!isHandleRecording && <ChatFileButton onClick={uploadImg}>
            <IconBase className="icon-chat-file" />
          </ChatFileButton>}
          {
            (value || (isHandleRecording && !isRecording))
              ? <SendButton onClick={isRenderingData ? stopLoadingMessage : requestStream}>
                <IconBase className="icon-chat-send" />
              </SendButton>
              : <ChatVoiceButton $isRecording={isRecording} onClick={isRecording ? stopRecording : startRecording}>
                <IconBase className="icon-chat-voice" />
              </ChatVoiceButton>
          }
        </Handle>
        <FileUpload
          multiple
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef as any}
        />
      </AiInputContentWrapper>
    </AiInputOutWrapper>
  </AiInputWrapper>
})
